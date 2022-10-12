
import WISEConfig from '../../config';
import session from '../../session';
import { AxiosRequestConfig } from 'axios';

let appendAppUrlPrefixInterceptor = function appendAppUrlPrefix(config: AxiosRequestConfig): AxiosRequestConfig {
    let currentCF = session.getFacilityByUserSelect();
    let url = config.url;
    if (url) {
        if (url.startsWith("/fd-app/") || url.startsWith("/idm-app/") || url.startsWith("/print-app/") || url.startsWith("/file-app/") || url.startsWith("/push-app/")) {
            url = "/shared" + url;
        } else if (url.startsWith("/bam/") || url.startsWith("/report-center/") || url.startsWith("/base-app/") || url.startsWith("/wms-app/") || url.startsWith("/yms-app/") || url.startsWith("/inventory-app/")) {
            if (currentCF) {
                if (currentCF.accessUrl) {
                    if (url.startsWith('/report-center/') && WISEConfig.reportCenterPath) {
                        url = "/" + currentCF.accessUrl + WISEConfig.reportCenterPath + url;
                    } else {
                        url = "/" + currentCF.accessUrl + url;
                    }
                }
                else if (config.headers && config.headers['accessUrl']) {
                    if (url.startsWith('/report-center/') && WISEConfig.reportCenterPath) {
                        url = "/" + config.headers['accessUrl'] + WISEConfig.reportCenterPath + url;
                    } else {
                        url = "/" + config.headers['accessUrl'] + url;
                    }
                }
                else if (config.data && config.data.facilityName) {
                    if (url.startsWith('/report-center/') && WISEConfig.reportCenterPath) {
                        url = "/" + config.data.facilityName + WISEConfig.reportCenterPath + url;
                    } else {
                        url = "/" + config.data.facilityName + url;
                    }
                }
            } else {
                throw {
                    response: {
                        data: { error: 'Can not find activity facility for current customer.' },
                        headers: {}
                    }
                };
            }
        }
    }
    config.url = WISEConfig.apiContextPath + url;
    return config;

};

export default appendAppUrlPrefixInterceptor;