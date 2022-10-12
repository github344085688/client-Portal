import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import { Dialog, MessageBox } from 'element-ui';
import ElementSelect from '@components/element-select/element-select';
import template from "./newTrip.vue";
import controlPanelService from "@services/control-panel/controlPanelService";
import OrganizationAutoComplete from '@components/organization-auto-complete/organization-auto-complete';
import errorHandler from "@shared/error-handler";
import WaittingBtn from '@components/waitting-button/waitting-btn';
import TagsInput from "@components/tags-input/tags-input";
import { DatePicker } from 'element-ui';
import VueDragDrop from 'vue-drag-drop';
import { filter, forEach, groupBy, findIndex, every } from "lodash";
import TmsCarrierAutoComplete from '@panelComponents/tms-carrier-auto-complete/tms-carrier-auto-complete';
import TmsTrailerAutoComplete from '@panelComponents/tms-trailer-auto-complete/tms-trailer-auto-complete';
import { Message } from 'element-ui';

Vue.use(Dialog);
Vue.use(DatePicker);
Vue.use(VueDragDrop);
@Component({
    mixins: [template],
    name: 'newTrip',
    components: {
        ElementSelect,
        OrganizationAutoComplete,
        WaittingBtn,
        TagsInput,
        TmsCarrierAutoComplete,
        TmsTrailerAutoComplete
    }
})
export default class NewTrip extends Vue {
    showNewTrip: Boolean = false;
    // validateOrderLoading: Boolean = false;
    newTripLoading: Boolean = false;
    inputType: string = 'Pro';
    newTrip: any = {
        dispatch_id: '',
        dateRange: '',
        timeRange: '',
        dispatch_start_date: '',
        dispatch_end_date: '',
        dispatch_start_start_time: '',
        dispatch_start_end_time: '',
        dispatch_priority: '',
        dispatch_origin_terminal_id: '',
        dispatch_destination_terminal_id: '',
        dispatch_type: '',
        // dispatch_inspection: '',
        dispatch_carrier_id: '',
        dispatch_driver_id: '',
        dispatch_driver_user_id: '',
        dispatch_tractor_no: '',
        dispatch_service_level: '',
        input_empty_trip: 0,
        dispatch_tasks: [
            {
                orders: [],
                validateOrderLoading: false,
                dispatch_task_sequence: '',
                dispatch_task_trailer_vehicle_id: '',
                dispatch_task_trailer_vehicle_name: '',
                dispatch_task_details: []
            }
        ],
    };
    termialLocations: any = [];
    carrierList: any = [];
    tripType: any = [
        {name: 'LTL-CA', value: 0},
        {name: 'LH-CA', value: 1},
        {name: 'LTL-USA', value: 2},
        {name: 'LH-USA', value: 3},
    ];
    orderFiles: any = [];
    taskIndex: number = 0;
    stopIndex: number = -1;
    dropType: string = '';
    transferTripData: any = {
        transferArr: [],
        transferTo: ''
    };
    showTripDialog: Boolean = false;
    tagsOrders: any = [];
    isStraightTruck: Boolean = false;
    isEmptyTrip: Boolean = false;
    canChangeTrip: Boolean = false;
    pickerBeginOption: any = {
        disabledDate: (time: any) => {
            return time.getTime() <= (Date.now() - (24 * 60 * 60 * 1000));
        }
    };
    linkDriverIds: any = '';

    @Prop({ default: false })
    show!: Boolean;

    @Prop({ default: false })
    isEdit!: Boolean;

    @Prop({ default: false })
    isNew!: Boolean;

    @Prop({
        default: function () {
            return {};
        }
    })
    currentTrip!: any;

    @Prop({ default: '' })
    styleCss!: string;

    created() {
        this.searchTerminal();
    }

