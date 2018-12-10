import WiseVue from "../../shared/wise-vue";
import { Component, Prop, Provide, Watch, Emit } from "vue-property-decorator";
import template from "./organization-auto-complete.vue";
import { Select, Option } from "element-ui";
import { find, unionBy, findIndex, flatMap } from 'lodash-es';
import organizationService from "../../services/organization-service";
import errorHanlder from '../../shared/error-handler';

WiseVue.use(Select);
WiseVue.use(Option);

@Component({
    mixins: [template],
    name: 'organization-auto-complete'
})
export default class OrganizationAutoComplete extends WiseVue {


    @Prop({ default: false })
    clearable!: boolean;

    @Prop({ default: "" })
    value!: string;

    @Prop({ default: "" })
    tag!: string;

    @Prop({ default: "" })
    customerId!: string;

    selectValue: any = "";

    loading = false;
    orgs: Array<any> = [];


    onSelectChange() {
        this.$emit("input", this.selectValue);
        this.$emit("change", find(this.orgs, { id: this.selectValue }));
    }

    remoteMethod(keyword: string) {
        this.searchOrganizations(keyword);
    }

    @Watch("value")
    valueUpdate() {
        this.getOrganizationById(this.value);
    }

    @Watch("customerId")
    valueCustormerUpdate() {
        this.searchOrganizations('');
    }

    getOrganizationById(id: string) {
        if (this.value && findIndex(this.orgs, { id: this.value }) < 0) {
            this.unsubcribers.push(organizationService.get(id).subscribe(
                res => {
                    let response: any = flatMap([res], "basic");
                    this.orgs = unionBy(response, this.orgs, "id");
                    this.selectValue = this.value;
                },
                err => {
                    errorHanlder.handle(err);
                }
            ));
        }
    }

    private setupSearchParameter(keyword: string) {
        let parameter: any = { scenario: 'Auto Complete' };
        if (this.tag) {
            parameter.relationship = this.tag;
            parameter.partnerName = keyword;
        } else {
            parameter.nameRegex = keyword;
        }
        return parameter;
    }

    private addCustomerIdToSearchParam(param: any) {

        param.customerId = this.customerId || this.getCustomerIdByUserSelect();

    }

    private searchOrganizations(keyword: string) {
        let param = this.setupSearchParameter(keyword);
        this.addCustomerIdToSearchParam(param);
        this.loading = true;

        this.unsubcribers.push(organizationService.getOrganizationByTagAndCustomerId(param).subscribe(
            res => {
                let orgs: any = flatMap(res, "basic");
                this.orgs = orgs;
                this.loading = false;
            },
            err => {
                this.loading = false;
            }
        ));

    }



}