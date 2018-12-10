import WiseVue from "../../shared/wise-vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./default-main-layout.vue";
import SidebarMenu from '../sidebar-menu/sidebar-menu';
import SidebarMenuService from "../../services/sidebar-menu-service";
import { forEach, find } from 'lodash-es';
import AppHeader from './app-header';

@Component({
    mixins: [template],
    components: {
      SidebarMenu,
      AppHeader
    }
})
export default class DefaultMainLayout extends WiseVue {

    menuData: Array<any> = [];
    states: Array<any> = [];
    project: string = "";

    getSideBarMenu() {
        let currentRouterName: any = this.$route.name;
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
            } else {
                if (menu.subMenu) {
                    let currentItem: any = find(menu.subMenu, { "routerName": currentRouterName });
                    if (currentItem) {
                        forEach(menu.subMenu, (cmenu: any) => {
                            if (cmenu.routerName === currentRouterName) {
                                currentItem.display = "block";
                                menu.display = "block";
                                this.states = cmenu.state.split('.');
                            }
                        });
                    } else {
                          menu.display = "none";
                        this.getCurrentStates(menu.subMenu, currentRouterName);
                    }
                }
            }

        });
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
      this.getSideBarMenu();

    }
    mounted() {
      this.menuData = SidebarMenuService.warehousing();
      this.project = "WAREHOUSING";
      this.getSideBarMenu();
    }
}
