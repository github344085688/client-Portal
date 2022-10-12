import BaseService from "./_tms-base-service";
import TMSQuoteService from "@services/tms/tms-location-type-service";
let loopCounter = 0;

class TmsQuoteService extends BaseService {
     packagingType!: Array<any>;
     palletSpaceCalculation = TMSQuoteService.getPalletSpaceCalculation()[0].palletSpaceCalculation;

     getPackgingOption(type: number) {
            this.packagingType = TMSQuoteService.getPackaging()[0].packagingOptions;
            let packging = {
                width: 0,
                length: 0,
            };

        for (let i = 0; i < this.packagingType.length; i++) {
            if (this.packagingType[i].type == type) {
                packging.width = this.packagingType[i].width;
                packging.length = this.packagingType[i].length;
                break;
            }
        }

        return packging;
    }
    getPallet() {
        let type = 1;
        let packging = this.getPackgingOption(type);
        let pallet = [{
            key: loopCounter,
            palletType: type,
            height: 48,
            width: packging.width,
            length: packging.length,
            quantity: null,
            palletClass: ' ',
            totalWeight: null,
            weightUnit: 'lbs',
            heightUnit: 'in',
            palletSpace: 2,
            isStackable: false,
            isHazardous: false,
            nmfcNumber: null,
            description: null,
            overWeight: false
        }];
        loopCounter++;
        return pallet;
    }

    getQuote() {
        const quote = {
            quoteId: null,
            billto_id: 0,
            shipper_id: 0,
            pickup: {
                locationType: 1,
                zipCode: null,
                state: "",
                city: "",
                isStackable: false,
                isHazardous: false,
            },
            delivery: {
                locationType: 1,
                zipCode: null,
                state: "",
                city: "",
                isStackable: false,
                isHazardous: false,
            },
            estimate: {
                palletSpaceCharge: 0,
                fuelCharge: 0,
                complianceCharge: 0,
                total: 0,
                pickup: {
                    appointment: 0,
                    afterHourPickup: 0,
                    pickupBeforeNoons: 0,
                    blindShipment: 0,
                    beforeHour: 0,
                    residential: 0,
                    rail: 0,
                    liftGate: 0,
                    pieceCount: 0,
                    palletizeCharge: 0,
                    flatbed: 0,
                    hazmat: 0,
                    limittedAccess: 0,
                    cfs: 0,
                    constructionSite: 0,
                    codShipment: 0,
                    insurance: 0,
                    truckLoad: 0,
                    truckLoadSameday: 0,
                    OLF8_11: 0,
                    OLF12_19: 0,
                    OLF20_27: 0,
                    OLF28Over: 0,
                    sdBeforeHour: 0,
                    sdAfterHour: 0,
                    tradeshow: 0,
                    outboundTrailerAfter5Pm: 0,
                    outboundTrailerAfter6Pm: 0,
                    managementFee: 0,
                    nightTrailer: 0,
                    waitingCharge: 0,
                    crossDock: 0,
                },
                delivery: {
                    amDelivery: 0,
                    liftGate: 0,
                    beforeHourDelivery: 0,
                    pieceCount: 0,
                    blindShipment: 0,
                    flatbed: 0,
                    hazmat: 0,
                    palletizeCharge: 0,
                    constructionSite: 0,
                    residential: 0,
                    limittedAccess: 0,
                    quarantine: 0,
                    cfs: 0,
                    codShipment: 0,
                    insideDelivery: 0,
                    insurance: 0,
                    truckLoad: 0,
                    truckLoadSameday: 0,
                    OLF8_11: 0,
                    OLF12_19: 0,
                    OLF20_27: 0,
                    OLF28Over: 0,
                    txDeliveryServicePoints55: 0,
                    txDeliveryServicePoints110: 0,
                    sameDay: 0,
                    tradeshow: 0,
                    managementFee: 0,
                    nightTrailer: 0,
                    waitingCharge: 0,
                    crossDock: 0,
                }
            },
            isHazardous: false,
            isStackable: false,
            hasQuote: false,
            pallets: this.getPallet(),
            packaging: this.packagingType,
            palletSpaces: 0,
            palletSpaceCalculationSettings: this.palletSpaceCalculation,
        };
        return quote;
    }

    search(params: any) {
        return this.resource$.post<any>(`/calc_quote.php`, params);
    }
}

export default new TmsQuoteService();