import WiseVue from "@shared/wise-vue";
import { Component, Prop, Provide, Watch, Emit } from "vue-property-decorator";
import template from "./predefined-customer-select.vue";
import { Select, Option } from "element-ui";
import { find, unionBy, findIndex, flatMap } from 'lodash-es';
import organizationService from "@services/organization-service";
import errorHanlder from '@shared/error-handler';

WiseVue.use(Select);
WiseVue.use(Option);

@Component({
    mixins: [template],
    name: 'predefined-customer-select'
})
export default class PredefinedCustomerSelect extends WiseVue {

    @Prop({ default: false })
    clearable!: boolean;

    @Prop({ default: "" })
    value!: string;

    @Prop({ default: "" })
    tag!: string;

    @Prop({ default: false })
    isDisabled!: boolean ;

    @Prop({ default: () => {
        return {};
    }})
    facility!: Object;

    customerIds: Array<any> = [];
    loading = false;
    orgs: Array<any> = [];

    selectValue: any = "";
    async onSelectChange() {
        await this.setCustomerIdByUserSelect(this.selectValue);
        this.$emit("input", this.selectValue);
        this.$emit("change", find(this.orgs, ['id', this.selectValue]));
    }

    // @Watch("facility")
    // valueUpdate() {
    //     this.init();
    // }

    init() {
        this.customerIds = this.getCustomerIds();
        this.orgs = this.getCustomers();
        this.selectValue = this.getCustomerIdByUserSelect();
        this.$forceUpdate();
        this.$emit("input", this.selectValue);
        this.$emit("change", find(this.orgs, ['id', this.selectValue]));
    }

    mounted() {
        this.init();
    }


}