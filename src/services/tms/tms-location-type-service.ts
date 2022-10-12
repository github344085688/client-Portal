import BaseService from "./_tms-base-service";


class TmsLocationTypeService extends BaseService {
    getPackaging() {
        return [
                    {
                        packagingOptions: [
                            {
                                type: 1,
                                title: "Pallets: Standard (48\" x 40\")",
                                width: 40,
                                length: 48,
                                editable: false
                            },
                            {
                                type: 2,
                                title: "Pallets: (48\" x 60\")",
                                width: 60,
                                length: 48,
                                editable: false
                            },
                            {
                                type: 3,
                                title: "Pallets: (48\" x 48\")",
                                width: 48,
                                length: 48,
                                editable: false
                            },
                            {
                                type: 4,
                                title: "Pallets: (enter dimensions)",
                                width: null,
                                length: null,
                                editable: true
                            }
                        ],
                    }
        ];
    }

    getPalletSpaceCalculation () {
        return [
            {
                palletSpaceCalculation: {
                    standardWidth: 48,
                    standardLength: 40,
                    widthInterval: 2,
                    lengthInterval: 15,
                    maxHeight: 104
                }
            }
        ];
    }

    search() {
        return this.resource$.post<any>(`/get_location_type_acc_map.php`, {});
    }

}

export default new TmsLocationTypeService();