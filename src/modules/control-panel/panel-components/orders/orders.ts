import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import template from "./orders.vue";
import ElementSelect from '@components/element-select/element-select';
import '@assets/css/panel.scss';
import { parseInt, forEach, groupBy, filter, find, head, reverse, cloneDeep, findIndex } from "lodash";
import * as Moment from 'moment';
import AdvanceSearch from '@panelComponents/advanceSearch/advanceSearch';
import controlPanelService from "@services/control-panel/controlPanelService";
import AdvanceDetail from '@panelComponents/advanceDetail/advanceDetail';
import errorHandler from "@shared/error-handler";
import GoogleMap from '@components/googleMaps/googleMap';

@Component({
    mixins: [template],
    name: 'shipments',
    components: {
        ElementSelect,
        AdvanceSearch,
        AdvanceDetail,
        GoogleMap
    }
})
export default class Shipments extends Vue {
    viewType: Array<any> = [ 'Card View', 'Map View', 'List View', 'Table View'];
    // viewType: Array<any> = [ 'Card View', 'List View', 'Table View'];
    selectViewType: string = 'Card View';
    showOrderDetail: Boolean = false;
    searchParam: any = {
        page: 1,
        page_size: 50,
        filter_category_array: [],
    };
    totalCompleted: any = 0;
    totalCanceled: any = 0;
    currentFilterType: string = '';
    loadingOrder: Boolean = false;
    isViewNormal: Boolean = true;
    isFilterForStage: Boolean = false;
    filterStageTypeArr: Array<any> = ['', '', ''];
    headDataArr: any = [];
    issueData: any = {};
    normalData: any = {};
    issueArr: any = [];
    normalArr: any = [];
    viewArr: any = [];
    dataList: any = [];
    loadOrderDetail: Boolean = false;
    currentOrderId: any = '';
    associatedOrderNo: any = '';
    orderDetail: any = {};
    orderInfo: any = {};
    scrollLock: Boolean = false;
    searchPanelName: string = '';
    showAdvanceDetails: Boolean = false;
    isDefaultAdvanceSearch: Boolean = true;
    isInitCalendarView: Boolean = false;
    onEditTrip: Boolean = false;
    viewSortDesending: Boolean = false;
    orderChecked: Boolean = false;
    sort: any = '0';
    dropOrderArr: any = [];
    setmarkers: Array<any> =  [];
    timer: any;
    gisCenterForTerminal: any = {};

    listViewDataTitle: any = [
        { name: 'Pro#', isHide: false },
        { name: 'PU#', isHide: false },
        { name: 'Shipper/Consignee', isHide: false },
        { name: 'Pick/Delivery', isHide: false },
        { name: 'W/C/M', isHide: false },
        { name: 'Time Window', isHide: false },
    ];

