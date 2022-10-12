import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import template from "./wms.vue";
import ElementSelect from '@components/element-select/element-select';
import '@assets/css/panel.scss';
import { filter } from "lodash";
import AdvanceSearch from '@panelComponents/advanceSearch/advanceSearch';
import WmsDetail from '@panelComponents/wmsDetail/wmsDetail';
import { parseInt, forEach, groupBy, differenceBy, reverse, cloneDeep } from "lodash-es";
import * as Moment from 'moment';
import AdvanceDetail from '@panelComponents/advanceDetail/advanceDetail';
import FacilitySelect from "@components/facility-select/facility-select";
import ControlPanelService from '@services/control-panel/controlPanelService';
import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import errorHandler from "@shared/error-handler";

@Component({
    mixins: [template],
    name: 'shipments',
    components: {
        ElementSelect,
        AdvanceSearch,
        AdvanceDetail,
        FacilitySelect,
        PredefinedCustomerSelect,
        WmsDetail
    }
})
export default class Shipments extends Vue {
    viewType: Array<any> = ['Card View', 'List View', 'Table View'];
    selectViewType: string = 'Card View';
    currentFacility: any = '';
    showWMSDetail: Boolean = false;
    searchPanelName: string = '';
    showAdvanceDetails: Boolean = false;
    customerId: any = '';
    loadingWms: Boolean = false;
    searchParams: any = {};
    totalRnCompleted: any = 0;
    totalDnCompleted: any = 0;
    totalCanceled: any = 0;
    currentFilterType: string = '';
    loadingOrder: Boolean = false;
    isViewNormal: Boolean = true;
    isFilterForStage: Boolean = false;
    countTotal: any = 0;
    filterStageTypeArr: Array<any> = ['', ''];
    headDataArr: any = [];
    issueData: any = {};
    normalData: any = {};
    viewArr: any = [];
    dataList: any = [];
    wmsDetail: any = {};
    viewSortDesending: Boolean = false;
    isDefaultAdvanceSearch: Boolean = true;
    sort: any = '0';
    associatedWmsNo: any = '';

    listViewDataTitle: any = [
        { name: 'RN/DN/ET', isHide: false },
        { name: 'Status', isHide: false },
        { name: 'Equipment', isHide: false },
        { name: 'Customer', isHide: false },
        { name: 'Carrier', isHide: false },
        { name: 'Driver', isHide: false },
        { name: 'Create Time', isHide: false },
        { name: 'Create By', isHide: false },
    ];
    tableViewDataTitle: any = [
        { name: 'RN/DN/ET', isHide: false },
        { name: 'Status', isHide: false },
        { name: 'Equipment', isHide: false },
        { name: 'Customer', isHide: false },
        { name: 'Carrier', isHide: false },
        { name: 'Driver', isHide: false },
        { name: 'Create Time', isHide: false },
        { name: 'Create By', isHide: false },
    ];

    menuItem: any = [
        {
            type: 'li',
            title: 'View',
            func: () => {
                this.showDetail();
            }
        },
    ];

    menuItemAssociated: any = [
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
    ];

    sortAscending(item: any) {
        if (item) {
            item.secData.sort((a: any, b: any) => {
                return new Date(a.createdWhen).getTime() - new Date(b.createdWhen).getTime();
            });
            item.sortDesending = false;
            item.sort = '1';
        } else {
            this.viewArr.sort((a: any, b: any) => {
                return new Date(a.createdWhen).getTime() - new Date(b.createdWhen).getTime();
            });
            this.sort = '1';
            this.viewSortDesending = false;
        }
    }

    sortDecending(item: any) {
        if (item) {
            if (item.sortDesending) return;
            item.secData.sort((a: any, b: any) => {
                return new Date(a.createdWhen).getTime() - new Date(b.createdWhen).getTime();
            });
            item.sort = '2';
            reverse(item.secData);
            item.sortDesending = true;
        } else {
            if (this.viewSortDesending) return;
            this.viewArr.sort((a: any, b: any) => {
                return new Date(a.createdWhen).getTime() - new Date(b.createdWhen).getTime();
            });
            this.sort = '2';
            this.viewSortDesending = true;
            reverse(this.viewArr);
        }
    }

