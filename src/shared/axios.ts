import session from './session';
import axios from 'axios';
import router from '../router/router';
import appendAppUrlPrefixInterceptor  from "./interceptor/request/appendAppUrlPrefixInterceptor";
import addCompanyFacilityHeaderInterceptor from "./interceptor/request/addCompanyFacilityHeaderInterceptor";
import addTokenToHeader from "./interceptor/request/addTokenInterceptor";
import errorHandlerInterceptor from "./interceptor/response/errorHandlerInterceptor";

let ax = axios.create();


ax.interceptors.request.use(appendAppUrlPrefixInterceptor);
ax.interceptors.request.use(addCompanyFacilityHeaderInterceptor);
ax.interceptors.request.use(addTokenToHeader);
ax.interceptors.response.use(response => response, errorHandlerInterceptor);


export default ax;

