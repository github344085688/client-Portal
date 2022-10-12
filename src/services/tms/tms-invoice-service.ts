import BaseService from "../_base-service";
import ax from '@shared/axios';
class InvoiceService extends BaseService {

    searchInvoice(searchParam: any) {
        return this.resource$.post<any>(`/report-center/billing/call-bill-pay-api`, searchParam);
    }

    downLoadExcel(searchParam: any) {
        return ax.post(`/report-center/billing/call-bill-pay-api/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }
}

export default new InvoiceService();