import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import { cloneDeep, forEach } from "lodash";
import template from "./advanceDetail.vue";
import { Checkbox, Upload, MessageBox, Dialog } from 'element-ui';
import errorHandler from '@shared/error-handler';
import NewTrip from '@panelComponents/newTrip/newTrip';
import controlPanelService from '@services/control-panel/controlPanelService';
import WaittingBtn from '@components/waitting-button/waitting-btn';
import TripTools from '@panelComponents/tripTools/tripTools';
import VueDragDrop from 'vue-drag-drop';
import Draggable from 'vuedraggable';
import FileControl from '@panelComponents/fileControl/fileControl';

Vue.use(Dialog);
Vue.use(Checkbox);
Vue.use(Upload);
Vue.use(VueDragDrop);
@Component({
    mixins: [template],
    name: 'advanceDetail',
    components: {
        NewTrip,
        WaittingBtn,
        Draggable,
        FileControl,
        TripTools
    }
})
export default class AdvanceDetail extends Vue {
    showAdvanceDetail: Boolean = false;
    detailName: string = '';
    orderDetail: any = {};
    fileType: string = 'photo';
    excludeLinkedFiles: Boolean = false;
    newTasks: any = [];
    dropIndex: number = 0;
    dropType: string = '';
    orderFiles: any = [];
    tripDateValue: any = ['2020-12-18', '2021-01-14'];
    tripDetail: any = {};
    showMerge: Boolean = false;
    showTransfer: Boolean = false;
    mergeTripNo: any = '';
    transferTripData: any = {
        transferTask: [],
        transferTo: ''
    };
    mergeOrTransferTrip: Boolean = false;
    saveTripLoading: Boolean = false;
    saveTasks: any = {};
    loadingTrip: Boolean = false;

    @Prop({
        default: function () {
            return {};
        }
    })
    detail!: any;

    @Prop({ default: "" })
    type!: string;

    @Prop({ default: false})
    show!: Boolean;

    editTripTask() {
        this.$store.commit('isEditTrip', true);
        this.showAdvanceDetail = false;
    }

    saveTrip() {
        this.saveTripLoading = true;
        controlPanelService.moveTaskStop(this.tripDetail.trip_no, this.tripDetail.tasks).subscribe(
            (res: any) => {
                this.saveTripLoading = false;
                MessageBox.alert(`Edit stop success`, 'Save Success', {
                    confirmButtonText: 'Ok',
                    callback: action => {
                        this.$store.commit('refreshOrderAndTrip', {
                            order: false,
                            trip: true
                        });
                        this.showAdvanceDetail = false;
                    }
                });
            },
            (err: any) => {
                this.saveTripLoading = false;
                errorHandler.handle(err);
            }
        );
    }

    handleStopChange(e: any) {
        let fromTaskIndex = e.from.getAttribute('data-index');
        let toTaskIndex = e.to.getAttribute('data-index');
        let moveStop = cloneDeep(this.tripDetail.tasks[fromTaskIndex].stops[e.oldIndex]);
        this.tripDetail.tasks[fromTaskIndex].stops.splice(e.oldIndex, 1);
        this.tripDetail.tasks[toTaskIndex].stops.splice(e.newIndex, 0, moveStop);
        let stopCount = 0;
        forEach(this.tripDetail.tasks, (task, taskIndex) => {
            forEach(task.stops, (stop, stopIndex) => {
                if (stop) {
                    stopCount ++;
                }
                stop.stop_sequence = stopCount;
            });
        });
    }

    createNewTripAndPost() {}

    showLineHaulOrders(line: any) {
        line.showLineHaulOrders = true;
        this.$forceUpdate();
    }

    hideLineHaulOrders(line: any, e: any) {
        line.showLineHaulOrders = false;
        this.$forceUpdate();
        e.stopPropagation();
    }

    mergeTripDialog() {
        this.showMerge = true;
    }

    closeMerge() {
        this.showMerge = false;
    }

    transferTripDialog() {
        this.showTransfer = true;
    }

    closeTansfer() {
        this.showTransfer = false;
    }

    getTripDetail(tripId: any) {
        this.loadingTrip = true;
        controlPanelService.getTripDetail(tripId).subscribe(
            (res: any) => {
                this.tripDetail = res.data[0];
                this.saveTasks = cloneDeep(this.tripDetail.tasks);
                this.loadingTrip = false;
            },
            (err: any) => {
                errorHandler.handle(err);
                this.loadingTrip = false;
            }
        );
    }

    refreshTrip() {
        this.getTripDetail(this.tripDetail.trip_no);
    }

    saveMerge() {
        if (!this.mergeTripNo) {
            errorHandler.handle('Please fill in trip id');
            return;
        }
        this.mergeOrTransferTrip = true;
        this.$forceUpdate();
        let params: any = {
            tripNo: this.tripDetail.trip_no,
            targetTripId: this.mergeTripNo
        };
        controlPanelService.mergeTrip(params).subscribe(
            (res: any) => {
                this.mergeOrTransferTrip = false;
                MessageBox.alert(`Merge to ${this.mergeTripNo} success `, 'Merge Success', {
                    confirmButtonText: 'Ok',
                    callback: action => {
                        this.$store.commit('refreshOrderAndTrip', {
                            order: true,
                            trip: true
                        });
                    }
                });
            },
            (err: any) => {
                errorHandler.handle(err);
                this.mergeOrTransferTrip = false;
            }
        );
    }

    saveTransfer() {
        if (!this.transferTripData.transferTask) {
            errorHandler.handle('Please select task');
            return;
        }
        if (!this.transferTripData.transferTo) {
            errorHandler.handle('Please fill in target trip');
            return;
        }
        this.mergeOrTransferTrip = true;
        this.$forceUpdate();
        let params = {
            currentTripId: this.tripDetail.trip_no,
            targetTripId: this.transferTripData.transferTo,
            tasks: this.transferTripData.transferTask
        };
        controlPanelService.transferTrip(params).subscribe(
            (res: any) => {
                this.mergeOrTransferTrip = false;
                MessageBox.alert(`Transfer to ${this.transferTripData.transferTo} success`, 'Transfer Success', {
                    confirmButtonText: 'Ok',
                    callback: action => {
                        this.$store.commit('refreshOrderAndTrip', {
                            order: true,
                            trip: true
                        });
                    }
                });
            },
            (err: any) => {
                errorHandler.handle(err);
                this.mergeOrTransferTrip = false;
            }
        );
    }

    @Watch('show', {
        immediate: true,
    })
    showOrHide(current: any) {
        if (current) {
            this.showAdvanceDetail = true;
            if (this.type == 'Trip') {
                this.tripDetail = this.detail;
                this.saveTasks = cloneDeep(this.tripDetail.tasks);
                this.detailName = `${this.type}(${this.detail.trip_no})`;
            } else {
                this.orderDetail = this.detail;
                this.detailName = `${this.type} (Pro: ${this.detail.order_pro})`;
            }
        } else {
            this.showAdvanceDetail = false;
        }
    }

    @Watch('showAdvanceDetail')
    listenShowAdvanceDetail() {
        if (!this.showAdvanceDetail) {
            this.tripDetail.tasks = cloneDeep(this.saveTasks);
            this.$emit("setShowOrHide", this.showAdvanceDetail);
        }
    }

    get needRefresh() {
        return this.$store.state.refreshOrderAndTrip;
    }
    @Watch('needRefresh', {
        deep: true,
    })
    closeDetail() {
        this.showAdvanceDetail = false;
        this.$emit("setShowOrHide", this.showAdvanceDetail);
    }
 }