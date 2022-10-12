import CustomerWiseVue from "@/shared/customer-wise-vue";
import { param } from "jquery";
import { Component, Prop, Watch, Emit, PropSync } from 'vue-property-decorator';
import template from './index.vue';
import loadService from '@services/load-service';
import receiptService from '@services/receipt-service';
import { CheckboxGroup, Checkbox } from 'element-ui';
import * as _ from 'lodash';
import PopUpWindows from "@components/pop-up-windows/pop-up-windows";
import LoadSearchForm from "@components/load-search-form/index";
import ReceiptSearchForm from "@/components/receiptSearchForm";
import { watch } from "fs";
import errorHanlder from '@shared/error-handler';

interface List {
    head?: object;
    body?: Array<object>;
    headMap?: object;
}

interface PopUpConfig {
    height?: number | string;
    title?: string;
    isSubmit?: Boolean;
    cancelFunc?: Function;
    submitFunc?: Function;
}

@Component({
    mixins: [template],
    components: {
        ElCheckboxGroup: CheckboxGroup,
        ElCheckbox: Checkbox,
        PopUpWindows,
        LoadSearchForm,
        ReceiptSearchForm
    }
})

export default class LoadReceiptList extends CustomerWiseVue {
    @Prop(String) readonly entryType!: string;
    @PropSync('isShow', { type: Boolean }) syncIsShow!: Boolean;
    @Prop(Array) selectedRecordIds!: Array<string>;
    @Emit()
    getSelectedRecords(records: Array<object>) {
        return records;
    }
    syncSelectedRecordIds: Array<string> = this.selectedRecordIds;
    isSelectedAll: boolean = false;
    loading: boolean = false;
    recordList: List = {
        head: {},
        body: [],
        headMap: {}
    };
    totalRecordCount: Number = 0;

    popUpConfig: PopUpConfig = {
        title: '',
        height: 500,
        isSubmit: true,
        submitFunc: () => {
            this.confirm();
        },
        cancelFunc: () => {
            this.cancelFunc();
        }
    };

    @Watch('selectedRecordIds')
    onChange(newVal: any, oldVal: any) {
        this.syncSelectedRecordIds = newVal;
    }
    public init() {
        this.popUpConfig.title = this.entryType === 'Load' ? 'Relevance Loads' : 'Relevance Receipt';
        this.recordList = {};
        (this.$refs[this.entryType === 'Load' ? 'loadSearchForm' : 'receiptSearchForm'] as any).init();
        this.isSelectedAll = false;
    }

    getLoads(params: any) {
        this.loading = true;
        Object.assign(params, {
            statuses: ["New"],
            scenario: 'Appointment'}
        );
        loadService.searchLoad(params).subscribe(
            res => {
                this.loading = false;
                this.totalRecordCount = res.length;
                this.recordList = {
                    head: ['Load ID', 'Load NO', 'Company', 'Status', 'MBOL', 'Customer', 'Carrier', 'Freight Term'],
                    body: res,
                    headMap: {
                        'Load ID': 'id',
                        'Load NO': 'loadNo',
                        'Company': 'companyName',
                        'Status': 'status',
                        'MBOL': 'masterBolNo',
                        'Customer': 'customerName',
                        'Carrier': 'carrierName',
                        'Freight Term': 'freightTerm'
                    }
                };
            },
            err => {
                this.loading = false;
                errorHanlder.handle(err);
            }
        );
    }

    getReceipts(params: any) {
        this.loading = true;
        Object.assign(params, {
            excludeStatuses: ["Closed", "Force Closed", "Cancelled"],
            scenario: 'Appointment'
        });
        receiptService.searchReceipt(params).subscribe(
            res => {
                this.loading = false;
                this.totalRecordCount = res.length;
                this.recordList = {
                    head: ['RN', 'Company', 'Reference No.', 'Container No.', 'Purchase Order No.', 'Seal No', 'Customer', 'Status'],
                    body: res,
                    headMap: {
                        'RN': 'id',
                        'Company': 'companyName',
                        'Reference No.': 'referenceNo',
                        'Container No.': 'containerNo',
                        'Purchase Order No.': 'poNo',
                        'Seal No': 'sealNo',
                        'Customer': 'customerName',
                        'Status': 'status'
                    }
                };
            },
            err => {
                this.loading = false;
                errorHanlder.handle(err);
            }
        );
    }

    toggleSelection(recordId: string) {
        if (recordId) {
            if (this.syncSelectedRecordIds.indexOf(recordId) > -1) {
                _.remove(this.syncSelectedRecordIds, function (n) {
                    return n === recordId;
                });

                if (this.syncSelectedRecordIds.length !== this.totalRecordCount) {
                    this.isSelectedAll = false;
                }
            } else {
                this.syncSelectedRecordIds.push(recordId);

                if (this.syncSelectedRecordIds.length === this.totalRecordCount) {
                    this.isSelectedAll = true;
                }
            }
        } else {
            if (this.isSelectedAll) {
                this.syncSelectedRecordIds = [];
                this.isSelectedAll = false;
            } else {
                this.syncSelectedRecordIds = _.map(this.recordList.body, 'id');
                this.isSelectedAll = true;
            }
        }
    }

    isChecked(recordId: string) {
        return this.syncSelectedRecordIds.indexOf(recordId) > -1;
    }

    private confirm() {
        if (this.syncSelectedRecordIds.length === 0) {
            this.$message.warning("Please select an record at lease!");
        } else {
            const param: any = {};
            if (this.entryType === 'Load') {
                this.loading = true;
                param.loadIds = this.syncSelectedRecordIds;
                loadService.searchLoad(param).subscribe(
                    res => {
                        this.loading = false;
                        if (res.error) {
                            this.$message.warning(`Error Found: ${res.error}`);
                            return;
                        }
                        const selectedRecords = _.filter(res, (record) => {
                            return this.syncSelectedRecordIds.indexOf(record.id) > -1;
                        });
                        this.$emit('getSelectedRecords', selectedRecords);
                        this.syncIsShow = false;
                    },
                    error => {
                        this.loading = false;
                        this.syncIsShow = false;
                        this.$message.warning(`Error Found: ${error}`);
                    }
                );

            } else if (this.entryType === 'Receipt') {
                this.loading = true;
                param.receiptIds = this.syncSelectedRecordIds;
                receiptService.searchReceipt(param).subscribe(
                    res => {
                        this.loading = false;
                        if (res.error) {
                            this.$message.warning(`Error Found: ${res.error}`);
                            return;
                        }
                        const selectedRecords = _.filter(res, (record) => {
                            return this.syncSelectedRecordIds.indexOf(record.id) > -1;
                        });
                        this.$emit('getSelectedRecords', selectedRecords);
                        this.syncIsShow = false;
                    },
                    error => {
                        this.loading = false;
                        this.syncIsShow = false;
                        this.$message.warning(`Error Found: ${error}`);
                    }
                );
            }
        }
    }

    cancelFunc() {
        this.syncIsShow = false;
    }

}