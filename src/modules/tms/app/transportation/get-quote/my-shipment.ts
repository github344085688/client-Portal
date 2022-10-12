import WiseVue from "@shared/wise-vue";
import { Component } from "vue-property-decorator";
import template from "./my-shipment.vue";
import Checkbox from "@components/checkbox/checkbox";
@Component({
    mixins: [template],
    name: 'my-shipment',
    components: {
            Checkbox
        }
})

export default class MyShipment extends WiseVue {
    modalName: string = '';
    pickupCity: string | null = '';
    pickupState: string | null = '';
    pickupZipCode: string | null = '';
    deliveryCity: string | null = '';
    deliveryState: string | null = '';
    deliveryZipCode: string | null = '';
    pickupDate: string | null = '';
    classNum: any = '';
    classes: Array<any> = [];
    pallet: string = '';
    pallets: Array<any> = [];
    dimension: string = '';
    dimensions: Array<any> = [];
    totalWeight: any = '';
    num: any = '';
    height: number = 113;
    description: any = [];
    sortText: string = 'Best Match';
    routeParams: any = '';
    sorts: Array<any> = [
        "Best Match",
        "Low to High",
        "High to Low",
        "Fastest"
    ];

    onSortChange(sort: string) {
        this.sortText = sort;
    }
    goEdit() {
        let quoteId = localStorage.getItem('quoteId');
        let param: any = {};
        if (quoteId) {
            param = {input_quote_id: quoteId};
        }
        this.$router.push(
            {
                path: "app/get-quote",
                name: "GetQuote",
                params: param,
            }
        );
    }
    fillDescription(manifestLines: any, manifestNum: number) {
        if (manifestLines && Array.isArray(manifestLines)) {

            if (manifestNum <= 1 && manifestLines[0] && manifestLines[0].volume_details[0]) {
                this.classNum = manifestLines[0].manifest_class;
                this.pallet = manifestLines[0].manifest_pallet;
                this.totalWeight = manifestLines[0].manifest_weight;
                let volume_details = manifestLines[0].volume_details[0];
                this.dimension = volume_details.length + ' x ' + volume_details.width + ' x ' + volume_details.height;
            } else if (manifestNum > 1) {
                    let sum = 0;
                    manifestLines.splice(manifestNum);
                    manifestLines.forEach((manifest: any) => {
                    sum += parseInt(manifest.manifest_weight);
                    this.totalWeight = sum;
                    this.classes.push(manifest.manifest_class);
                    this.pallets.push(manifest.manifest_pallet);
                    let details: Array<any> = [];
                    details.push(manifest.volume_details[0]);
                    details.forEach((detail: any) => {
                        this.dimensions.push(detail.length + ' x ' + detail.width + ' x ' + detail.height);
                    });
                });
            }
        }
    }
    changeStyle() {
        let selects = document.getElementsByClassName("el-icon-arrow-up");
        let scrollbar = document.getElementsByClassName('el-scrollbar');
        let dropdown: any = document.getElementsByTagName('body');
        dropdown[0].classList.remove('quote');
        dropdown[0].classList.add('shipment');
        scrollbar[0].classList.add('my-shipment');
        let inputs = document.getElementsByClassName('el-input__inner');
        for (let i = 0; i < selects.length; i++) {
            selects[i].classList.remove('el-icon-arrow-up');
            inputs[i].classList.add('triangle');
        }
    }
    assignValue(params: any) {

        let quoteId = params.input_quote_id;
        if (quoteId) {
            localStorage.setItem('quoteId', quoteId);
        }

        let storage = localStorage;
        this.pickupCity = storage.getItem('pickupCity');
        this.pickupState = storage.getItem('pickupState');
        this.pickupZipCode = storage.getItem('pickupZipCode');
        this.deliveryCity = storage.getItem('deliveryCity');
        this.deliveryState = storage.getItem('deliveryState');
        this.deliveryZipCode = storage.getItem('deliveryZipCode');

        let manifestLines: any = storage.getItem('manifestLines');
        manifestLines = JSON.parse(manifestLines);
        this.num = Number(storage.getItem('num'));
        this.routeParams = params;
        this.height += ((this.num - 1) * 36);
        this.fillDescription(manifestLines, this.num);
    }
    mounted() {
        let params: any = this.$route.params;
        this.assignValue(params);
        this.changeStyle();
    }
}