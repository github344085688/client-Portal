
import BaseService from "./_base-service";

class FacilityService extends BaseService {

    get(facilityId: string) {
        return this.resource$.get<any>(`/fd-app/facility/${facilityId}`);
    }
    search(params: any) {
        return this.resource$.post<any>(`/fd-app/facility/search`, params);
    }
}

let facilityService = new FacilityService();
export default facilityService;

