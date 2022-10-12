import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import { Dialog } from 'element-ui';
import ElementSelect from '@components/element-select/element-select';
import template from "./advanceSearch.vue";
import TagsInput from "@components/tags-input/tags-input";
import * as Moment from 'moment';
import { DatePicker } from 'element-ui';
import { filter, forEach, groupBy, cloneDeep, findIndex, differenceBy } from "lodash";
const searchData = require('../../advanceSearchData.json');

Vue.use(Dialog);
Vue.use(DatePicker);
@Component({
    mixins: [template],
    name: 'advanceSearch',
    components: {
        ElementSelect,
        TagsInput
    }
})
export default class AdvanceSearch extends Vue {
    showAdvance: Boolean = false;
    searchData: any = {};
    searchNum: number = 0;

    saveSearchData: any = {};

    searchList: any = {
        Order: {
            time: ['', ''],
            searchParams: [
                {name: '', opt: '', value: [], type: ''}
            ],
            associated: false
        },
        Trip: {
            time: ['', ''],
            searchParams: [
                {name: '', opt: '', value: [], type: ''}
            ],
            associated: false
        },
        WMS: {
            time: ['', ''],
            searchParams: [
                {name: '', opt: '', value: [], type: ''}
            ],
        },
        PickAndDeliveryOrders: {
            time: ['', ''],
            searchParams: [
                {name: '', opt: '', value: [], type: ''}
            ],
            associated: false
        },
        ExistingTrips: {
            time: ['', ''],
            searchParams: [
                {name: '', opt: '', value: [], type: ''}
            ],
        },
    };
    firstSelect: Array<any> = ['Label Text'];
    firstSelectVal: any = '';
    secSelectVal: any = '';
    lastTimeSearch: string = '';
    pickerMinDate: any = null;
    pickerMaxDate: any = null;
    limitTime: any = 4 * 24 * 3600 * 1000;
    limitDays: number = 5;
    pickerOptions: any = {};

    @Prop({ default: "" })
    panel!: string;

    init() {
        this.searchData = cloneDeep(searchData);
        forEach(this.searchData, (item, key) => {
            if (!this.searchList[key].timeType) {
                this.searchList[key].timeType = item.timeType;
            }
            this.searchList[key].timeTypeArr = item.timeTypeArr;
        });
        this.saveSearchData = cloneDeep(searchData);
        this.setDefaultTime();
    }

    setDefaultTime() {
        let sevenDaysAgo: any = '';
        let currentDay = Moment().format("YYYY-MM-DD");
        if (this.panel == 'WMS') {
            sevenDaysAgo = currentDay;
        } else {
            sevenDaysAgo = Moment().subtract(0, "days").format("YYYY-MM-DD");
        }
        forEach(this.searchList, (item) => {
            if (!item.time[0] && !item.time[1]) {
                item.time = [sevenDaysAgo, currentDay];
            }
        });
    }

    judgeRuleType(item: any, originData: any) {
        let filterArr: any = filter(originData, (o) => {
            return o.name == item.name;
        });
        if (filterArr) {
            if (filterArr[0].type == 'select') {
                item.selectArr = filterArr[0].selectArr;
            }
            item.multiple = filterArr[0].multiple;
            item.type = filterArr[0].type;
            item.value = filterArr[0].value;
            item.optArr = filterArr[0].optArr;
            item.keyFix = filterArr[0].keyFix || '';
            item.opt = 'is';
            item.apiParamName = filterArr[0].apiParamName;
        }
        this.resetSearchData(this.panel);
        this.filterRepeatParam();
    }

    changeOpt(item: any) {
        if (item.opt == 'include' || item.opt == 'exclude') {
            item.multiple = true;
            if (!Array.isArray(item.value)) {
                if (item.value) {
                    item.value = [item.value];
                } else {
                    item.value = [];
                }
            }
            this.$forceUpdate();
        } else {
            if (Array.isArray(item.value)) {
                item.value = '';
            }
            item.multiple = false;
        }
    }

    filterRepeatParam() {
        for (let i = 0; i < this.searchList[this.panel].searchParams.length; i++) {
            for (let j = 0; j < this.searchData[this.panel].searchParams.length; j++) {
                if (this.searchList[this.panel].searchParams[i].name == this.searchData[this.panel].searchParams[j].name) {
                    this.searchData[this.panel].searchParams.splice(j, 1);
                }
            }
        }
    }

