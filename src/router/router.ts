import Vue from 'vue';
import Router from 'vue-router';
import util from '@shared/util';
import session from '@shared/session';
import Login from '@modules/login/login';
import auth from "@shared/auth";
import Sso from '@components/layout/sso';

import { wmsRoutes } from './wms';
import { tmsRoutes } from './tms';
import { controlPanelRoutes } from './controlPanel';
import { idmRoutes } from './idm';

const SHIPMENT = 'SHIPMENT';
Vue.use(Router);
let router = new Router({
  routes: [
    {
      path: '/',
      redirect: { name: 'Login' }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/sso',
      name: 'sso',
      component: Sso,
    },
    ...wmsRoutes,
    ...tmsRoutes,
    ...controlPanelRoutes,
    ...idmRoutes
  ]
});


router.beforeEach(async (to, from, next) => {
  if (to.matched.length > 0) {
    if (to.name === 'Login' || to.name === 'sso') {
      next();
    } else {
      if (auth.isSignIn()) {
        await auth.initialRequiredUserInfo();
        let isWms = to.fullPath.indexOf('wms');
        let isControlPanel = to.fullPath.indexOf('control-panel');
        if (isControlPanel > -1) {
          let systemChat = <HTMLImageElement>document.querySelector('.zopim');
          if (systemChat) {
            systemChat.style.display = 'none';
          }
        } else {
          let systemChat = <HTMLImageElement>document.querySelector('.zopim');
          if (systemChat) {
            systemChat.style.display = 'block';
          }
        }
        if (isWms && !util.judgeIfHasPermission(to.meta.permissions, session.getUserPermission()) && !to.meta.rootDirectory) {
          next({ replace: true, name: 'Login' });
        } else if (isControlPanel && !util.judgeIfHasPermission(to.meta.permissions, session.getUserPermission())) {
          next({ replace: true, name: 'Login' });
        } else {
          next();
        }
      } else {
        next({ replace: true, name: 'Login' });
      }
    }
  } else {
    next({ replace: true, name: 'Login' });
  }

});

export default router;