    associatedTrip() {
        this.associatedWmsNo =  this.wmsDetail.id;
        this.$store.commit('showAssociatedTripByWms', this.associatedWmsNo);
    }

    unAssociatedTrip() {
        this.$store.commit('showAssociatedTripByWms', '');
    }

    mouseclick(data: any) {
        this.wmsDetail = data;
    }

    mounted() {
        let currentDay = Moment().format("YYYY-MM-DD");
        let sevenDaysAgo = Moment().subtract(0, "days").format("YYYY-MM-DD");
        // this.searchParams.createdWhenFrom = sevenDaysAgo;
        // this.searchParams.createdWhenTo = currentDay;
        this.searchParams.createdWhen = [sevenDaysAgo, currentDay];
        this.getWMSData();
    }

    getWMSData() {
        this.loadingWms = true;
        this.dataList = [];
        this.viewArr = [];
        ControlPanelService.getWMSPanelData(this.searchParams).subscribe(
            (res: any) => {
                this.loadingWms = false;
                this.loadingOrder = false;
                this.filterStageTypeArr = ['', ''];
                this.isViewNormal = true;
                res.data.issue.details = filter(res.data.issue.details, o => {
                    return o.categories == 'ET_IN_YARD' || o.categories == 'IN_PROGRESS';
                });
                res.data.normal.details = filter(res.data.normal.details, o => {
                    return o.categories == 'ET_IN_YARD' || o.categories == 'IN_PROGRESS';
                });
                this.issueData = res.data.issue;
                this.normalData = res.data.normal;
                this.totalCanceled = this.issueData.summary.cancel + this.normalData.summary.cancel;
                this.totalRnCompleted = this.normalData.summary.rnComplete;
                this.totalDnCompleted = this.normalData.summary.dnComplete;
                if (this.isViewNormal) {
                    this.viewArr = this.normalData.details;
                } else {
                    this.viewArr = this.issueData.details;
                }
                this.getDataListByType(this.viewArr);
                this.getheadDataArr(this.issueData, this.normalData);
            },
            (err: any) => {
                errorHandler.handle(err);
                this.loadingWms = false;
            }
        );
    }

    viewIssueOrNormal(index: any, type: any) {
        if (type == 'issue') {
            this.isViewNormal = false;
        } else {
            this.isViewNormal = true;
        }
        this.setFilterArr();
        this.getDataListByType(this.isViewNormal ? this.normalData.details : this.issueData.details);
    }

    getheadDataArr(issueData: any, normalData: any) {
        let etInYardObj: any = {
            name: 'ET-In-Yard',
            normal: normalData.summary.etInYard,
            issue: issueData.summary.etInYard,
            filter: this.filterStageTypeArr[0],
        };
        let inProgressObj: any = {
            name: 'In-progress',
            normal: normalData.summary.inProgress,
            issue: issueData.summary.inProgress,
            filter: this.filterStageTypeArr[1],
        };
        this.headDataArr = [].concat(etInYardObj).concat(inProgressObj);
    }

