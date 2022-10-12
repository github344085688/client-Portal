import { filter, forEach, cloneDeep, findIndex, difference } from 'lodash-es';
import { Component, Prop, Provide, Watch, Emit } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import tlp from "./editControlPanel.vue";
import VueGridLayout from 'vue-grid-layout';
import WaittingBtn from '@components/waitting-button/waitting-btn';
import ElementSelect from '@components/element-select/element-select';
import errorHandler from "@shared/error-handler";
import session from '@shared/session';
import util from '@shared/util';

const gridLayout = require('../grid-layout.json');
const components = require('../components.json');
import Wms from '@panelComponents/wms/wms';
import Trips from '@panelComponents/trips/trips';
import Orders from '@panelComponents/orders/orders';
import Driver from '@panelComponents/driver/driver';
import DriverCalendar from '@panelComponents/driverCalendar/driverCalendar';
import Messages from '@panelComponents/messages/messages';
import Equipment from '@panelComponents/equipment/equipment';
import Notifications from '@panelComponents/notifications/notifications';
import TripLog from '@panelComponents/tripLog/tripLog';
import OrderHistory from '@panelComponents/orderHistory/orderHistory';
import PickupAndDeliveryOrders from '@panelComponents/pickupAndDeliveryOrders/pickupAndDeliveryOrders';
import ExistingTrips from '@panelComponents/existingTrips/existingTrips';
import panelDesignService from '@services/control-panel/panelDesignService';

@Component({
    mixins: [tlp],
    components: {
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem,
        WaittingBtn,
        ElementSelect,
        Wms,
        Trips,
        Orders,
        Driver,
        DriverCalendar,
        Messages,
        Equipment,
        Notifications,
        TripLog,
        OrderHistory,
        PickupAndDeliveryOrders,
        ExistingTrips
    }
})
export default class EditControlPanel extends WiseVue {

    layout: Array<any> = gridLayout.gridLayout;
    panels: Array<any> = ['Orders', 'Trips', 'Wms', 'Driver', 'DriverCalendar', 'Messages', 'Equipment', 'Notifications', 'TripLog', 'OrderHistory', 'PickupAndDeliveryOrders', 'ExistingTrips'];
    panelComponents: Array<any> = [];

    selectPanel: Array<any> = [];
    saving: Boolean = false;
    totalY: number = 6;
    type: string = 'Edit';
    currentPanel: string = '';
    currentPanelTitle: string = '';
    isNew: Boolean = false;
    currentPanelId: any = '';
    showRemovePanelBtn: Boolean = false;

    userPanelList: any = {};
    defaultPanel: any = [
        {name: 'Control Panel', isDefault: true, data: [
            {"x": 0, "y": 0, "w": 6, "h": 6, "i": "1", "component": "Orders", "static": false},
            {"x": 6, "y": 0, "w": 6, "h": 6, "i": "2", "component": "Trips", "static": false},
            {"x": 12, "y": 0, "w": 7, "h": 6, "i": "3", "component": "Wms", "static": false},
            {"x": 19, "y": 0, "w": 5, "h": 4, "i": "4", "component": "Driver", "static": false},
            {"x": 19, "y": 4, "w": 5, "h": 2, "i": "5", "component": "DriverCalendar", "static": false},
            {"x": 0, "y": 6, "w": 5, "h": 5, "i": "6", "component": "Messages", "static": false},
            {"x": 5, "y": 6, "w": 5, "h": 4, "i": "7", "component": "Equipment", "static": false},
            {"x": 10, "y": 6, "w": 4, "h": 4, "i": "8", "component": "Notifications", "static": false},
            {"x": 14, "y": 6, "w": 5, "h": 2, "i": "9", "component": "TripLog", "static": false},
            {"x": 19, "y": 6, "w": 5, "h": 2, "i": "10", "component": "OrderHistory", "static": false}
        ]},
        {name: 'Dispatch Dashboard', isDefault: true, data: [
            {"x": 0, "y": 0, "w": 12, "h": 6, "i": "1", "component": "PickupAndDeliveryOrders", "static": false},
            {"x": 12, "y": 0, "w": 12, "h": 6, "i": "2", "component": "ExistingTrips", "static": false},
            {"x": 0, "y": 6, "w": 5, "h": 5, "i": "6", "component": "Messages", "static": false},
            {"x": 5, "y": 6, "w": 5, "h": 4, "i": "7", "component": "Equipment", "static": false},
            {"x": 10, "y": 0, "w": 5, "h": 4, "i": "4", "component": "Driver", "static": false},
            {"x": 15, "y": 4, "w": 4, "h": 2, "i": "5", "component": "DriverCalendar", "static": false},
            {"x": 19, "y": 6, "w": 5, "h": 2, "i": "9", "component": "TripLog", "static": false},
            {"x": 19, "y": 11, "w": 5, "h": 2, "i": "10", "component": "OrderHistory", "static": false}
        ]},
    ];

