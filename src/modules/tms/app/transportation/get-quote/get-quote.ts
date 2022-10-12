import ButtonSet from "@components/button-set/button-set";
import errorHandler from "@shared/error-handler";
import WiseVue from "@shared/wise-vue";
import session from "@shared/session";
import StepCounter from "@components/step-counter/step-counter";
import Checkbox from "@components/checkbox/checkbox";
import ShippingDetail from "@components/shipping-detail/shipping-detail";
import CheckboxModal from "@components/checkbox-modal/checkbox-modal";
import DefaultModal from "@components/modal/modal";
import MessageModal from "@components/message-modal/message-modal";
import OneButtonModal from "@components/one-button-modal/one-button-modal";
import TMSLocationTypeService from "@services/tms/tms-location-type-service";
import TMSMyAccountService from "@services/tms/tms-my-account-service";
import TMSQuoteService from "@services/tms/tms-quote-service";
import { Component, Watch } from "vue-property-decorator";
import googleAutoComplete from "@services/tms/google-auto-complete";
import tlp from "./get-quote.vue";
import QuoteRequestBuilder from "./quote-request-builder";


@Component({
    mixins: [tlp],
    components: {
        ButtonSet,
        StepCounter,
        Checkbox,
        CheckboxModal,
        DefaultModal,
        MessageModal,
        OneButtonModal,
        ShippingDetail,
    }
})
export default class GetQuote extends WiseVue {
    accountNumber = '';
    companyName: string = '';
    firstName: string = '';
    lastName: string = '';
    phone: any = '';
    fax: any = '';
    email: any = '';

    isLogin: boolean = session.getUserId();
    // isLogin: boolean = false;
    pickLocationType: Array<any> = [];
    deliverLocationType: Array<any> = [];

    quoteSearchParam: any = {};
    pallets: Array<any> = [];
    quoteData: any = TMSQuoteService.getQuote();

    DEFAULT_LOCATION: any = '';
    locationType: Array<any> = [];
    pickUpValue: any = '';
    deliveryValue: any = '';
    pickupAcc: any = [] ;
    deliveryAcc: any = [];

    isShowModal: boolean = false;
    chose_pick_ary: any = [];
    chose_delivery_ary: any = [];
    sure_chose_pick_ary: any = [];
    sure_chose_delivery_ary: any = [];
    pickupAccData: any = [];
    deliveryAccData: any = [];

    PICK_MODAL = 'pick';
    DELIVERY_MODAL = 'delivery';
    // error modal
    ERROR_MODAL: string = "errorModal";
    ERROR_MODAL_TITLE: string = "Error";

    PALLET_OVERVALUE_MODAL: string = "palletOverValueModal";
    EDIT_QUOTE_MODAL: string = "editQuoteModal";
    // no data modal
    NO_DATA_MODAL: string = "noDataModal";
    NO_DATA_TITLE: string = "Calculation Failed";
    NO_DATA_MODAL_MESSAEG: string = "Please modify your input and try again.";
    // message modal
    SUCCESS_MODAL_NAME: string = "successModal";
    SUCCESS_MODAL_TITLE: string = "Success";
    SUCCESS_MODAL_MESSAGE: string = "Successfully Saved";
    // localStorage name
    EDIT_PICKUP_ACC: string = 'chosePickupAcc';
    EDIT_DELIVERY_ACC: string = 'choseDeliveryAcc';
    EDIT_PICKUP_VALUE: string = 'pickUpValue';
    EDIT_DELIVERY_VALUE: string = 'deliveryValue';

    myAccountData: any = TMSMyAccountService.getMyAccount();
    loading: boolean = false;
    resets: boolean = true;
    validationStarted: boolean = false;
    isEditMode: boolean = false;
    calculating: boolean = false;
    sideBarBlur: boolean = false;
    creditLimit: number = 0;
    quoteId: any = null;
    searchParams: any = {};
    watcher: string = '';