    setOptions() {
        this.pickerOptions = {
            onPick: ({minDate}: any) => {
                if (minDate && this.pickerMinDate) {
                    this.pickerMinDate = null;
                } else if (minDate) {
                    this.pickerMinDate = minDate.getTime();
                }
            },
            disabledDate: (time: any) => {
                if (this.pickerMinDate) {
                    return (time.getTime() > (this.pickerMinDate + this.limitTime)) || (time.getTime() < (this.pickerMinDate - this.limitTime));
                    }
                return false;
            }
        };
    }

    resetSearchData(type: any) {
        this.searchList[type].timeType = this.saveSearchData[type].timeType;
        this.searchData[type] = cloneDeep(this.saveSearchData[type]);
    }

    // judgeSelectedRule(currentRule: string, selectedRule: any) {
    //     let arr: any = [];
    //     console.log(currentRule);
    //     arr = filter(selectedRule, (o: any) => {
    //         return o.name == currentRule;
    //     });
    //     console.log(arr);
    //     if (arr.length > 0) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }

    addAdvanceSearch(type: any) {
        this.searchList[type].searchParams.push({name: '', value: '', opt: '', type: '', apiParamName: ''});
    }

    resetAdvanSearch(type: any) {
        let currentDay = Moment().format("YYYY-MM-DD");
        let sevenDaysAgo = '';
        if (this.panel == 'WMS') {
            sevenDaysAgo = currentDay;
        } else {
            sevenDaysAgo = Moment().subtract(0, "days").format("YYYY-MM-DD");
        }
        this.searchList[type].time = [sevenDaysAgo, currentDay];
        this.resetSearchData(type);
        this.searchList[type].searchParams = [{name: '', value: '', opt: '', type: '', apiParamName: ''}];
        this.searchList[type].isDefault = true;
        if (this.panel == 'Order') {
            this.searchList[this.panel].pickup_appointment_date = '';
            this.searchList[this.panel].schedule_pickup_date = '';
            this.searchList[this.panel].schedule_delivery_date = '';
        }
        if (this.panel == 'Trip') {
            this.searchList[this.panel].dispatch_date = '';
        }
        this.$store.commit('showAssociatedOrderByTrip', '');
        this.$store.commit('showAssociatedTripByWms', '');
    }

    removeAdanceSearch(type: any, index: any, paramData: any) {
        this.searchList[type].searchParams.splice(index, 1);
        this.searchData[type].searchParams.push(paramData);
    }

    searchByParams(panel: any, params: any) {
        this.searchNum = 0;
        let groupParams: any = {
            query_array: [],
        };
        let filterParams = groupBy(cloneDeep(params.searchParams), 'apiParamName');
        forEach(filterParams, (item: any, index: any) => {
            if (index) {
                forEach(item, (perItem: any) => {
                    let perObj: any = {
                        column: index,
                        opt: this.setParamOpt(perItem.opt),
                    };
                    if (typeof(perItem.value) == 'object' && (perItem.value.length > 0)) {
                        perObj.value_array = [].concat(perItem.value);
                        this.searchNum ++;
                        groupParams.query_array.push(perObj);
                    } else {
                        if (perItem.value && typeof(perItem.value) == 'string') {
                            perObj.value = perItem.value;
                            this.searchNum ++;
                            groupParams.query_array.push(perObj);
                        } else {
                            perObj.value = '';
                        }
                    }
                });
            }
        });
        groupParams.time = cloneDeep(params.time);
        if (groupParams.time[0] && groupParams.time[1]) {
            groupParams.time[0] = Moment(groupParams.time[0]).format("YYYY-MM-DD");
            groupParams.time[1] = Moment(groupParams.time[1]).format("YYYY-MM-DD");
        }

        groupParams.panel = panel;
        let distanceDays = '';
        if (this.panel == 'WMS') {
            distanceDays = Moment().subtract(0, "days").format("YYYY-MM-DD");
        } else {
            distanceDays = Moment().subtract(0, "days").format("YYYY-MM-DD");
        }
        if (params.timeType.toLowerCase().indexOf('create') < 0) {
            groupParams.isDefault = false;
            this.searchNum ++;
        } else {
            if (groupParams.time[1] == Moment().format("YYYY-MM-DD") && groupParams.time[0] == distanceDays && (params.searchParams.length <= 1 && (params.searchParams[0] ? (params.searchParams[0].name == '' ? true : false) : true))) {
                groupParams.isDefault = true;
            } else {
                groupParams.isDefault = false;
            }
            if (groupParams.time[1] != Moment().format("YYYY-MM-DD") || groupParams.time[0] != distanceDays) {
                this.searchNum ++;
            }
        }
        groupParams[params.timeType] = groupParams.time;
        this.$store.commit('changeAdvanceSearchParams', groupParams);
        this.showAdvance = false;
    }

