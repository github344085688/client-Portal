import { AxiosRequestConfig } from 'axios';
import session from '../../session';
let AddWISETokenInterceptor = function(config: AxiosRequestConfig) {
    config.headers = config.headers || {};
    config.headers.Authorization = session.getUserToken();
    return config;
};

export default AddWISETokenInterceptor;