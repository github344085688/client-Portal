import WiseVue from "@shared/wise-vue";
import { Component, Prop, Provide, Watch, Emit } from "vue-property-decorator";
import template from "./companyid-select.vue";
import { Select, Option } from "element-ui";
import { findIndex } from 'lodash-es';

WiseVue.use(Select);
WiseVue.use(Option);

@Component({
    mixins: [template],
    name: 'companyId-select'
})
export default class CompanyIdSelect extends WiseVue {

    @Prop({ default: "" })
    app!: string;

    loading = false;
    companyIds: Array<any> = [];
    selectValue: any = "";
    onSelectChange() {
        this.$emit('update:change', this.selectValue);
        this.$emit('change');
    }

    init() {
        let AppCompanyIds = this.getAssignedInvoiceAppCompanyIds();
        let indexAppCompanyIds = findIndex(AppCompanyIds, { app: this.app });
        if (AppCompanyIds && indexAppCompanyIds > -1) {
            this.companyIds = AppCompanyIds[indexAppCompanyIds].companyIds;
            this.selectValue = this.companyIds[0];
            this.$emit('update:change', this.companyIds[0]);
        } else {
            this.companyIds = [];
        }

    }

    mounted() {
        this.init();
    }
}