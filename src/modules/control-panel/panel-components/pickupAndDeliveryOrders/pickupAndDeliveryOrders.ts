import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import template from "./pickupAndDeliveryOrders.vue";
import ElementSelect from '@components/element-select/element-select';
import '@assets/css/panel.scss';
import { parseInt, forEach, reverse, filter, indexOf, cloneDeep, findIndex, find, head, } from "lodash";
import controlPanelService from "@services/control-panel/controlPanelService";
import AdvanceSearch from '@panelComponents/advanceSearch/advanceSearch';
import AdvanceDetail from '@panelComponents/advanceDetail/advanceDetail';
import NewTrip from '@panelComponents/newTrip/newTrip';
import * as Moment from 'moment';
import { groupBy } from 'lodash';
import errorHandler from "@shared/error-handler";
import GoogleMap from '@components/googleMaps/googleMap';

@Component({
    mixins: [template],
    name: 'PickupAndDeliveryOrders',
    components: {
        ElementSelect,
        AdvanceSearch,
        AdvanceDetail,
        NewTrip,
        GoogleMap
    }
})
export default class PickupAndDeliveryOrders extends Vue {
    viewType: Array<any> = ['Card View', 'Map View', 'List View', 'Table View'];
   // viewType: Array<any> = ['Card View', 'List View', 'Table View'];
    selectViewType: string = 'Card View';
    showOrderDetail: Boolean = false;
    dateValue: any = '';
    timeValue: any = '';
    showStageBar: Boolean = true;
    orderStatusArr: any = ['All', 'New', 'Booked', 'Picked Up', 'Line Haul', 'OFD'];
    orderStatusFilter: string = 'All';
    showCustomizeFields: Boolean = true;
    showViewTripsPanelBtn: Boolean = false;
    showAdvanceDetails: Boolean = false;
    showCloseBtn: Boolean = false;
    loadOrderDetail: Boolean = false;
    currentOrderId: any = '';
    associatedOrderNo: any = '';
    orderDetail: any = {};
    orderInfo: any = {};
    searchPanelName: string = '';
    totalCompleted: any = 0;
    totalCanceled: any = 0;
    issueData: any = {};
    normalData: any = {};
    issueArr: any = [];
    normalArr: any = [];
    scrollLock: Boolean = false;
    headDataArr: any = [];
    filterShipper: String = '';
    filterConsignee: String = '';
    filterStageTypeArr: Array<any> = ['', '', '', '', ''];
    dispatchFilterArr: any = [
        {name: 'P', key: 'canDoPickup', select: false},
        {name: 'D', key: 'canDoDelivery', select: false},
        {name: 'L', key: 'canDoLineHaul', select: false},
    ];
    selectDispatchArr: any = [];
    loadingOrder: Boolean = false;
    isViewNormal: Boolean = true;
    onEditTrip: Boolean = false;
    searchParam: any = {
        page: 1,
        page_size: 50,
        filter_category_array: [],
    };
    sort: any = '0';
    orderChecked: Boolean = false;
    dropOrderArr: any = [];
    showTripDialog: Boolean = false;

    listViewDataTitle: any = [
        { name: 'Type / Pro#', isHide: false },
        { name: 'PU#', isHide: false },
        { name: 'Shipper/Consignee', isHide: false },
        { name: 'Pick/Delivery', isHide: false },
        { name: 'W/C/M', isHide: false },
        { name: 'Time Window', isHide: false },
    ];
    tableViewDataTitle: any = [
        { name: 'Type / Pro#', isHide: false },
        { name: 'PU#', isHide: false },
        { name: 'Shipper', isHide: false },
        { name: 'Consignee', isHide: false },
        { name: 'Pick up Trip', isHide: false },
        { name: 'LineHaul Trip', isHide: false },
        { name: 'OFD Trip', isHide: false },
        { name: 'Pick', isHide: false },
        { name: 'Delivery', isHide: false },
        { name: 'Weight', isHide: false },
        { name: 'Capacity', isHide: false },
        { name: 'Miles', isHide: false },
        { name: 'Time Window', isHide: false },
    ];
    isDefaultAdvanceSearch: Boolean = true;
    viewSortDesending: Boolean = false;

