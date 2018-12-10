import Vue from 'vue';
import Router from 'vue-router';
import Login from '../modules/login/login';
import Inbound from '../modules/wms/order/inbound/inbound';
import MyOrders from '../modules/wms/order/my-orders/my-orders';
import Demo from '../modules/demo/demo';
import Welcome from '../components/layout/welcome';
import DefaultMainLayout from '../components/layout/default-main-layout';
import Activity from '../modules/wms/report/inventory/activity/activity';
import Adjustment from '../modules/wms/report/inventory/adjustment/adjustment';
import Aging from '../modules/wms/report/inventory/aging/aging';
import Status from '../modules/wms/report/inventory/status/status';
import InventoryDetail from '../modules/wms/report/inventory/status/inventory-detail/inventory-detail';
import Scheduled from '../modules/wms/report/inbound/scheduled/scheduled';
import Receipt from '../modules/wms/report/inbound/receipt/receipt';
import OutboundScheduled from '../modules/wms/report/outbound/scheduled/scheduled';
import OutboundShipping from '../modules/wms/report/outbound/shipping/shipping';
import Tracking from '../modules/tms/tools/tracking/tracking';
import ShipmentActivity from '../modules/tms/app/transportation/shipment-activity/shipment-activity';
import Inventory from '../modules/wms/inventory/inventorySearch';
import InventoryTable from '../modules/wms/inventory/inventoryTable';
import auth from "../shared/auth";


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
      path: '/demo',
      name: 'Demo',
      component: Demo
    },
    { path: '/tms',
    name: 'Tms',
    component: DefaultMainLayout,
      children: [
        {
          path: '/',
          name: '/',
          component: Welcome,

        }, {
          path: 'tool',
          name: 'Welcome',
          component: Welcome,
        },  {
              path: 'transportation/shipping',
              name: 'ShipmentActivity',
              component: ShipmentActivity,
          },
          {
              path: 'tools/tracking',
              name: 'Tracking',
              component: Tracking,
          },
      ]
    },
    {
      path: '/wms',
      name: 'Wms',
      component: DefaultMainLayout,
      children: [
        {
          path: '/',
          name: '/',
          component: Welcome,

        }, {
          path: 'report',
          name: 'Report',
          component: Welcome,
        },
        {
          path: 'report/activity',
          name: 'Activity',
          component: Activity,

        }, {
          path: 'report/adjustment',
          name: 'Adjustment',
          component: Adjustment,
        }, {
          path: 'report/aging',
          name: 'Aging',
          component: Aging,
        }, {
          path: 'report/status',
          name: 'Status',
          component: Status,
        }, {
          path: 'report/status/inventory/detail',
          name: 'InventoryDetail',
          component: InventoryDetail,
        }, {
          path: 'report/scheduled',
          name: 'Scheduled',
          component: Scheduled,
        }, {
          path: 'report/receipt',
          name: 'Receipt',
          component: Receipt,
        }, {
          path: 'report/outbound/scheduled',
          name: 'OutboundScheduled',
          component: OutboundScheduled,
        },
        {
          path: 'report/outbound/shipping',
          name: 'OutboundShipping',
          component: OutboundShipping,
        },
        {
          path: 'inventory',
          name: 'Inventory',
          component: Inventory,
        },
        {
          path: 'inventoryTable',
          name: 'InventoryTable',
          component: InventoryTable,
        },
        {
          path: 'inbound',
          name: 'Inbound',
          component: Inbound,
          meta: {
            category: SHIPMENT
          }
        },
        {
          path: 'my-orders',
          name: 'MyOrders',
          component: MyOrders,
          meta: {
            category: SHIPMENT
          }
        }
      ]
    }

  ]
});


router.beforeEach(async (to, from, next) => {

  if (to.name === 'Login') {
    next();
  } else {
    if (auth.isSignIn()) {
      await auth.initialRequiredUserInfo();
      next();
    } else {
      next({ replace: true, name: 'Login' });
    }
  }

});

export default router;
