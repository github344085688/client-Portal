import { filter, keyBy, keys, forEach, cloneDeep } from 'lodash-es';
import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import InvoiceCustomer from "@components/invoice-customer/invoice-customer";
import LocationAutoComplete from "@components/location-auto-complete/location-auto-complete";
import SimplifiedPager from "@components/simplified-pager/simplified-pager";
import StaticCustomizeTable from "@components/static-customize-table/static-customize-table";
import CompanyidSelect from "@components/companyId-select/companyid-select";
import ElementSelect from "@components/element-select/element-select";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import DateRange from "@components/date-range/date-range";
import Pager from "@components/pager/pager";
import errorHandler from "@shared/error-handler";
import WiseVue from "@shared/wise-vue";
import util from "@shared/util";
import { Component, Watch } from "vue-property-decorator";
import * as XLSX from 'xlsx';
import tlp from "./invoice.vue";
import PicturesShow from "@components/pictures-show/pictures-show";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/debounceTime";
import constants from '@shared/constants';
import errorHanlder from '@shared/error-handler';
import session from "@shared/session";
import tmsInvoiceService from "@services/tms/tms-invoice-service";
import organizationService from "@services/organization-service";
@Component({
    mixins: [tlp],
    components: {
        PredefinedCustomerSelect,
        ElementSelect,
        LocationAutoComplete,
        DateRange,
        SimplifiedPager,
        StaticCustomizeTable,
        Pager,
        WaittingBtn,
        PicturesShow,
        CompanyidSelect,
        InvoiceCustomer
    }
})
export default class Invoice extends WiseVue {
    searchParams: any = { page: { PageSize: 10, CurrentPage: 1, TotalPage: 0, TotalNumber: 0, StartNum: 0, EndNum: 0 } };
    paymentStatus: Array<any> = [{ name: 'All', value: 'All' }, { name: 'PAID', value: 'PAID' }, { name: 'UNPAID', value: 'UNPAID' }];
    searchByInput: Subject<void> = new Subject();

    searchInvoice: any = {
        "api": "/api/ar/AR_Invoice_GetbyParametersSplitPages",
        data: {
            "Program": "tms"
        }
    };
    tableHeader: Array<any> = [];
    tableDataList: Array<any> = [];

    searchResultPaging: any = {};

    showPhotoView: number = -1;
    tableData: any = {};
    tableFileds: Array<any> = [];

    loading = false;
    exportLoading: boolean = false;
    data: Array<any> = [];
    customerId: string = "";
    onSelectPaymentStatus(payload: any) {
        this.searchInvoiceByPaging();
    }

    private searchInvoiceByPaging() {
        this.loading = true;
        this.$delete(this.searchInvoice.data, 'TotalNumber');
        tmsInvoiceService.searchInvoice(this.searchInvoice).subscribe(
            res => {
                this.tableData = {};
                this.tableHeader = [];
                if (res.Page) {
                    this.searchInvoice.data.PageSize = res.Page.PageSize;
                    this.searchInvoice.data.PageIndex = res.Page.CurrentPage;
                    this.searchInvoice.data.TotalNumber = res.Page.TotalNumber;
                }
                if (res.Result && res.Status == true) {
                    if (res.Result.length > 0) {
                        this.filterInvoice(res.Result);
                        this.loading = false;
                    } else {
                        this.loading = false;
                    }
                } else {
                    this.loading = false;
                }
            },
            err => {
                this.loading = false;
                errorHandler.handle(err);
            }
        );
    }

    private filterInvoice(result: any) {
        this.tableData = keyBy(result, function (o) {
            return o.InvoiceHeader.HeaderID;
        });
        forEach(this.tableData, (item) => {
            this.$set(item, 'isClick', false);
        });
        this.filterItemDetail();
        let keyHeaders = keys(result[0].InvoiceHeader);
        this.initTable(keyHeaders);
    }

    private filterItemDetail() {
        forEach(this.tableData, (item) => {
            item.ToTalCount = item.InvoiceDetails.length;
            item.PageSize = 10;
            item.pageDetails = item.InvoiceDetails.slice(0, 10);
        });
    }

    private initTable(Headers: any) {
        Headers.forEach((head: any) => {
            let field = { fieldId: head, fieldName: head, checked: 1 };
            this.tableHeader.push(field);
        });
        this.tableDataList = keys(this.tableData);
    }

    searchItemLevelReportFromPager(pager: any) {
        let pageEnd = pager.currentPage * pager.pageSize;
        let pageStart = pageEnd - pager.pageSize;
        this.tableData[pager.keyId].pageDetails = this.tableData[pager.keyId].InvoiceDetails.slice(pageStart, pageEnd);
        this.$forceUpdate();
    }

    getItemLeveLHead(invoiceDetails: Array<any>) {
        return keys(invoiceDetails[0]);
    }

    showItemDetail(name: string, isClick: boolean) {
        this.tableData[name].isClick = isClick;
    }


    triggerSearchFromPager(payload: any) {
        this.searchInvoice.data.PageSize = payload.pageSize;
        this.searchInvoice.data.PageIndex = payload.currentPage;
        this.searchInvoiceByPaging();
    }

    setPageVisibility(itemDetail: Array<any>) {
        if (itemDetail.length > 10) {
            return true;
        }
        return false;
    }

    onselectCustomerChange() {
        if (this.customerId) {
            this.searchCustomerCode();
        }

    }
    private searchCustomerCode() {
        organizationService.search({ ids: [this.customerId] }).subscribe(
            res => {
                this.searchInvoice.data.Customer = res[0].extend.customerCode;
                this.searchInvoiceByPaging();
            },
            err => {
                errorHanlder.handle(err);
            }
        );
    }

    private init() {
        this.searchInvoice.data.PageSize = this.searchParams.page.PageSize;
        this.searchInvoice.data.PageIndex = this.searchParams.page.CurrentPage;
        this.searchByInput.debounceTime(constants.debounceTime).subscribe(
            this.searchInvoiceByPaging,
            err => {
                errorHanlder.handle(err);
            }
        );
    }

    mounted() {
        this.init();
    }

    PhotoViewLeave(index: any) {
        this.showPhotoView = index;
    }

    exportExcel() {
        this.exportLoading = true;
        this.$delete(this.searchInvoice, 'TotalNumber');
        let excelsearch = cloneDeep(this.searchInvoice);
        excelsearch.data.PageSize = 100;
        excelsearch.data.PageIndex = 1;
        tmsInvoiceService.downLoadExcel(excelsearch).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "Invoice.xlsx");
        })).catch((err: any) => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }
}