    setParamOpt(opt: string) {
        switch (opt) {
            case 'is':
                return '=';
                break;
            case "isn't":
                return '!=';
                break;
            case 'include':
                return 'in';
                break;
            case 'exclude':
                return 'not_in';
                break;
        }
    }

    unassociated(panel: any) {
        if (this.panel == 'Trip' || this.panel == 'ExistingTrips') {
            this.searchList[panel].load_no = '';
            this.$store.commit('showAssociatedTripByWms', '');
            this.$store.commit('showAssociatedTripByOrder', '');
        } else {
            this.searchList[panel].trip_id = '';
            this.$store.commit('showAssociatedOrderByTrip', '');
        }
        this.searchByParams(panel, this.searchList[panel]);
    }

    get searchPanelName() {
        return this.panel;
    }

    @Watch('searchPanelName')
    showSearchForPanel() {
        if (!this.panel) {
            this.showAdvance = false;
            return;
        }
        if (this.panel == 'WMS') {
            this.limitTime = 2 * 24 * 3600 * 1000;
            this.limitDays = 3;
        } else {
            this.limitTime = 4 * 24 * 3600 * 1000;
            this.limitDays = 5;
        }
        this.setOptions();
        this.init();
        this.filterRepeatParam();
        this.showAdvance = true;
    }

    closeDialog() {
        this.$emit('closeAdvanceSearch', this.panel);
    }

    get associatedTripNo() {
        return this.$store.state.associatedOrderByTrip;
    }
    @Watch('associatedTripNo', {
        deep: true,
    })
    getAssociatedTripNo() {
        if (this.$store.state.associatedOrderByTrip) {
            this.searchList['Order'].associated = true;
            this.searchList['PickAndDeliveryOrders'].associated = true;
        } else {
            this.searchList['Order'].associated = false;
            this.searchList['PickAndDeliveryOrders'].associated = false;
        }
    }

    get associatedWmsNo() {
        return this.$store.state.associatedTripByWms;
    }
    @Watch('associatedWmsNo', {
        deep: true,
    })
    getAssociatedWmsNo() {
        if (this.$store.state.associatedTripByWms) {
            this.searchList['Trip'].associated = true;
            this.searchList['Trip'].time = ['', ''];
            this.searchList['Trip'].searchParams = [
                {name: '', opt: '', value: [], type: ''}
            ];
            this.searchNum = 0;
        } else {
            this.searchList['Trip'].associated = false;
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
            this.searchList['Order'].associated = true;
            this.searchList['Order'].time = ['', ''];
            this.searchList['Order'].searchParams = [
                {name: '', opt: '', value: [], type: ''}
            ];
            this.searchNum = 0;
        }
    }

    get associatedTripByOrderId() {
        return this.$store.state.associatedTripByOrder;
    }
    @Watch('associatedTripByOrderId', {
        deep: true,
    })
    getAssociatedTripByOrder() {
        this.searchList['Trip'].associated = false;
        this.searchList['ExistingTrips'].associated = false;
        if (this.$store.state.associatedTripByOrder) {
            this.searchList['Trip'].associated = true;
            this.searchList['Trip'].time = ['', ''];
            this.searchList['Trip'].searchParams = [
                {name: '', opt: '', value: [], type: ''}
            ];
            this.searchList['ExistingTrips'].associated = true;
            this.searchList['ExistingTrips'].time = ['', ''];
            this.searchList['ExistingTrips'].searchParams = [
                {name: '', opt: '', value: [], type: ''}
            ];
            this.searchNum = 0;
        }
    }

    changeTimeType() {
        this.$forceUpdate();
    }
}