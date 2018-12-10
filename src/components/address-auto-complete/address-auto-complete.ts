import WiseVue from "../../shared/wise-vue";
import { Component, Prop, Provide, Watch, Emit } from "vue-property-decorator";
import template from "./address-auto-complete.vue";
import { Select, Option } from "element-ui";
import { mixins } from "vue-class-component";
import { find, unionBy, findIndex }  from 'lodash-es';
import addressService from "../../services/address-service";
import errorHanlder from '../../shared/error-handler';

WiseVue.use(Select);
WiseVue.use(Option);

@Component({
    mixins: [template],
    name: 'address-auto-complete'
})
export default class AddressAutoComplete extends WiseVue {


    @Prop({ default: false })
    clearable!: boolean;

    // @Prop({ default: "" })
    // extParam!: object;

    @Prop({ default: [] })
    tags!: Array<any>;

    @Prop({ default: "" })
    value!: string;

    @Prop({ default: "" })
    organizationId!: string;

    @Prop({ default: "" })
    ltAddressExpression!: string;

    selectValue: any = "";

    loading = false;
    addressList: Array<any> = [];

    private formateAddress(address: any) {
        let addressInfo: string = "";
        if (address.address1) {
            addressInfo += " - " + address.address1;
        }
        if (address.city) {
            addressInfo += " " + address.city;
        }
        if (address.state) {
            addressInfo += " " + address.state;
        }
        if (address.zipCode) {
            addressInfo += " " + address.zipCode;
        }
        if (address.storeNo) {
            addressInfo += " (" + address.storeNo + ")";
        }
        return addressInfo;
    }

    onSelectChange() {
        this.$emit("change", find(this.addressList, { id: this.selectValue }));
    }

    remoteMethod(keyword: string) {
        this.searchAddress(keyword);
    }


    @Watch("value")
    valueUpdate() {
        this.getAddressById(this.value);
    }

    getAddressById(id: string) {
        if (this.value && findIndex(this.addressList, { id: this.value }) < 0) {
            this.unsubcribers.push(addressService.get(id).subscribe(
                res => {
                    this.addressList = unionBy(res, this.addressList, "id");
                    this.selectValue = this.value;
                },
                err => {
                    errorHanlder.handle(err);
                }
            ));
        }
    }

    private setupSearchParameter(keyword: string) {
        let parameter: any = { scenario: 'Auto Complete', limit: 20 };
        if (keyword) {
            parameter.keyword = keyword;
        }
        if (this.tags) {
            parameter.tags = this.tags;
        }
        return parameter;
    }

    private addOrganizationIdToSearchParam(param: any) {
        if (this.organizationId) {
            param.organizationId = this.organizationId;
        }
    }




    private searchAddress(keyword: string) {
        let param = this.setupSearchParameter(keyword);
        this.addOrganizationIdToSearchParam(param);

        this.loading = true;

        this.unsubcribers.push(addressService.search(param).subscribe(
            res => {

                this.addressList = res;
                this.loading = false;
            },
            err => {
                this.loading = false;
            }
        ));

    }

}