import WiseVue from "@shared/wise-vue";
import { Component, Prop, Provide, Watch, Emit } from "vue-property-decorator";
import template from "./tms-trailer-auto-complete.vue";
import { Select, Option } from "element-ui";
import { find, unionBy, findIndex, flatMap , compact, uniqBy } from 'lodash-es';
import errorHanlder from '@shared/error-handler';
import Session from '@shared/session';
import ControlPanelService from '@services/control-panel/controlPanelService';

WiseVue.use(Select);
WiseVue.use(Option);

@Component({
    mixins: [template],
    name: 'tms-trailer-auto-complete'
})
export default class TmsTrailerAutoComplete extends WiseVue {

    @Prop({ default: false })
    clearable!: boolean;

    @Prop({ default: "" })
    value!: string;

    @Prop({ default: "" })
    tag!: string;

    @Prop({ default: "" })
    searchText!: string;

    @Prop({ default: "Input to search" })
    placeholder!: string;

    selectValue: any = this.value;

    loading = false;
    orgs: Array<any> = [];
    companyId: string | number = '';

    mounted() {
        if (this.value) {
            this.selectValue = '';
            this.getTrailerBySearch(this.value);
        }
    }

    onSelectChange() {
        this.$emit("input", this.selectValue);
        this.$emit("change", find(this.orgs, { vehicle_id: this.selectValue }));
        this.$forceUpdate();
    }

    @Watch("value")
    valueUpdate(val: any) {
        if (!val) {
            this.selectValue = '';
        }
    }

    @Watch('searchText')
    selectValueFun() {
        if (this.searchText) {
            this.selectValue = this.searchText;
        }
    }

    remoteMethod(keyword: string) {
        this.getTrailerBySearch(keyword);
    }

    getCompanyId() {
        let companyInfo = Session.getAssignedCompanyFacilities();
        if (companyInfo) {
            this.companyId = companyInfo[0].companyId;
        }
    }

    getTrailerBySearch(text: any) {
        this.loading = true;
        this.getCompanyId();
        ControlPanelService.searchTrailer(text, this.companyId).subscribe(
            (res: any) => {
                this.orgs = res.data;
                this.loading = false;
            },
            (err: any) => {
                this.loading = false;
                errorHanlder.handle(err);
            }
        );
    }
}