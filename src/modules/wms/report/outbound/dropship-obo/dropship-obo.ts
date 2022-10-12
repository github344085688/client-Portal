import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import MultipleOrganizationAutoComplete from "@components/multiple-organization-auto-complete/multiple-organization-auto-complete";
import ElementSelect from "@components/element-select/element-select";
import FacilitySelect from "@components/facility-select/facility-select";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import DateRange from "@components/date-range/date-range";
import Pager from "@components/pager/pager";
import errorHandler from "@shared/error-handler";
import CustomerWiseVue from "@shared/customer-wise-vue";
import util from "@shared/util";
import OutboundService from "@services/outbound-service";
import { Component, Prop, Provide } from "vue-property-decorator";
import { map, compact, round, cloneDeep, forEach, sumBy, isEmpty } from "lodash-es";
import tlp from "./dropship-obo.vue";
import session from "@shared/session";
import CompanyService from "@services/company-service";

@Component({
    mixins: [tlp],
    components: {
        ElementSelect,
        PredefinedCustomerSelect,
        MultipleOrganizationAutoComplete,
        FacilitySelect,
        DateRange,
        Pager,
        WaittingBtn
    }
})
export default class ShippedSummary extends CustomerWiseVue {

    searchParam: any = {};
    dropshipOBOReports: any = { data: [] };
    cutOffTimes: any = [];
    holidays: any = [];

    loading = false;
    cutOffTimeLoading = false;
    holidayLoading = false;
    exportLoading: boolean = false;

    onSelectDateRange(payload: any) {
        this.searchParam.timeFrom = payload.timeFrom;
        this.searchParam.timeTo = payload.timeTo;
        // this.searchReport();
    }

    onSelectFacilityChange(payload: any) {
        // this.searchReport();
    }

    onselectCustomerChange(payload: any) {
        this.searchCutOffTimeAndHoliday();
    }

    searchDropshipOBO() {
        this.dropshipOBOReports = { data: [] };
        let searchParam = cloneDeep(this.searchParam);
        if (isEmpty(searchParam.timeFrom) || isEmpty(searchParam.timeTo)) {
            errorHandler.handle("timeFrom and timeTo must not be empty.");
            return;
        }
        if (isEmpty(searchParam.cutOffTime)) {
            errorHandler.handle("Apply Cut Off Time(24 Hours) must not be empty.");
            return;
        }
        this.loading = true;
        OutboundService.searchDropshipOBO(searchParam).subscribe(
            res => {
                this.dropshipOBOReports = res.results;
                if (!isEmpty(this.dropshipOBOReports.data)) {
                    let dropshipOBOTotal: any = { "Facility": "Total" };
                    forEach(this.dropshipOBOReports.head, (head) => {
                        if (head != "Facility" && head != "On Time%") {
                            dropshipOBOTotal[head] = sumBy(this.dropshipOBOReports.data, head);
                        }
                    });
                    dropshipOBOTotal["On Time%"] = "0%";
                    if (dropshipOBOTotal["Total Orders"] != 0) {
                        dropshipOBOTotal["On Time%"] = round(dropshipOBOTotal["On Time Shipped"] / dropshipOBOTotal["Total Orders"] * 100, 2) + "%";
                    }
                    this.dropshipOBOReports.data.push(dropshipOBOTotal);
                }
                this.loading = false;
            },
            err => {
                this.loading = false;
                errorHandler.handle(err);
            }
        );
    }

    searchOrderOffTimeByAllFacility(searchParam: any) {
        this.cutOffTimeLoading = true;
        OutboundService.searchOrderOffTimeByAllFacility(searchParam).subscribe(
            res => {
                this.cutOffTimes = res;
                this.cutOffTimeLoading = false;
            },
            err => {
                this.cutOffTimeLoading = false;
                errorHandler.handle(err);
            }
        );
    }


    searchReport() {
        let facilities = this.getfacilitiesBySelectedCustomer();
        let facilityIds = compact(map(facilities, "id"));
        if (isEmpty(facilityIds)) {
            errorHandler.handle("This customer has no associated facility.");
            return;
        }
        this.searchDropshipOBO();
        this.searchCutOffTimeAndHoliday();
    }


    exportExcel() {
        let searchParam = cloneDeep(this.searchParam);
        if (isEmpty(searchParam.timeFrom) || isEmpty(searchParam.timeTo)) {
            errorHandler.handle("timeFrom and timeTo must not be empty.");
            return;
        }
        if (isEmpty(searchParam.cutOffTime)) {
            errorHandler.handle("Apply Cut Off Time(24 Hours) must not be empty.");
            return;
        }
        this.exportLoading = true;
        OutboundService.dropshipOboDownLoad(searchParam).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "dropship-obo.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }

    searchCutOffTimeAndHoliday() {
        if (this.searchParam.customerId) {
            let facilities = this.getfacilitiesBySelectedCustomer();
            let facilityIds = map(facilities, "id");
            let searchParam = { customerId: this.searchParam.customerId, facilityIds: facilityIds };
            this.searchOrderOffTimeByAllFacility(searchParam);
        }
        let currentCF = session.getCurrentCompanyFacility();
        if (currentCF.companyId) {
            this.holidayLoading = true;
            CompanyService.search({ ids: [currentCF.companyId] }).subscribe(
                res => {
                    this.holidayLoading = false;
                    this.holidays = res[0].holiday;
                },
                err => {
                    this.holidayLoading = false;
                    errorHandler.handle(err);
                }
            );
        }
    }

    private init() {
        this.searchCutOffTimeAndHoliday();
    }

    mounted() {
        this.init();
    }

}