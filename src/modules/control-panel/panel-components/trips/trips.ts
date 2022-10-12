import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import template from "./trips.vue";
import { Checkbox, Upload, Radio, MessageBox } from 'element-ui';
import ElementSelect from '@components/element-select/element-select';
import '@assets/css/panel.scss';
import { parseInt, forEach, groupBy, filter, reverse, differenceBy, cloneDeep } from "lodash-es";
import OrganizationAutoComplete from '@components/organization-auto-complete/organization-auto-complete';
import AdvanceSearch from '@panelComponents/advanceSearch/advanceSearch';
import AdvanceDetail from '@panelComponents/advanceDetail/advanceDetail';
import controlPanelService from "@services/control-panel/controlPanelService";
import * as Moment from 'moment';
import WaittingBtn from '@components/waitting-button/waitting-btn';
import errorHandler from "@shared/error-handler";
import NewTrip from '@panelComponents/newTrip/newTrip';
import TripDetail from '@panelComponents/tripDetail/tripDetail';

Vue.use(Checkbox);
Vue.use(Radio);
Vue.use(Upload);

@Component({
    mixins: [template],
    name: 'shipments',
    components: {
        ElementSelect,
        OrganizationAutoComplete,
        AdvanceSearch,
        AdvanceDetail,
        NewTrip,
        WaittingBtn,
        TripDetail
    }
})
export default class Shipments extends Vue {
    viewType: Array<any> = ['Card View', 'List View', 'Table View'];
    selectViewType: string = 'Card View';
    showTripDetail: Boolean = false;
    fileType: string = 'photo';
    excludeLinkedFiles: Boolean = false;
    showTripDialog: Boolean = false;
    totalCompleted: any = 0;
    totalCanceled: any = 0;
    filterStageTypeArr: Array<any> = ['', '', ''];
    isFilterForStage: Boolean = false;
    isViewNormal: Boolean = true;
    loadingTrip: Boolean = false;
    headDataArr: any = [];
    issueData: any = {};
    normalData: any = {};
    issueArr: any = [];
    normalArr: any = [];
    viewArr: any = [];
    searchPanelName: string = '';
    viewAllStop: Boolean = false;
    searchParam: any = {
        page: 1,
        page_size: 50,
        filter_category_array: [],
    };
    dropIndex: number = 0;
    dropType: string = '';
    tripDetail: any = {};
    isEditTrip: Boolean = false;
    isNewTrip: Boolean = false;
    viewSortDesending: Boolean = false;
    isDefaultAdvanceSearch: Boolean = true;

    dataList: Array<any> = [];
    currentTripId: any = '';
    isEditStop: Boolean = false;
    sort: any = '0';
    scrollLock: Boolean = false;
    associatedTripNo: any = '';
    loadOrderDetail: Boolean = false;
    orderDetail: any = {};
    showAdvanceDetails: Boolean = false;
    saveScroll: any = 0;

    listViewDataTitle: any = [
        { name: 'Trip#', isHide: false },
        { name: 'Total Mileage', isHide: false },
        { name: 'Priority', isHide: false },
        { name: 'Dispatcher', isHide: false },
        { name: 'Carrier', isHide: false },
        { name: 'Due Date', isHide: false },
        { name: 'Date', isHide: false },
        { name: 'Pickup Location', isHide: false },
        { name: 'Destination', isHide: false },
    ];

    tableViewDataTitle: any = [
        { name: 'Trip#', isHide: false },
        { name: 'Total Mileage', isHide: false },
        { name: 'Priority', isHide: false },
        { name: 'Dispatcher', isHide: false },
        { name: 'Carrier', isHide: false },
        { name: 'Due Date', isHide: false },
        { name: 'Date', isHide: false },
        { name: 'Pickup Location', isHide: false },
        { name: 'Destination', isHide: false },
        { name: 'Driver', isHide: false }
    ];

    menuItem: any = [
        {
            type: 'li',
            title: 'View',
            func: () => {
                this.showDetail();
            }
        },
        {
            type: 'li',
            title: 'Select related',
            func: () => {
                this.associatedOrder();
            }
        },
        {
            type: 'li',
            title: 'Reset related',
            func: () => {
                this.unAssociatedOrder();
            }
        },
        {
            type: 'li',
            title: 'Send Message To Driver',
            func: () => {
                this.sendMessageToDriver();
            }
        },
    ];

