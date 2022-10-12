import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import template from "./driver.vue";
import { DatePicker, TimePicker } from 'element-ui';
import ElementSelect from '@components/element-select/element-select';
import '@assets/css/panel.scss';
import { filter, forEach } from "lodash";
import errorHandler from "@shared/error-handler";
import VueDragDrop from 'vue-drag-drop';
import controlPanelService from "@services/control-panel/controlPanelService";

Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(VueDragDrop);

@Component({
    mixins: [template],
    name: 'shipments',
    components: {
        ElementSelect,
    }
})
export default class Shipments extends Vue {
    viewType: Array<any> = ['Card View', 'List View', 'Table View', 'Calendar View', 'Map View'];
    selectViewType: string = 'Card View';
    showOrderDetail: Boolean = false;
    dateValue: any = '';
    timeValue: any = '';
    selectTerminal: any = '';
    selectIndex: any = -1;
    loadingDriver: Boolean = false;
    driverName: string = '';
    viewList: any = [];
    driverList: any = [];
    driverInfo: any = {};
    driverCompanyList: any = [];
    filterCompanyId: any = '';

    menuItem: any = [
        {
            type: 'li',
            title: 'Driver Detail',
            func: () => {
                this.goTmsDriverPage();
            }
        },
    ];

    searchParams: any = {
        page_size: 99999
    };

    mounted() {
        this.getDriverList();
        this.getDriverCompany();
    }

    getDriverList() {
        this.loadingDriver = true;
        controlPanelService.getDriverData(this.searchParams).subscribe(
            (res: any) => {
                this.driverList = res.data;
                forEach(this.driverList, (item, index) => {
                    item.showMore = false;
                });
                this.viewList = this.driverList;
                this.loadingDriver = false;
            },
            (err: any) => {
                errorHandler.handle(err);
                this.loadingDriver = false;
            }
        );
    }

    getDriverCompany() {
        controlPanelService.getTmsDriverCompany().subscribe(
            (res: any) => {
                this.driverCompanyList = res.data;
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    filterDriver() {
        this.viewList = filter(this.driverList, (item) => {
            let name = ((item.driver_firstname + item.driver_lastname).toString()).toLowerCase();
            return name.indexOf(this.driverName.toLowerCase()) != -1 && (this.filterCompanyId ?  this.filterCompanyId == item.driver_company_id : true);
        });
    }

    showDriverDetailOrHide(index: any, e: any) {
        this.viewList[index].showMore = !this.viewList[index].showMore;
        this.$forceUpdate();
        e.stopPropagation();
    }

    selectDriver(index: any, data: any) {
        this.selectIndex = index;
        this.$store.commit('setDriverCalendarInfo', data);
    }

    searchDriverOffDuty(date: any) {
        if (date) {
            let startTime = new Date(date[0]).getTime() + 8 * 3600 * 1000;
            let endTime = new Date(date[1]).getTime() + 8 * 3600 * 1000;
            this.viewList = filter(this.viewList, (item, index) => {
                item.offDuty = true;
                if (item.dispatchs) {
                    forEach(item.dispatchs, (duty) => {
                        let tripStartTime: any = new Date(duty.trip_start_date).getTime();
                        let tripEndTime: any = duty.trip_end_date ? new Date(duty.trip_end_date).getTime() : tripStartTime;
                        if (tripStartTime <= endTime && tripEndTime >= startTime) {
                            item.offDuty = false;
                            return;
                        }
                    });
                }
                return item.offDuty == true;
            });
        } else {
            this.filterDriver();
        }
    }

    showDetail() {
        this.showOrderDetail = true;
    }

    closeDialog() {
        this.showOrderDetail = false;
    }

    setDragType(type: any) {
        this.$store.commit('editDragType', type);
    }

    selectDriverInfo(driver: any) {
        this.driverInfo = driver;
    }

    goTmsDriverPage() {
        controlPanelService.goTmsDriverPage(this.driverInfo.driver_id, this.driverInfo.driver_user_id, this.driverInfo.eld_account_id).subscribe(
            (res: any) => {
                this.createScriptToWrite(res);
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    createScriptToWrite(res: string) {
        let head = document.getElementsByTagName('head')[0];
        let script = document.createElement('script');
        let scriptTxt = res.replace('<script>', '').replace('</script>', '');
        script.text = scriptTxt;
        head.appendChild(script);
    }

    get carrierLinkDriver() {
        return this.$store.state.carrierLinkDriverId;
    }

    @Watch('carrierLinkDriver', {
        deep: true,
    })
    getDriverByCarrierLinkId() {
        this.driverName = '';
        this.filterCompanyId = '';
        if (this.$store.state.carrierLinkDriverId) {
            this.searchParams.driver_company_ids = [95];
            this.searchParams.driver_ids = this.$store.state.carrierLinkDriverId;
        } else {
            delete this.searchParams.driver_company_ids;
            delete this.searchParams.driver_ids;
        }
        this.getDriverList();
    }
}