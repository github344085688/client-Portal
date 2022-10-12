
import { AxiosRequestConfig } from 'axios';
import session from '../../session';

let AddCompanyAndFacilityIdToHeaderInterceptor = async function (config: AxiosRequestConfig) {
    let currentCF = await session.getCurrentCompanyFacility();
    let user = await session.getUserInfo();
    let apiUrl: any = config.url;
    config.headers = config.headers || {};
    if (!config.headers["WISE-Company-Id"]) {
        if (config.data && config.data.wiseCompanyId) {
            config.headers["WISE-Company-Id"] = config.data.wiseCompanyId;
        } else {
            if (currentCF) {
                config.headers["WISE-Company-Id"] = currentCF.companyId;
            }
        }
    }

    if (currentCF) {
        config.headers["WISE-Facility-Id"] = currentCF.facilityId;
        if (config.data && config.data['excludeFacility']) {
            delete config.headers["WISE-Facility-Id"];
        }
    }
    if (config.data && config.data.facilityId) {
        config.headers["WISE-Facility-Id"] = config.data.facilityId;
    }
    if (user) {
        if (apiUrl.indexOf('cpapi') >= 0) {
            config.headers["x-login-username"] = user.ssoUsername;
        } else {
            config.headers["x-login-username"] = user.username;
        }
    }
    return config;
};

export default AddCompanyAndFacilityIdToHeaderInterceptor;