    @Watch('pickUpValue')
    pickUpChange() {
        this.sure_chose_pick_ary = [];
        this.getAccData(this.locationType);
        if (this.pickUpValue != localStorage.getItem(this.EDIT_PICKUP_VALUE)) {
            this.chose_pick_ary = [];
            this.clearStorage(this.EDIT_PICKUP_ACC);
        }
    }
    @Watch('deliveryValue')
    deliveryChange() {
        this.sure_chose_delivery_ary = [];
        this.getAccData(this.locationType);
        if (this.deliveryValue != localStorage.getItem(this.EDIT_DELIVERY_VALUE)) {
            this.chose_delivery_ary = [];
            this.clearStorage(this.EDIT_DELIVERY_ACC);
        }
    }

    onTypeChange(name: any, type: any) {
        if (name == 'pick') {
            this.pickUpValue = type;
        } else if (name == 'delivery') {
            this.deliveryValue = type;
        }
        let location: any = this.locationType.filter((item) => { return item['location_type_code'] == type; });
        if (location && location[0] && location[0].acc_ary && Array.isArray(location[0].acc_ary)) {
            name == 'pick' ? this.pickupAcc = location[0].acc_ary : this.deliveryAcc = location[0].acc_ary;
        } else {
            name == 'pick' ? this.pickupAcc = [] : this.deliveryAcc = [];
        }
        name == 'pick' ? this.chose_pick_ary = [] : this.chose_delivery_ary = [];
    }

    saveAcc(payload: any) {
        this.isShowModal = false;
        this.$emit('toBlur', this.isShowModal);
        this.updateAcc(payload);
        this.sure_chose_pick_ary = this.chose_pick_ary;
        this.sure_chose_delivery_ary = this.chose_delivery_ary;
        if (this.PICK_MODAL == payload['modalName']) {
                this.clearStorage(this.EDIT_PICKUP_ACC);
        } else if (this.DELIVERY_MODAL == payload['modalName']) {
                this.clearStorage(this.EDIT_DELIVERY_ACC);
        }
    }
    updateAcc(payload: any) {
        if (payload && payload['modalName']) {
            if (this.PICK_MODAL == payload['modalName']) {
                this.chose_pick_ary = payload['chosedAry'];
            } else if (this.DELIVERY_MODAL == payload['modalName']) {
                this.chose_delivery_ary = payload['chosedAry'];
            }
        }
    }

    showAcc(modalName: string) {
        if (!this.calculating) {
            this.setEdit();
            this.$modal.show(modalName);
            this.isShowModal = true;
            this.$emit('toBlur', this.isShowModal);
        }
    }
    closeAcc(modalName: string) {
        this.$modal.hide(modalName);
        this.isShowModal = false;
        if (modalName == 'pick') {
            this.chose_pick_ary = this.sure_chose_pick_ary;
        } else if (modalName == 'delivery') {
            this.chose_delivery_ary = this.sure_chose_delivery_ary;
        }
        this.$emit('toBlur', this.isShowModal);
        this.setEdit();
    }
    closeNoDataModal() {
        this.$modal.hide(this.NO_DATA_MODAL);
    }

    closeErrorModal() {
        this.$modal.hide(this.ERROR_MODAL);
    }

    pickupZipAutoComplete() {
        this.$nextTick(async function() {
            let input = document.getElementById('input_zip_code_pickup') as HTMLInputElement;
            let pickupZipAutoComplete = new googleAutoComplete();
            while (true) {
                let result: any =  await pickupZipAutoComplete.searchResult(input);
                this.quoteData.pickup.zipCode = result.postal_code;
                this.quoteData.pickup.city = result.city;
                this.quoteData.pickup.state = result.state;
            }
        });
    }

    deliveryZipAutoComplete() {
        this.$nextTick(async function() {
            let input = document.getElementById('input_zip_code_delivery') as HTMLInputElement;
            let pickupZipAutoComplete = new googleAutoComplete();
            while (true) {
                let result: any = await pickupZipAutoComplete.searchResult(input);
                this.quoteData.delivery.zipCode = result.postal_code;
                this.quoteData.delivery.city = result.city;
                this.quoteData.delivery.state = result.state;
            }
        });
    }