    dataList: any = [
    ];

    viewArr: any = [];

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
                this.associatedTrip();
            }
        },
        {
            type: 'li',
            title: 'Reset related',
            func: () => {
                this.unAssociatedTrip();
            }
        },
        {
            type: 'li',
            title: 'Send Message',
            func: () => {
                this.sendOrderMessage();
            }
        },
    ];
    terminalList: any = [];
    showTerminalFilter: Boolean = false;
    origin_terminal_array: any = [];
    dest_terminal_array: any = [];
    terminalSearch: Boolean = false;

    map_terminal: any = '';

    setmarkers: Array<any> =  [];
    timer: any;
    gisCenterForTerminal: any = {};
    mounted() {
        this.init();
        this.initScrollLoadData();
        this.getTerminal();
    }

    init() {
        let currentDay = Moment().format("YYYY-MM-DD");
        let sevenDaysAgo = Moment().subtract(0, "days").format("YYYY-MM-DD");
        // this.searchParam.order_create_from = sevenDaysAgo;
        // this.searchParam.order_create_to = currentDay;
        this.searchParam.order_create_date = [sevenDaysAgo, currentDay];
        this.getOrderPanelData(this.searchParam);
        if (this.$store.state.currentPanel == 'Dispatch Dashboard') {
            this.showCloseBtn = true;
            if (this.$store.state.isShowTripPanelBtn) {
                this.showViewTripsPanelBtn = true;
            }
        } else {
            this.showCloseBtn = false;
        }
    }

    initScrollLoadData () {
        const that = this;
        that.scrollLoad('.card-view > .card-con-box-small', 20, function () {
            if (that.scrollLock) return;
            that.scrollLock = true;
            that.getOrderPanelData(that.searchParam);
        });
        that.scrollLoad('.list-view > .table-out', 20, function () {
            if (that.scrollLock) return;
            that.scrollLock = true;
            that.getOrderPanelData(that.searchParam);
        });
        that.scrollLoad('.table-view > .table-out', 20, function () {
            if (that.scrollLock) return;
            that.scrollLock = true;
            that.getOrderPanelData(that.searchParam);
        });
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

    getOrderPanelData(searchParam: any) {
        this.loadingOrder = true;
        this.scrollLock = true;
        controlPanelService.getDispatchOrderData(searchParam).subscribe(
            (res: any) => {
                this.loadingOrder = false;
                let newIssueArr = filter(res.data.issue.details, o => {
                    return o.order_stage == 'New' || o.order_stage == 'Picked Up' || o.order_stage == 'OFD' || o.order_stage == 'Booked' || o.order_stage == 'Line Haul';
                });
                let newNormalArr = filter(res.data.normal.details, o => {
                    return o.order_stage == 'New' || o.order_stage == 'Picked Up' || o.order_stage == 'OFD' || o.order_stage == 'Booked' || o.order_stage == 'Line Haul';
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
                forEach(this.normalArr, (order: any) => {
                    order.isInfilter = true;
                    order.nameFilter = true;
                });
                forEach(this.issueArr, (order: any) => {
                    order.isInfilter = true;
                    order.nameFilter = true;
                });
                this.totalCanceled = this.issueData.summary.Cancelled + this.normalData.summary.Cancelled;
                this.totalCompleted = this.issueData.summary.Delivered + this.normalData.summary.Delivered;
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
                this.filterList();
                this.filterByName();
            },
            (err: any) => {
                errorHandler.handle(err);
                this.loadingOrder = false;
            }
        );
    }

    getDataListByType(list: any) {
        forEach(list, (item: any) => {
            item.showMore = false;
        });
        let arr = groupBy(list, 'order_stage');
        let newArr: any = {type: 'New', isHide: false, sortDesending: false, size: '20', secData: arr.New ? arr.New : []};
        let bookedArr: any = {type: 'Booked', isHide: false, sortDesending: false, size: '20', secData: arr.Booked ? arr.Booked : []};
        let pickedUpArr: any = {type: 'Picked Up', sortDesending: false, isHide: false, size: '20', secData: arr['Picked Up'] ? arr['Picked Up'] : []};
        let lineHaulArr: any = {type: 'Line Haul', sortDesending: false, isHide: false, size: '20', secData: arr['Line Haul'] ? arr['Line Haul'] : []};
        let ofdArr: any = {type: 'OFD', isHide: false, sortDesending: false, size: '20', secData: arr.OFD ? arr.OFD : []};
        this.dataList = [].concat(newArr).concat(bookedArr).concat(pickedUpArr).concat(lineHaulArr).concat(ofdArr);
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
            this.filterStageTypeArr = ['', '', '', '', ''];
            this.headDataArr[index].filter = `${stageType}-${categoryType}`;
            this.filterStageTypeArr[index] = `${stageType}-${categoryType}`;
            let filterArr: any = [];
            forEach(this.headDataArr, (type: any, index: any) => {
                if (type.filter) {
                    let filterObj: any = {
                        second_category: type.name,
                        third_category: type.filter.replace(`${type.name}-`, '')
                    };
                    filterArr.push(filterObj);
                }
            });
            this.searchParam.filter_category_array = cloneDeep(filterArr);
        }
        this.resetLoadOrder();
        if (this.$store.state.associatedOrderByTrip) {
            let searchParam = cloneDeep(this.searchParam);
            delete searchParam.order_create_date;
            this.getOrderPanelData(searchParam);
        } else {
            this.getOrderPanelData(this.searchParam);
        }
    }

    viewIssueOrNormal(index: any, type: any) {
        if (type == 'issue') {
            this.isViewNormal = false;
            this.searchParam.first_category = 'issue';
        } else {
            this.isViewNormal = true;
            this.searchParam.first_category = 'normal';
        }
        this.resetLoadOrder();
        if (this.$store.state.associatedOrderByTrip) {
            let searchParam = cloneDeep(this.searchParam);
            delete searchParam.order_create_date;
            this.getOrderPanelData(searchParam);
        } else {
            this.getOrderPanelData(this.searchParam);
        }
    }

    resetLoadOrder() {
        this.searchParam.page = 1;
        this.dataList = [];
        this.viewArr = [];
        this.selectDispatchArr = [];
        forEach(this.dispatchFilterArr, (item: any) => {
            item.select = false;
        });
    }

    dispatchFilter(dispatch: any, index: any) {
        dispatch.select = !dispatch.select;
        if (dispatch.select) {
            this.selectDispatchArr.push(dispatch.key);
        } else {
            let findFilter = dispatch.key;
            let index = indexOf(this.selectDispatchArr, findFilter);
            this.selectDispatchArr.splice(index, 1);
        }
        this.filterList();
    }

    filterList() {
        if (this.selectDispatchArr.length > 0) {
            forEach(this.viewArr, (order: any) => {
                order.isInfilter = false;
                forEach(this.selectDispatchArr, (filter: any) => {
                    if (order[filter]) {
                        order.isInfilter = true;
                    }
                });
            });
        } else {
            forEach(this.viewArr, (order: any) => {
                order.isInfilter = true;
            });
        }
        this.getDataListByType(this.viewArr);
    }

    filterByName() {
        forEach(this.viewArr, (order: any) => {
            if (order.shipper_name.toUpperCase().indexOf(this.filterShipper.toUpperCase()) != -1 && order.consignee_name.toUpperCase().indexOf(this.filterConsignee.toUpperCase()) != -1) {
                order.nameFilter = true;
            } else {
                order.nameFilter = false;
            }
        });
    }

    createNewTrip() {
        this.showTripDialog = true;
        this.$store.commit('isEditTrip', false);
        this.$store.commit('isNewTrip', true);
    }

    closeNewTripDialog() {
        this.showTripDialog = false;
        this.$store.commit('isEditTrip', false);
        this.$store.commit('isNewTrip', false);
    }

    getheadDataArr(issueData: any, normalData: any) {
        let newObj: any = {
            name: 'New',
            normal: normalData.summary.New,
            issue: issueData.summary.New,
        };
        let bookedObj: any = {
            name: 'Booked',
            normal: normalData.summary.Booked,
            issue: issueData.summary.Booked,
        };
        let pickedUpObj: any = {
            name: 'Picked Up',
            normal: normalData.summary['Picked Up'],
            issue: issueData.summary['Picked Up'],
        };
        let lineHaulObj: any = {
            name: 'Line Haul',
            normal: normalData.summary['Line Haul'],
            issue: issueData.summary['Line Haul'],
        };
        let ofdObj: any = {
            name: 'OFD',
            normal: normalData.summary.OFD,
            issue: issueData.summary.OFD,
        };
        this.headDataArr = [].concat(newObj).concat(bookedObj).concat(pickedUpObj).concat(lineHaulObj).concat(ofdObj);
    }

    filterOrderByStatus() {
        if (this.orderStatusFilter) {
            if (this.orderStatusFilter == 'All') {
                delete this.searchParam.second_category;
            } else {
                this.searchParam.second_category = '';
                this.searchParam.second_category = this.orderStatusFilter;
                this.searchParam.page = 1;
            }
            this.getOrderPanelData(this.searchParam);
            // if (this.isViewNormal) {
            //     if (this.orderStatusFilter == 'All') {
            //         this.viewArr = this.normalData.details;
            //     } else {
            //         this.viewArr = filter(this.normalData.details, (o) => {
            //             return o.order_stage == this.orderStatusFilter;
            //         });
            //     }
            // } else {
            //     if (this.orderStatusFilter == 'All') {
            //         this.viewArr = this.issueData.details;
            //     } else {
            //         this.viewArr = filter(this.issueData.details, (o) => {
            //             return o.order_stage == this.orderStatusFilter;
            //         });
            //     }
            // }
        }
    }

    sortAscending(item: any) {
        if (item) {
            item.secData.sort((a: any, b: any) => {
                return new Date(a.order_pickup_date).getTime() - new Date(b.order_pickup_date).getTime();
            });
            item.sort = '1';
            item.sortDesending = false;
        } else {
            this.viewArr.sort((a: any, b: any) => {
                return new Date(a.order_pickup_date).getTime() - new Date(b.order_pickup_date).getTime();
            });
            this.sort = '1';
            this.viewSortDesending = false;
        }
    }

    sortDecending(item: any) {
        if (item) {
            if (item.sortDesending) return;
            item.secData.sort((a: any, b: any) => {
                return new Date(a.order_pickup_date).getTime() - new Date(b.order_pickup_date).getTime();
            });
            item.sort = '2';
            reverse(item.secData);
            item.sortDesending = true;
        } else {
            if (this.viewSortDesending) return;
            this.viewArr.sort((a: any, b: any) => {
                return new Date(a.order_pickup_date).getTime() - new Date(b.order_pickup_date).getTime();
            });
            this.sort = '2';
            this.viewSortDesending = true;
            reverse(this.viewArr);
        }
    }

    judgeCanDrag(order: any) {
        if (order.canDoDelivery || order.canDoLineHaul || order.canDoPickup) {
            let arr = filter(this.$store.state.dropedOrder, (o: any) => {
                return o.orderId == order.order_id || (o.orderPu == order.pu_id && o.orderPro == order.order_pro);
            });
            if (arr.length == 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    get watchOrderDroped() {
        return this.$store.state.dropedOrder;
    }
    @Watch('watchOrderDroped')
    resetDragArr() {
        this.cancelOrderChecked();
        this.dropOrderArr = [];
    }

    hideOrderPanel() {
        this.$store.commit('showOrderPanelBtn', true);
    }

    hideOrExpandList(index: any) {
        if (this.listViewDataTitle[index] != undefined) {
            this.$set(this.listViewDataTitle[index], 'isHide', !this.listViewDataTitle[index].isHide);
        }
        if (this.tableViewDataTitle[index] != undefined) {
            this.$set(this.tableViewDataTitle[index], 'isHide', !this.tableViewDataTitle[index].isHide);
        }
    }

    viewTripPanle() {
        this.$store.commit('showTripPanelBtn', false);
    }

    dbClickForDetail(data: any) {
        this.orderDetail = {};
        this.getOrderDetailInfo(data.order_id);
        this.showOrderDetail = true;
    }

    showOrderHistory(order: any) {
        let orderAndHistory: any = {
            orderId: order.order_id,
            orderPro: order.order_pro,
            orderPu: order.pu_id
        };
        this.$store.commit('returnOrderHistory', orderAndHistory);
    }

    hideOrShowStageBar() {
        this.showStageBar = !this.showStageBar;
    }

    setShowOrHideFun(res: any) {
        this.showAdvanceDetails = res;
    }

    openTmsPage() {
        controlPanelService.goTmsOrderEditPage(this.orderDetail.pu_id).subscribe(
            (res: any) => {
                let head = document.getElementsByTagName('head')[0];
                let script = document.createElement('script');
                let scriptTxt = res.replace('<script>', '').replace('</script>', '');
                script.text = scriptTxt;
                head.appendChild(script);
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    closeAdvance() {
        this.searchPanelName = '';
    }

    get defaultPanelChange() {
        return this.$store.state.isShowTripPanelBtn;
    }

    @Watch('defaultPanelChange')
    panelChange() {
        this.showViewTripsPanelBtn = this.$store.state.isShowTripPanelBtn;
    }

    mouseclick(data: any) {
        this.orderInfo = data;
        this.currentOrderId = data.order_id;
    }

    showDetail() {
        this.showOrderDetail = true;
        this.getOrderDetailInfo(this.currentOrderId);
    }

    getOrderDetailInfo(id: any) {
        this.orderDetail = {};
        this.loadOrderDetail = true;
        controlPanelService.getOrderDeatilById(id).subscribe(
            (res: any) => {
                this.orderDetail = res.data;
                this.loadOrderDetail = false;
            },
            (err: any) => {
                errorHandler.handle(err);
                this.loadOrderDetail = false;
            }
        );
    }

    setDragType(type: any) {
        this.$store.commit('editDragType', type);
    }

    closeDialog() {
        this.showOrderDetail = false;
    }

    selectView(type: string) {
        if (type == 'Card View') {
            this.orderStatusFilter = 'All';
            delete this.searchParam.second_category;
            this.searchParam.page = 1;
            this.getOrderPanelData(this.searchParam);
        }
    }

    get watchIsEditTrip() {
        return this.$store.state.isEditTrip;
    }
    @Watch('watchIsEditTrip')
    currentDragType() {
        if (this.$store.state.isEditTrip || this.$store.state.isNewTrip) {
            this.onEditTrip = true;
        } else {
            this.onEditTrip = false;
            this.orderChecked = false;
        }
    }

    get watchIsNewTrip() {
        return this.$store.state.isNewTrip;
    }
    @Watch('watchIsNewTrip')
    currentDragTypeForEdit() {
        if (this.$store.state.isEditTrip || this.$store.state.isNewTrip) {
            this.onEditTrip = true;
        } else {
            this.onEditTrip = false;
            this.orderChecked = false;
        }
    }

    hideOrExpand(index: any) {
        if (!this.dataList[index].isHide) {
            this.dataList[index].isHide = true;
            this.dataList[index].size = '2';
        } else {
            this.dataList[index].isHide = false;
        }
        this.autoCardSize(this.dataList, index);
    }

    autoCardSize(dataList: any, index: any) {
        let hideArr = filter(this.dataList, (o) => {
            return o.isHide;
        });
        let expandItemNumber = this.dataList.length - hideArr.length;
        let lestWidth = 100 - (hideArr.length * 2);
        let perExpandWidth = parseInt((lestWidth / expandItemNumber).toString());
        forEach(this.dataList, (item) => {
            if (!item.isHide) {
                item.size = perExpandWidth;
            }
        });
    }

    get needRefresh() {
        return this.$store.state.refreshOrderAndTrip.order;
    }
    @Watch('needRefresh', {
        deep: true,
    })
    refreshTrip() {
        this.showOrderDetail = false;
        this.getOrderPanelData(this.searchParam);
        this.$store.commit('refreshOrderAndTrip', {
            order: false,
            trip: false
        });
        this.showOrderDetail = false;
    }

    get watchAdvanceSearch() {
        return this.$store.state.advanceSearchParams.PickAndDeliveryOrders;
    }
    @Watch('watchAdvanceSearch', {
        deep: true,
    })
    searchByAdvanceParams(params: any) {
        let cloneParams = cloneDeep(params);
        this.searchParam = {
            page: 1,
            page_size: 50,
        };
        // this.searchParam.order_create_date = [cloneParams.time[0], cloneParams.time[1]];
        forEach(cloneParams, (item, index) => {
            this.searchParam[index] = item;
        });
        this.isDefaultAdvanceSearch = cloneParams.isDefault;
        if (!this.isViewNormal) {
            this.searchParam.first_category = 'issue';
        } else {
            this.searchParam.first_category = 'normal';
        }
        this.terminalQuerry();
        this.filterOrderByStatus();
        this.$store.commit('showAssociatedOrderByTrip', '');
    }

    sendOrderMessage() {
        this.$store.commit('returnOrder', this.orderInfo);
    }

    changeOrderSelect(order: any) {
        this.orderChecked = false;
        if (order.checked) {
            this.dropOrderArr.push(order);
        } else {
            let index = findIndex(this.dropOrderArr, (item: any) => {
                return item.order_id == order.order_id;
            });
            if (index >= 0) {
                this.dropOrderArr.splice(index, 1);
            }
        }
        forEach(this.dataList, (o: any) => {
            forEach(o.secData, (order: any) => {
                if (order.checked) {
                    this.orderChecked = true;
                }
            });
        });
        forEach(this.viewArr, (o: any) => {
            if (o.checked) {
                this.orderChecked = true;
            }
        });
        this.$forceUpdate();
    }

    cancelOrderChecked() {
        forEach(this.dataList, (o: any) => {
            forEach(o.secData, (order: any) => {
                order.checked = false;
            });
        });
        forEach(this.viewArr, (o: any) => {
            o.checked = false;
        });
    }

    get associatedOrderByTripNo() {
        return this.$store.state.associatedOrderByTrip;
    }
    @Watch('associatedOrderByTripNo', {
        deep: true,
    })
    getAssociatedOrderByTripNo() {
        if (this.$store.state.associatedOrderByTrip) {
            this.resetLoadOrder();
            this.searchParam.trip_id = this.$store.state.associatedOrderByTrip;
            let searchParam = cloneDeep(this.searchParam);
            delete searchParam.order_create_date;
            delete searchParam.query_array;
            this.getOrderPanelData(searchParam);
            this.isDefaultAdvanceSearch = false;
        } else {
            delete this.searchParam.trip_id;
            this.getOrderPanelData(this.searchParam);
            this.isDefaultAdvanceSearch = true;
        }
    }

    getTerminal() {
        controlPanelService.getTerminal().subscribe(
            (res: any) => {
                this.terminalList = res.warehouse;
                let location = this.terminalList[0];
                this.map_terminal =  location.location_code;
                this.getMapDataInfo();
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    filterTerminal() {
        this.showTerminalFilter = false;
        if (!this.searchParam.query_array) {
            this.searchParam.query_array = [];
        }
        this.searchParam.page = 1;
        this.terminalQuerry();
        if (this.origin_terminal_array.length > 0 || this.dest_terminal_array.length > 0) {
            this.terminalSearch = true;
        } else {
            this.terminalSearch = false;
        }
        this.issueData.details = [];
        this.normalData.details = [];
        this.viewArr = [];
        this.getOrderPanelData(this.searchParam);
    }

    terminalQuerry() {
        let originIndex = findIndex(this.searchParam.query_array, (querry: any) => {
            return querry.column == 'origin_terminal_array';
        });
        if (originIndex > -1) {
            this.searchParam.query_array.splice(originIndex, 1);
        }
        let destIndex = findIndex(this.searchParam.query_array, (querry: any) => {
            return querry.column == 'dest_terminal_array';
        });
        if (destIndex > -1) {
            this.searchParam.query_array.splice(destIndex, 1);
        }
        if (this.origin_terminal_array.length > 0) {
            this.searchParam.query_array.push(
                {
                    column: 'origin_terminal_array',
                    opt: 'in',
                    value_array: this.origin_terminal_array
                }
            );
        }
        if (this.dest_terminal_array.length > 0) {
            this.searchParam.query_array.push(
                {
                    column: 'dest_terminal_array',
                    opt: 'in',
                    value_array: this.dest_terminal_array
                }
            );
        }
    }

    associatedTrip() {
        this.$store.commit('showAssociatedTripByOrder', this.currentOrderId);
        this.associatedOrderNo = this.currentOrderId;
        this.orderDetail.associated = true;
        this.$forceUpdate();
    }

    unAssociatedTrip() {
        this.$store.commit('showAssociatedTripByOrder', '');
    }

    get associatedByOrderId() {
        return this.$store.state.associatedTripByOrder;
    }
    @Watch('associatedByOrderId', {
        deep: true,
    })
    getAssociatedByOrderId() {
        if (!this.$store.state.associatedTripByOrder) {
            this.associatedOrderNo = '';
        }
    }

    async getMapDataInfo() {
        let _let = this;
        this.getGisTractorsOrTrailers();
        this.timer = setInterval(() => {
            _let.getGisTractorsOrTrailers();
        }, 300000);
    }

    async getGisTractorsOrTrailers() {
        this.gisCenterForTerminal = find(this.terminalList, { 'location_code': this.map_terminal});
        let markers: any = [];
        this.setmarkers = [];
        let [gisTractors, gisTrailers] = await Promise.all([
            controlPanelService.getGisTractors(this.map_terminal).toPromise(),
            controlPanelService.getGisTrailers(this.map_terminal).toPromise()]);
        if (gisTractors.data && gisTractors.data.data && gisTractors.data.data.length > 0) {
            forEach(gisTractors.data.data, (gisTractor: any) => {
                if (gisTractor.samsara_current_location_latitude && gisTractor.samsara_current_location_longitude) {
                    markers.push({
                        lat: Number(gisTractor.samsara_current_location_latitude),
                        lng: Number(gisTractor.samsara_current_location_longitude),
                        state: 'tractor',
                        title: gisTractor.vehicle_name
                    });
                }
            });
        }
        if (gisTrailers.data && gisTrailers.data.data && gisTrailers.data.data.length > 0) {
            forEach(gisTrailers.data.data, (gisTrailer: any) => {
                if (gisTrailer.samsara_current_location_latitude && gisTrailer.samsara_current_location_longitude) {
                    markers.push({
                        lat: Number(gisTrailer.samsara_current_location_latitude),
                        lng: Number(gisTrailer.samsara_current_location_longitude),
                        state: 'trailer',
                        title: gisTrailer.vehicle_name
                    });
                }
            });
        }
        this.setmarkers = markers;
    }

    beforeDestroy() {
        clearInterval(this.timer);
    }
}