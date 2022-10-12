import session from "@shared/session";

export default class QuoteRequestBuilder {

    private manifestLines: Array<object> = [];

    private quoteData: any;

    private pickupAccData: any;

    private deliveryAccData: any;

    private chosePickAcc: any;

    private choseDeliveryAcc: any;

    private line!: any;

    CM_RATE: any = 0.3937008;

    KG_RATE: any = 2.20462262;

    constructor(_quoteData: any, _pickAcc: any, _deliveryAcc: any, _chosePickAcc: any, _choseDeliveryAcc: any) {
        this.quoteData = _quoteData;
        this.pickupAccData = _pickAcc;
        this.deliveryAccData = _deliveryAcc;
        this.chosePickAcc = _chosePickAcc;
        this.choseDeliveryAcc = _choseDeliveryAcc;
    }

    public getRequestData() {
        this.fillManifest();
        this.fillAccessorialLine();
        let date_now = new Date();
        let date_month = date_now.getMonth() + 1;
        let date_day = date_now.getDate();
        let date_year = date_now.getFullYear();
        let dd: string = "";
        let mm: string = "";

        if (date_day < 10) {
          dd = "0" + date_day;
        }
        else {
          dd = date_day.toString();
        }
        if (date_month < 10) {
          mm = "0" + date_month;
        }
        else {
          mm = date_month.toString();
        }

        let requestData = {
          UserID: session.getUserId(),
          UserToken: session.getUserToken(),
          input_batch: 0,
          input_billing_party: "1",
          input_billto_id: this.quoteData.billto_id,
          input_consignee_city: this.quoteData.delivery.city,
          input_consignee_contact: "",
          input_consignee_id: "",
          input_consignee_name: "",
          input_consignee_phone: "",
          input_consignee_state: this.quoteData.delivery.state,
          input_consignee_street: "",
          input_consignee_warehouse: null,
          input_consignee_zip: this.quoteData.delivery.zipCode,
          input_debug: 0,
          input_dray_manifest_id: 0,
          input_drayage_port: "0",
          input_equipment_type: "0",
          input_internal_notes: "",
          input_mastertariff_id: "0",
          input_notes: "",
          input_quote_expiration_date: "2018-04-02",
          input_quote_id: this.quoteData.quoteId,
          input_savequote: 1,
          input_shipby: 0,
          input_shipment_date: date_year + "-" + mm + "-" + dd,
          input_shipment_id: "0",
          input_shipper_city: this.quoteData.pickup.city,
          input_shipper_contact: "",
          input_shipper_id: this.quoteData.shipper_id,
          input_shipper_name: "",
          input_shipper_phone: "",
          input_shipper_state: this.quoteData.pickup.state,
          input_shipper_street: "",
          input_shipper_warehouse: null,
          input_shipper_zip: this.quoteData.pickup.zipCode,
          input_single: 1,
          input_trip_id: "0",
          input_value: "",
          manifest_lines: this.manifestLines
        };

        return requestData;
      }

      fillManifest() {
        for (const item of this.quoteData.pallets) {
            let volume_detail = {
              palletType: item.palletType,
              width: item.width,
              length: item.length,
              height: item.height,
              isStackable: item.isStackable,
              isHazardous: item.isHazardous,
            };
          if (item.heightUnit == 'cm') {
              localStorage.setItem('width', volume_detail.width);
              localStorage.setItem('length', volume_detail.length);
              localStorage.setItem('height', volume_detail.height);
              volume_detail.width = Number((volume_detail.width * this.CM_RATE).toFixed(1));
              volume_detail.length = Number((volume_detail.length * this.CM_RATE).toFixed(1));
              volume_detail.height = Number((volume_detail.height * this.CM_RATE).toFixed(1));
            }

            this.line = {
              manifest_carton: item.quantity,
              manifest_class: item.palletClass,
              manifest_code: "",
              manifest_code_id: 0,
              manifest_content: item.description,
              manifest_line_id: 2,
              manifest_linear: "",
              manifest_pallet: item.quantity,
              manifest_space: Number(item.palletSpace),
              manifest_value: "",
              manifest_volume: item.width * item.length * item.height,
              volume_details: [volume_detail],
              manifest_weight: item.totalWeight,
              manifest_weightUnit: item.weightUnit,
              manifest_heightUnit: item.heightUnit,
              manifest_nmfc_number: item.nmfcNumber,
            };

          if (item.weightUnit == 'kg') {
            localStorage.setItem('totalWeight', item.totalWeight);
            this.line.manifest_weight = (item.totalWeight * this.KG_RATE).toFixed(1);
          }
            this.manifestLines.push(this.line);
          }
      }

      private fillAccessorialLine() {
        this.pickupAccData.forEach((data: any) => {
          this.chosePickAcc.forEach((id: any) => {
              if (data.acc_id == id) {
                   let line = {
                    manifest_carton: "",
                    manifest_class: "",
                    manifest_code: data.acc_code,
                    manifest_code_id: data.acc_id,
                    manifest_content: data.acc_name,
                    manifest_line_id: "",
                    manifest_linear: "",
                    manifest_pallet: "",
                    manifest_space: "",
                    manifest_value: "",
                    manifest_volume: "",
                    manifest_weight: ""
                    };
                    this.manifestLines.push(line);
              }
          });
        });

        this.deliveryAccData.forEach((data: any) => {
          this.choseDeliveryAcc.forEach((id: any) => {
              if (data.acc_id == id) {
                      let line = {
                          manifest_carton: "",
                          manifest_class: "",
                          manifest_code: data.acc_code,
                          manifest_code_id: data.acc_id,
                          manifest_content: data.acc_name,
                          manifest_line_id: "",
                          manifest_linear: "",
                          manifest_pallet: "",
                          manifest_value: "",
                          manifest_volume: "",
                          manifest_weight: ""
                          };
                  this.manifestLines.push(line);
              }
          });
        });
      }

}

