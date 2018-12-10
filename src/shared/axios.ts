import session from './session';
import axios, { AxiosRequestConfig } from 'axios';
import router from '../router/router';
import WISEConfig from './config';

let ax = axios.create();



ax.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.url = appendUrlPrefixBaseOnAppAndWarehouse(config.url);
    addCompanyAndFacilityIdToHeader(config);
    addTokenToHeader(config);

    return config;
  });

  ax.interceptors.response.use(function (response) {
    return response;
  }, function (error) {

    if (error.response.status === 401) {
        session.clean();
        router.replace({name: 'Login'});
    }
    return Promise.reject(error);
  });


  function appendUrlPrefixBaseOnAppAndWarehouse(url: string|undefined): string|undefined {
    let currentCF = session.getCurrentCompanyFacility();
    if (url) {
        if (url.startsWith("/fd-app/") || url.startsWith("/idm-app/") || url.startsWith("/print-app/") || url.startsWith("/file-app/") || url.startsWith("/push-app/")) {
           url = "/shared" + url;
        } else if (url.startsWith("/bam/") || url.startsWith("/base-app/") || url.startsWith("/wms-app/") || url.startsWith("/yms-app/") || url.startsWith("/inventory-app/")) {
            if (currentCF) {
                url = "/" + currentCF.facility.accessUrl + url;
            }
        }
    }
    return WISEConfig.apiContextPath + url;
  }

  function addTokenToHeader(config: AxiosRequestConfig) {
     config.headers = config.headers || {};
     config.headers.Authorization = session.getUserToken();
  }

  async function  addCompanyAndFacilityIdToHeader(config: AxiosRequestConfig)  {
    let currentCF = await session.getCurrentCompanyFacility();
    config.headers = config.headers || {};
    if (!config.headers["WISE-Company-Id"]) {
        if (config.data && config.data.wiseCompanyId) {
            config.headers["WISE-Company-Id"] = config.data.wiseCompanyId;
        } else {
            if (currentCF) {
                config.headers["WISE-Company-Id"] = currentCF.company.id;
            }
        }
    }

    if (currentCF) {
        config.headers["WISE-Facility-Id"] = currentCF.facility.id;
    }
  }


export default ax;

