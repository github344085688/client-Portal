import WiseVue from "@shared/wise-vue";
import { Component, Prop, Provide, Watch, Emit } from "vue-property-decorator";
import template from "./organization-auto-complete.vue";
import { Select, Option } from "element-ui";
import { find, unionBy, findIndex, flatMap , compact } from 'lodash-es';
import organizationService from "@services/organization-service";
import errorHanlder from '@shared/error-handler';

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

    @Prop({ default: "Input to search" })
    placeholder!: string;

    selectValue: any = this.value;

    loading = false;
    orgs: Array<any> = [];
    relatedOrgsKeyByCustomerId: any = {};

    mounted() {
       this.relatedOrgsKeyByCustomerId = this.getRelatedOrgsKeyByCustomerId();
        if (this.value && this.tag) {
            this.searchOrganizations("", this.value);
        }
        if (this.value && !this.tag) {
            this.selectValue = "";
            this.getOrganization(this.value);
        }
    }

    onSelectChange() {
        this.$emit("input", this.selectValue);
        this.$emit("change", find(this.orgs, { id: this.selectValue }));
    }

    remoteMethod(keyword: string) {
        this.searchOrganizations(keyword);
    }

    @Watch("value")
    valueUpdate(val: any) {
        this.selectValue = "";
        if (val) {
            this.getOrganizationById(val);
            this.getOrganization(val);
        }
    }

    @Watch("customerId")
    valueCustormerUpdate() {
        this.selectValue = "";
        this.searchOrganizations('');
    }

    private  getOrganization(id: any) {
        organizationService.get(id).subscribe(
            res => {
                if (res.basic) this.selectValue = res.basic.name;
            },
            err => {
                errorHanlder.handle(err);
            }
        );
    }

    getOrganizationById(id: string) {
        if (this.value && findIndex(this.orgs, ['id', this.value]) < 0) {
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

    private setupSearchParameter(keyword: string, partnerId?: String) {
        let param: any = { scenario: 'Auto Complete' };
        param.customerId = this.customerId || this.getCustomerIdByUserSelect();
        let reletionOrgs = this.relatedOrgsKeyByCustomerId[param.customerId];
        if (this.tag && this.tag) {
            param.relationship = this.tag;
            param.partnerName = keyword;
        }
        if (!this.tag) {
            delete param.customerId;
            param.nameRegex = keyword;
            param.searchScenario = 'Auto Complete';
        }
        else {
            param.nameRegex = keyword;
        }
        if (reletionOrgs && compact(reletionOrgs.relatedTitleIds).length > 0) {
            param.partnerIds = reletionOrgs.relatedTitleIds;
        } else {
            if (partnerId) {
                param.partnerId = partnerId;
            }
        }
        return param;
    }


    private searchOrganizations(keyword: string, partnerId?: String) {
        let param = this.setupSearchParameter(keyword, partnerId);
        this.loading = true;
        this.unsubcribers.push(organizationService.getOrganizationByTagAndCustomerId(param).subscribe(
            res => {
                let orgs: any = flatMap(res, "basic");
                this.orgs = orgs;
                this.loading = false;
            },
            err => {
                this.loading = false;
                this.error(err);
            }
        ));

    }



}