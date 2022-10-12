import Welcome from '@components/layout/welcome';
import DefaultMainLayout from '@components/layout/default-main-layout';
import IdManagement from "@modules/idm/id-management/index";

export const idmRoutes = [{
    path: '/idm',
    name: 'Idm',
    component: DefaultMainLayout,
    children: [
      {
        path: '/',
        name: '/',
        component: Welcome,

      },
      {
        path: 'idManagement',
        name: 'IdManagement',
        component: IdManagement
      }
    ]
}];