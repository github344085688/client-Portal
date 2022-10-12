import { filter, forEach, cloneDeep, findIndex, find } from 'lodash-es';
import { Component, Prop, Provide, Watch, Emit, Vue } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import tlp from "./driverList.vue";
import Pager from "@components/pager/pager";
import errorHandler from "@shared/error-handler";

@Component({
    mixins: [tlp],
    components: {
        Pager
    }
})
export default class DriverList extends WiseVue {
    filterName: String = '';
    primaryCompany: any = '';
    terminalCode: any = '';
    status: any = '';
    payGroup: any = '';
    driverList: any = [];
    tavleHead: any = ['Last name', 'First name', 'Primary company', 'GP code', 'Phone', 'Vehicle', 'Terminal code', 'Paygroup', 'Status', 'Action'];

    mounted() {
        this.init();
    }

    init() {
    }
}