    domLayout: Array<any> = [];

    init() {
        this.panelComponents = cloneDeep(components.components);
        if (this.isNew) {
            this.type = 'Create New Control Panel';
            this.currentPanel = '';
            this.currentPanelTitle = '';
            this.currentPanelId = '';
            this.domLayout = [];
            this.userPanelList = [];
        } else {
            panelDesignService.getUserPanelData().subscribe(
                (res: any) => {
                    if (res.length > 0) {
                        this.userPanelList = res.concat(this.defaultPanel);
                        forEach(this.userPanelList, item => {
                            if (typeof item.data == 'string') {
                                item.data = JSON.parse(item.data);
                            }
                        });
                        this.currentPanel = this.$route.query.panel || this.userPanelList[0].name;
                        this.currentPanelTitle =  this.currentPanel;
                        this.type = `Edit ${this.currentPanel} Panel`;
                        this.currentPanelId =  this.$route.query.panelId || this.userPanelList[0].id;
                        let index = findIndex(this.userPanelList, (o: any) => {
                            return o.name == this.currentPanel;
                        });
                        this.domLayout = this.userPanelList[index].data || this.userPanelList[0].data;
                        this.initLayout();
                    }
                },
                (err: any) => {
                    errorHandler.handle(err);
                }
            );
        }
    }

    checkoutPermission(permission: String) {
        return util.judgeIfHasPermission(permission, session.getUserPermission());
    }

    saveOrUpdateControlPanel() {
        if (!this.currentPanelTitle) {
            errorHandler.handle('Please inset title.');
            return;
        }
        this.saving = true;
        if (this.isNew) {
            this.createNewControlPanel();
        } else {
            this.updateControlPanel();
        }
    }

    updateControlPanel() {
        let data = cloneDeep(this.domLayout);
        panelDesignService.updateUserPanelData(this.currentPanelId, this.currentPanelTitle, data).subscribe(
            (res: any) => {
                this.popups({
                    title: 'Update Panel',
                    content: 'Save Successful',
                    confirm: 'OK'
                }).then(
                    (res: any) => {
                        this.$router.replace({
                            name: 'ControlPanel'
                        });
                    }
                );
                session.setCurrentPanel(this.currentPanelTitle);
            },
            (err: any) => {
                errorHandler.handle(err);
                this.saving = false;
            }
        );
    }

    deletePanel() {
        this.popups({
            title: 'Delete Panel',
            content: 'Are you sure delete ' + this.currentPanelTitle,
            cancel: 'No',
            confirm: 'Yes'
        }).then(
            (res: any) => {
                panelDesignService.dateUserPanelData(this.currentPanelId).subscribe(
                    (res: any) => {
                        this.popups({
                            title: 'Delete Panel',
                            content: 'Delete Successful',
                            confirm: 'OK'
                        }).then(
                            (res: any) => {
                                this.$router.replace({
                                    name: 'ControlPanel'
                                });
                            }
                        );
                    },
                    (err: any) => {
                        errorHandler.handle(err);
                    }
                );
            }
        );
    }

