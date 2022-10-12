import { filter, forEach, cloneDeep, findIndex, find } from 'lodash-es';
import { Component, Prop, Provide, Watch, Emit, Vue } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import tlp from "./controlPanel.vue";
import errorHandler from '@shared/error-handler';
import VueGridLayout from 'vue-grid-layout';
import WaittingBtn from '@components/waitting-button/waitting-btn';
import ElementSelect from '@components/element-select/element-select';

const gridLayout = require('../grid-layout.json');
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
import session from '@shared/session';
import util from '@shared/util';

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
export default class ControlPanel extends WiseVue {

    layout: Array<any> = gridLayout.gridLayout;
    panels: Array<any> = ['Orders', 'Trips', 'Wms', 'Driver', 'DriverCalendar', 'Messages', 'Equipment', 'Notifications', 'TripLog', 'OrderHistory', 'PickupAndDeliveryOrders', 'ExistingTrips'];
    currentPanel: string = '';
    currentPanelId: any = '';
    viewType: Array<any> = ['Card View', 'List View', 'Table View', 'Calendar View', 'Map View'];
    selectViewType: string = '';
    saving: Boolean = false;
    totalY: number = 6;
    isPanelLoading: Boolean = false;
    canEdit: Boolean = true;
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
            {"x": 19, "y": 8, "w": 5, "h": 2, "i": "10", "component": "OrderHistory", "static": false}
        ]},
    ];

    userPanelList: any = [];
    domLayout: Array<any> = [];

    init() {
        this.changeDefaultPanelByPermission();
        this.isPanelLoading = true;
        panelDesignService.getUserPanelData().subscribe(
            (res: any) => {
                if (res.length == 0) {
                    this.canEdit = false;
                }
                this.isPanelLoading = false;
                this.userPanelList = [{name: 'Create new dashboard +'}].concat(this.defaultPanel).concat(res);
                forEach(this.userPanelList, item => {
                    if (typeof item.data == 'string') {
                        item.data = JSON.parse(item.data);
                    }
                });
                if (this.userPanelList) {
                    let lastUsedPanel: any = session.getCurrentPanel();
                    let index = findIndex(this.userPanelList, (o: any) => {
                        return o.name == lastUsedPanel;
                    });
                    if (lastUsedPanel && index > -1) {
                        let currentPanelData = filter(this.userPanelList, (o) => {
                            return o.name == lastUsedPanel;
                        });
                        this.currentPanelId = currentPanelData[0].id;
                        if (currentPanelData) {
                            this.domLayout = currentPanelData[0].data;
                            this.currentPanel = currentPanelData[0].name;
                            this.$store.commit('changeCurrentPanel', this.currentPanel);
                        }
                    } else {
                        this.currentPanel = this.userPanelList[1].name;
                        this.domLayout = this.userPanelList[1].data;
                        this.$store.commit('changeCurrentPanel', this.currentPanel);
                    }
                }
                this.domLayout = this.filterWmsPanelByPermission(this.domLayout);
            },
            (err: any) => {
                this.isPanelLoading = false;
                errorHandler.handle(err);
            }
        );
    }

    checkoutPermission(permission: String) {
        return util.judgeIfHasPermission(permission, session.getUserPermission());
    }

    changeDefaultPanelByPermission() {
        if (!this.checkoutPermission('controlPanel::wmsPanel_read')) {
            this.defaultPanel[0].data = [
                {"x": 0, "y": 0, "w": 10, "h": 6, "i": "1", "component": "Orders", "static": false},
                {"x": 10, "y": 0, "w": 9, "h": 6, "i": "2", "component": "Trips", "static": false},
                {"x": 19, "y": 0, "w": 5, "h": 4, "i": "4", "component": "Driver", "static": false},
                {"x": 19, "y": 4, "w": 5, "h": 2, "i": "5", "component": "DriverCalendar", "static": false},
                {"x": 0, "y": 6, "w": 5, "h": 5, "i": "6", "component": "Messages", "static": false},
                {"x": 5, "y": 6, "w": 5, "h": 4, "i": "7", "component": "Equipment", "static": false},
                {"x": 10, "y": 6, "w": 4, "h": 4, "i": "8", "component": "Notifications", "static": false},
                {"x": 14, "y": 6, "w": 5, "h": 2, "i": "9", "component": "TripLog", "static": false},
                {"x": 19, "y": 6, "w": 5, "h": 2, "i": "10", "component": "OrderHistory", "static": false}
            ];
        }
    }

    filterWmsPanelByPermission(panelData: any) {
        if (!this.checkoutPermission('controlPanel::wmsPanel_read')) {
            let index = findIndex(panelData, (o: any) => {
                return o.component == 'Wms';
            });
            if (index >= 0) {
                panelData.splice(index, 1);
            }
        }
        return panelData;
    }

    selectPanelView(currentPanel: any) {
        if (currentPanel == 'Create new dashboard +') {
            this.createNewPanel();
        } else {
            let currentPanelData = filter(this.userPanelList, (o) => {
                return o.name == this.currentPanel;
            });
            this.currentPanelId = currentPanelData[0].id;
            if (currentPanelData) {
                this.domLayout = this.filterWmsPanelByPermission(currentPanelData[0].data);
                session.setCurrentPanel(currentPanelData[0].name);
                this.$store.commit('changeCurrentPanel', this.currentPanel);
            }
        }
    }

    editPanel() {
        if (!this.canEdit) {
            this.popups({
                title: 'Edit panel',
                content: 'Default panel can not be edited, you can create new.',
                confirm: 'Create New',
                cancel: 'Exit'
            }).then(
                (res: any) => {
                    this.$router.replace({
                        name: 'EditControlPanel',
                        query: {type: 'new'}
                    });
                }
            );
        } else {
            this.$router.replace({
                name: 'EditControlPanel',
                query: {panel: this.currentPanel, panelId: this.currentPanelId}
            });
        }
    }

    clonePanel() {
        this.popups({
            title: 'Replicate Panel',
            content: `Are you sure to clone ${this.currentPanel}.`,
            confirm: 'Clone',
            cancel: 'Exit'
        }).then(
            (res: any) => {
                panelDesignService.saveUserPanelData(this.currentPanel + '-clone', this.domLayout).subscribe(
                    (res: any) => {
                        this.popups({
                            title: 'Replicate Panel',
                            content: 'Clone Successful',
                            confirm: 'OK'
                        }).then(
                            (res: any) => {
                                session.setCurrentPanel(this.currentPanel + '-clone');
                                this.init();
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

    createNewPanel() {
        this.$store.commit('changeEditPanelStatus', true);
        this.$router.replace({
            name: 'EditControlPanel',
            query: {type: 'new'}
        });
    }

    mounted() {
        Vue.nextTick(() => {
            this.init();
        });
    }

    get defaultPanelChange() {
        return [this.$store.state.isShowOrderPanelBtn, this.$store.state.isShowTripPanelBtn];
    }

    @Watch('defaultPanelChange')
    currentDragType() {
        forEach(this.userPanelList, (item, index) => {
            if (item.name == 'Dispatch Dashboard' && this.$store.state.isShowOrderPanelBtn) {
                item.data = [
                    {"x": 0, "y": 0, "w": 0, "h": 6, "i": "1", "component": "PickupAndDeliveryOrders"},
                    {"x": 12, "y": 0, "w": 24, "h": 6, "i": "2", "component": "ExistingTrips"},
                    {"x": 0, "y": 6, "w": 4, "h": 4, "i": "6", "component": "Messages"},
                    {"x": 4, "y": 6, "w": 5, "h": 4, "i": "7", "component": "Equipment"},
                ];
            } else
            if (item.name == 'Dispatch Dashboard' && this.$store.state.isShowTripPanelBtn) {
                item.data = [
                    {"x": 0, "y": 0, "w": 24, "h": 6, "i": "1", "component": "PickupAndDeliveryOrders"},
                    {"x": 0, "y": 0, "w": 0, "h": 6, "i": "2", "component": "ExistingTrips"},
                    {"x": 0, "y": 6, "w": 5, "h": 5, "i": "6", "component": "Messages", "static": false},
                    {"x": 5, "y": 6, "w": 5, "h": 4, "i": "7", "component": "Equipment", "static": false},
                    {"x": 10, "y": 0, "w": 5, "h": 4, "i": "4", "component": "Driver", "static": false},
                    {"x": 15, "y": 4, "w": 4, "h": 2, "i": "5", "component": "DriverCalendar", "static": false},
                    {"x": 19, "y": 6, "w": 5, "h": 2, "i": "9", "component": "TripLog", "static": false},
                    {"x": 19, "y": 8, "w": 5, "h": 2, "i": "10", "component": "OrderHistory", "static": false}
                ];
            } else
            if (item.name == 'Dispatch Dashboard' && !this.$store.state.isShowTripPanelBtn && !this.$store.state.isShowOrderPanelBtn) {
                item.data = [
                    {"x": 0, "y": 0, "w": 12, "h": 6, "i": "1", "component": "PickupAndDeliveryOrders"},
                    {"x": 12, "y": 0, "w": 12, "h": 6, "i": "2", "component": "ExistingTrips"},
                    {"x": 0, "y": 6, "w": 5, "h": 5, "i": "6", "component": "Messages", "static": false},
                    {"x": 5, "y": 6, "w": 5, "h": 4, "i": "7", "component": "Equipment", "static": false},
                    {"x": 10, "y": 0, "w": 5, "h": 4, "i": "4", "component": "Driver", "static": false},
                    {"x": 15, "y": 4, "w": 4, "h": 2, "i": "5", "component": "DriverCalendar", "static": false},
                    {"x": 19, "y": 6, "w": 5, "h": 2, "i": "9", "component": "TripLog", "static": false},
                    {"x": 19, "y": 8, "w": 5, "h": 2, "i": "10", "component": "OrderHistory", "static": false}
                ];
            }
        });
        this.selectPanelView('');
    }

    goRelationshipPage() {
        this.$router.replace({
            name: 'Relationship',
        });
    }
}