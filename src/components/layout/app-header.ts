import Vue from "vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./app-header.vue";
import session from '../../shared/session';
import userService from '../../services/user-service';
import errorHanlder from '../../shared/error-handler';

@Component({
  mixins: [template],
  components: {}
})
export default class AppHeader extends Vue {
  userName: string = '';

  switchSideBarMenu(vaule: any) {
    this.$emit("sideBarMenuData", vaule);
  }

  loginOut() {
    userService.logout(session.getUserToken()).subscribe(
      res => {
        session.clean();
        this.$router.replace({name: 'Login'});
      },
      err => {
        session.clean();
        this.$router.replace({name: 'Login'});
        errorHanlder.handle(err);
      }
    );
  }

  async mounted() {
    let userNames = await session.fetchUserInfo();
    this.userName = userNames.firstName.slice(0, 2);
  }

}