    createNewControlPanel() {
        let createLayout = forEach(this.domLayout, item => {
            item.static = false;
        });
        panelDesignService.saveUserPanelData(this.currentPanelTitle, createLayout).subscribe(
            (res: any) => {
                this.popups({
                    title: 'Create New Panel',
                    content: 'Save Successful',
                    confirm: 'OK'
                }).then(
                    (res: any) => {
                        this.$router.replace({
                            name: 'ControlPanel'
                        });
                    }
                );
                session.setCurrentPanel(this.currentPanelTitle);
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
        this.saving = false;
    }

    selected(panel: any) {
        panel.selected = !panel.selected;
        this.$forceUpdate();
    }

    cancelEditControlPanel() {
        this.$router.replace({
            name: 'ControlPanel'
        });
    }

    selectPanelView(panel: any) {
        if (panel.isDefault) {
            errorHandler.handle('Default panel can not be edited.');
            return false;
        }
        this.currentPanel = panel.name;
        this.currentPanelTitle = panel.name;
        this.domLayout = panel.data;
        this.currentPanelId = panel.id;
        this.type = `Edit ${this.currentPanel} Panel`;
        this.selectPanel = [];
        forEach(this.domLayout, (item) => {
            if (this.panels.indexOf(item.component) != -1) {
                this.selectPanel.push(item.component);
            }
        });
    }

    initLayout() {
        let maxY: number = 0;
        forEach(this.domLayout, (item) => {
            if (this.panels.indexOf(item.component) != -1) {
                this.selectPanel.push(item.component);
            }
            this.panelComponents[findIndex(this.panelComponents, (o) => {
                return o.panelName == item.component;
            })].data = item;
            maxY += item.y + item.h;
            if (maxY > this.totalY) {
                this.addBcgLayout();
            }
        });
    }

    selectPanelComponents() {
        let arr: Array<any> = [];
        forEach(this.selectPanel, (item) => {
            let index = findIndex(this.panelComponents, (o) => {
                return o.panelName == item;
            });
            arr.push(this.panelComponents[index].data);
        });

        let maxY: number = 0;
        this.domLayout = arr;
        forEach(this.domLayout, (item, index) => {
            maxY += item.y + item.h;
            if (maxY > this.totalY) {
                this.addBcgLayout();
            }
        });
    }

    removePanel(panelName: string) {
        let index = findIndex(this.selectPanel, (o) => {
            return o == panelName;
        });
        this.selectPanel.splice(index, 1);
        this.domLayout.splice(index, 1);
    }

    moving(index: any) {
        forEach(this.domLayout, (item, itemIndex) => {
            if (index != itemIndex) {
                item.static = true;
            }
        });
    }

    layoutUpdatedEvent() {
        forEach(this.domLayout, (item, itemIndex) => {
            item.static = false;
        });
    }

    movedEvent(i: any, newX: any, newY: any, w: any, h: any, name: any) {
        let moveData = {"x": newX, "y": newY, "w": w, "h": h, "i": i, "component": name};
        let index = findIndex(this.panelComponents, (o) => {
            return o.panelName == name;
        });
        this.panelComponents[index].data = moveData;
        if (newY + h >= this.layout.length / 6) {
            this.addBcgLayout();
        }
    }

    addBcgLayout() {
        let yNum = this.layout[this.layout.length - 1].y + 1;
        let indexNum = this.layout[this.layout.length - 1].i + 1;
        for (let k: number = 0; k < 36; k++) {
            let addYNumber = (k / 6).toString();
            let addArr: any = [{'x': 4 * parseInt(addYNumber), 'y': parseInt(addYNumber) + yNum + 1, 'w': 4, 'h': 1, 'i': indexNum + k + 1}];
            this.layout = this.layout.concat(addArr);
        }
        this.totalY += 6;
    }

    mounted() {
        this.isNew = this.$route.query.type == 'new' ? true : false;
        this.init();
    }

    get watchEditPanelStatus() {
        return this.$store.state.isInEditPanel;
    }
    @Watch('watchEditPanelStatus')
    showRemovePanelIcon() {
        this.showRemovePanelBtn = this.$store.state.isInEditPanel;
    }

    createNew() {
        this.isNew = true;
        this.selectPanel = [];
        this.currentPanel = '';
        this.currentPanelTitle = '';
        this.type = `Create New Panel`;
        this.currentPanelId = '';
        this.domLayout = [];
        this.$router.replace({
            name: 'EditControlPanel',
            query: {type: 'new'}
        });
    }
}