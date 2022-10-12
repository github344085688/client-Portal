import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import template from "./existingTrips.vue";
import ElementSelect from '@components/element-select/element-select';
import '@assets/css/panel.scss';
import { parseInt, forEach, keyBy, filter, join, reverse, differenceBy, groupBy, cloneDeep } from "lodash-es";
import OrganizationAutoComplete from '@components/organization-auto-complete/organization-auto-complete';
import AdvanceDetail from '@panelComponents/advanceDetail/advanceDetail';
import AdvanceSearch from '@panelComponents/advanceSearch/advanceSearch';
import * as Moment from 'moment';
import controlPanelService from "@services/control-panel/controlPanelService";
import errorHandler from "@shared/error-handler";
import NewTrip from '@panelComponents/newTrip/newTrip';
import TripDetail from '@panelComponents/tripDetail/tripDetail';
import { throws } from "assert";
const loadStatusData = require('../../../../mapjs/gis-line-haul.json');
const orderLoadData = require('../../../../mapjs/gis-orders.json');

@Component({
    mixins: [template],
    name: 'ExistingTrips',
    components: {
        ElementSelect,
        OrganizationAutoComplete,
        AdvanceDetail,
        AdvanceSearch,
        NewTrip,
        TripDetail
    }
})
export default class ExistingTrips extends Vue {
    viewType: Array<any> = ['Card View', 'List View', 'Table View'];
    selectViewType: string = 'Card View';
    showTripDetail: Boolean = false;
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
    showStageBar: Boolean = true;
    tripStatusArr: any = ['All', 'scheduled', 'in_progress'];
    tripStatusFilter: string = 'All';
    showCustomizeFields: Boolean = true;
    showViewOrderPanelBtn: Boolean = false;
    showCloseBtn: Boolean = false;
    isShowMapView: Boolean = false;
    dropIndex: number = 0;
    dropType: string = '';
    fileType: string = 'photo';
    searchPanelName: string = '';
    viewSortDesending: Boolean = false;
    searchParam: any = {
        page: 1,
        page_size: 50,
        filter_category_array: [],
    };
    currentTripId: any = '';
    tripDetail: any = {};
    isEditTrip: Boolean = false;
    isDefaultAdvanceSearch: Boolean = true;
    associatedTripNo: any = '';

    mapViewOrderList: any = [];
    showTable: Boolean = false;
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
    dataList: Array<any> = [];
    sort: any = '0';
    scrollLock: Boolean = false;
    loadOrderDetail: Boolean = false;
    orderDetail: any = {};
    showAdvanceDetails: Boolean = false;

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

