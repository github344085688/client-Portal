import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import template from "./tripLog.vue";
import controlPanelService from "@services/control-panel/controlPanelService";
import errorHandler from "@shared/error-handler";

@Component({
    mixins: [template],
    name: 'tripLog',
    components: {}
})
export default class TripLog extends Vue {
    tripLogArr: any = [];
    currentTrip: any = '';
    getLogLoading: Boolean = false;

    get watchTripLog() {
        return this.$store.state.tripLog;
    }

    @Watch('watchTripLog', {
        deep: true
    })
    initOrderHistory() {
        this.currentTrip = this.$store.state.tripLog.tripNo;
        this.getTripLogs();
    }

    getTripLogs() {
        this.getLogLoading = true;
        controlPanelService.getTripLog(this.currentTrip).subscribe(
            (res: any) => {
                this.tripLogArr = res.logs;
                this.getLogLoading = false;
            },
            (err: any) => {
                errorHandler.handle(err);
                this.getLogLoading = false;
            }
        );
    }
}