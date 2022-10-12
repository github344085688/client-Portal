import WiseVue from "@shared/wise-vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./default-main-layout.vue";
import SidebarMenu from '../sidebar-menu/sidebar-menu';
import SidebarMenuService from "@services/sidebar-menu-service";
import { forEach, find, remove, isEmpty } from 'lodash-es';
import session from '@shared/session';
import userService from '@services/user-service';
import errorHanlder from '@shared/error-handler';
import AppHeader from './app-header';
import util from '@shared/util';
@Component({
    mixins: [template],
    components: {
        SidebarMenu,
        AppHeader
    }
})
export default class DefaultMainLayout extends WiseVue {
    @Provide('reloads') reloads: any = this.reload;
    menuData: Array<any> = [];
    states: Array<any> = [];
    isBlur: boolean = false;
    project: string = "";
    isRouterAlive: boolean = false;
    isHeavyLoad: boolean = false;
    menuItem: any = {
        subMenu: []
    };
    showSubMenu: Boolean = false;
    enableSaasMode: Boolean = enableSaasMode;

    getSideBarMenu() {
        let currentRouterName: any = this.$route.name;
        this.menuItem = {subMenu: []};
        this.showFirst = true;
        this.showSubMenu = false;
        this.getCurrentStates(this.menuData, currentRouterName);
        if (this.states.length > 0) {
            let states: any = [];
            let str: string = "";
            forEach(this.states, (state: any) => {
                if (str) {
                    str = str + "." + state;
                } else {
                    str = state;
                }
                states.push(str);
            });
            forEach(states, (state: any) => {
                this.resuriseSetDisplay(this.menuData, state);
            });
        }
    }

    getCurrentStates(menuData: any, currentRouterName: string) {
        forEach(menuData, (menu: any) => {
            if (menu.routerName === currentRouterName) {
                menu.display = "block";
                this.states = menu.state.split('.');
                this.showFirst = true;
                this.showSubMenu = false;
            } else {
                if (menu.subMenu) {
                    let currentItem: any = find(menu.subMenu, { "routerName": currentRouterName });
                    menu.display = "none";
                    this.showFirst = true;
                    if (currentItem) {
                        forEach(menu.subMenu, (cmenu: any) => {
                            if (cmenu.routerName === currentRouterName) {
                                currentItem.display = "block";
                                menu.display = "block";
                                this.states = cmenu.state.split('.');
                                this.menuItem = menu;
                                this.showFirst = true;
                                this.showSubMenu = true;
                                this.$forceUpdate();
                            }
                        });
                    }
                }
            }
        });
        this.$forceUpdate();
    }

    resuriseSetDisplay(menuData: any, state: string) {
        forEach(menuData, (menu: any) => {
            if (menu.state === state) {
                menu.display = "block";
            } else {
                if (menu.subMenu) {
                    let currentItem: any = find(menu.subMenu, { "state": state });
                    if (currentItem) {
                        forEach(menu.subMenu, (cmenu: any) => {
                            if (cmenu.state === state) {
                                currentItem.display = "block";
                            }
                        });
                    } else {
                        this.resuriseSetDisplay(menu.subMenu, state);
                    }
                }
            }

        });
    }

    switchSideBarMenuData(sideBarMenuName: any) {
        if (sideBarMenuName === 'transportation') {
            this.menuData = SidebarMenuService.transportation();
            this.project = "TRANSPORTATION";
        }
        if (sideBarMenuName === 'warehousing') {
            this.menuData = SidebarMenuService.warehousing();
            this.project = "WAREHOUSING";
        }
        if (sideBarMenuName === 'tools') {
            this.menuData = SidebarMenuService.tools();
            this.project = "TOOLS";
        }
        if (sideBarMenuName === 'controlpanel') {
            this.menuData = SidebarMenuService.controlpanel();
            this.project = "CONTROLPANEL";
        }
        if (sideBarMenuName === 'idm') {
            this.menuData = SidebarMenuService.idm();
            this.project = "IDMANAGEMENT";
        }
        this.getSideBarMenu();
    }
    toBlur(bool: boolean) {
        this.isBlur = bool;
    }
    showFirst: boolean = true;
    clickLog() {
        if (this.menuItem.subMenu && this.menuItem.subMenu.length <= 0) {
            this.showSubMenu = false;
            this.showFirst = !this.showFirst;
        } else {
            if (this.menuItem.state === 'TmsMessage') {
                this.showSubMenu = false;
            } else {
                this.showSubMenu = !this.showSubMenu;
            }
            this.showFirst = !this.showFirst;
        }
    }

