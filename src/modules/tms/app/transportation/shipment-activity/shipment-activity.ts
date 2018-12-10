
import LocationAutoComplete from "../../../../../components/location-auto-complete/location-auto-complete";
import SimplifiedPager from "../../../../../components/simplified-pager/simplified-pager";
import CustomizeTable from "../../../../../components/customize-table/customize-table";
import ElementSelect from "../../../../../components/element-select/element-select";
import WaittingBtn from "../../../../../components/waitting-button/waitting-btn";
import DateRange from "../../../../../components/date-range/date-range";
import Pager from "../../../../../components/pager/pager";
import errorHandler from "../../../../../shared/error-handler";
import WiseVue from "../../../../../shared/wise-vue";
import util from "../../../../../shared/util";
import { Component } from "vue-property-decorator";
import * as XLSX from 'xlsx';
import tlp from "./shipment-activity.vue";
import PicturesShow from "../../../../../components/pictures-show/pictures-show";

import shipmentActivityService from "../../../../../services/tms/tms-shipment-activity-service";
@Component({
    mixins: [tlp],
    components: {
        ElementSelect,
        LocationAutoComplete,
        DateRange,
        SimplifiedPager,
        CustomizeTable,
        Pager,
        WaittingBtn,
        PicturesShow
    }
})
export default class ShipmentActivity extends WiseVue {

    searchParams: any = {searchBy: '', shipmentType: 0, status: 0, freightTerm: 0, shipment_start_date: '', shipment_end_date: '', page: { pageSize: 10, currentPage: 1, totalPage: 0, totalNumber: 0, startNum: 0, endNum: 0} };
    shipmentType: Array<any> = [{name: 'All', value: 0}, {name: 'LTL', value: 1}, {name: 'FTL', value: 2}, {name: 'Ocean', value: 3}, {name: 'Rail', value: 4}, {name: 'Air', value: 5}, {name: 'Others', value: 6}];
    status: Array<any> = [{name: 'All', value: 0}, {name: 'Deliverd', value: 1}, {name: 'LineHaul', value: 4}, {name: 'En Route', value: 2}, {name: 'Cancelled', value: 3}];
    freightTerm: Array<any> = [{name: 'All', value: 0}, {name: 'Prepaid', value: 1}, {name: 'Collect', value: 2}, {name: '3rd Party', value: 3}];
    tableHeader: Array<any> = [];
    data: Array<any> = [];
    DELIVERY_DATE_DB_STR = "delivery_date"; // use in vue file, no delete.

    defaultTimeFrom: string = "";
    defaultTimeTo: string = "";

    searchResultPaging: any = {};

    showPhotoView: number = -1;

    tableFileds: Array<any> = [];

    loading = false;
    customerId: string = "";
    exportLoading: boolean = false;
    onSelectShippedDateRange(payload: any) {
        this.searchParams.shipment_start_date = payload.timeFrom;
        this.searchParams.shipment_end_date = payload.timeTo;
        this.searchParams.page.currentPage = 1;
        this.searchParams.page.pageSize = 10;
        this.searchShipmentActivityByPaging();
    }

    onSelectDropdownList(payload: any) {
        this.searchParams.page.currentPage = 1;
        this.searchParams.page.pageSize = 10;
        this.searchShipmentActivityByPaging();
    }

    onSelectCustomizeTable(payload: any) {
    }

    onLocationSelectChange(payload: any) {
        if (payload) {
            this.searchParams.searchBy = payload['location_id'];
            this.searchParams.page.currentPage = 1;
            this.searchParams.page.pageSize = 10;
            this.searchShipmentActivityByPaging();
        }
    }
    getFreightTermText(freightTermId: any): string {
        let item = this.freightTerm.filter((item) => {return parseInt(item['value']) == parseInt(freightTermId); });
        if (item) {
            return item[0]['name'];
        }
        return "";
    }