    associatedOrder() {
        this.$store.commit('showAssociatedOrderByTrip', this.currentTripId);
        this.associatedTripNo = this.currentTripId;
        this.tripDetail.associated = true;
        this.$forceUpdate();
    }

    unAssociatedOrder() {
        this.$store.commit('showAssociatedOrderByTrip', '');
    }

    sortAscending(item: any) {
        if (item) {
            item.secData.sort((a: any, b: any) => {
                return new Date(a.trip_start_date + ' ' + a.trip_start_time_from).getTime() - new Date(b.trip_start_date + ' ' + b.trip_start_time_from).getTime();
            });
            item.sortDesending = false;
            item.sort = '1';
        } else {
            this.viewArr.sort((a: any, b: any) => {
                return new Date(a.trip_start_date + ' ' + a.trip_start_time_from).getTime() - new Date(b.trip_start_date + ' ' + b.trip_start_time_from).getTime();
            });
            this.sort = '1';
            this.viewSortDesending = false;
        }
    }

    sortDecending(item: any) {
        if (item) {
            if (item.sortDesending) return;
            item.secData.sort((a: any, b: any) => {
                return new Date(a.trip_start_date + ' ' + a.trip_start_time_from).getTime() - new Date(b.trip_start_date + ' ' + b.trip_start_time_from).getTime();
            });
            item.sort = '2';
            reverse(item.secData);
            item.sortDesending = true;
        } else {
            if (this.viewSortDesending) return;
            this.viewArr.sort((a: any, b: any) => {
                return new Date(a.trip_start_date + ' ' + a.trip_start_time_from).getTime() - new Date(b.trip_start_date + ' ' + b.trip_start_time_from).getTime();
            });
            this.sort = '2';
            this.viewSortDesending = true;
            reverse(this.viewArr);
        }
    }

    dropDownTrip(item: any) {
        item.showMore = !item.showMore;
        this.$forceUpdate();
    }

    scrollLoad (ele: any, bottomHeight: any, callback: any) {
        let _ele = document.querySelector(ele);
        let bH = bottomHeight || 100;
        _ele.addEventListener('scroll', function () {
            let scrollTop = _ele.scrollTop,
                cliHeight = _ele.clientHeight,
                scrollHeight = _ele.scrollHeight;
            if (scrollTop && scrollHeight - cliHeight - scrollTop < bH) {
                callback();
            }
        }, false);
    }

    initScrollLoadData () {
        const that = this;
        that.scrollLoad('.trip-card-view > .card-con-box', 20, function () {
            if (that.scrollLock) return;
            that.scrollLock = true;
            that.getTripData(that.searchParam);
        });
        that.scrollLoad('.trip-list-view > .table-out', 20, function () {
            if (that.scrollLock) return;
            that.scrollLock = true;
            that.getTripData(that.searchParam);
        });
        that.scrollLoad('.trip-table-view > .table-out', 20, function () {
            if (that.scrollLock) return;
            that.scrollLock = true;
            that.getTripData(that.searchParam);
        });
    }

    mounted() {
        let currentDay = Moment().format("YYYY-MM-DD");
        let sevenDaysAgo = Moment().subtract(0, "days").format("YYYY-MM-DD");
        // this.searchParam.trip_create_from = sevenDaysAgo;
        // this.searchParam.trip_create_to = currentDay;
        this.searchParam.trip_create_date = [sevenDaysAgo, currentDay];
        this.getTripData(this.searchParam);
        this.initScrollLoadData();
    }

