import { filter, forEach, cloneDeep, findIndex, find } from 'lodash-es';
import { Component, Prop, Provide, Watch, Emit, Vue } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import tlp from "./tmsMessageCenter.vue";
import errorHandler from "@shared/error-handler";

@Component({
    mixins: [tlp],
    components: {}
})
export default class TmsMessageCenter extends WiseVue {
    tmsMessageUrl: any = '';

    created() {
        this.tmsMessageUrl = TMS_MESSAGE_URL;
    }
}