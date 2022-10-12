import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import { Dialog } from 'element-ui';
import { cloneDeep, forEach } from 'lodash';
import template from "./tripDetail.vue";
import { Checkbox, Upload, MessageBox } from 'element-ui';
import errorHandler from '@shared/error-handler';
import NewTrip from '@panelComponents/newTrip/newTrip';
import controlPanelService from '@services/control-panel/controlPanelService';
import WaittingBtn from '@components/waitting-button/waitting-btn';
import AdvanceDetail from '@panelComponents/advanceDetail/advanceDetail';
import TripTools from '@panelComponents/tripTools/tripTools';
import VueDragDrop from 'vue-drag-drop';
import Draggable from 'vuedraggable';

Vue.use(Dialog);
Vue.use(Checkbox);
Vue.use(Upload);
Vue.use(VueDragDrop);
@Component({
    mixins: [template],
    name: 'tripDetail',
    components: {
        NewTrip,
        WaittingBtn,
        AdvanceDetail,
        Draggable,
        TripTools
    }
})
export default class TripDetail extends Vue {

    tripDetail: any = {};
    showTripDetail: Boolean = false;
    // isEditTrip: Boolean = false;
    showAdvanceDetails: Boolean = false;
    excludeLinkedFiles: Boolean = false;
    orderFiles: any = [];
    mergeOrTransferTrip: Boolean = false;
    mergeTripNo: string = '';
    showMerge: Boolean = false;
    showTransfer: boolean = false;
    selectTools: Array<any> = [true, false, false];
    transferTripData: any = {
        transferTask: [],
        transferTo: ''
    };
    saveTripLoading: Boolean = false;
    viewSortDesending: Boolean = false;

    dataList: Array<any> = [];
    currentTrip: any = {};
    loadingTrip: boolean = false;
    saveTasks: any = {};

    @Prop({
        default: function () {
            return {};
        }
    })
    tripId!: any;

    @Prop({ default: false })
    show!: Boolean;

    @Watch('show')
    showDetail() {
        this.showMerge = false;
        this.showTransfer = false;
        this.transferTripData = {
            transferTask: [],
            transferTo: ''
        };
        if (this.show) {
            this.showTripDetail = true;
            this.getTripDetail(this.tripId);
        } else {
            this.showTripDetail = false;
            this.tripDetail = {};
        }
    }

    getTripDetail(tripId: any) {
        this.loadingTrip = true;
        controlPanelService.getTripDetail(tripId).subscribe(
            (res: any) => {
                this.loadingTrip = false;
                this.tripDetail = res.data || {};
                this.saveTasks = cloneDeep(this.tripDetail.tasks);
            },
            (err: any) => {
                this.loadingTrip = false;
                errorHandler.handle(err);
                this.showTripDetail = false;
            }
        );
    }

    refreshTrip() {
        this.getTripDetail(this.tripDetail.trip_no);
    }

    closeDialog() {
        this.tripDetail.tasks = cloneDeep(this.saveTasks);
        this.$emit('closeTripDetail', true);
    }

    advanceDetail(trip: any) {
        this.currentTrip = trip;
        this.showAdvanceDetails = true;
        this.$emit('closeTripDetail', true);
    }

    saveTrip() {
        this.saveTripLoading = true;
        let tasks = {
            tasks: this.tripDetail.tasks
        };
        controlPanelService.moveTaskStop(this.tripDetail.trip_no, tasks).subscribe(
            (res: any) => {
                this.saveTripLoading = false;
                MessageBox.alert(`Edit stop success`, 'Save Success', {
                    confirmButtonText: 'Ok',
                    callback: action => {
                        this.$store.commit('refreshOrderAndTrip', {
                            order: false,
                            trip: true
                        });
                    }
                });
            },
            (err: any) => {
                this.saveTripLoading = false;
                errorHandler.handle(err);
            }
        );
    }

    editTripTask() {
        this.showTripDetail = true;
        this.$store.commit('isEditTrip', true);
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

    showLineHaulOrders(line: any) {
        line.showLineHaulOrders = true;
        this.$forceUpdate();
    }

    hideLineHaulOrders(line: any, e: any) {
        line.showLineHaulOrders = false;
        this.$forceUpdate();
        e.stopPropagation();
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

    setShowOrHideFun(res: any) {
        this.showAdvanceDetails = res;
    }
    selectToolsFun(index: any) {
        this.selectTools = [false, false, false];
        this.selectTools[index] = true;
    }
}