    @Watch('show', {
        immediate: true,
        deep: true
    })
    showOrHide(current: any) {
        if (current) {
            this.showNewTrip = true;
            this.isStraightTruck = false;
        } else {
            this.showNewTrip = false;
        }

        if (this.isEdit) {
            this.newTrip.dispatch_id = this.currentTrip.trip_no;
            this.newTrip.dateRange = this.currentTrip.trip_start_date;
            this.newTrip.input_empty_trip = this.currentTrip.input_empty_trip;
            this.newTrip.input_empty_trip ? this.isEmptyTrip = true : this.isEmptyTrip = false;
            this.newTrip.input_empty_trip ? this.canChangeTrip = true : this.canChangeTrip = false;
            this.newTrip.timeRange = [this.currentTrip.trip_start_time_from, this.currentTrip.trip_start_time_to];
            this.newTrip.dispatch_priority = this.currentTrip.priority;
            this.newTrip.dispatch_origin_terminal_id = Number(this.currentTrip.original_terminal.location_id) || '';
            this.newTrip.dispatch_destination_terminal_id = Number(this.currentTrip.destination_terminal.location_id) || '';
            switch (this.currentTrip.trip_type) {
                case 'LTL-CA':
                    this.newTrip.dispatch_type = 0;
                    break;
                case "LH-CA":
                    this.newTrip.dispatch_type = 1;
                    break;
                case 'LTL-USA':
                    this.newTrip.dispatch_type = 2;
                    break;
                case 'LH-USA':
                    this.newTrip.dispatch_type = 3;
                    break;
            }
            // this.newTrip.dispatch_inspection = this.currentTrip.truck_inspection ? true : false;
            this.newTrip.dispatch_carrier_id = Number(this.currentTrip.carrier_id) || '';
            this.newTrip.dispatch_driver_id = this.currentTrip.driver_id;
            this.newTrip.dispatch_driver_user_id = this.currentTrip.driver_user_id;
            this.newTrip.selectDriver = this.currentTrip.driver_firstname + ' ' + this.currentTrip.driver_lastname;
            this.newTrip.dispatch_tractor_no = this.currentTrip.tractor_no;
            this.newTrip.dispatch_service_level = this.currentTrip.service_level;
            this.newTrip.dispatch_tasks = this.currentTrip.tasks;
            this.isStraightTruck = this.currentTrip.vehicle_type == 'Straight Truck' || this.currentTrip.vehicle_type == 'Staight Truck - CA' ? true : false;
            this.makeTaskLikeNewTripTask();
        } else {
            this.resetNewTrip();
        }
    }

    makeTaskLikeNewTripTask() {
        forEach(this.newTrip.dispatch_tasks, (task, taskIndex) => {
            task.orders = [];
            task.type = '';
            task.validateOrderLoading = false;
            task.dispatch_task_sequence = task.task_sequence;
            task.dispatch_task_trailer_vehicle_id = task.vehicle_id;
            task.dispatch_task_trailer_vehicle_name = task.vehicle_name;
            task.dispatch_task_details = [];
            forEach(task.stops, (stop, stopIndex) => {
                if (stop.stage_text != 'truck inspection') {
                    forEach(stop.lines, (order, orderIndex) => {
                        if (order.void == 0) {
                            let type = '';
                            if (order.task_group_stage == '0') {
                                type = 'Pickup';
                            } else
                            if (order.task_group_stage == '2') {
                                type = 'Delivery';
                            } else
                            if (order.task_group_stage == '1') {
                                type = 'LineHaul';
                            }
                            task.orders.push({
                                pu_id: order.pu_id || null,
                                order_id: order.order_id || null,
                                lh_id: order.lh_id || null,
                                type: type,
                                order_pro: order.order_pro || null,
                                shipper_lat: order.shipper_lat || null,
                                shipper_lng: order.shipper_lng || null,
                                consignee_lat: order.consignee_lat || null,
                                consignee_lng: order.consignee_lat || null
                            });
                        }
                    });
                } else {
                    task.type = 'truck inspection';
                }
            });
        });
    }

    createOrEditTrip() {
        this.newTrip.dispatch_start_date = this.newTrip.dateRange;
        if (this.linkDriverIds) {
            delete this.newTrip.dispatch_carrier_id;
        }
        this.groupTaskOrdersOrLingHaul();
        forEach(this.newTrip.dispatch_tasks, (item, index) => {
            item.dispatch_task_sequence = index + 1;
        });
        if (this.judgeTripParams()) {
            this.newTripLoading = true;
            controlPanelService.createNewTrip(this.newTrip).subscribe(
                (res: any) => {
                    this.newTripLoading = false;
                    this.$store.commit('refreshOrderAndTrip', {
                        order: true,
                        trip: true
                    });
                    MessageBox.alert(`Trip: ${res.dispatch_id}`, 'Save Success', {
                        confirmButtonText: 'Ok',
                        callback: action => {
                            this.showNewTrip = false;
                        }
                    });
                },
                (err: any) => {
                    this.newTripLoading = false;
                    if (err.response.data.errorMessage.data) {
                        Message.error(JSON.stringify(err.response.data.errorMessage.data));
                    } else {
                        Message.error(err.response.data.errorMessage.message);
                    }
                }
            );
        }
    }