    getTripData(searchParam: any) {
        this.loadingTrip = true;
        this.scrollLock = true;
        controlPanelService.getTripPanelData(searchParam).subscribe(
            (res: any) => {
                this.loadingTrip = false;
                let newIssueArr = filter(res.data.issue.details, o => {
                    return o.trip_status_category == 'scheduled' || o.trip_status_category == 'in_progress';
                });
                let newNormalArr = filter(res.data.normal.details, o => {
                    return o.trip_status_category == 'scheduled' || o.trip_status_category == 'in_progress';
                });
                if (searchParam.page == 1) {
                    this.issueData = res.data.issue;
                    this.normalData = res.data.normal;
                } else {
                    this.issueData.details = this.issueData.details.concat(newIssueArr);
                    this.normalData.details = this.normalData.details.concat(newNormalArr);
                }
                this.normalArr = this.normalData.details;
                this.issueArr = this.issueData.details;
                forEach(this.normalArr, (item) => {
                    item.showMore = false;
                    item.showDropDown = false;
                    item.isHide = false;
                    item.associated = false;
                    this.maskLineHaulOrderSign(item);
                });
                forEach(this.issueArr, (item) => {
                    item.showMore = false;
                    item.showDropDown = false;
                    item.isHide = false;
                    item.associated = false;
                    this.maskLineHaulOrderSign(item);
                });
                this.totalCanceled = this.issueData.summary.cancelled.total + this.normalData.summary.cancelled.total;
                this.totalCompleted = this.issueData.summary.completed.total + this.normalData.summary.completed.total;
                if (this.isViewNormal) {
                    this.viewArr = this.normalArr;
                } else {
                    this.viewArr = this.issueArr;
                }
                this.getDataListByType(this.viewArr);
                this.getheadDataArr(this.issueData, this.normalData);
                if (searchParam.page < res.page.last_page) {
                    this.scrollLock = false;
                    searchParam.page ++;
                } else {
                    this.scrollLock = true;
                }
            },
            (err: any) => {
                errorHandler.handle(err);
                this.loadingTrip = false;
            }
        );
    }

    maskLineHaulOrderSign(perTrip: any) {
        if (perTrip.trip_stage_category == 'L') {
            forEach(perTrip.tasks, (pertask: any, taskIndex: any) => {
                forEach(pertask.stops, (stop, stopIndex) => {
                    if (stop.stage != 'truck inspection') {
                        forEach(stop.lines, (line, lineIndex) => {
                            line.showLineHaulOrders = false;
                        });
                    }
                });
            });
        }
    }

    showLineHaulOrders(line: any) {
        line.showLineHaulOrders = true;
        this.$forceUpdate();
    }

    hideLineHaulOrders(line: any, e: any) {
        line.showLineHaulOrders = false;
        this.$forceUpdate();
        e.stopPropagation();
    }

    getDataListByType(list: any) {
        forEach(list, (item: any) => {
            item.showMore = false;
        });
        let arr = groupBy(list, 'trip_status_category');
        let scheduledArr: any = {type: 'Scheduled', isHide: false, sortDesending: false, size: '33', cols: 1, secData: arr.scheduled ? arr.scheduled : []};
        let inProgressArr: any = {type: 'In-progress', sortDesending: false, isHide: false, size: '66', cols: 2, secData: arr['in_progress'] ? arr['in_progress'] : []};
        this.dataList = [].concat(scheduledArr).concat(inProgressArr);
    }

    viewIssueOrNormal(index: any, type: any) {
        if (type == 'issue') {
            this.isViewNormal = false;
            this.searchParam.first_category = 'issue';
        } else {
            this.isViewNormal = true;
            this.searchParam.first_category = 'normal';
        }
        this.resetLoadTrip();
        if (this.$store.state.associatedTripByWms) {
            let searchParam = cloneDeep(this.searchParam);
            delete searchParam.trip_create_date;
            this.isDefaultAdvanceSearch = false;
            this.getTripData(searchParam);
        } else {
            this.getTripData(this.searchParam);
        }
    }

    resetLoadTrip() {
        this.searchParam.page = 1;
        this.searchParam.query_array = [];
        this.dataList = [];
        this.viewArr = [];
    }

    getheadDataArr(issueData: any, normalData: any) {
        let scheduledObj: any = {
            name: 'Scheduled',
            normal: normalData.summary.scheduled,
            issue: issueData.summary.scheduled,
            filter: this.filterStageTypeArr[0],
            // showNormal: this.filterStatuTypeArr[0],
        };
        let inProgressObj: any = {
            name: 'In-progress',
            normal: normalData.summary['in_progress'],
            issue: issueData.summary['in_progress'],
            filter: this.filterStageTypeArr[1],
        };
        this.headDataArr = [].concat(scheduledObj).concat(inProgressObj);
    }