    addLine() {
        let pallet = TMSQuoteService.getPallet()[0];
        this.pallets.push(pallet);
    }

    private init() {
        TMSMyAccountService.search().subscribe(
            (res: any) => {
                if (res && res['status'] && res['status'] == 200) {
                    let data = res['data'];
                    this.myAccountData[1].billing.locationId = data.billing.location_id;
                    this.myAccountData[0].shipping.locationId = data.shipping.location_id;
                } else {
                    console.log(res['error']);
                }
            }, (err: any) => {
                console.log(err);
            }
        );
        this.pickupZipAutoComplete();
        this.deliveryZipAutoComplete();
        this.pallets = TMSQuoteService.getPallet();
        this.setEdit();
    }
    initLocationTypeAndAccessorials() {

        TMSLocationTypeService.search().subscribe(
            (res: any) => {
                if (res && res['status'] && res['status'] == 200) {
                    this.locationType = res['data'] || [];
                    this.getAccData(this.locationType);
                    let location = this.locationType[0].location_type_description;
                    this.pickUpValue = location;
                    this.deliveryValue = location;
                    this.DEFAULT_LOCATION = location;
                    this.onTypeChange('pick', this.pickUpValue);
                    this.onTypeChange('delivery', this.deliveryValue);
                } else {
                    errorHandler.handle("init location type and accessorials error!");
                    console.log(res['error']);
                }
            }, (err: any) => {
                errorHandler.handle("init location type and accessorials error!");
                console.log(err);
            }
        );
    }

    getAccData(data: any) {
        if (data) {
            this.locationType.forEach((item) => {
                if (item.location_type_code == this.pickUpValue) {
                    this.pickupAccData = item.acc_ary;
                }
                if (item.location_type_code == this.deliveryValue) {
                    this.deliveryAccData = item.acc_ary;
                }
            });
        }
    }
    get palletSpaces() {
        let sum = 0;
        sum = this.totalSum(sum, 'palletSpace');
        this.quoteData.palletSpaces = sum;
        return sum;
    }

    get totalPallets() {
        let sum = 0;
        return this.totalSum(sum, 'quantity');
    }

    get allTotalWeight() {
        let sum = 0;
        return this.totalSum(sum, 'totalWeight');
    }

    totalSum(sum: any, name: any) {
        this.quoteData.pallets.forEach((item: any) => {
          sum += parseInt(item[name]);
        });
        return sum;
    }
    get exceedPalletSpaces() {
        return this.palletSpaces > 15;
    }

    get overWeight() {
    let result = false;

    this.quoteData.pallets.forEach((item: any) => {
        if (item.overWeight) {
             result = item.overWeight;
        }
    });
         return result;
    }

    get palletOverValue() {
        let overValue: boolean = false;

        this.quoteData.pallets.forEach((item: any) => {
            if (parseInt(item.quantity) > 15 || parseInt(item.totalWeight) > 1800) {
            overValue = true;
            }
        });

        if (this.quoteData.isHazardous) {
            overValue = true;
        }

        return overValue;
    }

    setPallet(payload: any) {
        let index = payload.index;
        let pallet = payload.pallet;
        this.quoteData.pallets[index] = pallet;
    }

    palletOverValueModalRightBtnAction() {
        this.reset();
        this.$modal.hide(this.PALLET_OVERVALUE_MODAL);
    }
    palletOverValueModalRightBtnStyle: any = {
        display: "none !important"
    };
    editQuoteModalRightBtnStyle: any = {
        "background-color": "#15223d !important"
    };
    submitData() {
        // proceed only when accessorial data is available
        if (this.pickupAccData.length > 0 || this.deliveryAccData.length > 0) {
            this.calculating = true;
            this.quoteData.billto_id = this.myAccountData[1].billing.locationId;
            this.quoteData.shipper_id = this.myAccountData[0].shipping.locationId;
            this.quoteData.pallets = this.pallets;
            this.quoteData.quoteId = this.quoteId;
            this.setEdit();
            let requestData = new QuoteRequestBuilder(
              this.quoteData,
              this.pickupAccData,
              this.deliveryAccData,
              this.chose_pick_ary,
              this.chose_delivery_ary
            ).getRequestData();
          TMSQuoteService.search(requestData).subscribe(
              (res: any) => {
                if (res && res['status'] && res['status'] == 1 && res['statusMsg'] == '') {
                    let manifestNum = this.pallets.length;
                    this.saveStorage(requestData, manifestNum);
                    requestData.input_quote_id = res.quote_id;
                    this.jumpPage(requestData);
                } else {
                    console.log(res['statusMsg']);
                    errorHandler.handle("get quote error!");
                }
                this.calculating = false;
              }, (err: any) => {
                    console.log(err);
                    errorHandler.handle("get quote error!");
              }
          );
          } else {
            this.$modal.show(this.ERROR_MODAL);
          }
    }

