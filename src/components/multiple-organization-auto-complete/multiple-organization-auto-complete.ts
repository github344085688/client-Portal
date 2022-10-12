import WiseVue from "@shared/wise-vue";
import { Component, Prop, Provide, Watch, Emit } from "vue-property-decorator";
import template from "./multiple-organization-auto-complete.vue";
import { Select, Option } from "element-ui";
import { find, map, difference, unionBy, flatMap , compact } from 'lodash-es';
import organizationService from "@services/organization-service";
import errorHanlder from '@shared/error-handler';

WiseVue.use(Select);
WiseVue.use(Option);

@Component({
    mixins: [template],
    name: 'multiple-organization-auto-complete'
})
export default class MultipleOrganizationAutoComplete extends WiseVue {


    @Prop({ default: false })
    clearable!: boolean;

    @Prop({ default: () => [] })
    value!:  Array<any>;

    @Prop({ default: "" })
    tag!: string;

    @Prop({ default: "" })
    customerId!: string;

    selectValue: any = this.value;

    loading = false;
    orgs: Array<any> = [];
    relatedOrgsKeyByCustomerId: any = {};

    mounted() {
       this.relatedOrgsKeyByCustomerId = this.getRelatedOrgsKeyByCustomerId();
        if (this.value && this.value.length > 0) {
            this.searchOrganizations("", this.value);
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
    valueUpdate() {
         if (this.value && this.value.length > 0 ) {
            this.searchOrganizationsByIds("", this.value);
         }

    }

    @Watch("customerId")
    valueCustormerUpdate() {
        this.selectValue = [];
        this.searchOrganizations('');
    }

    searchOrganizationsByIds(keyword: string, partnerIds?: any) {
        let orgIds = map(this.orgs, 'id');
        let diffIds = difference(partnerIds, orgIds);
        let param: any = { };
        if (this.tag) {
            param.relationship = this.tag;
            param.partnerName = keyword;
        } else {
            param.nameRegex = keyword;
        }
        if (diffIds.length > 0) {
            param.partnerIds = diffIds;
        } else {
            return ;
        }
        this.unsubcribers.push(organizationService.getOrganizationByTagAndCustomerId(param).subscribe(
                res => {
                    let response: any = flatMap(res, "basic");
                    this.orgs = unionBy(response, this.orgs, "id");
                    this.selectValue = this.value;
                },
                err => {
                    errorHanlder.handle(err);
                }
            ));
    }

    private setupSearchParameter(keyword: string, partnerIds: any) {
        let param: any = { scenario: 'Auto Complete' };
        param.customerId = this.customerId || this.getCustomerIdByUserSelect();
        let reletionOrgs = this.relatedOrgsKeyByCustomerId[param.customerId];
        if (this.tag) {
            param.relationship = this.tag;
            param.partnerName = keyword;
        } else {
            param.nameRegex = keyword;
        }
        if (reletionOrgs && compact(reletionOrgs.relatedTitleIds).length > 0) {
            param.partnerIds = reletionOrgs.relatedTitleIds;
        } else {
            if (partnerIds) {
                param.partnerIds = partnerIds;
            }
        }
        return param;
    }


    private searchOrganizations(keyword: string, partnerIds?: any) {
        let param = this.setupSearchParameter(keyword, partnerIds);
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