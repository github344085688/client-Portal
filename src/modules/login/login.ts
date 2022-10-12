import { Vue, Component, Prop , Provide } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import tlp from "./login.vue";
import userService from  "@services/user-service";
import { Subscription } from 'rxjs/Subscription';
import session from '@shared/session';
import { map }  from 'lodash-es';
import errorHanlder from '@shared/error-handler';
import { Subject } from "rxjs/Subject";




@Component({
    mixins: [tlp]
 })
 export default class Login extends WiseVue {

    userForm = {isSubmitting: false};
    user = { username: "", password: ""};

    signInSub: Subject<void> = new Subject();


    mounted() {
        this.signInSub.subscribe(
            this.signIn,
            err => {
               errorHanlder.handle(err);
            }
        );
    }

    private initialUserSession(userLoginedResult: any) {
        session.setUserToken(userLoginedResult.oAuthToken);
        session.setUserId(userLoginedResult.idmUserId);
        session.setUserPermission(map(userLoginedResult.userPermissions, 'name'));
        session.setUserInfo(userLoginedResult.userView);
    }

    signIn() {
        this.$validator.validateAll().then(
            res => {
                if (res) {
                    this.userForm.isSubmitting = true;
                    this.unsubcribers.push(userService.login(this.user).subscribe(
                        res => {
                            if (res.success) {
                              session.clean();
                              this.initialUserSession(res);
                              this.$router.replace({name: '/'});
                            } else {
                                errorHanlder.handle(res.errorMessage ? res.errorMessage : "Login Failed!");
                            }
                        },
                        err =>  {
                             errorHanlder.handle(err);
                             this.userForm.isSubmitting = false;
                        },
                        () => {
                           this.userForm.isSubmitting = false;
                        }
                    ));
                }

            }
        );
    }
 }