
import WiseVue from "@shared/wise-vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./customize-table.vue";
import { find, forEach, map, compact } from 'lodash-es';
import customizationService from "@services/wms/customization-service";
import errorHanlder from '@shared/error-handler';
import session from '@shared/session';
@Component({
    mixins: [template],
    name: 'customize-table',

})

export default class CustomizeTable extends WiseVue {

    @Prop({ default: "" })
    reportCategory!: string;

    @Prop({ default: "" })
    customerId!: string;

    @Prop({ default: "" })
    customizeType!: string;

    @Watch("reportCategory")
    onReportCategoryChange() {
        this.searchDefaultCustomization();
    }

    @Watch("customerId")
    onCustomerIdChange() {
        this.searchDefaultCustomization();
    }

    show: boolean = false;
    customizitionTableView: any = {};
    customizationId!: string;

    private searchDefaultCustomization() {
        this.customizitionTableView = {};
        let customerId = this.customerId ? this.customerId : this.getCustomerIdByUserSelect();
        if (!customerId) return;
        customizationService.searchCustomization({ userId: session.getUserId(), reportCategory: this.reportCategory, customerId: customerId }).subscribe((res) => {
            this.customizitionTableView = res.tableHeaderSetting;
            this.customizationId = res.tableHeaderSetting.customizationId;
            if (this.customizeType === 'inbound') {
                this.customizitionTableView.generalDynFields = this.customizitionTableView.receiptGeneralDynFields;
                this.customizitionTableView.detailDynFields = this.customizitionTableView.receiptDetailDynFields;
            } else if (this.customizeType === 'outbound') {
                this.customizitionTableView.generalDynFields = this.customizitionTableView.orderGeneralDynFields;
                this.customizitionTableView.detailDynFields = this.customizitionTableView.orderDetailDynFields;
            }
             this.customizitionTableView.isFirstInit = true;
             this.emitParent();
        });
    }

    customizeTableShow() {
        this.show = !this.show;
    }

    checkedField(field: any) {
        if (field) {
            field.isDefaultField = !field.isDefaultField;
        }

    }

    private emitParent() {
        this.$emit("selectCustomizeTable", this.customizitionTableView);
    }


    private createOrUpdateTableViewCustomization() {
        let params: any = {};
        params.userId = session.getUserId();
        params.customerId = this.customerId;
        params.reportCategory = this.reportCategory;

        params.generalColumnList = compact(map(this.customizitionTableView.generalLevelFieldMappings, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }
        }));
        params.detailColumnList = compact(map(this.customizitionTableView.detailLevelFieldMappings, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }

        }));
        params.idColumnList = compact(map(this.customizitionTableView.idLevelFieldMappings, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }
        }));
        params.cartonColumnList = compact(map(this.customizitionTableView.cartonLevelFieldMappings, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }
        }));
        params.generalDynFields = compact(map(this.customizitionTableView.generalDynFields, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }
        }));
        params.detailDynFields = compact(map(this.customizitionTableView.detailDynFields, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }
        }));

        if (this.customizationId) {
            customizationService.updateUserCustomization(this.customizationId, params).subscribe((res) => {

            }, (err) => {
                errorHanlder.handle(err);
            });
        } else {
            customizationService.createUserCustomization(params).subscribe((res) => {
                this.customizationId = res.id;
            }, (err) => {
                errorHanlder.handle(err);
            });
        }


    }

    private fillDynTxtPropertyIsSelected() {
        forEach(this.customizitionTableView.generalLevelFieldMappings, (mapping) => {

            if ((mapping.customerField === 'ReceiptDynTxtProperty' || mapping.customerField === 'OrderDynTxtProperty')) {
                if (find(this.customizitionTableView.generalDynFields, 'isDefaultField')) {
                    mapping.isDefaultField = true;
                } else {
                    mapping.isDefaultField = false;
                }
            }
        });
        forEach(this.customizitionTableView.detailLevelFieldMappings, (mapping) => {

            if ((mapping.customerField === 'ReceiptItemLineDynTxtProperty' || mapping.customerField === 'OrderItemLineDynTxtProperty')) {
                if (find(this.customizitionTableView.detailDynFields, 'isDefaultField') > 0) {
                    mapping.isDefaultField = true;
                } else {
                    mapping.isDefaultField = false;
                }
            }
        });
    }

    isItemLineDynTxtProperty(dynName: string) {
        if (dynName === 'ReceiptItemLineDynTxtProperty' || dynName === 'OrderItemLineDynTxtProperty') {
            return true;
        } {
            return false;
        }
    }

    isDynTxtProperty(dynName: string) {
        if (dynName === 'ReceiptDynTxtProperty' || dynName === 'OrderDynTxtProperty') {
            return true;
        } {
            return false;
        }
    }

    created() {
        document.addEventListener('click', (e: any) => {
            if (!this.$el.contains(e.target)) {
                if (this.show) {
                    this.show = false;
                    this.fillDynTxtPropertyIsSelected();
                    this.createOrUpdateTableViewCustomization();
                    this.customizitionTableView.isFirstInit = false;
                    this.emitParent();
                }

            }
        });
    }

    mounted() {
    }


}



