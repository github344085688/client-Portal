import BaseService from "./_base-service";

class SideBarService extends BaseService {

    tools() {
        return [
            {
                "title": "Tools",
                "display": "none",
                "state": "TMS",
                "url": "",
                "subMenu": [
                    {
                        "title": "Tracking",
                        "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/inventory.svg",
                        "url": "",
                        "state": "TMS.Tracking",
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
              "url": "",
              "subMenu": [
                  {
                      "title": "Shipment Activity",
                      "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/inventory.svg",
                      "url": "",
                      "state": "TMS.ShipmentActivity",
                      "routerName": "ShipmentActivity",
                      "display": "none",
                  }
              ]
          }
      ];
    }
  warehousing() {
    return [

      {
        "title": "Reports",
        "display": "block",
        "state": "Reports",
        "url": "",
        "subMenu": [
          {
            "title": "Inventory",
            "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/inventory.svg",
            "url": "",
            "state": "Reports.Inventory",
            "display": "block",
            "subMenu": [
              {
                "title": "Activity",
                "display": "none",
                "routerName": "Activity",
                "state": "Reports.Inventory.Activity",
              },
              {
                "title": "Adjustment",
                "display": "none",
                "routerName": "Adjustment",
                "state": "Reports.Inventory.Adjustment",
              },
              {
                "title": "Aging",
                "routerName": "Aging",
                "display": "none",
                "state": "Reports.Inventory.Aging",
              },
              {
                "title": "Status",
                "routerName": "Status",
                "display": "none",
                "state": "Reports.Inventory.Status",
              }
            ]
          },
          {
            "title": "Inbound",
            "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/inbound.svg",
            "url": "",
            "state": "Reports.Inbound",
            "display": "none",
            "subMenu": [
              {
                "title": "Scheduled",
                "routerName": "Scheduled",
                "display": "none",
                "state": "Reports.Inbound.Scheduled",
              },
              {
                "title": "Receiving",
                "routerName": "Receipt",
                "display": "none",
                "state": "Reports.Inbound.Receipt",
              },
            ]
          },
          {
            "title": "Outbound",
            "state": "Reports.Outbound",
            "imgSrc": STATIC_CONTENT_CONTEXT_PATH + "static/img/outbound.svg",
            "display": "none",
            "subMenu": [

              {
                "title": "Schedule",
                "display": "none",
                "routerName": "OutboundScheduled",
                "state": "Reports.Outbound.OutboundScheduled",
              }, {
                "title": "Shipping",
                "display": "none",
                "routerName": "OutboundShipping",
                "state": "Reports.Outbound.OutboundShipping",
              },

            ]
          }
        ]
      },
      {
        "title": "Inventory",
        "display": "none",
        "state": "Inventory",
        "routerName": "Inventory",
      }
      // {
      //   "title": "Inventory ",
      //   "display": "none",
      //   "routerName": "Inventory",
      //   "state": "Inventory",
      // },
    ];
  }

}

let sideBarService = new SideBarService();
export default sideBarService;
