import Welcome from '@components/layout/welcome';
import DefaultMainLayout from '@components/layout/default-main-layout';
import SnLookUp from '@modules/wms/report/inventory/snLookUp/snLookUp';
import Activity from '@modules/wms/report/inventory/activity/activity';
import Adjustment from '@modules/wms/report/inventory/adjustment/adjustment';
import Aging from '@modules/wms/report/inventory/aging/aging';
import Status from '@modules/wms/report/inventory/status/status';
import InventoryDetail from '@modules/wms/report/inventory/status/inventory-detail/inventory-detail';
import InboundScheduledSummary from '@modules/wms/report/inbound/schedule-summary/schedule-summary';
import InboundReceivingSummary from '@modules/wms/report/inbound/receiving-summary/receiving-summary';
import InboundInquiry from '@modules/wms/report/inbound/inquiry/inquiry';
import OutboundInquiry from '@modules/wms/report/outbound/inquiry/inquiry';
import DropshipOBO from '@modules/wms/report/outbound/dropship-obo/dropship-obo';
import ReturnLabel from '@modules/wms/report/document/returnLabel/returnLabel';
import OrderEntry from '@modules/wms/report/outbound/order-entry/order-entry';
import CostCalculator from '@modules/wms/report/costCalculator/costCalculator';
import DashboardKpi from '@modules/wms/report/dashboard/kpi/kpi';
import historicalInventoryAging from '@modules/wms/report/inventory/historicalInventoryAging/historicalInventoryAging';
import SnActivityHistory from '@modules/wms/report/inventory/snActivityHistory/snActivityHistory';
import OrderUpdate from '@modules/wms/report/outbound/order-update/order-update';
import OrderUpdateView from '@modules/wms/report/outbound/order-update/order-update-view';
import ItemMaster from '@modules/wms/report/item-master/item-master';
import Deposit from '@modules/wms/report/deposit/deposit';
import ReceiptEntry from '@modules/wms/report/inbound/receipt-entry/receipt-entry';
import PutAwayReport from '@modules/wms/report/inbound/put-away-report/put-away-report';
import ItemLineLevelReport from '@modules/wms/report/outbound/itemLineLevel-report/itemLineLevel-report';
import OutboundScheduledSummary from '@modules/wms/report/outbound/schedule-summary/schedule-summary';
import OutboundShippingSummary from '@modules/wms/report/outbound/shipping-summary/shipping-summary';
import MakeAppointment from '@modules/wms/report/appointment/makeAppointment';
import EditAppointment from '@/modules/wms/report/appointment/editAppointment';
import Marketplace from '@/modules/wms/report/marketplace';

