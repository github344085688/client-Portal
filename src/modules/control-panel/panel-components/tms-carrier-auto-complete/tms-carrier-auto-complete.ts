import WiseVue from "@shared/wise-vue";
import { Component, Prop, Provide, Watch, Emit } from "vue-property-decorator";
import template from "./tms-carrier-auto-complete.vue";
import { Select, Option } from "element-ui";
import { find, unionBy, findIndex, flatMap , compact, uniqBy } from 'lodash-es';
import errorHanlder from '@shared/error-handler';
import ControlPanelService from '@services/control-panel/controlPanelService';

WiseVue.use(Select);
WiseVue.use(Option);

@Component({
    mixins: [template],
    name: 'tms-carrier-auto-complete'
})
export default class TmsCarrierAutoComplete extends WiseVue {

    @Prop({ default: false })
    clearable!: boolean;

    @Prop({ default: "" })
    value!: string;

    @Prop({ default: "" })
    tag!: string;

    @Prop({ default: "Input to search" })
    placeholder!: string;

    selectValue: any = this.value;

    loading = false;
    orgs: Array<any> = [];

    mounted() {
        if (this.value) {
            this.selectValue = '';
            this.getCarrierBySearch('', this.value);
        }
    }

    onSelectChange() {
        this.$emit("input", this.selectValue);
        this.$emit("change", find(this.orgs, { location_id: this.selectValue }));
    }

    @Watch("value")
    valueUpdate(val: any) {
        if (val) {
            this.selectValue = '';
            this.getCarrierBySearch('', val);
        } else {
            this.selectValue = "";
        }
    }

    remoteMethod(keyword: string) {
        this.getCarrierBySearch(keyword, '');
    }

    getCarrierBySearch(text: any, id: any) {
        this.loading = true;
        let params = {
            text: text,
            id: id
        };
        ControlPanelService.getCarrierList(params).subscribe(
            (res: any) => {
                this.orgs = res.data;
                if (params.id) {
                    this.selectValue = params.id;
                }
                this.loading = false;
            },
            (err: any) => {
                this.loading = false;
                errorHanlder.handle(err);
            }
        );
    }
}