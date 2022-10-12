import { Component, Prop, Watch } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import tlp from './address-input.vue';
import OrganizationAutoComplete from "../organization-auto-complete/organization-auto-complete";
import SwitchButton from "../switch-button/switch-button";
import PopUpWindows from "../pop-up-windows/pop-up-windows";
import { keyBy } from 'lodash-es';
import addressService from "@services/address-service";
@Component({
  mixins: [tlp],
  components: {
    PopUpWindows,
    OrganizationAutoComplete,
    SwitchButton,
  }
})
export default class AddressInput extends WiseVue {
  @Prop({
    default: 0
  })
  step!: number;

  @Prop({
    default: false
  })
  isFirst!: boolean;

  @Prop({
    default: 0
  })
  completeSchedule!: number;
  @Prop({
    default: ''
  })
  tests!: string;

  @Prop({
    default: false
  })
  isDoing!: boolean;

  @Prop({
    default: ''
  })
  value!: any | string;

  @Prop({
    default: ''
  })
  name!: string;

  @Prop({
    default: 'Address'
  })
  tlitle!: string;

  @Prop({
    default: ''
  })
  tag!: string;

  @Prop({
    default: false
  })
  isValidate!: boolean;


  @Prop({
    default: ''
  })
  customerId!: string;


  isShow: boolean = false;
  currentAddress: any = {};
  keyByCustomers: any = {};
  customerName: any = {};
  addressMessage: string = '';
  addressSearch: any = {};
  addressResults: any = {};
  isSearchAddress: boolean = false;
  changeAddressResultIndex: number = -1;


  @Watch('customerId')
    private fillCustomer(val: any, oldVal: any) {
        if (val) {
            this.currentAddress.organizationId = val;
            this.customerName = this.keyByCustomers[val].name;
        }
    }

  @Watch('value')
  private getValue(val: any, oldVal: any) {
      if (!val) {
          this.currentAddress = {};
          return;
      }
      else {
          this.currentAddress = val;
          this.addressMessage = `${this.currentAddress.name}-${this.currentAddress.address1} ${this.currentAddress.address2}, ${ this.currentAddress.city} ${ this.currentAddress.state} ${ this.currentAddress.zipCode} (${ this.currentAddress.storeNo}), ${ this.currentAddress.country}`;
      }
  }

  mounted() {
      this.keyByCustomers = keyBy(this.getCustomers(), 'id');
      this.onSearchAddress({organizationId: this.customerId});
  }

  onEdit() {
    this.isShow = true;
     if (this.value) this.currentAddress = this.value;
  }

  emitCancel() {
    this.isShow = false;
  }

  onSetTheAddress(scope: any) {
    this.$validator.validateAll(scope).then(
      res => {
        if (res) {
          this.$emit('input', this.currentAddress);
          this.$emit('selectAddress', this.currentAddress);
          this.addressMessage = `${this.currentAddress.name}-${this.currentAddress.address1} ${this.currentAddress.address2}, ${ this.currentAddress.city} ${ this.currentAddress.state} ${ this.currentAddress.zipCode} (${ this.currentAddress.storeNo}), ${ this.currentAddress.country}`;

          this.isShow = false;
          this.currentAddress = {};
        }
      }
    );
  }

  onSearchAddress(params: any) {
        this.isSearchAddress = true;
        this.$forceUpdate();
        addressService.search(params).subscribe(
            (res: any)  => {
                this.addressResults = res;
                this.isSearchAddress = false;
            },
            (err: any) => {
                this.error(err);
            }
        );

    }

    onAddressResult(address: any, index: number) {
        this.changeAddressResultIndex = index;
        this.currentAddress = address;
    }




}