    groupTaskOrdersOrLingHaul() {
        let orderIdAndTaskGroupIdArr: any = [];
        forEach(this.newTrip.dispatch_tasks, (item, index) => {
            forEach(item.stops, (perStop) => {
                forEach(perStop.lines, (perLine) => {
                    orderIdAndTaskGroupIdArr.push({
                        order_id: perLine.order_id,
                        order_pro: perLine.order_pro,
                        lh_id: perLine.lh_id,
                        type: perStop.stage_text,
                        task_group_id: perLine.task_group_id,
                    });
                });
            });
            item.dispatch_task_details = [];
            let arr = groupBy(item.orders, 'type');
            forEach(arr, (perItem, perIndex) => {
                if (perIndex == 'Pickup') {
                    item.dispatch_task_details.push({
                        task_detail_stage: 0,
                        task_detail_lines: []
                    });
                    let detailIndex = findIndex(item.dispatch_task_details, (o: any) => {
                        return o.task_detail_stage == 0;
                    });
                    forEach(perItem, (everyOrder, orderIndex) => {
                        item.dispatch_task_details[detailIndex].task_detail_lines.push(
                            {
                                task_group_id: this.findTaskGroupId(orderIdAndTaskGroupIdArr, everyOrder.order_id, 'pickup'),
                                order_id: everyOrder.order_id,
                                pu_id: everyOrder.pu_id,
                                order_pro: everyOrder.order_pro,
                                lat: everyOrder.shipper_lat,
                                lng: everyOrder.shipper_lng
                            }
                        );
                    });
                } else
                if (perIndex == 'Delivery') {
                    item.dispatch_task_details.push({
                        task_detail_stage: 2,
                        task_detail_lines: []
                    });
                    let detailIndex = findIndex(item.dispatch_task_details, (o: any) => {
                        return o.task_detail_stage == 2;
                    });
                    forEach(perItem, (everyOrder, orderIndex) => {
                        item.dispatch_task_details[detailIndex].task_detail_lines.push(
                            {
                                task_group_id: this.findTaskGroupId(orderIdAndTaskGroupIdArr, everyOrder.order_id, 'delivery'),
                                pu_id: everyOrder.pu_id,
                                order_id: everyOrder.order_id,
                                order_pro: everyOrder.order_pro,
                                lat: everyOrder.consignee_lat,
                                lng: everyOrder.consignee_lng
                            }
                        );
                    });
                } else
                if (perIndex == 'LineHaul') {
                    item.dispatch_task_details.push({
                        task_detail_stage: 1,
                        task_detail_lines: []
                    });
                    let detailIndex = findIndex(item.dispatch_task_details, (o: any) => {
                        return o.task_detail_stage == 1;
                    });
                    forEach(perItem, (everyOrder, orderIndex) => {
                        item.dispatch_task_details[detailIndex].task_detail_lines.push(
                            {
                                task_group_id: this.findTaskGroupId(orderIdAndTaskGroupIdArr, everyOrder.lh_id, 'linehaul'),
                                lh_id: everyOrder.lh_id,
                                order_pro: everyOrder.order_pro,
                                lat: 0,
                                lng: 0
                            }
                        );
                    });
                }
            });
        });
    }

    findTaskGroupId(groupIds: any, findId: any, type: any) {
        let resultArr: any = [];
        if (type == 'pickup' || type == 'delivery') {
            resultArr = filter(groupIds, (o: any) => {
                return o.order_id == findId && o.type == type;
            });
        } else {
            resultArr = filter(groupIds, (o: any) => {
                return o.lh_id == findId && o.type == type;
            });
        }
        if (resultArr[0] && resultArr[0].task_group_id != undefined) {
            return resultArr[0].task_group_id;
        } else {
            return '';
        }
    }

    removeOrderTags(deleteOrder: any) {
        let regDeleteOrder = deleteOrder.replace(/PU:/g, '').replace(/Pro:/g, '');
        forEach(this.newTrip.dispatch_tasks, (task, index) => {
            forEach(task.orders, (order, orderIndex) => {
                if (deleteOrder.toString().indexOf('PU:') != -1) {
                    if (regDeleteOrder == order.pu_id) {
                        task.orders.splice(orderIndex, 1);
                        this.$store.commit('removeDropedOrder', regDeleteOrder);
                    }
                } else
                if (deleteOrder.toString().indexOf('Pro:') != -1) {
                    if (regDeleteOrder == order.order_pro) {
                        task.orders.splice(orderIndex, 1);
                        this.$store.commit('removeDropedOrder', regDeleteOrder);
                    }
                }
            });
        });
        this.$forceUpdate();
    }

