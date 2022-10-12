
import userService from "@services/user-service";
import companyService from "@services/company-service";
import facilityService from "@services/facility-service";
import errorHanlder from './error-handler';
import { forEach } from "lodash-es";

export class Session {

    _sessionInfo: any = {};

    async fetchUserInfo() {
        if (this.getSessionData("userInfo")) {
            return this.getSessionData("userInfo");
        } else if (this.getUserId()) {
            try {
                let userInfo = await userService.getUser(this.getUserId()).toPromise();
                this.setUserInfo(userInfo);
                return userInfo;
            } catch (err) {
                errorHanlder.handle(err);
                return undefined;
            }
        }
        return undefined;
    }


    getUserRelatedCustomerIds() {
        return this.getFromSessionOrStorage("userRelatedCustomerIds", true);
    }

    setUserRelatedCustomerIds(relatedCustomerIds: any) {
        this.setToSessionAndLocalStorage("userRelatedCustomerIds", relatedCustomerIds, true);
    }

    getUserRelatedCustomers() {
        return this.getFromSessionOrStorage("userRelatedCustomers", true);
    }

    setUserRelatedCustomers(relatedCustomers: any) {
        this.setToSessionAndLocalStorage("userRelatedCustomers", relatedCustomers, true);
    }

    setUserInfo(userInfo: any) {
        this.setSessionData("userInfo", userInfo);
    }

    getUserInfo() {
        return this.getFromSessionOrStorage("userInfo", false);
    }

    getUserId() {
        return this.getFromSessionOrStorage("userId", false);
    }

    setUserId(userId: string) {
        this.setToSessionAndLocalStorage("userId", userId, false);
    }

    getUserToken() {
        return this.getFromSessionOrStorage("token", false);
    }

    setUserToken(token: string) {
        this.setToSessionAndLocalStorage("token", token, false);
    }

    getFacilityByUserSelect() {
        return this.getFromSessionOrStorage("selectedFacility", true);
    }

    setFacilityByUserSelect(facility: any) {
        this.setToSessionAndLocalStorage("selectedFacility", facility, true);
    }

    getCustomerIdByUserSelect() {
        return this.getFromSessionOrStorage("selectedCustomer", false);
    }

    setCustomerIdByUserSelect(customerId: string) {
        this.setToSessionAndLocalStorage("selectedCustomer", customerId, false);
    }

    getCurrentPanel() {
        return this.getFromSessionOrStorage("currentPanel", false);
    }



    getSsoMark() {
        return this.getFromSessionOrStorage("ssoMark", false);
    }

    setCurrentPanel(panelName: string) {
        this.setToSessionAndLocalStorage("currentPanel", panelName, false);
    }

    setSsoMark() {
        this.setToSessionAndLocalStorage("ssoMark", "sso", false);
    }

    getUserPermission() {
        return this.getFromSessionOrStorage("userPermissions", true);
    }

    setUserPermission(userPermissions: any) {
        this.setToSessionAndLocalStorage("userPermissions", userPermissions, true);
    }

    getCurrentCompanyFacility() {
        return this.getFromSessionOrStorage("companyFacility", true);
    }

    setCurrentCompanyFacility(companyFacility: any) {
        this.setToSessionAndLocalStorage("companyFacility", companyFacility, true);
    }

    getAssignedCompanyFacilities() {
        return this.getFromSessionOrStorage("assignedCompanyFacilities", true);
    }

    setAssignedCompanyFacilities(assignedCompanyFacilities: any) {
        this.setToSessionAndLocalStorage("assignedCompanyFacilities", assignedCompanyFacilities, true);
    }

    setAssignedInvoiceAppCompanyIds(invoiceAppCompanyIdsMappings: any) {
        this.setToSessionAndLocalStorage("invoiceAppCompanyIdsMappings", invoiceAppCompanyIdsMappings, true);
    }

    getAssignedInvoiceAppCompanyIds() {
        return  this.getFromSessionOrStorage("invoiceAppCompanyIdsMappings", true);
    }

    setAssignedInvoiceCustomerIds(invoiceCustomerIds: any) {
        this.setToSessionAndLocalStorage("invoiceCustomerIds", invoiceCustomerIds, true);
    }

    getAssignedInvoiceCustomerIds() {
        return  this.getFromSessionOrStorage("invoiceCustomerIds", true);
    }

    getFacilityAndCustomerRelation() {
        return this.getFromSessionOrStorage("facilityAndCustomerRelation", true);
    }

    setFacilityAndCustomerRelation(facilityAndCustomerRelation: any) {
        this.setToSessionAndLocalStorage("facilityAndCustomerRelation", facilityAndCustomerRelation, true);
    }

    getUserPanelData() {
        let panelData = this.getFromSessionOrStorage("userPanelData", true);
        if (panelData) {
            return panelData;
        } else {
            this.setUserDefaultPanelData();
        }
    }

    addUserPanelData(addPanelData: any) {
        let panelData = this.getFromSessionOrStorage("userPanelData", true);
        panelData = panelData.concat(addPanelData);
        this.setToSessionAndLocalStorage("userPanelData", panelData, true);
    }

    updateUserPanelData(panelData: any) {
        this.setToSessionAndLocalStorage("userPanelData", panelData, true);
    }

    setUserDefaultPanelData() {
    }

    clean() {
        this._sessionInfo = {};
        if (Storage !== undefined) {
            forEach(Object.keys(localStorage), function (key) {
                if (key.startsWith("cp-")) {
                    localStorage.removeItem(key);
                }
            });
        }
    }

    private getFromSessionOrStorage(key: string, isObject: boolean) {
        key = this.addPrefix(key);
        return this.getSessionData(key) || this.getFromStorageAndSetToSessionDataIfExist(key, isObject);
    }

    private setToSessionAndLocalStorage(key: string, value: any, isObject: boolean) {
        key = this.addPrefix(key);
        this.setSessionData(key, value);
        if (Storage !== undefined) {
            this.setToStorage(key, value, isObject);
        }
    }

    private getFromStorageAndSetToSessionDataIfExist(key: string, storedAsObject: boolean) {
        if (storedAsObject) {
            if (localStorage.getItem(key) !== null) {
                this.setSessionData(key, this.getItemFromStorage(key));
                return this.getSessionData(key);
            }
        } else {
            if (localStorage[key]) {
                this.setSessionData(key, localStorage[key]);
                return this.getSessionData(key);
            }
        }
        return null;
    }

    private setToStorage(key: string, value: any, storedAsObject: boolean) {
        if (storedAsObject)
            this.setItemToStorage(key, value);
        else
            localStorage[key] = value;
    }



    private setSessionData(key: string, value: any) {
        key = this.addPrefix(key);
        this._sessionInfo[key] = value;
    }

    private getSessionData(key: string): any {
        key = this.addPrefix(key);
        return (<any>this._sessionInfo)[key];
    }


    private removeSessionData(key: string) {
        delete this._sessionInfo[key];
    }

    private setItemToStorage(key: string, value: any) {
        if (value) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    private getItemFromStorage(key: string) {
        let item = localStorage.getItem(key);

        if (item !== null && typeof item === 'string') {
            let itemValue = null;
            try {
                itemValue = JSON.parse(item);
            } catch (err) {
            }
            return itemValue;
        } else {
            return item;
        }
    }

    private addPrefix(key: string) {
        if (!key.startsWith("cp-")) {
            key = "cp-" + key;
        }
        return key;
    }



}

export default new Session();