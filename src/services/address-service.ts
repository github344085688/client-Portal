import BaseService from "./_base-service";
import { replace, isEmpty } from  'lodash-es';

class AddressService extends BaseService {


    formatAddress(addressEntity: any, addressExpression: any): string {
        if (isEmpty(addressEntity)) return "";
        if (addressExpression) {
                return this.processAddressExpression(replace(addressExpression, "\\n", "\n"), addressEntity);
        } else {
                let orgName = addressEntity.organizationName ? addressEntity.organizationName : "";
                let addressInfo = orgName + "\n" + addressEntity.name;
                if (addressEntity.address1) {
                    addressInfo += " - " + addressEntity.address1;
                }
                if (addressEntity.city) {
                    addressInfo += " " + addressEntity.city;
                }
                if (addressEntity.state) {
                    addressInfo += " " + addressEntity.state;
                }
                if (addressEntity.zipCode) {
                    addressInfo += " " + addressEntity.zipCode;
                }
                if (addressEntity.storeNo) {
                    addressInfo += " (" + addressEntity.storeNo + ")";
                }
                return addressInfo;
        }
    }

    private processAddressExpression(dataExpression: any, data: any) {
        for (let key in data) {
            dataExpression = replace(dataExpression, "{" + key + "}", data[key]);
        }
        return dataExpression;
    }

    get(addressId: string) {
        return this.resource$.get<any>(`/fd-app/address/${addressId}`);
    }


    search(params: any) {
        return this.resource$.post<any>("/bam/address/search", params);
    }

}



export default new AddressService();