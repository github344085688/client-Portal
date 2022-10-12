import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import template from "./notifications.vue";
import ControlPanelService from '@services/control-panel/controlPanelService';
import * as Moment from 'moment';
import errorHandler from "@shared/error-handler";

@Component({
    mixins: [template],
    name: 'notifications',
    components: {}
})
export default class Notifications extends Vue {

    notificationList: any = [];
    loadNtification: Boolean = false;
    notificationUrl: string = '';
    searchParams: any = {
        trip_start_date: '',
        trip_end_date: '',
        page_size: 9999999,
        page: 1
    };
    clientId: any = '';

    mounted() {
        this.init();
    }

    async init() {
        this.clientId = await this.getTmsClientId();
        if (this.clientId) {
            this.notificationUrl = `${MESSAGE_URL}//Noticication?ClientId=${this.clientId}`;
        } else {
            errorHandler.handle('ClientId error');
        }
    }

    getTmsClientId() {
        return new Promise((resolve: any, reject: any) => {
            ControlPanelService.getTmsClientId().subscribe(
                (res: any) => {
                    if (res) {
                        resolve(res);
                    } else {
                        reject('');
                    }
                },
                (err: any) => {
                    reject('');
                    errorHandler.handle(err);
                }
            );
        });
    }

    // getNotification() {
    //     this.loadNtification = true;
    //     ControlPanelService.getNotificationData(this.searchParams).subscribe(
    //         (res: any) => {
    //             this.notificationList = res.data;
    //             this.loadNtification = false;
    //         },
    //         (err: any) => {
    //             errorHandler.handle(err);
    //             this.loadNtification = false;
    //         }
    //     );
    // }

    // get watchTripPanelTime() {
    //     return this.$store.state.advanceSearchParams.Trip.time;
    // }
    // @Watch('watchTripPanelTime', {
    //     deep: true,
    // })
    // searchNotificationByTimeRange(time: any) {
    //     this.searchParams.trip_start_date = time[0];
    //     this.searchParams.trip_end_date = time[1];
    //     this.getNotification();
    // }
}