    filterType(index: any, stageType: any, categoryType: any) {
        if (this.headDataArr[index].filter == `${stageType}-${categoryType}`) {
            this.headDataArr[index].filter = '';
            this.filterStageTypeArr[index] = '';
            this.searchParam.filter_category_array = [];
        } else {
            forEach(this.headDataArr, (type: any, index: any) => {
                type.filter = '';
            });
            this.filterStageTypeArr = ['', '', ''];
            this.headDataArr[index].filter = `${stageType}-${categoryType}`;
            this.filterStageTypeArr[index] = `${stageType}-${categoryType}`;
            let filterArr: any = [];
            forEach(this.headDataArr, (type: any, index: any) => {
                if (type.filter) {
                    let resultStr = '';
                    if (type.name == 'Scheduled') {
                        resultStr = 'scheduled';
                    } else
                    if (type.name == 'In-progress') {
                        resultStr = 'in_progress';
                    }
                    let filterObj: any = {
                        second_category: resultStr,
                        third_category: type.filter.replace(`${type.name}-`, '')
                    };
                    filterArr.push(filterObj);
                }
            });
            this.searchParam.filter_category_array = cloneDeep(filterArr);
        }
        this.resetLoadTrip();
        if (this.$store.state.associatedTripByWms) {
            let searchParam = cloneDeep(this.searchParam);
            delete searchParam.trip_create_date;
            this.getTripData(searchParam);
        } else {
            this.getTripData(this.searchParam);
        }
    }

    get needRefresh() {
        return this.$store.state.refreshOrderAndTrip.trip;
    }
    @Watch('needRefresh', {
        deep: true,
    })
    refreshTrip() {
        this.searchParam.page = 1;
        this.getTripData(this.searchParam);
        this.$store.commit('refreshOrderAndTrip', {
            order: false,
            trip: false
        });
        this.showTripDetail = false;
    }

    mouseclick(data: any) {
        this.tripDetail = cloneDeep(data);
        this.currentTripId = data.trip_no;
    }

    dbClickForDetail(data: any) {
        this.tripDetail = cloneDeep(data);
        this.currentTripId = data.trip_no;
        this.showDetail();
    }

    showDetail() {
        this.showTripDetail = true;
    }

    changeIsEdit(res: any) {
        if (res.isEditTrip) {
            this.tripDetail = cloneDeep(res);
        }
    }

    closeDialog() {
        this.showTripDetail = false;
    }

    selectView(type: string) {
        console.log(type);
    }

    clickDropDown(index: any) {
        this.viewArr[index].showDropDown = !this.viewArr[index].showDropDown;
        this.$forceUpdate();
    }

    hideOrExpand(index: any) {
        if (!this.dataList[index].isHide) {
            this.dataList[index].isHide = true;
            this.dataList[index].size = '10';
        } else {
            this.dataList[index].isHide = false;
        }
        this.autoCardSize(this.dataList, index);
    }

    hideOrExpandList(index: any) {
        if (this.listViewDataTitle[index] != undefined) {
            this.$set(this.listViewDataTitle[index], 'isHide', !this.listViewDataTitle[index].isHide);
        }
        if (this.tableViewDataTitle[index] != undefined) {
            this.$set(this.tableViewDataTitle[index], 'isHide', !this.tableViewDataTitle[index].isHide);
        }
    }

    showTripLog(logs: any, tripNo: any) {
        let tripAndLog: any = {
            tripNo: tripNo,
            logArr: logs
        };
        this.$store.commit('showTripLog', tripAndLog);
    }

    autoCardSize(dataList: any, index: any) {
        let hideArr = filter(this.dataList, (o) => {
            return o.isHide;
        });
        let lestWidth = 100 - (hideArr.length * 10);
        let allCols = 0;
        let perExpandWidth = 0;
        forEach(this.dataList, (item) => {
            if (!item.isHide && item.cols) {
                allCols += item.cols;
            } else if (!item.isHide) {
                allCols ++;
            }
        });
        perExpandWidth = parseInt((lestWidth / allCols).toString());
        forEach(this.dataList, (item) => {
            if (!item.isHide) {
                if (item.cols) {
                    item.size = perExpandWidth * item.cols;
                } else {
                    item.size = perExpandWidth;
                }
            }
        });
    }