    setEditData(name: string) {

        let store: any = localStorage.getItem(name);
        if (store) {
            if (name == this.EDIT_PICKUP_ACC || name == this.EDIT_DELIVERY_ACC) {

                let storageArr = JSON.parse(store);
                if (storageArr && storageArr.length > 0) {
                    name == this.EDIT_PICKUP_ACC ? this.chose_pick_ary = storageArr : this.chose_delivery_ary = storageArr;
                }
            }
        }
    }

    setEdit() {
        this.setEditData(this.EDIT_PICKUP_ACC);
        this.setEditData(this.EDIT_DELIVERY_ACC);
    }

    saveStorage(data: any, num: any) {
        let storage = localStorage;
        storage.setItem(this.EDIT_PICKUP_ACC, JSON.stringify(this.chose_pick_ary));
        storage.setItem(this.EDIT_DELIVERY_ACC, JSON.stringify(this.chose_delivery_ary));
        storage.setItem(this.EDIT_PICKUP_VALUE, this.pickUpValue);
        storage.setItem(this.EDIT_DELIVERY_VALUE, this.deliveryValue);
        storage.setItem('pickupZipCode', data.input_shipper_zip);
        storage.setItem('pickupCity', data.input_shipper_city);
        storage.setItem('pickupState', data.input_shipper_state);
        storage.setItem('deliveryZipCode', data.input_consignee_zip);
        storage.setItem('deliveryCity', data.input_consignee_city);
        storage.setItem('deliveryState', data.input_consignee_state);
        storage.setItem('manifestLines', JSON.stringify(data.manifest_lines));
        storage.setItem('num', num);
    }

    jumpPage(params: any) {
        this.$router.push({
            path: 'app/my-shipment',
            name: 'MyShipment',
            params: params,
        });
    }

    async validate() {
        this.validationStarted = true;
        let result = await this.$validator.validateAll();

        if (
          this.overWeight ||
          this.exceedPalletSpaces
        ) {
          this.$modal.show(this.PALLET_OVERVALUE_MODAL);
          return;
        }
        if (result && !this.overWeight && !this.exceedPalletSpaces) {
            this.submitData();
        }
    }

    submit() {
        if (this.isEditMode) {
          this.$modal.show(this.EDIT_QUOTE_MODAL);
        } else {
          this.validate();
        }
      }

    reset() {
        this.resets = !this.resets;
        this.chose_pick_ary = [];
        this.chose_delivery_ary = [];
        this.validationStarted = false;
        this.quoteData.hasQuote = false;
        this.$validator.errors.clear();
        this.pallets.splice(1);
        this.quoteData.pickup.zipCode = null;
        this.quoteData.pickup.city = '';
        this.quoteData.pickup.state = '';
        this.quoteData.delivery.zipCode = null;
        this.quoteData.delivery.city = '';
        this.quoteData.delivery.state = '';
        this.onTypeChange('pick', this.DEFAULT_LOCATION);
        this.onTypeChange('delivery', this.DEFAULT_LOCATION);
        this.pallets.forEach(val => {
            val.quantity = null;
            val.totalWeight = null;
            val.height = 48;
            val.palletClass = ' ';
            val.description = null;
            val.palletSpace = null;
            val.isStackable = false;
            val.isHazardous = false;
            val.nmfcNumber = null;
            val.palletType = 1;
            val.weightUnit = 'lbs';
            val.heightUnit = 'in';
        });
    }

