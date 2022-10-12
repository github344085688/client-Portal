import BaseService from "./_base-service";


class ConstantService extends BaseService {
    getReceiptTypes() {
        return ['Regular Receipt', 'Title Transfer Receipt', 'Migo Transfer Receipt',
                'Inventory Receipt', 'CrossDock', 'Sales Return', 'RDN', 'Auto Process Receipt',
                'Customer Transfer', 'RTS', 'Internal Transfer Receiving', 'Transload',
                'Purchase Return', 'Material Purchase'];
    }
}

let constantService =  new ConstantService();
export default constantService;