export const wmsRoutes = [{
    path: '/wms',
    name: 'Wms',
    component: DefaultMainLayout,
    children: [
      {
        path: '/',
        name: '/',
        component: Welcome,
        meta: {
          rootDirectory: true
        }
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: Welcome,
        meta: {
          rootDirectory: true
        }
      },
      {
        path: 'inventory/snLookUp',
        name: 'SnLookUp',
        component: SnLookUp,
        meta: {
          permissions: "Inventory::snLookUp_read"
        }
      },
      {
        path: 'inventory/snActivityHistory',
        name: 'SnActivityHistory',
        component: SnActivityHistory,
        meta: {
          permissions: "Inventory::snLookUp_read"
        }
      },
      {
        path: 'inventory/activity',
        name: 'Activity',
        component: Activity,
        meta: {
          permissions: "Inventory::itemActivity_read"
        }
      },
      {
        path: 'inventory/adjustment',
        name: 'Adjustment',
        component: Adjustment,
        meta: {
          permissions: "Inventory::adjustment_read"
        }
      },
      {
        path: 'inventory/aging',
        name: 'Aging',
        component: Aging,
        meta: {
          permissions: "Inventory::aging_read"
        }
      },
      {
        path: 'inventory/historicalInventoryAging',
        name: 'historicalInventoryAging',
        component: historicalInventoryAging,
        meta: {
          permissions: "Inventory::historicalInventoryAging_read"
        }
      },
      {
        path: 'inventory/status',
        name: 'Status',
        component: Status,
        meta: {
          permissions: "Inventory::status_read"
        }
      },
      {
        path: 'inventory/status/inventory/detail',
        name: 'InventoryDetail',
        component: InventoryDetail,
        meta: {
          permissions: "Inventory::status_read"
        }
      },
      {
        path: 'inbound',
        name: 'Inbound',
        component: Welcome,
        meta: {
          rootDirectory: true
        }
      },
      {
        path: 'inbound/Inquiry',
        name: 'InboundInquiry',
        component: InboundInquiry,
        meta: {
          permissions: "Inbound::inquiry_read"
        }
      },
      {
        path: 'inbound/schedule-summary',
        name: 'InboundScheduledSummary',
        component: InboundScheduledSummary,
        meta: {
          permissions: "Inbound::scheduleSummary_read"
        }
      },
      {
        path: 'inbound/receiving-summary',
        name: 'InboundReceivingSummary',
        component: InboundReceivingSummary,
         meta: {
          permissions: "Inbound::ReceivedSummary_read"
        }
      },
      {
        path: 'inbound/receipt-entry',
        name: 'ReceiptEntry',
        component: ReceiptEntry,
         meta: {
          permissions: "Inbound::ReceiptEntry_read"
        }
      },
      {
            path: 'inbound/put-away-report',
            name: 'PutAwayReport',
            component: PutAwayReport,
            meta: {
                permissions: "Inbound::PutAwayReport_read"
        }
      },
      {
        path: 'outbound',
        name: 'Outbound',
        component: Welcome,
        meta: {
          rootDirectory: true
        }
      },
      {
        path: 'outbound/Inquiry',
        name: 'OutboundInquiry',
        component: OutboundInquiry,
        meta: {
          permissions: "Outbound::inquiry_read"
        }
      },
      {
        path: 'outbound/itemLineLevel-report',
        name: 'ItemLineLevelReport',
        component: ItemLineLevelReport,
        meta: {
          permissions: "Inventory::status_read"
        }
      },
      {
        path: 'outbound/schedule-summary',
        name: 'OutboundScheduledSummary',
        component: OutboundScheduledSummary,
        meta: {
          permissions: "Outbound::scheduleSummary_read"
        }
      },
      {
        path: 'outbound/shipping-summary',
        name: 'OutboundShippingSummary',
        component: OutboundShippingSummary,
        meta: {
          permissions: "Outbound::shippigSummary_read"
        }
      },
      {
        path: 'outbound/order-update',
        name: 'OrderUpdate',
        component: OrderUpdate,
        meta: {
          permissions: "Outbound::orderUpdate_read"
        }
      },
      {
        path: 'outbound/order-update-view',
        name: 'OrderUpdateView',
        component: OrderUpdateView,
        meta: {
          permissions: "Outbound::orderUpdate_read"
        }
      },
      {
        path: 'itemMaster',
        name: 'ItemMaster',
        component: ItemMaster,
        meta: {
          permissions: "ItemMaster::itemMaster_read"
        }
      },
      {
        path: 'deposit',
        name: 'Deposit',
        component: Deposit,
        meta: {
          permissions: "Deposit::deposit_read"
        }
      },
      {
        path: 'outbound/order-entry',
        name: 'OrderEntry',
        component: OrderEntry,
        meta: {
          permissions: "Outbound::OrderEntry_read"
        }
      },
      {
        path: 'outbound/dropship-obo',
        name: 'DropshipOBO',
        component: DropshipOBO,
        meta: {
          permissions: "outbound::dropshipOBO_write"
        }
      },
      {
        path: 'costCalculator',
        name: 'CostCalculator',
        component: CostCalculator,
        meta: {
          permissions: "CostCalculator::CostCalculator_read"
        }
      },
      {
        path: 'dashboard/kpi',
        name: 'DashboardKpi',
        component: DashboardKpi,
        meta: {
          permissions: "dashboard::KPIByCustomer_read"
        }
      },
      {
        path: 'document/returnLabel',
        name: 'ReturnLabel',
        component: ReturnLabel,
        meta: {
          permissions: "document::returnLabel_read"
        }
      },
      {
        path: 'appointment',
        name: 'Appointment',
        component: Welcome,
        meta: {
          rootDirectory: true
        }
      },
      {
          path: 'appointment/makeAppointment',
          name: 'MakeAppointment',
          component: MakeAppointment,
          meta: {
            permissions: "facility::appointmentMake_read"
          }
      },
      {
        path: 'appointment/editAppointment',
        name: 'EditAppointment',
        component: EditAppointment,
        meta: {
          permissions: "facility::appointmentMake_read"
        }
      },
      {
        path: 'Marketplace',
        name: 'Marketplace',
        component: Marketplace,
        meta: {
          permissions: "marketplace::marketplace_read"
        }
      }
    ]
}];