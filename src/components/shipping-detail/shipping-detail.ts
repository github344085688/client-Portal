import WiseVue from "@shared/wise-vue";
import { Component, Prop, Watch, Inject } from "vue-property-decorator";
import template from "./shipping-detail.vue";
import Checkbox from "@components/checkbox/checkbox";
import StepCounter from "../step-counter/step-counter";
import { Validator } from "vee-validate";
import TMSQuoteService from "@services/tms/tms-quote-service";

@Component({
    mixins: [template],
    name: 'shipping-detail',
    components: {
        StepCounter,
        Checkbox,
    }
})

export default class ShippingDetail extends WiseVue {
    freightClass: Array<any> = [
        "50", "55", "60", "65", "70", "77", "85", "92", "100", "110", "125", "150", "175", "200", "250", "300", "400", "500"
      ];
    @Inject()
    $validator!: Validator;
    @Prop({default: false})
    isLogin!: boolean;
    @Prop()
    index!: number;
    @Prop({default: false})
    validationStarted!: boolean;
    @Prop()
    totalNumber!: string;
    @Prop()
    pallets!: Array<any>;
    @Prop()
    pallet!: any;
    @Prop({default: false})
    lock!: boolean;
    @Prop({default: false})
    isDefault!: boolean;
    @Prop()
    resets!: boolean;
    @Prop()
    calculating!: boolean;

    classValue: any = ' ';
    weightUnits: Array<any> = ['lbs', 'kg'];
    heightUnits: Array<any> = ['in', 'cm'];
    packaging = TMSQuoteService.getQuote().packaging;
    palletSpaceCalculationSettings = TMSQuoteService.getQuote().palletSpaceCalculationSettings;

    tips: any = {
        freightTip: "Freight class indicates the type of product in the shipment and affects not only carrying charges but also the overall shipping proces Rates returned may be limited if you do not provide a class.",
        nmfcTip: "Optional: If you know your NMFC item number, enter it here to put it on the bill of lading.",
        lengthTip: "Dimensions are optional. If you supply any dims, we require that you enter all three."
    };

    // computed properties
    get editable() {
        let type = this.pallet.palletType;

        for (let i = 0; i < this.packaging.length; i++) {
            if (this.packaging[i].type == type) {
                return this.packaging[i].editable;
            }
        }
    }

    get overWeight() {
        let palletSpace = parseInt(this.pallet.palletSpace);
        let weight = parseFloat(this.pallet.totalWeight);

        if (palletSpace > 0) {
        let result = weight / palletSpace > 1800;
        this.pallet.overWeight = result;
        return result;
        } else {
             return false;
        }
    }

    @Watch("pallet.palletType")
    onPalletTypeChanged(val: any) {

        let dimension = TMSQuoteService.getPackgingOption(val);
        Object.assign(this.pallet, dimension);
        this.$validator.errors.remove("width" + this.index);
        this.$validator.errors.remove("length" + this.index);
    }

    @Watch("pallet.length")
    onSelectlengthChange(length: number) {
        this.pallet.length = length;
    }

    @Watch("pallet.Width")
    onWidthChange(width: number) {
        this.pallet.width = width;
    }

    @Watch("pallet.Height")
    onHeightChange(height: number) {
        this.pallet.height = height;
    }

    @Watch("pallet.totalWeight")
    onTotalWeightChange(total: number) {
        this.pallet.totalWeight = total;
    }

    @Watch("pallet.quantity")
    onQuantityChange(quantity: any) {
        this.pallet.quantity = quantity;
        this.pallet.palletSpace = quantity;
    }

    onSelectClassChange(payload: any) {
        this.pallet.palletClass = payload;
    }

    onHeightUnitChange(heightUnit: any) {
        this.pallet.heightUnit = heightUnit;
    }

    onWeightUnitChange(weightUnit: any) {
        this.pallet.weightUnit = weightUnit;
    }

    @Watch("pallet.description")
    onDescriptionChange(description: string) {
        this.pallet.description = description;
    }

    @Watch("nmfcNumber")
    onNmfcChange(nmfc: number) {
        this.pallet.nmfcNumber = nmfc;
    }

    deleteLine() {
        this.$validator.errors.clear();
        if (this.pallets.length > 1) {
            this.pallets.splice(this.index, 1);
        }
    }

    changes(payload: any) {
        if (payload.id) {
            payload.id == 1 ?
            this.pallet.isStackable = !this.pallet.isStackable :
            this.pallet.isHazardous = !this.pallet.isHazardous;
        }
    }

    updated() {
        this.$emit('trans', {index: this.index, pallet: this.pallet});
    }

    publicValidate(code: any, field: string) {
        if (!code) {
            return 'This is a required field.';
        } else {
            if (parseInt(code) > 96) {
                return 'Excess';
            }
            if (this.$validator.errors.has(field)) {
                return 'Invalid Format';
            }
        }
        return '';
    }

    mounted() {
        let selects = document.getElementsByClassName("el-input__icon");
        let inputs = document.getElementsByClassName('el-input__inner');
        for (let i = 0; i < selects.length; i++) {
            selects[i].classList.remove('el-icon-arrow-up');
            inputs[i].classList.add('dropdown');
        }
    }
}