    ifEmptyTrip() {
        if (this.isEmptyTrip) {
            this.newTrip.input_empty_trip = 1;
        } else {
            this.newTrip.input_empty_trip = 0;
            this.newTrip.dispatch_tasks = [
                {
                    orders: [],
                    validateOrderLoading: false,
                    dispatch_task_sequence: '',
                    dispatch_task_trailer_vehicle_id: '',
                    dispatch_task_trailer_vehicle_name: '',
                    dispatch_task_details: []
                }
            ];
        }
    }

    selectCarrier(carrier: any) {
        if (carrier && carrier.location_link_driver_ids) {
            this.linkDriverIds = carrier.location_link_driver_ids;
            this.newTrip.input_carrier_driver_parent_carrier_id = this.newTrip.dispatch_carrier_id;
            this.$store.commit('carrierLinkDriver', carrier.location_link_driver_ids);
        } else {
            this.newTrip.dispatch_driver_id = '';
            delete this.newTrip.input_carrier_driver_parent_carrier_id;
            this.$store.commit('carrierLinkDriver', '');
            this.linkDriverIds = '';
        }
    }

    async selectTrailer(data: any, taskIndex: any) {
        if (data) {
            this.newTrip.dispatch_tasks[taskIndex].dispatch_task_trailer_vehicle_name = '';
            let validateTrailerResult = await this.validateTrailer(data.vehicle_id, taskIndex);
            if (validateTrailerResult) {
                this.newTrip.dispatch_tasks[taskIndex].dispatch_task_trailer_vehicle_name = data.vehicle_name;
                this.newTrip.dispatch_tasks[taskIndex].dispatch_task_trailer_vehicle_id = data.vehicle_id;
            }
        } else {
            this.newTrip.dispatch_tasks[taskIndex].dispatch_task_trailer_vehicle_name = '';
            this.newTrip.dispatch_tasks[taskIndex].dispatch_task_trailer_vehicle_id = '';
        }
        this.$forceUpdate();
    }

    juedgeOrderRepeat(order: any) {
        let allOrderArr: any = [];
        forEach(this.newTrip.dispatch_tasks, (task, index) => {
            allOrderArr = allOrderArr.concat(task.orders);
        });
        let orderIndex: any = 0;
        if (this.inputType == 'Pro') {
            orderIndex = findIndex(allOrderArr, (o: any) => {
                return o.order_pro == order;
            });
        } else {
            orderIndex = findIndex(allOrderArr, (o: any) => {
                return o.pu_id == order;
            });
        }
        if (orderIndex == -1) {
            return true;
        } else {
            return false;
        }
    }

    closeDialog() {
        this.showNewTrip = false;
        this.$emit('closeNewTrip', true);
        this.$store.commit('carrierLinkDriver', '');
        // this.$store.commit('isNewTrip', false);
        this.$store.commit('isEditTrip', false);
    }