    editQuote(params: any) {
         if (params && params.input_quote_id) {
            let storage = localStorage;
            let manifestNum = Number(storage.getItem('num'));

            this.pickUpValue = storage.getItem(this.EDIT_PICKUP_VALUE);
            this.deliveryValue = storage.getItem(this.EDIT_DELIVERY_VALUE);
            this.quoteData.pickup.zipCode = storage.getItem('pickupZipCode');
            this.quoteData.pickup.city = storage.getItem('pickupCity');
            this.quoteData.pickup.state = storage.getItem('pickupState');
            this.quoteData.delivery.zipCode = storage.getItem('deliveryZipCode');
            this.quoteData.delivery.city = storage.getItem('deliveryCity');
            this.quoteData.delivery.state = storage.getItem('deliveryState');
            let manifestLines: any = storage.getItem('manifestLines');
            manifestLines = JSON.parse(manifestLines);
            this.setEditManifest(manifestLines, manifestNum);
            this.pallets.shift();
        }
    }

    setEditManifest(manifestLines: any, manifestNum: any) {
        if (manifestLines) {
            for (let i = 0; i < manifestNum; i++) {
                let manifest = manifestLines[i];
                let details = manifestLines[i].volume_details[0];
                if (manifest.manifest_weightUnit == 'kg') {
                    manifest.manifest_weight = localStorage.getItem('totalWeight');
                }
                if (manifest.manifest_heightUnit == 'cm') {
                    details.height = localStorage.getItem('height');
                    details.width = localStorage.getItem('width');
                    details.length = localStorage.getItem('length');
                }
                let palletList = {
                    quantity: manifest.manifest_carton,
                    totalWeight: manifest.manifest_weight,
                    height: details.height,
                    width: details.width,
                    length: details.length,
                    palletType: details.palletType,
                    description: manifest.manifest_content,
                    isStackable: details.isStackable,
                    isHazardous: details.isHazardous,
                    palletClass: manifest.manifest_class,
                    weightUnit: manifest.manifest_weightUnit,
                    heightUnit: manifest.manifest_heightUnit,
                    nmfcNumber: manifest.manifest_nmfc_number,
                };
                this.pallets.push(palletList);
            }
        }
    }
    mounted() {
        this.init();
        this.initLocationTypeAndAccessorials();
        this.changeSelectStyle();
        let params: any = this.$route.params;
        if (params && params.input_quote_id) {
            this.quoteId = params.input_quote_id;
            this.setEdit();
            this.editQuote(params);
        } else {
            this.clearMultiStorage();
            this.onTypeChange('pick', this.DEFAULT_LOCATION);
            this.onTypeChange('delivery', this.DEFAULT_LOCATION);
        }
    }
    clearStorage(name: string) {
        localStorage.removeItem(name);
    }

    clearMultiStorage() {
        this.clearStorage(this.EDIT_PICKUP_ACC);
        this.clearStorage(this.EDIT_DELIVERY_ACC);
        this.clearStorage(this.EDIT_PICKUP_VALUE);
        this.clearStorage(this.EDIT_DELIVERY_VALUE);
        this.clearStorage('quoteId');
    }

    publicValidate(code: any, field: string) {
        if (!code) {
            return 'This is a required field.';
        } else {
                if (this.$validator.errors.has(field)) {
                    return 'Invalid Format';
                }
        }
        return '';
    }

