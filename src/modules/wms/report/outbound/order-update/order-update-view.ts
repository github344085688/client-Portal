import CustomerWiseVue from "@shared/customer-wise-vue";
import { Component } from "vue-property-decorator";
import errorHandler from "@shared/error-handler";
import OrganizationAutoComplete from "@components/organization-auto-complete/organization-auto-complete";
import organizationService from "@services/organization-service";
import orderService from "@services/order-service";
import { map, isEmpty, cloneDeep } from "lodash-es";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import "rxjs/add/operator/debounceTime";
import tlp from "./order-update-view.vue";
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
@Component({
    mixins: [tlp],
    components: {
        OrganizationAutoComplete,
        WaittingBtn,
        DatePicker
    }
})
export default class OrderUpdateView extends CustomerWiseVue {

    update: any = { };
    customerId: any = '';
    loading = false;
    updataOrders: Array<any> = [];
    carrierServiceTypes: Array<any> = [];
    carrierShipMethods: Array<any> = [];
    defaultShippingMethods: Array<any> = ['Truckload', 'LTL', 'Small Parcel', 'Will Call'];

    mounted() {
      let routeParams = this.$route.params;
        if (routeParams.orders) {
            this.updataOrders  = JSON.parse(routeParams.orders);
        }
      if (routeParams.customerId) this.customerId = routeParams.customerId;
      else this.$router.replace({ name: 'OrderUpdate'});
    }

    onselectCarrierChange(carrier: any) {
      if (carrier && carrier.id) {
        this._setInfoByCarrierId(carrier.id);
      }

    }

    private _setInfoByCarrierId(carrierId: any) {
      organizationService.getCarrierByOrgId(carrierId).subscribe(
        (carrier: any) => {
          this.carrierServiceTypes = carrier.serviceTypes;
          this.carrierShipMethods = isEmpty(carrier.shippingMethods) ? this.defaultShippingMethods : carrier.shippingMethods;
          if (carrier.defaultShippingMethod) {
            this.update.shipMethod = carrier.defaultShippingMethod;
          }
        },
        (err: any) => {
          errorHandler.handle(err);
        }
      );
    }

    updateOrders() {
      let cloneUpdate =  cloneDeep(this.update);
      let updateOrders = map(this.updataOrders, Order => {
        return {
          orderId: Order.orderId,
          referenceNo: Order.referenceNO,
          update: cloneUpdate
        };
      });
        this.loading = true;
        orderService.batchUpdateOrder(updateOrders).subscribe(
            (res: any) => {
                this.loading = false;
                this.$router.replace({name: 'OrderUpdate'});
            },
            (err: any) => {
                this.loading = false;
                errorHandler.handle(err);
            }
        );
    }

    CancelUpdateOrders() {
      this.$router.replace({name: 'OrderUpdate'});
    }

}
