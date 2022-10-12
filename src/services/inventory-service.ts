
import BaseService from "./_base-service";
import ax from '@shared/axios';

class InventoryService extends BaseService {

    searchInventoryDetailByPaging(searchParam: any) {
        return this.resource$.post<any>(`/bam/wms-app/inventories/search-by-paging`, searchParam);
    }

    searchInventoryDetail(searchParam: any) {
        return this.resource$.post<any>(`/bam/wms-app/inventories/search`, searchParam);
    }

    searchInventorySnLookUpByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inventory/sn-activity-report/search-by-paging`, searchParam);
    }

    searchInventoryStatusByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inventory/status-report-v2/search-by-paging`, searchParam);
    }

    searchInventoryItemActivityReport(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inventory/item-activities/report`, searchParam);
    }

    searchInventoryStatusItemDetail(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inventory/status-report-item-detail/search-by-paging`, searchParam);
    }
    /*
     criteria: item keyword
     */
    searchInventoryAgingByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inventory/aging-report-v2/search-by-paging`, searchParam);
    }
        /*
     criteria: keyword(item keyword),types,lpIds,startTime,endTime, timeFrom, timeTo, see AdjustmentSearch below for more details
     */
    searchInventoryAdjustmentByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inventory/adjustment-report-v2/search-by-paging`, searchParam);
    }

    activityItemLevelDownLoad(searchParam: any) {
        return ax.post(`/report-center/inventory/item-activities/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    adjustmentDownLoad(searchParam: any) {
        return ax.post(`/report-center/inventory/adjustment-report-v2/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    agingReportDownLoad(searchParam: any) {

        return ax.post(`/report-center/inventory/aging-report-v2/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    statusReportDownLoad(searchParam: any) {
        return ax.post(`/report-center/inventory/status-report-v2/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    statusItemDetailReportDownLoad(searchParam: any) {
        return ax.post(`/report-center/inventory/status-report-item-detail/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    statusLotNoReportDownLoad(searchParam: any) {
        return ax.post(`/report-center/inventory/status-report-v2/lotno-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    snLookUpReportDownLoad(searchParam: any) {
        return ax.post(`/report-center/inventory/sn-activity-report/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

  searchStatusRreportItemOnhandDetail(searchParam: any) {
    return this.resource$.post<any>(`/report-center/inventory/status-report-item-onhand-detail `, searchParam);
  }


  searchHistoricalInventoryAgingByPaging(searchParam: any) {
    return this.resource$.post<any>(`/report-center/inventory/aging-report-receipt-level`, searchParam);
  }

  agingReportReceiptLevelDownLoad(searchParam: any) {
    return ax.post(`/report-center/inventory/aging-report-receipt-level/download`, searchParam, {
      responseType: 'arraybuffer'
    });
  }

  searchInventorySnActivityHistorySearch(searchParam: any) {
    return this.resource$.post<any>(`/report-center/inventory/sn-activity-history-report/search`, searchParam);
  }

}

export default new InventoryService();