    changeSelectStyle() {
        let selects = document.getElementsByClassName("el-input__icon");
        let inputs = document.getElementsByClassName('el-input__inner');
        let dropdown: any = document.getElementsByTagName('body');
        dropdown[0].classList.add('quote');
        for (let i = 0; i < selects.length; i++) {
            selects[i].classList.remove('el-icon-arrow-up');
            inputs[i].classList.add('dropdown');
        }
    }
     STATE_ARY: Array<any> = [
        {code: "AL", name : "AL", desc: "Alabama"},
        {code: "AK", name : "AK", desc: "Alaska"},
        {code: "AZ", name : "AZ", desc: "Arizona"},
        {code: "AR", name : "AR", desc: "Arkansas"},
        {code: "CA", name : "CA", desc: "California"},
        {code: "CO", name : "CO", desc: "Colorado"},
        {code: "CT", name : "CT", desc: "Connecticut"},
        {code: "DE", name : "DE", desc: "Delaware"},
        {code: "DC", name : "DC", desc: "District of Columbia"},
        {code: "FL", name : "FL", desc: "Florida"},
        {code: "GA", name : "GA", desc: "Georgia"},
        {code: "HI", name : "HI", desc: "Hawaii"},
        {code: "ID", name : "ID", desc: "Idaho"},
        {code: "IL", name : "IL", desc: "Illinois"},
        {code: "IN", name : "IN", desc: "Indiana"},
        {code: "IA", name : "IA", desc: "Iowa"},
        {code: "KS", name : "KS", desc: "Kansas"},
        {code: "KY", name : "KY", desc: "Kentucky"},
        {code: "LA", name : "LA", desc: "Louisiana"},
        {code: "ME", name : "ME", desc: "Maine"},
        {code: "MD", name : "MD", desc: "Maryland"},
        {code: "MA", name : "MA", desc: "Massachusetts"},
        {code: "MI", name : "MI", desc: "Michigan"},
        {code: "MN", name : "MN", desc: "Minnesota"},
        {code: "MS", name : "MS", desc: "Mississippi"},
        {code: "MO", name : "MO", desc: "Missouri"},
        {code: "MT", name : "MT", desc: "Montana"},
        {code: "NE", name : "NE", desc: "Nebraska"},
        {code: "NV", name : "NV", desc: "Nevada"},
        {code: "NH", name : "NH", desc: "New Hampshire"},
        {code: "NJ", name : "NJ", desc: "New Jersey"},
        {code: "NM", name : "NM", desc: "New Mexico"},
        {code: "NY", name : "NY", desc: "New York"},
        {code: "NC", name : "NC", desc: "North Carolina"},
        {code: "ND", name : "ND", desc: "North Dakota"},
        {code: "OH", name : "OH", desc: "Ohio"},
        {code: "OK", name : "OK", desc: "Oklahoma"},
        {code: "OR", name : "OR", desc: "Oregon"},
        {code: "PA", name : "PA", desc: "Pennsylvania"},
        {code: "RI", name : "RI", desc: "Rhode Island"},
        {code: "SC", name : "SC", desc: "South Carolina"},
        {code: "SD", name : "SD", desc: "South Dakota"},
        {code: "TN", name : "TN", desc: "Tennessee"},
        {code: "TX", name : "TX", desc: "Texas"},
        {code: "UT", name : "UT", desc: "Utah"},
        {code: "VT", name : "VT", desc: "Vermont"},
        {code: "VA", name : "VA", desc: "Virginia"},
        {code: "WA", name : "WA", desc: "Washington"},
        {code: "WV", name : "WV", desc: "West Virginia"},
        {code: "WI", name : "WI", desc: "Wisconsin"},
        {code: "WY", name : "WY", desc: "Wyoming"},
        {code: "AB", name : "AB", desc: "Alberta"},
        {code: "BC", name : "BC", desc: "British Columbia"},
        {code: "MB", name : "MB", desc: "Manitoba"},
        {code: "NB", name : "NB", desc: "New Brunswick"},
        {code: "NL", name : "NL", desc: "Newfoundland and Labrador"},
        {code: "NS", name : "NS", desc: "Nova Scotia"},
        {code: "ON", name : "ON", desc: "Ontario"},
        {code: "PE", name : "PE", desc: "Prince Edward Island"},
        {code: "QC", name : "QC", desc: "Quebec"},
        {code: "SK", name : "SK", desc: "Saskatchewan"},
        {code: "NT", name : "NT", desc: "Northwest Territories"},
        {code: "NU", name : "NU", desc: "Nunavut"},
        {code: "YT", name : "YT", desc: "Yukon"}
    ];
}