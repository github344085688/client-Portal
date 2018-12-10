import WiseVue from "../../shared/wise-vue";
import { Component, Prop, Provide, Watch, Emit } from "vue-property-decorator";
import template from "./predefined-customer-select.vue";
import { Select, Option } from "element-ui";
import { find, unionBy, findIndex, flatMap } from 'lodash-es';
import organizationService from "../../services/organization-service";
import errorHanlder from '../../shared/error-handler';

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


    customerIds: Array<any> = [];
    loading = false;
    orgs: Array<any> = [];

    selectValue: any = "";
    onSelectChange() {
        this.setCustomerIdByUserSelect(this.selectValue);
        this.$emit("input", this.selectValue);
        this.$emit("change", find(this.orgs, ['id', this.value]));
    }

    @Watch("value")
    valueUpdate() {
        this.getOrganizationById();
        this.searchOrganizations();
    }

    getOrganizationById() {
        let id: any = null;
        if (!this.value) {
            id = this.getCustomerIdByUserSelect();
        } else {
            id = this.value;
        }
        if (id && findIndex(this.orgs, { id: id }) < 0) {
            this.unsubcribers.push(organizationService.get(id).subscribe(
                res => {
                    let response: any = flatMap([res], "basic");
                    this.orgs = unionBy(response, this.orgs, "id");
                    this.selectValue = id;
                },
                err => {
                    errorHanlder.handle(err);
                }
            ));
        }
    }

    private searchOrganizations() {
        let id: any = null;
        if (!this.value) {
            id = this.getCustomerIdByUserSelect();
        } else {
            id = this.value;
        }
        if (id && findIndex(this.orgs, { id: id }) < 0) {
            this.customerIds = this.getCustomerIds();
            this.loading = true;
            this.unsubcribers.push(organizationService.search({ ids: this.customerIds }).subscribe(
                res => {
                    let orgs: any = flatMap(res, "basic");
                    this.orgs = orgs;
                    this.loading = false;
                },
                err => {
                    this.loading = false;
                    errorHanlder.handle(err);
                }
            ));
        }

    }
    init() {
        this.getOrganizationById();
        this.searchOrganizations();
        this.$emit("input", this.getCustomerIdByUserSelect());
    }

    mounted() {
        this.init();
    }


}