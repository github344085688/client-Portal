import CustomerWiseVue from '@shared/customer-wise-vue';
import { Component } from "vue-property-decorator";
import tlp from "./costCalculator.vue";
import { Slider } from "element-ui";
import { map, find } from "lodash-es";
import 'element-ui/lib/theme-chalk/slider.css';
import CostCalculatorSerive from '@services/cost-calculator';
import organizationService from '@services/organization-service';
import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import errorHandler from "@shared/error-handler";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import FacilitySelect from "@components/facility-select/facility-select";
import ItemAutoComplete from "@components/itemspec-auto-complete/itemspec-auto-complete";
import itemService from "@services/item-service";

CustomerWiseVue.use(Slider);

@Component({
    mixins: [tlp],
    components: {
        PredefinedCustomerSelect,
        FacilitySelect,
        WaittingBtn,
        ItemAutoComplete
    }
})
export default class CostCalculator extends CustomerWiseVue {
    productId: string = "0131103628";
    productData: any = null;
    customerId: any = '';
    facilities: any = [];
    selectFacility: any = '';
    costParmas: any = {
        Program: 'Wise',
        Company: 'LT',
        CustomerCode: '',
        Facility: '',
        CarrierCode: 'UPS',
        DeliveryService: 'UPS_Ground',
        ItemWeight: '',
        ItemLength: '',
        ItemWidth: '',
        ItemHeight: '',
        ItemQty: 1,
        StorageQty: 50,
        CapacityType: 'Large Bin',
    };
    orderOptions: Array<any> = [1, 2, 3, 4, 5, 10];
    capacityType: Array<any> = ['Small Bin', 'Large Bin', 'Pallet'];
    rangeValue: any = 0;
    resultPrice: any = 0;
    loading: Boolean = false;
    currentTagName: any = 'item';
    marks: any = {
        0: '50',
        20: '100',
        40: '250',
        60: '500',
        80: '750',
        100: '1000'
    };
    timeUnit: string = '';

    costData: any = {};
    isSearchItemUnit: boolean = false;
    searchParams: any = {};

    mounted() {
        this.init();
    }

    async init() {
        this.costParmas.Facility = this.getFacilityByUserSelect().thirdPartySite;
        await this.searchCustomerCode(true);
    }

    changeRange() {
        map(this.marks, (value: any, index: any) => {
            if (this.rangeValue == index) {
                this.costParmas.StorageQty = Number(value);
            }
        });
        this.searchCostData(this.costParmas);
    }

    searchCostDataWhenParamsChange() {
        this.searchCostData(this.costParmas);
    }

    changeCustomer() {
        this.searchCustomerCode(false);
    }

    searchItemUnit() {
        if (!this.searchParams.itemSpecId) return;
        this.isSearchItemUnit = true;
        itemService.searchItemUnit({itemSpecId: this.searchParams.itemSpecId}).subscribe(
            (res: any) => {
                let baseUnit: any = find(res.units, {'isBaseUnit': true});
                this.productData = baseUnit;
                this.costParmas.ItemWeight = baseUnit.weight;
                this.costParmas.ItemLength = baseUnit.length;
                this.costParmas.ItemWidth = baseUnit.width;
                this.costParmas.ItemHeight = baseUnit.height;
                this.searchCostData(this.costParmas);
            },
            (err: any) => {
                errorHandler.handle('Error');
                this.isSearchItemUnit = false;
            }
        );
    }



    searchCostData(searchParams: any) {
        CostCalculatorSerive.getProductCostData(searchParams).subscribe(
            (res: any) => {
                if (res.Status) {
                    this.isSearchItemUnit = false;
                    this.costData = res.Result;
                    this.resultPrice = this.costData.StorageCost.Cost;
                    if (this.costData.StorageCost.ItemLines.length > 0) {
                        this.timeUnit = (this.costData.StorageCost.ItemLines[0]).Period.toLowerCase();
                    }
                } else {
                    this.isSearchItemUnit = false;
                    errorHandler.handle('Fulfillment & Ship Search Error');
                }
            },
            (err: any) => {
                this.isSearchItemUnit = false;
                errorHandler.handle('Fulfillment & Ship Search Error');
            }
        );
    }

    onSelectFacilityChange() {
        this.costParmas.Facility = this.selectFacility.thirdPartySite;
        this.searchCostDataWhenParamsChange();
    }

    formatTooltip(val: any) {
        let price: any = '';
        if (this.costData.StorageCost) {
            price = this.costData.StorageCost.Cost;
        }
        return `$${price}`;
    }

    private async searchCustomerCode(searchProduct: Boolean) {
        organizationService.search({ id: this.customerId }).subscribe(
            res => {
                this.costParmas.CustomerCode = res[0].extend.customerCode;
                this.costParmas.Facility = this.getFacilityByUserSelect().thirdPartySite;
                if (searchProduct) {
                } else {
                    this.searchCostData(this.costParmas);
                }
            },
            err => {
                errorHandler.handle('CustomerCode Error');
            }
        );
    }

    onClickStatuTab(tabName: string) {
        this.currentTagName = tabName;
    }

    onClickCalculate() {
        if (!this.searchParams.width) {
            errorHandler.handle('Please enter width');
            return;
        }
        if (!this.searchParams.length) {
            errorHandler.handle('Please enter length');
            return;
        }
        if (!this.searchParams.height) {
            errorHandler.handle('Please enter height');
            return;
        }
        if (!this.searchParams.weight) {
            errorHandler.handle('Please enter weight');
            return;
        }
        this.isSearchItemUnit = true;
        this.costParmas.ItemWeight = this.searchParams.weight;
        this.costParmas.ItemLength = this.searchParams.length;
        this.costParmas.ItemWidth = this.searchParams.width;
        this.costParmas.ItemHeight = this.searchParams.height;
        this.searchCostData(this.costParmas);
    }
}