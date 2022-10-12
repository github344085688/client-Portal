import WiseVue from "@shared/wise-vue";
import { Component, Prop, Inject } from "vue-property-decorator";
import template from "./sidebar-menu.vue";
import * as Velocity from 'velocity-animate';
import { forEach, find } from 'lodash-es';
import session from '@shared/session';
import userService from '@services/user-service';
import errorHanlder from '@shared/error-handler';
@Component({
    mixins: [template],
    name: 'sidebar-menu',
})
export default class SidebarMenu extends WiseVue {
    @Prop({ default: [] })
    menuData!: Array<any>;
    currentRouterName: any;

    @Inject('reloads') reloads: any;

    setMenuData(title: string) {
        this.menuData.forEach(menu => {
            if (menu.title !== title) {
                menu.display = "none";
            }
            this.resuriseSetDisplay(menu, title);
        });
    }

    resuriseSetDisplay(menu: any, title: string) {
        forEach(menu.subMenu, element => {
            if (element.title !== title) {
                element.display = "none";
                if (this.currentRouterName === element.routerName) {
                    element.display = "block";
                }

                if (element.subMenu) {
                    this.resuriseSetDisplay(element, title);
                }
            }
        });
    }
    itemTitle: string = "";
    clickLi(menuItem: any) {
        this.currentRouterName = this.$route.name;
        this.setMenuData(menuItem.title);
        if (menuItem.display === "block") {
            menuItem.display = "none";
        } else {
            menuItem.display = "block";
        }
        if (!this.itemTitle) {
            this.itemTitle = menuItem.title;
        } else {
            if (this.itemTitle === menuItem.title && !menuItem.subMenu) {
                menuItem.display = "block";

            } else {
                this.itemTitle = menuItem.title;
            }
        }
        if (menuItem.routerName) {

            if (menuItem.routerName === 'Login') {
                this.signOut();
            } else {
                if (menuItem.routerName === 'ReceiptEntry' || menuItem.routerName === 'OrderEntry' ) this.reloads();
                this.$router.replace({ name: menuItem.routerName });
            }

        }
        this.$emit('chooseItem', menuItem);
    }

    signOut() {
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

    mounted() {
    }

    judgeIsShowYellowTip(menuItem: any) {
        return (menuItem.display === 'block' && menuItem.state && (menuItem.state.indexOf('.') === -1));
    }

    changeMenu() {
        this.$emit('change', {});
    }

    beforeEnter(el: any) {

    }

    enter(el: any, done: any) {
        // (<Element>el).classList.remove();(<Element>el).classList.add();
        Velocity.animate(el, "slideDown", { duration: 200 });
        done();
    }

    leave(el: any, done: any) {
        Velocity.animate(el, "slideUp", { duration: 200 });
        // done();
    }


}