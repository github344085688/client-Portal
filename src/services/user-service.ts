 import BaseService from "./_base-service";
 import { Observable } from 'rxjs/Observable';
 import * as _ from "lodash";
 import session from "@shared/session";


 class UserService extends BaseService {

    login(user: any) {
        return this.resource$.post<any>("/idm-app/user/login", {username: user.username, password: user.password, channel: "CLIENT PORTAL", returnUserPermissions: ["WEB"]});
    }

    logout(token: string) {
        return this.resource$.post("/idm-app/user/logout", {oauthToken: token});
    }

    getUser(userId: string) {
        return this.resource$.get<any>(`/idm-app/user/${userId}`);
    }

    searchUsers(params: any) {
        return this.resource$.post<any>('/idm-app/user/search', params);
    }

    getUserIdByToken(token: string) {
        let param = {
            requestedEndpoint: "",
            token: token
        };
        return this.resource$.post<any>('/idm-app/user/authorize', param);
    }

    getUserPermissions(idmUserId: any) {
        return this.resource$.post<any>(`/idm-app/user/${idmUserId}/permission`, ["WEB", "ALL"]);
    }

 }

 let userService =  new UserService();
 export default userService;