    closeNewTripDialog() {
        this.showTripDialog = false;
        this.$store.commit('isEditTrip', false);
        this.$store.commit('isNewTrip', false);
    }

    createNewTrip() {
        this.showTripDialog = true;
        this.$store.commit('isEditTrip', false);
        this.$store.commit('isNewTrip', true);
    }

    getOrderDetailById(id: any) {
        this.loadOrderDetail = true;
        controlPanelService.getOrderDeatilById(id).subscribe(
            (res: any) => {
                this.orderDetail = res.data;
                this.showAdvanceDetails = true;
                this.loadOrderDetail = false;
            },
            (err: any) => {
                this.loadOrderDetail = false;
                errorHandler.handle(err);
            }
        );
    }

    setShowOrHideFun(res: any) {
        this.showAdvanceDetails = res;
    }

    closeAdvance() {
        this.searchPanelName = '';
    }

    get watchIsEditTrip() {
        return this.$store.state.isEditTrip;
    }
    @Watch('watchIsEditTrip')
    showEditTrip() {
        if (this.$store.state.isEditTrip) {
            this.isEditTrip = true;
            this.$store.commit('isNewTrip', false);
            this.showTripDialog = true;
        } else {
            this.isEditTrip = false;
        }
    }

    get watchAdvanceSearch() {
        return this.$store.state.advanceSearchParams.Trip;
    }
    @Watch('watchAdvanceSearch', {
        deep: true,
    })
    searchByAdvanceParams(params: any) {
        this.searchParam = {
            page: 1,
            page_size: 50,
        };
        forEach(params, (item, index) => {
            this.searchParam[index] = item;
        });
        if (!this.isViewNormal) {
            this.searchParam.first_category = 'issue';
        } else {
            this.searchParam.first_category = 'normal';
        }
        this.isDefaultAdvanceSearch = params.isDefault;
        this.filterStageTypeArr = [];
        if (this.$store.state.associatedTripByOrder) {
            this.$store.commit('showAssociatedTripByOrder', '');
        } else {
            this.dataList = [];
            this.getTripData(this.searchParam);
        }
        if (this.$store.state.associatedTripByWms) {
            this.$store.commit('showAssociatedTripByWms', '');
        }
    }

    sendMessageToDriver() {
        this.$store.commit('returnTrip', this.tripDetail);
    }

    get associatedByTripNo() {
        return this.$store.state.associatedOrderByTrip;
    }
    @Watch('associatedByTripNo', {
        deep: true,
    })
    getAssociatedByTripNo() {
        if (!this.$store.state.associatedOrderByTrip) {
            this.associatedTripNo = '';
        }
    }

    get associatedByWmsNo() {
        return this.$store.state.associatedTripByWms;
    }
    @Watch('associatedByWmsNo', {
        deep: true,
    })
    getAssociatedTripByWmsNo() {
        if (this.$store.state.associatedTripByWms) {
            this.resetLoadTrip();
            this.searchParam.load_no = this.$store.state.associatedTripByWms;
            let searchParam = cloneDeep(this.searchParam);
            delete searchParam.trip_create_date;
            delete searchParam.query_array;
            this.getTripData(searchParam);
            this.isDefaultAdvanceSearch = false;
        } else {
            delete this.searchParam.load_no;
            this.getTripData(this.searchParam);
            this.isDefaultAdvanceSearch = true;
        }
    }

    get associatedTripByOrderId() {
        return this.$store.state.associatedTripByOrder;
    }
    @Watch('associatedTripByOrderId', {
        deep: true,
    })
    getAssociatedTripByOrderId() {
        if (this.$store.state.associatedTripByOrder) {
            this.resetLoadTrip();
            this.searchParam.order_id = this.$store.state.associatedTripByOrder;
            let searchParam = cloneDeep(this.searchParam);
            delete searchParam.trip_create_date;
            delete searchParam.query_array;
            this.getTripData(searchParam);
            this.isDefaultAdvanceSearch = false;
        } else {
            delete this.searchParam.order_id;
            this.getTripData(this.searchParam);
            this.isDefaultAdvanceSearch = true;
        }
    }
}