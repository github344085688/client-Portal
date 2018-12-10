import WiseVue from "../../shared/wise-vue";
import { Component, Prop, Provide, Watch, Emit } from "vue-property-decorator";
import template from "./facility-select.vue";
import { Select, Option } from "element-ui";
import { find, unionBy, findIndex, flatMap } from 'lodash-es';
import organizationService from "../../services/organization-service";
import errorHanlder from '../../shared/error-handler';

WiseVue.use(Select);
WiseVue.use(Option);

@Component({
    mixins: [template],
    name: 'facility-select'
})
export default class PredefinedCustomerSelect extends WiseVue {

    @Prop({ default: false })
    clearable!: boolean;

    // @Prop({ default: "" })
    // value!: string;

    loading = false;
    facilities: Array<any> = [];
    defaultFacility: any = {};
    selectValue: any = "";
    onSelectChange() {
        this.setFacilityByUserSelect(this.selectValue);
        this.$emit("input", this.selectValue);
        this.$emit("change", this.selectValue);
    }

    @Watch("value")
    valueUpdate() {

    }


    init() {
        this.facilities = this.getAssignedCompanyFacilities();
        this.defaultFacility = this.getFacilityByUserSelect();
        this.selectValue = this.defaultFacility;
        this.$emit("input", this.selectValue);
    }

    mounted() {
        this.init();
    }
}