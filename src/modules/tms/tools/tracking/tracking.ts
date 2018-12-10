import errorHandler from "../../../../shared/error-handler";
import WiseVue from "../../../../shared/wise-vue";

import tlp from "./tracking.vue";
import { Component } from "vue-property-decorator";
import tmsTrackingService from "../../../../services/tms/tms-tracking-service";
import WaittingBtn from "../../../../components/waitting-button/waitting-btn";
import TrackProcessBar from "../../../../components/trackProcessBar/track-process-bar";

@Component({
    mixins: [tlp],
    components: {
        TrackProcessBar,
        WaittingBtn
    }
})
export default class TrackShipments extends WiseVue {

    searchParams: any = {pro: '', search_ref: true};
    data: any  = "";
    loading: boolean = false;

    data_no_found: boolean = true;
    is_init: boolean = true;

    private init() {
        let order_pro = this.$route.query['order_pro'];

        if (order_pro) {
            this.searchParams.pro = order_pro;
            this.searchParams.search_ref = false;
            this.searchOrderHistoryByPro();
        }
    }

    hasData() {
       return this.data && this.isObject(this.data.history);
    }

    isObject(o: any) {
        return Object.prototype.toString.call(o) === '[object Object]';
    }


    searchOrderHistoryByPro() {

        this.loading = true;
        this.data = "";
        tmsTrackingService.search(this.searchParams).subscribe(
            res => {
                this.is_init = false;
                this.loading = false;
                if (res.status == 200) {
                    this.data = res['data'];
                    if (!this.data || !this.isObject(this.data) || !this.data['tms_order_id']) {
                        this.data_no_found = true;
                        this.data = "";
                    } else {
                        this.data_no_found = false;
                    }
                    this.searchParams.search_ref = true;
                } else {
                    errorHandler.handle(res['error']);
                    this.searchParams.search_ref = true;
                    this.data_no_found = false;
                    this.data = "";
                }

            },
            err => {
                this.is_init = false;
                this.loading = false;
                this.searchParams.search_ref = true;
                this.data_no_found = false;
                this.data = "";
                errorHandler.handle(err);
            }
        );
    }


    mounted() {
        this.init();
    }
}

