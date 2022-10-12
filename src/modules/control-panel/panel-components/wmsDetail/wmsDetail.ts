import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import { Dialog } from 'element-ui';
import { cloneDeep, forEach } from 'lodash';
import template from "./wmsDetail.vue";
import { Checkbox, Upload, MessageBox } from 'element-ui';
import errorHandler from '@shared/error-handler';

@Component({
    mixins: [template],
    name: 'wmsDetail',
    components: {}
})
export default class WMSDetail extends Vue {

    wmsDetail: any = {};
    detailType: string = '';
    showWMSDetail: Boolean = false;
    loadingWMS: Boolean = false;

    @Prop({
        default: function () {
            return {};
        }
    })
    wmsId!: any;

    @Prop({
        default: function () {
            return {};
        }
    })
    wmsOrder!: any;

    @Prop({ default: false })
    show!: Boolean;

    @Watch('show')
    showDetail() {
        if (this.show) {
            this.showWMSDetail = true;
            this.wmsDetail = this.wmsOrder;
            this.detailType = this.wmsDetail.id.substring(0, 2);
        } else {
            this.showWMSDetail = false;
        }
    }

    closeDialog() {
        this.showWMSDetail = false;
        this.$emit('closeWMSDetail', true);
    }
}