    searchTerminal() {
        controlPanelService.searchTerminal().subscribe(
            (res: any) => {
                this.termialLocations = res.warehouse;
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    createNewTask() {
        this.newTrip.dispatch_tasks.push(
            {
                orders: [],
                validateOrderLoading: false,
                dispatch_task_trailer_vehicle_id: '',
                dispatch_task_trailer_vehicle_name: '',
                dispatch_task_sequence: '',
                dispatch_task_details: []
            }
        );
    }

    removeTask(index: number) {
        MessageBox.confirm('Are you sure to delete this task?', 'Delete Task', {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
        }).then(() => {
            this.newTrip.dispatch_tasks.splice(index, 1);
        }).catch(() => {});
    }

    changeTaskStage(index: any) {
        this.newTrip.tasks[index].orders = [];
    }

    handleDragover(index: any, stopIndex: any) {
        this.dropType = this.$store.state.dragType;
        if (typeof(index) == 'number') {
            this.taskIndex = index;
        } else {
            this.taskIndex = -1;
        }
        if (stopIndex) {
            this.stopIndex = stopIndex;
        } else {
            this.stopIndex = -1;
        }
    }

    async handleDrop(data: any) {
        if (this.dropType == 'driver') {
            this.newTrip.selectDriver = data.driver_firstname + ' ' + data.driver_lastname;
            this.newTrip.dispatch_driver_id = data.driver_id;
            this.newTrip.dispatch_driver_user_id = data.driver_user_id;
        } else
        if (this.dropType == 'truck' || this.dropType == 'Straight Truck') {
            this.newTrip.dispatch_tractor_no = data.vehicle_name;
            if (this.dropType == 'Straight Truck') {
                this.isStraightTruck = true;
            } else {
                this.isStraightTruck = false;
            }
        } else
        if (this.dropType == 'trailer' || this.dropType == 'chassis') {
            if (this.taskIndex == -1) return;
            let validateTrailerResult = await this.validateTrailer(data.vehicle_id, this.taskIndex);
            if (validateTrailerResult) {
                this.newTrip.dispatch_tasks[this.taskIndex].dispatch_task_trailer_vehicle_name = data.vehicle_name;
                this.newTrip.dispatch_tasks[this.taskIndex].dispatch_task_trailer_vehicle_id = data.vehicle_id;
            }
        } else
        if (this.dropType.indexOf('Order') != -1) {
            if (this.taskIndex == -1) return;
            if (data.constructor == Object) {
                let singleData: any = [];
                singleData.push(data);
                this.filterOrdersAndValidate(singleData).then((res: any) => {
                    if (res) {
                        this.makeOrderLines(singleData);
                    }
                });
            } else {
                this.filterOrdersAndValidate(data).then((res: any) => {
                    if (res) {
                        this.makeOrderLines(data);
                    }
                });
            }
        }
        this.dropType = '';
    }

    addOrderTags(orders: any, index: any) {
        this.taskIndex = index;
        let lastInputOrderId = orders[orders.length - 1].replace(/PU:/g, '').replace(/Pro:/g, '');
        if (this.juedgeOrderRepeat(lastInputOrderId)) {
            this.newTrip.dispatch_tasks[index].validateOrderLoading = true;
            let searchParams: any = {};
            if (this.inputType == 'Pro') {
                searchParams.order_pro_array = [];
                searchParams.order_pro_array.push(lastInputOrderId);
            } else {
                searchParams.pu_id = lastInputOrderId;
            }
            controlPanelService.getOrderPanelData(searchParams).subscribe(
                async (res: any) => {
                    if (res.data.normal.details[0]) {
                        this.filterOrdersAndValidate(res.data.normal.details).then((validateRes: any) => {
                            this.makeOrderLines(res.data.normal.details);
                        }, (err: any) => {
                            orders.splice(orders.length - 1, 1);
                        });
                        this.$forceUpdate();
                    } else {
                        errorHandler.handle('Order does not exist.');
                        orders.splice(orders.length - 1, 1);
                    }
                    this.newTrip.dispatch_tasks[index].validateOrderLoading = false;
                },
                (err: any) => {
                    this.newTrip.dispatch_tasks[index].validateOrderLoading = false;
                    errorHandler.handle(err);
                }
            );
        } else {
            orders.splice(orders.length - 1, 1);
            errorHandler.handle('Order has been assigned to other task');
        }
    }

    async filterOrdersAndValidate(data: any) {
        let validateArr: any = [];
        forEach(data, (perOrder) => {
            let canDoType: String = '';
            if (perOrder.canDoDelivery) {
                canDoType = 'delivery';
            } else
            if (perOrder.canDoLineHaul) {
                canDoType = 'linehaul';
            } else {
                canDoType = 'pickup';
            }
            validateArr.push({
                type: canDoType,
                order_id: perOrder.order_id,
                pu_id: perOrder.pu_id || null,
                order_pro: perOrder.order_pro || null,
                linehaul_id: perOrder.lh_id || null
            });
        });
        return await this.validateOrderLines(validateArr, this.taskIndex);
    }

    makeOrderLines(data: any) {
        forEach(data, (perOrder, orderIndex) => {
            let canDoType: String = '';
            if (perOrder.canDoDelivery) {
                canDoType = 'Delivery';
            } else
            if (perOrder.canDoLineHaul) {
                canDoType = 'LineHaul';
            } else {
                canDoType = 'Pickup';
            }
            if (this.stopIndex > -1) {
                this.newTrip.dispatch_tasks[this.taskIndex].stops[this.stopIndex].lines.push(
                    {
                        pu_id: perOrder.pu_id || null,
                        order_id: perOrder.order_id || null,
                        lh_id: perOrder.lh_id || null,
                        type: canDoType,
                        order_pro: perOrder.order_pro || null,
                        shipper_lat: perOrder.shipper_lat || null,
                        shipper_lng: perOrder.shipper_lng || null,
                        consignee_lat: perOrder.consignee_lat || null,
                        consignee_lng: perOrder.consignee_lat || null
                    }
                );
            } else {
                this.newTrip.dispatch_tasks[this.taskIndex].orders.push(
                    {
                        pu_id: perOrder.pu_id || null,
                        order_id: perOrder.order_id || null,
                        lh_id: perOrder.lh_id || null,
                        type: canDoType,
                        order_pro: perOrder.order_pro || null,
                        shipper_lat: perOrder.shipper_lat || null,
                        shipper_lng: perOrder.shipper_lng || null,
                        consignee_lat: perOrder.consignee_lat || null,
                        consignee_lng: perOrder.consignee_lat || null
                    }
                );
            }
            this.$store.commit('addDropedOrder', perOrder);
            this.$forceUpdate();
        });
    }

    validateOrder(param: any, taskIndex: any) {
        this.newTrip.dispatch_tasks[taskIndex].validateOrderLoading = true;
        return new Promise((resolve: any, reject: any) => {
            controlPanelService.validateOrder(param).subscribe(
                (res: any) => {
                    this.newTrip.dispatch_tasks[taskIndex].validateOrderLoading = false;
                    resolve(true);
                },
                (err: any) => {
                    this.newTrip.dispatch_tasks[taskIndex].validateOrderLoading = false;
                    if (err.response.data.errorMessage.data) {
                        Message.error(JSON.stringify(err.response.data.errorMessage.data));
                    } else {
                        Message.error(err.response.data.errorMessage.message);
                    }
                    reject(false);
                }
            );
        }).catch((e) => {});
    }

    validateLineHaul(param: any, taskIndex: any) {
        this.newTrip.dispatch_tasks[taskIndex].validateOrderLoading = true;
        return new Promise((resolve: any, reject: any) => {
            controlPanelService.validateLineHaul(param).subscribe(
                (res: any) => {
                    this.newTrip.dispatch_tasks[taskIndex].validateOrderLoading = false;
                    resolve(true);
                },
                (err: any) => {
                    this.newTrip.dispatch_tasks[taskIndex].validateOrderLoading = false;
                    if (err.response.data.errorMessage.data) {
                        Message.error(JSON.stringify(err.response.data.errorMessage.data));
                    } else {
                        Message.error(err.response.data.errorMessage.message);
                    }
                    reject(false);
                }
            );
        }).catch((e) => {});
    }

    validateOrderLines(param: any, taskIndex: any) {
        this.newTrip.dispatch_tasks[taskIndex].validateOrderLoading = true;
        return new Promise((resolve: any, reject: any) => {
            controlPanelService.validateOrderLines(param).subscribe(
                (res: any) => {
                    this.newTrip.dispatch_tasks[this.taskIndex].validateOrderLoading = false;
                    resolve(true);
                },
                (err: any) => {
                    this.newTrip.dispatch_tasks[this.taskIndex].validateOrderLoading = false;
                    if (err.response.data.errorMessage.data) {
                        Message.error(JSON.stringify(err.response.data.errorMessage.data));
                    } else {
                        Message.error(err.response.data.errorMessage.message);
                    }
                    reject(false);
                }
            );
        }).catch((e) => {});
    }

    validateTrailer(trailerId: any, taskIndex: any) {
        this.newTrip.dispatch_tasks[taskIndex].validateTrailerLoading = true;
        this.$forceUpdate();
        return new Promise((resolve: any, reject: any) => {
            controlPanelService.validateTrailer(trailerId).subscribe(
                (res: any) => {
                    this.newTrip.dispatch_tasks[this.taskIndex].validateTrailerLoading = false;
                    if (res.has_assign_trip) {
                        reject(false);
                        errorHandler.handle('Trailer has been assigned');
                    } else {
                        resolve(true);
                    }
                },
                (err: any) => {
                    this.newTrip.dispatch_tasks[this.taskIndex].validateTrailerLoading = false;
                    errorHandler.handle(err);
                    reject(false);
                }
            );
        }).catch((e) => {});
    }

    judgeTripParams() {
        let withTrailer: Boolean = true;
        if (!this.newTrip.dispatch_start_date) {
            errorHandler.handle('Please select dispatch date!');
            return false;
        }
        if (!this.newTrip.dispatch_origin_terminal_id) {
            errorHandler.handle('Please select origin terminal!');
            return false;
        }
        if (this.isEmptyTrip) {
            if (!this.newTrip.dispatch_destination_terminal_id) {
                errorHandler.handle('Please select end terminal!');
                return false;
            }
            every(this.newTrip.dispatch_tasks, (item, index) => {
                if (!item.dispatch_task_trailer_vehicle_id) {
                    withTrailer = false;
                    errorHandler.handle('Please add trailer for all tasks!');
                    return false;
                }
            });
            if (withTrailer) {
                return true;
            } else {
                return false;
            }
        } else {
            if (!this.newTrip.dispatch_carrier_id && !this.newTrip.dispatch_driver_id) {
                errorHandler.handle('Please select driver or carrier');
                return false;
            }
            if (!this.newTrip.dispatch_tractor_no) {
                errorHandler.handle('Please select equipment');
                return false;
            }
            if (!this.isStraightTruck) {
                every(this.newTrip.dispatch_tasks, (item, index) => {
                    if (!item.dispatch_task_trailer_vehicle_id) {
                        withTrailer = false;
                        errorHandler.handle('Please add trailer for all tasks!');
                        return false;
                    }
                });
                if (withTrailer) {
                    return true;
                } else {
                    return false;
                }
            }
            let withOrder: Boolean = false;
            forEach(this.newTrip.dispatch_tasks, (item, index) => {
                if (item. orders.length > 0) {
                    withOrder = true;
                }
            });
            if (!withOrder) {
                errorHandler.handle('Please drag and drop orders');
                return false;
            }
            return true;
        }
    }

    clean(cleanType: any, item: any, orderIndex: any) {
        if (cleanType == 'driver') {
            this.newTrip.selectDriver = '';
            this.newTrip.dispatch_driver_id = '';
            this.newTrip.dispatch_driver_user_id = '';
        } else
        if (cleanType == 'truck') {
            this.newTrip.dispatch_tractor_no = '';
            this.isStraightTruck = false;
        } else
        if (cleanType == 'trailer') {
            item.dispatch_task_trailer_vehicle_id = '';
            item.dispatch_task_trailer_vehicle_name = '';
        } else
        if (cleanType.indexOf('order') != -1) {
            if (this.stopIndex > -1) {
                item.lines.splice(orderIndex, 1);
            } else {
                let tagsOrderIndex = findIndex(item.tagsOrders, (o: any) => {
                    return o.replace(/PU:/g, '').replace(/Pro:/g, '') == item.orders[orderIndex].pu_id || o.replace(/PU:/g, '').replace(/Pro:/g, '') == item.orders[orderIndex].order_pro;
                });
                if (tagsOrderIndex > -1) {
                    item.tagsOrders.splice(tagsOrderIndex, 1);
                }
                this.$store.commit('removeDropedOrder', item.orders[orderIndex].order_id);
                item.orders.splice(orderIndex, 1);
            }
        }
        this.$forceUpdate();
    }

    resetNewTrip() {
        this.newTrip = {
            dispatch_id: '',
            dateRange: '',
            timeRange: '',
            dispatch_start_date: '',
            dispatch_end_date: '',
            dispatch_start_start_time: '',
            dispatch_start_end_time: '',
            dispatch_priority: '',
            dispatch_origin_terminal_id: '',
            dispatch_destination_terminal_id: '',
            input_empty_trip: 0,
            dispatch_type: '',
            // dispatch_inspection: '',
            dispatch_carrier_id: '',
            dispatch_driver_id: '',
            dispatch_tractor_no: '',
            dispatch_service_level: '',
            dispatch_tasks: [
                {
                    orders: [],
                    validateOrderLoading: false,
                    dispatch_task_sequence: '',
                    dispatch_task_trailer_vehicle_id: '',
                    dispatch_task_trailer_vehicle_name: '',
                    dispatch_task_details: []
                }
            ],
        };
        this.isEmptyTrip = false;
    }

    get watchDragType() {
        return this.$store.state.dragType;
    }
    @Watch('watchDragType')
    currentDragType() {
        this.dropType = this.$store.state.dragType;
    }
}