    getStatusText(status: any, delivered_date: string): string  {
        let item = this.status.filter((item) => {return parseInt(item['value']) == parseInt(status); });
        if (item) {
            let text = item[0]['name'];
            if (item[0]['value'] == 1) {
                text += " " + delivered_date;
            }
            return text;
        }
        return "";
    }

    PhotoViewLeave(index: any) {
        this.showPhotoView = index;
    }

    private  searchShipmentActivityByPaging() {
       this.loading = true;
       shipmentActivityService.search(this.searchParams).subscribe(
           res => {
               this.loading = false;
               if (res.status == 200) {
                   this.tableHeader = res['headers'];
                   this.data = res['data'];
                   this.searchResultPaging = res['page'];
               } else {
                   errorHandler.handle(res['error']);
               }
           },
           err => {
               this.loading = false;
               this.tableHeader = [
                   {"fieldId": "PRO#", "fieldName": "PRO#", "checked": "1"},
                   {"fieldId": "Ship Date", "fieldName": "Ship Date", "checked": "1"},
                   {"fieldId": "Shipper", "fieldName": "Shipper", "checked": "1"},
                   {"fieldId": "PO#", "fieldName": "PO#", "col_header_db_col_name": "po", "checked": "1"},
                   {"fieldId": "Cust.Reference#", "fieldName": "Cust.Reference#", "col_header_db_col_name": "cust_ref", "checked": "1"},
                   {"fieldId": "Pieces/Weight", "fieldName": "Pieces/Weight", "col_header_db_col_name": "ctn_weight", "checked": "1"},
                   {"fieldId": "Total Pallets", "fieldName": "Total Pallets", "col_header_db_col_name": "pts", "checked": "1"},
                   {"fieldId": "Amount", "fieldName": "Amount", "col_header_db_col_name": "amount", "checked": "1"},
                   {"fieldId": "Freight Term", "fieldName": "Freight Term", "col_header_db_col_name": "freight_term", "checked": "1"},
                   {"fieldId": "Consignee", "fieldName": "Consignee", "col_header_db_col_name": "delivery_address", "checked": "1"},
                   {"fieldId": "Shipment Type", "fieldName": "Shipment Type", "col_header_db_col_name": "shipment_type", "checked": "1"},
                   {"fieldId": "Status", "fieldName": "Status", "col_header_db_col_name": "tms_order_status", "checked": "1"},
                   {"fieldId": "View Docs", "fieldName": "View Docs", "col_header_db_col_name": "docs", "checked": "1"}
                   ];
               errorHandler.handle(err);
           }
       );
    }

    triggerSearchFromPager(payload: any) {
        this.searchParams.page.currentPage = payload.currentPage;
        this.searchParams.page.pageSize = payload.pageSize;
        this.searchShipmentActivityByPaging();
    }

    private init() {
        let currentDate = new Date();
        currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000 * 6);
        this.searchParams.shipment_start_date = util.fomateStartDate(currentDate);
        this.searchParams.shipment_end_date = util.fomateEndDate(new Date());
        this.defaultTimeFrom =  this.searchParams.shipment_start_date;
        this.defaultTimeTo = this.searchParams.shipment_end_date;
        this.searchShipmentActivityByPaging();
    }

    mounted() {
        this.init();
    }

    exportExcel() {
        this.exportLoading = true;
        shipmentActivityService.downLoadExcel(this.searchParams).subscribe(
           res => {
               this.exportLoading = false;
               if (res.status == 200) {
                   const wb = XLSX.utils.book_new();
                   const sheet = XLSX.utils.json_to_sheet(res['data']);
                   XLSX.utils.book_append_sheet(wb, sheet, "Shipment Activity");
                   XLSX.writeFile(wb, "shipmentActivity.xlsx" );
               } else {
                   errorHandler.handle(res['error']);
               }

           }, err => {
               this.exportLoading = false;
               errorHandler.handle(err);
           });
    }
}