    chooseItem(item: any) {
        this.menuItem = item;
        if (this.menuItem.subMenu && this.menuItem.subMenu.length > 0) {
            this.showFirst = true;
            this.showSubMenu = true;
        } else {
            if (item.state === 'TmsMessage') {
                this.showFirst = false;
                this.showSubMenu = false;
            } else {
                this.showFirst = true;
                this.showSubMenu = false;
            }
        }
    }

    clickLi(subMenu: any) {
        forEach(this.menuItem.subMenu, (item: any) => {
            item.display = "none";
        });
        this.$forceUpdate();
        subMenu.display = "block";
        if (subMenu.routerName) {
            if (subMenu.routerName === 'Login') {
                this.signOut();
            } else {
                if (subMenu.routerName === 'ReceiptEntry' || subMenu.routerName === 'OrderEntry' ) this.reloads();
                this.$router.replace({ name: subMenu.routerName });
            }
        }
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

    created() {
        if (this.$route.fullPath.indexOf('tools') > -1) {
            this.menuData = SidebarMenuService.tools();
        } else if (this.$route.fullPath.indexOf('transportation') > -1) {
            this.menuData = SidebarMenuService.transportation();
            if (this.$route.fullPath.indexOf('transportation/message-center') > -1) {
                this.$nextTick(() => {
                    this.showFirst = false;
                    this.showSubMenu = false;
                });
            }
        } else if (this.$route.fullPath.indexOf('wms') > -1) {
            this.menuData = SidebarMenuService.warehousing();
            this.filterNopermission(this.menuData);
        } else if (this.$route.fullPath.indexOf('control-panel') > -1) {
            this.menuData = SidebarMenuService.controlpanel();
            this.$nextTick(() => {
                let dom = <HTMLImageElement>document.querySelector('.unis-aside');
                let wrap = <HTMLImageElement>document.querySelector('.page-content-wrapper');
                let head = <HTMLImageElement>document.querySelector('.header-bar');
                dom.style.display = 'none';
                wrap.style.marginLeft = '0';
                head.style.left = '0';
            });
            this.hideMenu();
        }
        this.project = "WAREHOUSING";
        this.getSideBarMenu();
    }

    hideMenu() {
        this.$nextTick(() => {
            let dom = <HTMLImageElement>document.querySelector('.unis-aside');
            let wrap = <HTMLImageElement>document.querySelector('.page-content-wrapper');
            let head = <HTMLImageElement>document.querySelector('.header-bar');
            dom.style.display = 'none';
            wrap.style.marginLeft = '0';
            head.style.left = '0';
        });
    }

    filterNopermission(menuData: any) {
        for (let index = 0; index < menuData.length; index++) {
            if (util.judgeIfHasPermission(menuData[index].permissions, session.getUserPermission())) {
                if (!isEmpty(menuData[index].subMenu)) {
                    this.removeNopermission(menuData[index].subMenu);
                }
            } else {
                remove(menuData, (n: any) => {
                    return n.permissions == menuData[index].permissions;
                });
                index--; // 因为remove之后数组长度会减1,所以index 要跟着-1
            }
        }
    }

    removeNopermission(subMenu: any) {
        for (let index = 0; index < subMenu.length; index++) {
            if (util.judgeIfHasPermission(subMenu[index].permissions, session.getUserPermission())) {
                if (!isEmpty(subMenu[index].subMenu)) {
                    this.removeNopermission(subMenu[index].subMenu);
                }
            } else {
                remove(subMenu, (n: any) => {
                    return n.permissions == subMenu[index].permissions;
                });
                index--; // 因为remove之后数组长度会减1,所以index 要跟着-1
            }
        }
    }

    reload () {
        this.isRouterAlive = true;
        this.$nextTick(function () {
            this.isHeavyLoad = true;
            this.isRouterAlive = false;
        });
    }
}
