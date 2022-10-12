
import session from '@shared/session';
import { Rx4axios, RxiosConfig } from '@shared/rx4axios';
import axios, { AxiosInstance } from 'axios';
import errorHandlerInterceptor from "@shared/interceptor/response/errorHandlerInterceptor";

class Tms4axios extends Rx4axios  {

    constructor(axios: AxiosInstance, options: RxiosConfig = {}) {
         super(axios, options);
    }

    public get<T>(url: string, queryParams?: object, headers?: object) {
        queryParams = this._addTokenAndUserInfo(queryParams);
        headers = this._addTokenToHeader(headers);
        return super.get<T>(this._addDomainToUrl(url), queryParams, headers);
    }

    public post<T>(url: string, body: object, queryParams?: object, headers?: object) {
        body = this._addTokenAndUserInfo(body);
        headers = this._addTokenToHeader(headers);
        return super.post<T>(this._addDomainToUrl(url),  body, queryParams, headers);
    }

    public put<T>(url: string, body: object, queryParams?: object, headers?: object) {
        body = this._addTokenAndUserInfo(body);
        headers = this._addTokenToHeader(headers);
        return super.put<T>(this._addDomainToUrl(url), body, queryParams, headers);
    }

    public patch<T>(url: string, body: object, queryParams?: object, headers?: object) {
        body = this._addTokenAndUserInfo(body);
        headers = this._addTokenToHeader(headers);
        return super.patch<T>(this._addDomainToUrl(url), body, queryParams, headers);
    }

    public delete(url: string, queryParams?: object, headers?: object) {
        queryParams = this._addTokenAndUserInfo(queryParams);
        headers = this._addTokenToHeader(headers);
        return super.delete(this._addDomainToUrl(url), queryParams, headers);
    }

    private _addTokenToHeader(headers?: object) {
        headers = headers || {};
        let token = session.getUserToken();
        Object.assign(headers, {'User-Authorization': token});
        return headers;
    }

    private _addDomainToUrl(url: string) {
        let temp_url = url;
        if (temp_url && temp_url.toLowerCase().startsWith('http')) {
            return url;
        } else {
            return TMS_DOMAIN + url;
        }
    }

    private  _addTokenAndUserInfo(queryParams?: object) {
        queryParams = queryParams || {};
        let idmUserId = session.getUserId();
        Object.assign(queryParams, {UserID: idmUserId});
        return queryParams;
    }

}

let axios4Tms =  axios.create();
axios4Tms.interceptors.response.use(response => response, errorHandlerInterceptor);

let Tms4ax =  new Tms4axios(axios4Tms);
export default Tms4ax;


