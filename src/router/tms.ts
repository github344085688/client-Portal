import Welcome from '@components/layout/welcome';
import DefaultMainLayout from '@components/layout/default-main-layout';
import Tracking from '@modules/tms/tools/tracking/tracking';
import ShipmentActivity from '@modules/tms/app/transportation/shipment-activity/shipment-activity';
import Invoice from '@modules/tms/app/transportation/invoice/invoice';
import GetQuote from '@modules/tms/app/transportation/get-quote/get-quote';
import MyShipment from '@modules/tms/app/transportation/get-quote/my-shipment';
import DriverManager from '@modules/tms/app/driver-manager/list/driverList';
import TerminalList from '@modules/tms/app/terminal/list/terminal';
import NewTerminal from "@modules/tms/app/terminal/newTerminal/newTerminal";
import TerminalDetail from "@modules/tms/app/terminal/terminalDetail/terminalDetail";
import TerminalZoneList from "@modules/tms/app/terminal/terminalZoneList/terminalZoneList";
import TerminalZone from "@modules/tms/app/terminal/terminalZone/terminalZone";
import TerminalMatrix from "@modules/tms/app/terminal/terminalMatrix/terminalMatrix";
import TmsMessageCenter from "@modules/tms/app/tms-message-center/tmsMessageCenter";

export const tmsRoutes = [{
    path: '/tms',
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
      }, {
        path: 'transportation/shipping',
        name: 'ShipmentActivity',
        component: ShipmentActivity,
      },
      {
        path: 'transportation/Invoice',
        name: 'Invoice',
        component: Invoice,
      },
      {
        path: 'tools/tracking',
        name: 'Tracking',
        component: Tracking,
      }, {
        path: 'app',
        name: 'App',
        component: Welcome,
      }, {
        path: 'transportation/get-quote/',
        name: 'GetQuote',
        component: GetQuote,
      }, {
        path: 'app/my-shipment/',
        name: 'MyShipment',
        component: MyShipment,
      }, {
        path: 'transportation/driver-manager/',
        name: 'DriverManager',
        component: DriverManager,
        meta: {
          permissions: 'driverManager::driverManager_read'
        }
      }, {
        path: '/transportation/terminal-list/',
        name: 'TerminalList',
        component: TerminalList,
      }, {
        path: '/transportation/new-terminal/:id',
        name: 'NewTerminal',
        component: NewTerminal,
      }, {
        path: '/transportation/terminal/:id',
        name: 'TerminalDetail',
        component: TerminalDetail,
      }, {
        path: '/transportation/terminal-zone/:id',
        name: 'TerminalZone',
        component: TerminalZone,
      },
      {
        path: '/transportation/terminal-zone-list',
        name: 'TerminalZoneList',
        component: TerminalZoneList,
      },
      {
        path: '/transportation/terminal-matrix',
        name: 'TerminalMatrix',
        component: TerminalMatrix,
        props: (route: any) => ({query: {
            id: route.query.id,
            location: location
        }})
      },
      {
        path: '/transportation/message-center',
        name: 'TmsMessageCenter',
        component: TmsMessageCenter,
      }
    ]
}];