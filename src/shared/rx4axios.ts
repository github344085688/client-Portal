import { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios';
import ax from './axios';
import { Observable } from 'rxjs/Observable';

export interface RxiosConfig extends AxiosRequestConfig {
  localCache?: boolean;
}

class Rx4axios {
  private _httpClient: AxiosInstance;

  constructor(private options: RxiosConfig = {}) {
    this._httpClient = ax;
  }

  private _makeRequest<T>(method: string, url: string, queryParams?: object, body?: object, headers?: object) {
    let request: AxiosPromise<T>;
    switch (method) {
      case 'GET':
        request = this._httpClient.get<T>(url, {params: queryParams, headers});
        break;
      case 'POST':
        request = this._httpClient.post<T>(url, body, {params: queryParams, headers});
        break;
      case 'PUT':
        request = this._httpClient.put<T>(url, body, {params: queryParams, headers});
        break;
      case 'PATCH':
        request = this._httpClient.patch<T>(url, body, {params: queryParams, headers});
        break;
      case 'DELETE':
        request = this._httpClient.delete(url, {params: queryParams, headers});
        break;

      default:
        throw new Error('Method not supported');
    }
    return new Observable<T>(subscriber => {
      request.then(response => {
        subscriber.next(response.data);
        subscriber.complete();
      }).catch((err: Error) => {
        subscriber.error(err);
        subscriber.complete();
      });
    });
  }

  public get<T>(url: string, queryParams?: object, headers?: object) {
    return this._makeRequest<T>('GET', url, queryParams, headers);
  }

  public post<T>(url: string, body: object, queryParams?: object, headers?: object) {
    return this._makeRequest<T>('POST', url, queryParams, body, headers);
  }

  public put<T>(url: string, body: object, queryParams?: object, headers?: object) {
    return this._makeRequest<T>('PUT', url, queryParams, body, headers);
  }

  public patch<T>(url: string, body: object, queryParams?: object, headers?: object) {
    return this._makeRequest<T>('PATCH', url, queryParams, body, headers);
  }

  public delete(url: string, queryParams?: object, headers?: object) {
    return this._makeRequest('DELETE', url, queryParams, headers);
  }
}

let Rx4ax =  new Rx4axios();
export default Rx4ax;