    tableViewDataTitle: any = [
        { name: 'Pro#', isHide: false },
        { name: 'PU#', isHide: false },
        { name: 'Shipper', isHide: false },
        { name: 'Consignee', isHide: false },
        { name: 'Pick', isHide: false },
        { name: 'Delivery', isHide: false },
        { name: 'Weight', isHide: false },
        { name: 'Capacity', isHide: false },
        { name: 'Miles', isHide: false },
        { name: 'Time Window', isHide: false },
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
    map_terminal: any = '';
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
        that.scrollLoad('.card-view > .card-con-box', 20, function () {
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

    sortAscending(item: any) {
        if (item) {
            item.secData.sort((a: any, b: any) => {
                return new Date(a.order_pickup_date).getTime() - new Date(b.order_pickup_date).getTime();
            });
            item.sortDesending = false;
            item.sort = '1';
        } else {
            this.viewArr.sort((a: any, b: any) => {
                return new Date(a.order_pickup_date).getTime() - new Date(b.order_pickup_date).getTime();
            });
            this.viewSortDesending = false;
            this.sort = '1';
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

    showOrderHistory(order: any) {
        let orderAndHistory: any = {
            orderId: order.order_id,
            orderPro: order.order_pro,
            orderPu: order.pu_id,

        };
        this.$store.commit('returnOrderHistory', orderAndHistory);
    }

    getOrderPanelData(searchParams: any) {
        this.loadingOrder = true;
        this.scrollLock = true;
        controlPanelService.getOrderPanelData(searchParams).subscribe(
            (res: any) => {
                this.loadingOrder = false;
                let newIssueArr = filter(res.data.issue.details, o => {
                    return o.order_stage == 'New' || o.order_stage == 'Picked Up' || o.order_stage == 'OFD';
                });
                let newNormalArr = filter(res.data.normal.details, o => {
                    return o.order_stage == 'New' || o.order_stage == 'Picked Up' || o.order_stage == 'OFD';
                });
                if (searchParams.page == 1) {
                    this.issueData = res.data.issue;
                    this.normalData = res.data.normal;
                } else {
                    this.issueData.details = this.issueData.details.concat(newIssueArr);
                    this.normalData.details = this.normalData.details.concat(newNormalArr);
                }
                this.normalArr = this.normalData.details;
                this.issueArr = this.issueData.details;
                this.totalCanceled = this.issueData.summary.Cancelled.total + this.normalData.summary.Cancelled.total;
                this.totalCompleted = this.issueData.summary.Delivered.total + this.normalData.summary.Delivered.total;
                if (this.isViewNormal) {
                    this.viewArr = this.normalArr;
                } else {
                    this.viewArr = this.issueArr;
                }
                this.getDataListByType(this.viewArr);
                this.getheadDataArr(this.issueData, this.normalData);
                if (searchParams.page < res.page.last_page) {
                    this.scrollLock = false;
                    searchParams.page ++;
                } else {
                    this.scrollLock = true;
                }
            },
            (err: any) => {
                this.loadingOrder = false;
                errorHandler.handle(err);
            }
        );
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
                    let filterObj: any = {
                        second_category: type.name,
                        third_category: type.filter.replace(`${type.name}-`, '')
                    };
                    filterArr.push(filterObj);
                }
            });
            this.searchParam.filter_category_array = cloneDeep(filterArr);
        }
        this.searchParam.page = 1;
        this.dataList = [];
        this.viewArr = [];
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
        this.getOrderPanelData(this.searchParam);
    }

    resetLoadOrder() {
        this.searchParam.page = 1;
        this.searchParam.query_array = [];
        this.dataList = [];
        this.viewArr = [];
    }

    getheadDataArr(issueData: any, normalData: any) {
        let newObj: any = {
            name: 'New',
            normal: normalData.summary.New,
            issue: issueData.summary.New,
            filter: this.filterStageTypeArr[0],
            // showNormal: this.filterStatuTypeArr[0],
        };
        let pickedUpObj: any = {
            name: 'Picked Up',
            normal: normalData.summary['Picked Up'],
            issue: issueData.summary['Picked Up'],
            filter: this.filterStageTypeArr[1],
            // showNormal: this.filterStatuTypeArr[1],
        };
        let ofdObj: any = {
            name: 'OFD',
            normal: normalData.summary.OFD,
            issue: issueData.summary.OFD,
            filter: this.filterStageTypeArr[2],
            // showNormal: this.filterStatuTypeArr[2],
        };
        this.headDataArr = [].concat(newObj).concat(pickedUpObj).concat(ofdObj);
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

    mouseclick(data: any) {
        this.orderInfo = data;
        this.currentOrderId = data.order_id;
    }

    showDetail() {
        this.showOrderDetail = true;
        this.getOrderDetailInfo(this.currentOrderId);
    }

    dbClickForDetail(data: any) {
        this.orderDetail = {};
        this.getOrderDetailInfo(data.order_id);
        this.showOrderDetail = true;
    }

    getOrderDetailInfo(id: any) {
        this.loadOrderDetail = true;
        controlPanelService.getOrderDeatilById(id).subscribe(
            (res: any) => {
                this.orderDetail = res.data;
                this.loadOrderDetail = false;
            },
            (err: any) => {
                this.loadOrderDetail = false;
                errorHandler.handle(err);
            }
        );
    }

    getDataListByType(list: any) {
        forEach(list, (item: any) => {
            item.showMore = false;
        });
        let arr = groupBy(list, 'order_stage');
        let newArr: any = {type: 'New', isHide: false, sortDesending: false, size: '33', secData: arr.New ? arr.New : []};
        let pickedUpArr: any = {type: 'Picked Up', sortDesending: false, isHide: false, size: '33', secData: arr['Picked Up'] ? arr['Picked Up'] : []};
        let ofdArr: any = {type: 'OFD', isHide: false, sortDesending: false, size: '33', secData: arr.OFD ? arr.OFD : []};
        this.dataList = [].concat(newArr).concat(pickedUpArr).concat(ofdArr);
    }

    setShowOrHideFun(res: any) {
        this.showAdvanceDetails = res;
    }

    closeDialog() {
        this.showOrderDetail = false;
    }

    selectView(type: string) {
        if (type == 'Calendar View' && !this.isInitCalendarView) {
            this.$nextTick(() => {
                this.isFilterForStage = true;
            });
        }
    }

    setDragType(type: any) {
        this.$store.commit('editDragType', type);
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
        this.orderChecked = false;
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

    get watchAdvanceSearch() {
        return this.$store.state.advanceSearchParams.Order;
    }
    @Watch('watchAdvanceSearch', {
        deep: true,
    })
    searchByAdvanceParams(params: any) {
        this.searchParam = {
            page: 1,
            page_size: 50,
        };
        // if (params.time[0] && params.time[1]) {
        //     this.searchParam.order_create_date = [params.time[0], params.time[1]];
        // }
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
        this.getOrderPanelData(this.searchParam);
        this.$store.commit('showAssociatedOrderByTrip', '');
    }

    get needRefresh() {
        return this.$store.state.refreshOrderAndTrip.order;
    }
    @Watch('needRefresh', {
        deep: true,
    })
    refreshOrder() {
        this.getOrderPanelData(this.searchParam);
        this.showOrderDetail = false;
        this.$store.commit('refreshOrderAndTrip', {
            order: false,
            trip: false
        });
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

    autoCardSize(dataList: any, index: any) {
        let hideArr = filter(this.dataList, (o) => {
            return o.isHide;
        });
        let expandItemNumber = this.dataList.length - hideArr.length;
        let lestWidth = 100 - (hideArr.length * 10);
        let perExpandWidth = parseInt((lestWidth / expandItemNumber).toString());
        forEach(this.dataList, (item) => {
            if (!item.isHide) {
                item.size = perExpandWidth;
            }
        });
    }

    closeAdvance() {
        this.searchPanelName = '';
    }

    mounted() {
        let currentDay = Moment().format("YYYY-MM-DD");
        let sevenDaysAgo = Moment().subtract(0, "days").format("YYYY-MM-DD");
        this.searchParam.order_create_date = [sevenDaysAgo, currentDay];
        this.getOrderPanelData(this.searchParam);
        this.initScrollLoadData();
        this.getTerminal();
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
        this.dropOrderArr = [];
        this.$forceUpdate();
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