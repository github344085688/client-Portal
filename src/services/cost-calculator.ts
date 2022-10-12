
import BaseService from "./_base-service";
class CostCalculatorService extends BaseService {

    getProductInfo(params: any) {
        return this.resource$.post<any>('/bam/api/v1/amazon/product/lookup-item', {keyword: params});
    }

    getProductCostData(params: any) {
        return this.resource$.post<any>('/bam/shipping/cost-calculate', params);
    }
}

export default new CostCalculatorService();

