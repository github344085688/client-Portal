
import session from "../../session";
import router from '../../../router/router';

let errorHandlerInterceptor = function (error: any) {

    if (error.response.status === 401) {
        session.clean();
        router.replace({name: 'Login'});
    }
    return Promise.reject(error);
};

export default errorHandlerInterceptor;