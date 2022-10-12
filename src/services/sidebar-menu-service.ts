import BaseService from "./_base-service";

class SideBarService extends BaseService {

  tools() {
    return [
      {
        "title": "Tools",
        "display": "none",
        "state": "TMS-Tools",
        "url": "",
        "subMenu": [
          {
            "title": "Tracking",
            // "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/dashboard.png",
            "url": "",
            "state": "TMS-Tools.Tracking",
            "routerName": "Tracking",
            "display": "none",
          }
        ]
      }
    ];
  }

  transportation() {
    return [
      {
        "title": "Transportation",
        "display": "none",
        "state": "TMS",
        "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/vehicles.png",
        "url": "",
        "subMenu": [
          {
            "title": "Shipment Activity",
            // "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/dashboard.png",
            "url": "",
            "state": "TMS.ShipmentActivity",
            "routerName": "ShipmentActivity",
            "display": "none",
          },
          {
            "title": "Invoice",
            "imgSrc": "",
            "url": "",
            "state": "TMS.Invoice",
            "routerName": "Invoice",
            "display": "none",
          }
          , {
            "title": "Get a Quote",
            "imgSrc": "",
            "url": "",
            "state": "TMS.GetQuote",
            "routerName": "GetQuote",
            "display": "none",
          }
        ]
      },
      {
        "title": "Terminals",
        "display": "none",
        "state": "Terminal",
        "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/terminal.png",
        "url": "",
        "subMenu": [
          {
            "title": "Terminals",
            "url": "",
            "state": "Terminal.Terminals",
            "routerName": "TerminalList",
            "display": "none",
          }
          ,
          {
            "title": "Transit zones",
            "url": "",
            "state": "Terminal.TerminalZoneList",
            "routerName": "TerminalZoneList",
            "display": "none",
          },
          {
            "title": "Transit matrix",
            "url": "",
            "state": "Terminal.TerminalMatrix",
            "routerName": "TerminalMatrix",
            "display": "none",
          }
        ]
      },
      {
        "title": "Driver Manager",
        "display": "none",
        "state": "TmsDriver",
        "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/drivers.png",
        "url": "",
        "routerName": "DriverManager",
        "permissions": "driverManager::driverManager_read"
      },
      {
        "title": "Message Center",
        "display": "none",
        "state": "TmsMessage",
        "url": "",
        "routerName": "TmsMessageCenter",
        "permissions": "tmsMessageCenter::tmsMessageCenter_read"
      },
    ];
  }
  warehousing() {
    return [
      {
        "title": "Inbound",
        "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/inbound.png",
        "state": "Inbound",
        "display": "none",
        "subMenu": [
          {
            "title": "Inquiry",
            "routerName": "InboundInquiry",
            "display": "none",
            "state": "Inbound.InboundInquiry",
            "permissions": "Inbound::inquiry_read"
          },
          {
            "title": "Schedule Summary",
            "routerName": "InboundScheduledSummary",
            "display": "none",
            "state": "Inbound.InboundScheduledSummary",
            "permissions": "Inbound::scheduleSummary_read"
          },
          {
            "title": "Received  Summary",
            "routerName": "InboundReceivingSummary",
            "display": "none",
            "state": "Inbound.InboundReceivingSummary",
            "permissions": "Inbound::ReceivedSummary_read"
          },
          {
            "title": "Receipt Entry",
            "routerName": "ReceiptEntry",
            "display": "none",
            "state": "Inbound.ReceiptEntry",
            "permissions": "Inbound::ReceiptEntry_write"
          },
          {
            "title": "Put Away Report",
            "routerName": "PutAwayReport",
            "display": "none",
            "state": "Inbound.PutAwayReport",
            "permissions": "Inbound::PutAwayReport_read"
          }
        ]
      },
      {
        "title": "Outbound",
        "state": "Outbound",
        "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/outbound.png",
        "display": "none",
        "subMenu": [
          {
            "title": "Inquiry",
            "display": "none",
            "routerName": "OutboundInquiry",
            "state": "Outbound.OutboundInquiry",
            "permissions": "Outbound::inquiry_read"
          },
          {
            "title": "Schedule Summary",
            "routerName": "OutboundScheduledSummary",
            "display": "none",
            "state": "Outbound.OutboundScheduledSummary",
            "permissions": "Outbound::scheduleSummary_read"
          },
          {
            "title": "Shipped Summary",
            "routerName": "OutboundShippingSummary",
            "display": "none",
            "state": "Outbound.OutboundShippingSummary",
            "permissions": "Outbound::shippigSummary_read"
          },
          {
            "title": "Order Carrier Update",
            "routerName": "OrderUpdate",
            "display": "none",
            "state": "Outbound.OrderUpdate",
            "permissions": "Outbound::orderUpdate_read"
          },
          {
            "title": "Order Entry",
            "routerName": "OrderEntry",
            "display": "none",
            "state": "Outbound.OrderEntry",
            "permissions": "Outbound::OrderEntry_write"
          },
          {
            "title": "Dropship OBO",
            "routerName": "DropshipOBO",
            "display": "none",
            "state": "Outbound.DropshipOBO",
            "permissions": "outbound::dropshipOBO_write"
          },
          // {
          //   "title": "Generic Transload Report",
          //   "routerName": "GenericTransloadReport",
          //   "display": "none",
          //   "state": "Outbound.GenericTransloadReport",
          //   "permissions": "outbound::genericTransloadReport_read"
          // }
          // {
          //   "title": "Schedule",
          //   "display": "none",
          //   "routerName": "OutboundScheduled",
          //   "state": "Outbound.OutboundScheduled",
          // }, {
          //   "title": "Shipping",
          //   "display": "none",
          //   "routerName": "OutboundShipping",
          //   "state": "Outbound.OutboundShipping",
          // },

        ]
      },
      {
        "title": "Inventory",
        "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/inventory.png",
        "url": "",
        "state": "Inventory",
        "display": "block",
        "subMenu": [
          {
            "title": "SN Lookup",
            "display": "none",
            "routerName": "SnLookUp",
            "state": "Inventory.SnLookUp",
            "permissions": "Inventory::snLookUp_read"
          },
          {
            "title": "Item Activity",
            "display": "none",
            "routerName": "Activity",
            "state": "Inventory.Activity",
            "permissions": "Inventory::itemActivity_read"
          },
          {
            "title": "Adjustment",
            "display": "none",
            "routerName": "Adjustment",
            "state": "Inventory.Adjustment",
            "permissions": "Inventory::adjustment_read"
          },
          {
            "title": "Current Onhand Inventory Aging Report",
            "routerName": "Aging",
            "display": "none",
            "state": "Inventory.Aging",
            "permissions": "Inventory::aging_read"
          },
          {
            "title": "Historical Inventory Aging Report",
            "routerName": "historicalInventoryAging",
            "display": "none",
            "state": "Inventory.historicalInventoryAging",
            "permissions": "Inventory::historicalInventoryAging_read"
          },
          {
            "title": "Status",
            "routerName": "Status",
            "display": "none",
            "state": "Inventory.Status",
            "permissions": "Inventory::status_read"
          }
          // {
          //   "title": "Search",
          //   "routerName": "Search",
          //   "display": "none",
          //   "state": "Inventory.Search",
          // }
        ]
      },
      {
          "title": "Item Master",
          "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/item.png",
          "url": "",
          "state": "ItemMaster",
          "display": "none",
          "routerName": "ItemMaster",
          "permissions": "ItemMaster::itemMaster_read",
          "subMenu": []
      },
      {
        "title": "Appointment",
        "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/item.png",
        "url": "",
        "state": "Appointment",
        "display": "block",
        "subMenu": [{
          "title": "Make Appointment",
          "display": "none",
          "routerName": "MakeAppointment",
          "state": "cf.facility.appointment.makeAppointment",
          "permissions": "facility::appointmentMake_read"
        }]
      },
      {
        "title": "Billing",
        "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/deposit.png",
        "url": "",
        "state": "Deposit",
        "display": "none",
        "routerName": "Deposit",
        "permissions": "Deposit::deposit_read",
        "subMenu": []
      },
      {
        "title": "Cost Calculator",
        "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/calculator.png",
        "url": "",
        "state": "CostCalculator",
        "display": "none",
        "routerName": "CostCalculator",
        "permissions": "CostCalculator::CostCalculator_read",
        "subMenu": []
      },
      {
        "title": "Dashboard",
        "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/dashboard.png",
        "url": "",
        "state": "Dashboard",
        "display": "block",
        "subMenu": [
          {
            "title": "KPI",
            "display": "none",
            "routerName": "DashboardKpi",
            "state": "Dashboard.Kpi",
            "permissions": "dashboard::KPIByCustomer_read"
          },
        ]
      },
      {
        "title": "Document",
        "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/document.png",
        "url": "",
        "state": "Document",
        "display": "block",
        "subMenu": [
          {
            "title": "ReturnLabel",
            "display": "none",
            "routerName": "ReturnLabel",
            "state": "Document.ReturnLabel",
            "permissions": "document::returnLabel_read"
          },
        ]
      },
      {
        "title": "Marketplace",
        "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/document.png",
        "url": "",
        "state": "Marketplace",
        "routerName": "Marketplace",
        "permissions": "marketplace::marketplace_read",
        "display": "block",
        "subMenu": []
      }
    ];
  }
  controlpanel() {
    return [
      {
        "title": "Control Panel",
        "imgSrc": "",
        "url": "",
        "state": "ControlPanel",
        "display": "block",
        "subMenu": [
          {
            "title": "Control Panel",
            "display": "none",
            "routerName": "ControlPanel",
            "state": "controlPanel",
            "permissions": "controlPanel::controlPanel_read"
          },
          {
            "title": "Edit Control Panel",
            "display": "none",
            "routerName": "EditControlPanel",
            "state": "editControlPanel",
            "permissions": "controlPanel::controlPanel_read"
          },
        ]
      }
    ];
  }

  idm() {
    return [
      {
        "title": "ID Management",
        "display": "none",
        "state": "ID-Management",
        "routerName": "IdManagement",
        "url": ""
      }
    ];
  }

}

let sideBarService = new SideBarService();
export default sideBarService;
