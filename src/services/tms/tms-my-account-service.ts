import BaseService from "./_tms-base-service";


class TmsMyAccountService extends BaseService {
        getMyAccount() {
            return [
                {
                    shipping: {
                        locationId: 0,
                        locationName: "",
                        address1: "",
                        address2: "",
                        city: "",
                        state: "",
                        zip: "",
                        phone: "",
                        fax: "",
                        inEdit: false
                    }
                },
                {
                    billing: {
                        locationId: 0,
                        locationName: "",
                        address1: "",
                        address2: "",
                        city: "",
                        state: "",
                        zip: "",
                        phone: "",
                        fax: "",
                        paymentType: "",
                        creditLimit: "",
                        netTermDays: "",
                        inEdit: false
                    }
                },
                {
                    user: {
                        firstName: "",
                        lastName: "",
                        userName: "",
                        email: "",
                        inEdit: false
                    }
                }
            ];
        }
        search() {
            return this.resource$.post<any>(`/get_customer_account.php`, {});
        }
}
export default new TmsMyAccountService();