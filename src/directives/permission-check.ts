import util from '@shared/util';
import session from '@shared/session';
let permissionCheck = {
    install: function (vue: any) {
        vue.directive("permission-check", permissionCheckFun);
    }
};

let permissionCheckFun = function (el: any, binding: any) {
    if (el.style.display === "none") return;
    let permissions = binding.value;
    if (permissions) {
        if (!util.judgeIfHasPermission(permissions, session.getUserPermission())) {
            el.setAttribute("style", "display:none");
        }
    }
};



export default permissionCheck;