import BaseService  from  '../_base-service';
import session from '../../shared/session';

class Tms4axios extends BaseService  {
    public get<T>(url: string, queryParams?: object, headers?: object) {
        queryParams = this._addTokenAndUserInfo(queryParams);
        return this.resource$.get<T>(this._addDomainToUrl(url), queryParams, headers);
    }

    public post<T>(url: string, body: object, queryParams?: object, headers?: object) {
        body = this._addTokenAndUserInfo(body);
        return this.resource$.post<T>(this._addDomainToUrl(url),  body, queryParams, headers);
    }

    public put<T>(url: string, body: object, queryParams?: object, headers?: object) {
        body = this._addTokenAndUserInfo(body);
        return this.resource$.put<T>(this._addDomainToUrl(url), body, queryParams, headers);
    }

    public patch<T>(url: string, body: object, queryParams?: object, headers?: object) {
        body = this._addTokenAndUserInfo(body);
        return this.resource$.patch<T>(this._addDomainToUrl(url), body, queryParams, headers);
    }

    public delete(url: string, queryParams?: object, headers?: object) {
        queryParams = this._addTokenAndUserInfo(queryParams);
        return this.resource$.delete(this._addDomainToUrl(url), queryParams, headers);
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
        let token = session.getUserToken();
        let idmUserId = session.getUserId();
        Object.assign(queryParams, {UserToken: token, UserID: idmUserId});
        return queryParams;
    }

}

let Tms4ax =  new Tms4axios();
export default Tms4ax;



