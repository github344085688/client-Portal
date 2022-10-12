import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import ControlPanelService from '@services/control-panel/controlPanelService';
import errorHandler from "@shared/error-handler";
import template from "./equipment.vue";
import { filter } from "lodash-es";
import Session from '@shared/session';

@Component({
    mixins: [template],
    name: 'equipment',
    components: {}
})
export default class Equipment extends Vue {

    currentType: string = 'truck';
    currentGroup: string = '';
    groupsArr: any = [];
    truckList: Array<any> = [];
    chassisList: Array<any> = [];
    trailerList: Array<any> = [];
    staightTruckList: Array<any> = [];
    showList: Array<any> = [];
    typeArr: any = [
        {label: 'Tractors', value: 'truck'},
        {label: 'Chassis', value: 'chassis'},
        {label: 'Trailers', value: 'trailer'},
        {label: 'Straight Truck', value: 'Straight Truck'}
    ];
    loadEquipment: Boolean = false;
    equipmentName: string = '';
    searchParam: any = {
        page_size: 9999999,
            page: 1
    };

    mounted() {
        this.init();
    }

    init() {
        this.getEquipment();
        this.getGroup();
    }

    getEquipment() {
        this.loadEquipment = true;
        ControlPanelService.getEquipmentData(this.searchParam).subscribe(
            (res: any) => {
                this.truckList = filter(res.data, (o: any) => {
                    return o.parent_vehicle_type == 'truck' && o.vehicle_type != 'Straight Truck' && o.vehicle_type != 'Straight Truck - CA';
                });
                this.chassisList = filter(res.data, (o: any) => {
                    return o.parent_vehicle_type == 'chassis';
                });
                this.trailerList = filter(res.data, (o: any) => {
                    return o.parent_vehicle_type == 'trailer';
                });
                this.staightTruckList = filter(res.data, (o: any) => {
                    return o.vehicle_type == 'Straight Truck' || o.vehicle_type == 'Straight Truck - CA';
                });
                this.filterEquipmentByName();
                this.loadEquipment = false;
            },
            (err: any) => {
                this.loadEquipment = false;
                errorHandler.handle(err);
            }
        );
    }

    getGroup() {
        ControlPanelService.getEquipmentGroups().subscribe(
            (res: any) => {
                this.groupsArr = res.data;
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    filterEquipmentByName() {
        if (this.currentType == 'truck') {
            this.showList = filter(this.truckList, (item) => {
                let name = (item.vehicle_name.toString()).toLowerCase();
                return name.indexOf(this.equipmentName.toLowerCase()) != -1;
            });
        } else
        if (this.currentType == 'chassis') {
            this.showList = filter(this.chassisList, (item) => {
                let name = (item.vehicle_name.toString()).toLowerCase();
                return name.indexOf(this.equipmentName.toLowerCase()) != -1;
            });
        } else
        if (this.currentType == 'trailer')  {
            this.showList = filter(this.trailerList, (item) => {
                let name = (item.vehicle_name.toString()).toLowerCase();
                return name.indexOf(this.equipmentName.toLowerCase()) != -1;
            });
        } else {
            this.showList = filter(this.staightTruckList, (item) => {
                let name = (item.vehicle_name.toString()).toLowerCase();
                return name.indexOf(this.equipmentName.toLowerCase()) != -1;
            });
        }
    }

    switchType(type: string) {
        if (type == 'truck') {
            this.showList = this.truckList;
        } else
        if (type == 'chassis') {
            this.showList = this.chassisList;
        } else
        if (type == 'trailer') {
            this.showList = this.trailerList;
        } else {
            this.showList = this.staightTruckList;
        }
        this.currentType = type;
        this.equipmentName = '';
    }

    switchGroup(group: any) {
        this.searchParam.vehicle_group_ancestry = group;
        this.getEquipment();
    }

    setDragType(type: any) {
        this.$store.commit('editDragType', type);
    }
}