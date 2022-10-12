import WiseVue from "@shared/wise-vue";
import { Component } from "vue-property-decorator";
import template from "./sso.vue";
import session from '@shared/session';
import userService from '@services/user-service';
import errorHanlder from '@shared/error-handler';
import { map } from "lodash-es";




@Component({
    mixins: [template]
})
export default class Sso extends WiseVue {


    init() {
        let token = this.getToken();
        if (token) {
            this.verifyToken(token);
        } else {
            this.gotoLoginPage();
        }
    }

    getToken() {
        let token = this.$route.query.token;
        if (token) return token;
        return "";
    }

    verifyToken(token: string) {
        session.setUserToken(token);
        session.setSsoMark();
        userService.getUserIdByToken(token).subscribe(
            response => {
                session.setUserId(response.idmUserId);
                session.fetchUserInfo();
                userService.getUserPermissions(response.idmUserId).subscribe(
                    userPermissions => {
                        session.setUserPermission(map(userPermissions, 'name'));
                        this.$router.replace({ name: '/' });
                    },
                    err => {
                        this.gotoLoginPage();
                        errorHanlder.handle(err);
                    }
                );
            },
            err => {
                this.gotoLoginPage();
                errorHanlder.handle(err);
            }
        );
    }

    gotoLoginPage() {
        location.href = ssoRedirectLink;
    }

    mounted() {
        this.init();
    }
}