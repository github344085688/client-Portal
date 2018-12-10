
import userService from "../services/user-service";
import companyService from "../services/company-service";
import facilityService from "../services/facility-service";
import errorHanlder from './error-handler';

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


    getUserRelatedCustomerId() {
        return this.getFromSessionOrStorage("userRelatedCustomerId", false);
    }

    setUserRelatedCustomerId(relatedCustomerId: string) {
        this.setToSessionAndLocalStorage("userRelatedCustomerId", relatedCustomerId, false);
    }

    setUserInfo(userInfo: any) {
        this.setSessionData("userInfo", userInfo);
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



    getSsoMark() {
        return this.getFromSessionOrStorage("ssoMark", false);
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

    clean() {
        this._sessionInfo = {};
        if (Storage !== undefined) {
            localStorage.clear();
        }
    }

    private getFromSessionOrStorage(key: string, isObject: boolean) {
        return this.getSessionData(key) || this.getFromStorageAndSetToSessionDataIfExist(key, isObject);
    }

    private setToSessionAndLocalStorage(key: string, value: any, isObject: boolean) {
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
        this._sessionInfo[key] = value;
    }

    private getSessionData(key: string): any {
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

}

export default new Session();