    sortAscending(item: any) {
        if (item) {
            item.secData.sort((a: any, b: any) => {
                return new Date(a.trip_start_date + ' ' + a.trip_start_time_from).getTime() - new Date(b.trip_start_date + ' ' + b.trip_start_time_from).getTime();
            });
            item.sort = '1';
            item.sortDesending = false;
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

    associatedOrder() {
        this.associatedTripNo = this.currentTripId;
        this.$store.commit('showAssociatedOrderByTrip', this.currentTripId);
    }

    unAssociatedOrder() {
        this.$store.commit('showAssociatedOrderByTrip', '');
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
        that.scrollLoad('.existing-card-view > .card-con-box-small', 20, function () {
            if (that.scrollLock) return;
            that.scrollLock = true;
            that.getTripData(that.searchParam);
        });
        that.scrollLoad('.existing-list-view > .table-out', 20, function () {
            if (that.scrollLock) return;
            that.scrollLock = true;
            that.getTripData(that.searchParam);
        });
        that.scrollLoad('.existing-table-view > .table-out', 20, function () {
            if (that.scrollLock) return;
            that.scrollLock = true;
            that.getTripData(that.searchParam);
        });
    }

    mounted() {
        let currentDay = Moment().format("YYYY-MM-DD");
        let sevenDaysAgo = Moment().subtract(0, "days").format("YYYY-MM-DD");
        this.searchParam.trip_create_date = [sevenDaysAgo, currentDay];
        this.getTripData(this.searchParam);
        this.initScrollLoadData();
        this.init();
    }

    init() {
        if (this.$store.state.currentPanel == 'Dispatch Dashboard') {
            this.showCloseBtn = true;
            if (this.$store.state.isShowOrderPanelBtn) {
                this.showViewOrderPanelBtn = true;
            }
        } else {
            this.showCloseBtn = false;
        }
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
                    this.maskLineHaulOrderSign(item);
                });
                forEach(this.issueArr, (item) => {
                    item.showMore = false;
                    item.showDropDown = false;
                    item.isHide = false;
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
        if (this.headDataArr[index].filter) {
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
        this.getTripData(this.searchParam);
    }

    setFilterArr() {
        forEach(this.filterStageTypeArr, item => {
            if (item) {
                this.isFilterForStage = true;
            }
        });
        if (this.isFilterForStage) {
            let defaultArr = this.isViewNormal ?  this.normalData.details :  this.issueData.details;
            let deleteArr: any = [];
            forEach(defaultArr, (perItem, index) => {
                forEach(this.filterStageTypeArr, item => {
                    if (item) {
                        if (perItem.trip_status_category != undefined) {
                            if (item.toUpperCase().indexOf(perItem.trip_status_category.toUpperCase().replace('_', '-')) != -1) {
                                if (item.toUpperCase() != perItem.trip_status_category.toUpperCase().replace('_', '-') + '-' + perItem.trip_stage_category) {
                                    deleteArr.push(perItem);
                                }
                            }
                        } else {
                            deleteArr.push(perItem);
                        }
                    }
                });
            });
            this.viewArr = differenceBy(defaultArr, deleteArr, 'trip_no');
        } else {
            this.viewArr = this.isViewNormal ?  this.normalData.details :  this.issueData.details;
        }
    }

    filterTripByStatus() {
        if (this.tripStatusFilter) {
            if (this.isViewNormal) {
                if (this.tripStatusFilter == 'All') {
                    this.viewArr = this.normalData.details;
                } else {
                    this.viewArr = filter(this.normalData.details, (o) => {
                        return o.trip_status_category == this.tripStatusFilter;
                    });
                }
            } else {
                if (this.tripStatusFilter == 'All') {
                    this.viewArr = this.issueData.details;
                } else {
                    this.viewArr = filter(this.issueData.details, (o) => {
                        return o.trip_status_category == this.tripStatusFilter;
                    });
                }
            }
        }
    }

    getOrderDetailById(id: any) {
        this.loadOrderDetail = true;
        controlPanelService.getOrderDeatilById(id).subscribe(
            (res: any) => {
                this.orderDetail = res.data;
                this.loadOrderDetail = false;
                this.showAdvanceDetails = true;
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

    showMap() {
        const global: any = window;
        const jsmap = global.jsmap;
        jsmap.initMap('jsmap');
        forEach(loadStatusData, (line) => {
            line.line = join(line.path, " ");
        });
        let lineHaulMap = keyBy(loadStatusData, "Langhaul");
        this.getLoadOrder(lineHaulMap);
    }

    getLoadOrder(longHaulMap: any) {
        let orders = orderLoadData;
        forEach(orders, (order) => {
            let longHaul = longHaulMap[order.Langhaul];
            if (!longHaul) return;
            let index = Math.floor(longHaul.path.length * order.LinePoz);
            order.latlng = longHaul.path[index];
        });
        let fitBounds = true;

        let filter: any = {};
        let _f = {
            OrderNo: ''
        };
        if (filter.loadStatus_loadNo) {
            _f.OrderNo = filter.loadStatus_loadNo;
            orders = filter(orders, _f);
            fitBounds = false;
        }

        forEach(orders, (order) => {
            let infoData = [];
            if (order.OrderNo) infoData.push(["OrderNo.: ", order.OrderNo]);
            if (order.CustomerID) infoData.push(["Customer: ", order.CustomerID]);
            if (order.ReferenceNo) infoData.push(["ReferenceNo: ", order.ReferenceNo]);
            if (order.StoreName) infoData.push(["StoreName: ", order.StoreName]);
            if (order.ShipToState) infoData.push(["State: ", order.ShipToState]);
            if (order.ShipToCity) infoData.push(["City: ", order.ShipToCity]);
            if (order.ShipToAddress1) infoData.push(["Address: ", order.ShipToAddress1]);
            if (order.ShipToZipCode) infoData.push(["ZipCode: ", order.ShipToZipCode]);
            if (infoData.length > 0)
                order._html = this.createInfoTable(infoData);
        });

        let lines: any = [];
        forEach(loadStatusData, (line) => {
            lines.push({
                latlng : line.line
            });
        });
        const global: any = window;
        const jsmap = global.jsmap;
        jsmap.showLoadStatus(orders, lines, fitBounds);
    }

    createInfoTable (info: any) {
        let html = "<table>";
        forEach(info, (row) => {
            let tr = "<tr>";
            let firstCol = true;
            forEach(row, (col) => {
                let style = firstCol ? "text-align: right; padding-right: 5px;" : "";
                let b = firstCol ? "" : "<b>";
                tr += "<td style='vertical-align: initial; " + style + "'>" + b + col + b + "</td>";
                firstCol = false;
            });
            tr += "</tr>";
            html += tr;
        });
        html += "</table>";
        return html;
    }

    hideOrShowStageBar() {
        this.showStageBar = !this.showStageBar;
    }

    hideTripsPanel() {
        this.$store.commit('showTripPanelBtn', true);
    }

    showTripLog(logs: any, tripNo: any) {
        let tripAndLog: any = {
            tripNo: tripNo,
            logArr: logs
        };
        this.$store.commit('showTripLog', tripAndLog);
    }

    mouseclick(data: any) {
        this.tripDetail = data;
        this.currentTripId = data.trip_no;
    }

    dbClickForDetail(data: any) {
        this.tripDetail = data;
        this.currentTripId = data.trip_no;
        this.showDetail();
    }

    editTrip(data: any) {
        this.tripDetail = cloneDeep(data);
    }

    dropDownTrip(item: any) {
        item.showMore = !item.showMore;
        this.$forceUpdate();
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

    hideOrExpandList(index: any) {
        if (this.listViewDataTitle[index] != undefined) {
            this.$set(this.listViewDataTitle[index], 'isHide', !this.listViewDataTitle[index].isHide);
        }
        if (this.tableViewDataTitle[index] != undefined) {
            this.$set(this.tableViewDataTitle[index], 'isHide', !this.tableViewDataTitle[index].isHide);
        }
    }

    viewOrderPanle() {
        this.$store.commit('showOrderPanelBtn', false);
    }

    get defaultPanelChange() {
        return this.$store.state.isShowOrderPanelBtn;
    }

    @Watch('defaultPanelChange')
    currentDragType() {
        this.showViewOrderPanelBtn = this.$store.state.isShowOrderPanelBtn;
    }

    showDetail() {
        this.showTripDetail = true;
    }

    closeDialog() {
        this.showTripDetail = false;
    }

    selectView(type: string) {
        if (type == 'Map View') {
            if (!this.isShowMapView) {
                this.showMap();
                this.isShowMapView = true;
            }
        }
    }

    setDragType(type: any) {
        this.$store.commit('editDragType', type);
    }

    menuItems(data: any) {
        let menuArr = [
            {
                type: 'li',
                title: 'View',
                func: () => {
                    this.showDetail();
                }
            },
            {
                type: 'li',
                title: 'Export',
                func: () => alert('Export')
            }
        ];
        return menuArr;
    }

    clickDropDown(index: any) {
        this.viewArr[index].showDropDown = !this.viewArr[index].showDropDown;
        this.$forceUpdate();
    }

    get watchMapViewOrder() {
        return this.$store.state.mapViewOrder;
    }

    @Watch('watchMapViewOrder')
    showMapViewOrder() {
        this.mapViewOrderList = this.$store.state.mapViewOrder;
        if (this.mapViewOrderList) {
            this.showTable = true;
        }
    }

    hideMapTable() {
        this.showTable = false;
        this.$store.commit('showMapViewOrder', '');
    }

    closeAdvance() {
        this.searchPanelName = '';
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

    get watchAdvanceSearch() {
        return this.$store.state.advanceSearchParams.ExistingTrips;
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
        if (this.$store.state.associatedTripByOrder) {
            this.$store.commit('showAssociatedTripByOrder', '');
        } else {
            this.dataList = [];
            this.getTripData(this.searchParam);
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