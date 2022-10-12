import WiseVue from "@shared/wise-vue";
import { Component, Prop, Provide, Watch, Emit } from "vue-property-decorator";
import template from "./facility-select.vue";
import { Select, Option } from "element-ui";
import { map, forEach, groupBy, indexOf } from "lodash-es";

WiseVue.use(Select);
WiseVue.use(Option);

@Component({
    mixins: [template],
    name: 'facility-select'
})
export default class PredefinedCustomerSelect extends WiseVue {

    @Prop({ default: false })
    clearable!: boolean;

    @Prop({ default: false })
    isDisabled!: boolean;

    @Prop({ default: '' })
    customerId!: String;

    @Prop({ default: false })
    isShowFacilityAll!: String;

    // @Prop({ default: "" })
    // value!: string;
    @Watch("customerId")
    valueUpdateWhenCustomerChange() {
        this.init();
    }

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
        this.defaultFacility = this.getFacilityByUserSelect();
        this.facilities = this.getfacilitiesBySelectedCustomer();
        let defaultName = this.defaultFacility.name;
        let facilityNames = map(this.facilities, "name");
        if (this.defaultFacility.name != "All" && indexOf(facilityNames, defaultName) > -1) {
            this.selectValue = this.defaultFacility;
        } else {
            this.selectValue = this.facilities[0];
        }
        if (this.facilities.length > 1 && this.isShowFacilityAll) {
            let ids = map(this.facilities, "id");
            let id = ids.join(",");
            let name = "All";
            this.facilities.push({ id: id, name: name });
        }
        this.setFacilityByUserSelect(this.selectValue);
        this.$emit("input", this.selectValue);
        this.$emit("facilityChangeCauseByCustomerChange", this.selectValue);
    }

    mounted() {
        this.init();
    }
}