    getDataListByType(list: any) {
        forEach(list, (item: any) => {
            item.showMore = false;
        });
        let arr = groupBy(list, 'categories');
        let inprogressArr = groupBy(arr['IN_PROGRESS'], 'isIn');
        if (inprogressArr['false'] && inprogressArr['true']) {
            let totalRnNumber = inprogressArr['true'].length;
            let insetNumber = 0;
            forEach(inprogressArr['false'], (dn: any, index: any) => {
                if (index % 2 == 0 && insetNumber < totalRnNumber) {
                    inprogressArr['false'].splice(index, 0, inprogressArr['true'][insetNumber]);
                    insetNumber ++;
                }
            });
            if (insetNumber < totalRnNumber) {
                inprogressArr['false'] = inprogressArr['false'].concat(inprogressArr['true'].splice(insetNumber, totalRnNumber));
            }
        }
        let resultArr = cloneDeep(inprogressArr['false']);
        let inYardArr: any = {type: 'ET-In-Yard', isHide: false, sortDesending: false, size: '33', cols: 1, secData: arr['ET_IN_YARD'] ? arr['ET_IN_YARD'] : []};
        let inProgressArr: any = {type: 'In-progress', sortDesending: false, isHide: false, size: '66', cols: 2, secData:  resultArr};
        this.dataList = [].concat(inYardArr).concat(inProgressArr);
    }

    filterType(index: any, stageType: any, categoryType: any) {
        if (this.headDataArr[index].filter == `${stageType}-${categoryType}`) {
            this.headDataArr[index].filter = '';
            this.filterStageTypeArr[index] = '';
        } else {
            this.headDataArr[index].filter = `${stageType}-${categoryType}`;
            this.filterStageTypeArr[index] = `${stageType}-${categoryType}`;
        }
        this.isFilterForStage = false;
        this.setFilterArr();
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
                        if (perItem.categories != undefined) {
                            if (item.toUpperCase().indexOf(perItem.categories.toUpperCase().replace(/_/g, '-')) != -1) {
                                if (item.toUpperCase() != perItem.categories.toUpperCase().replace(/_/g, '-') + '-' + (perItem.isIn ? 'IN' : 'OUT')) {
                                    deleteArr.push(perItem);
                                }
                            }
                        } else {
                            deleteArr.push(perItem);
                        }
                    }
                });
            });
            this.viewArr = differenceBy(defaultArr, deleteArr, 'id');
        } else {
            this.viewArr = this.isViewNormal ?  this.normalData.details :  this.issueData.details;
        }
    }

    selectFacility(facility: any) {
        this.getWMSData();
    }

    selectCustomer() {
        this.getWMSData();
    }

    showDetail() {
        this.showWMSDetail = true;
    }

    dbClickForDetail(data: any) {
        this.wmsDetail = data;
        this.showWMSDetail = true;
    }

    closeDialog() {
        this.showWMSDetail = false;
    }

    selectView(type: string) {}

    hideOrExpandList(index: any) {
        this.$set(this.listViewDataTitle[index], 'isHide', !this.listViewDataTitle[index].isHide);
    }

    hideOrExpandTable(index: any) {
        this.$set(this.tableViewDataTitle[index], 'isHide', !this.tableViewDataTitle[index].isHide);
    }

    hideOrExpand(index: any) {
        if (!this.dataList[index].isHide) {
            this.dataList[index].isHide = true;
            this.dataList[index].size = '6';
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

    setShowOrHideFun(res: any) {
        this.showAdvanceDetails = res;
    }

    closeAdvance() {
        this.searchPanelName = '';
    }

    get watchAdvanceSearch() {
        return this.$store.state.advanceSearchParams.WMS;
    }
    @Watch('watchAdvanceSearch', {
        deep: true,
    })
    searchByAdvanceParams(params: any) {
        this.searchParams = {};
        // this.searchParams.createdWhenFrom = params.time[0];
        // this.searchParams.createdWhenTo = params.time[1];
        this.searchParams.createdWhen = [params.time[0], params.time[1]];
        forEach(params, (item, index) => {
            this.searchParams[index] = item;
        });
        this.isDefaultAdvanceSearch = params.isDefault;
        this.getWMSData();
    }

    get associatedByWmsNo() {
        return this.$store.state.associatedTripByWms;
    }
    @Watch('associatedByWmsNo', {
        deep: true,
    })
    getAssociatedByWmsNo() {
        if (!this.$store.state.associatedTripByWms) {
            this.associatedWmsNo = '';
        }
    }
}