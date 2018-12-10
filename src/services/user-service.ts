 import BaseService from "./_base-service";
 import { Observable } from 'rxjs/Observable';


 class UserService extends BaseService {

    login(user: any) {
        return this.resource$.post<any>("/idm-app/user/login", {username: user.username, password: user.password, channel: "Web", returnUserPermissions: ["WEB"]});
    }

    logout(token: string) {
        return this.resource$.post("/idm-app/user/logout", {oauthToken: token});
    }

    getUser(userId: string) {
        return this.resource$.get<any>(`/idm-app/user/${userId}`);
    }
 }

 let userService =  new UserService();
 export default userService;