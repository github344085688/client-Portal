import Vue from "vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./app-header.vue";
import session from '@shared/session';
import userService from '@services/user-service';
import errorHanlder from '@shared/error-handler';
import util from '@shared/util';

@Component({
  mixins: [template],
  components: {}
})
export default class AppHeader extends Vue {
  userName: string = '';
  @Prop({ default: false })
  isBlur!: boolean;

  @Prop({ default: false })
  showOrHideSideBar!: boolean;

  switchSideBarMenu(value: any) {
    this.$emit("sideBarMenuData", value);
    this.$nextTick(() => {
      let dom = <HTMLImageElement>document.querySelector('.unis-aside');
      let wrap = <HTMLImageElement>document.querySelector('.page-content-wrapper');
      let head = <HTMLImageElement>document.querySelector('.header-bar');
      dom.style.display = 'block';
      wrap.style.marginLeft = '240px';
      head.style.left = '240px';
      if (value == 'warehousing') this.$router.replace({ name: '/' });
      if (value == 'controlpanel') {
        this.$router.replace({ name: 'ControlPanel' });
        dom.style.display = 'none';
        wrap.style.marginLeft = '0';
        head.style.left = '0';
      }
      if (value == 'idManagement') {
        this.$router.replace({ name: 'IdManagement' });
      }
    });
  }

  judgePermissionForMenu(permisson: any) {
    if (isPermissionDisabled) {
      return true;
    }
    if (util.judgeIfHasPermission(permisson, session.getUserPermission())) {
      return true;
    } else {
      return false;
    }
  }

  loginOut() {
    userService.logout(session.getUserToken()).subscribe(
      res => {
        session.clean();
        this.$router.replace({ name: 'Login' });
      },
      err => {
        session.clean();
        this.$router.replace({ name: 'Login' });
        errorHanlder.handle(err);
      }
    );
  }

  async mounted() {
    let userNames = await session.fetchUserInfo();
    this.userName = userNames.firstName.slice(0, 2);
  }

}
