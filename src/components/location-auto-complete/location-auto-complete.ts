import WiseVue from "../../shared/wise-vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import template from "./location-auto-complete.vue";
import { find, unionBy, findIndex } from 'lodash-es';
import locationService from "../../services/tms/tms-location-service";
import errorHanlder from '../../shared/error-handler';

@Component({
    mixins: [template],
    name: 'location-auto-complete'
})
export default class LocationAutoComplete extends WiseVue {


    @Prop({ default: false })
    clearable!: boolean;

    @Prop({ default: "" })
    extParam!: object;

    @Prop({ default: "" })
    value!: string;

    @Prop({ default: "" })
    statuses!: string;

    @Prop({ default: "" })
    placeholder!: string;

    selectValue: any = "";

    loading = false;
    locations: Array<any> = [];


    onSelectChange() {
        this.$emit("input", this.selectValue);
        let location = find(this.locations, { location_id: this.selectValue });
        this.$emit("change", location );
    }

    remoteMethod(keyword: string) {
        this.searchItem(keyword);
    }

    @Watch("value")
    valueUpdate() {
        this.getItemById(this.value);
    }

    getItemById(id: string) {
        if (this.value && findIndex(this.locations, { location_id: this.selectValue}) < 0) {
            this.searchItem(id);
        }
    }

    private setupSearchParameter(keyword: string) {
        let parameter: any = { paging: { pageNo: 1, limit: 10 } };
        if (this.statuses) {
            parameter.statuses = this.statuses;
        }
        if (keyword) {
            parameter.keyword = keyword;
        }
        return parameter;
    }



    private searchItem(keyword: string) {
        let param = this.setupSearchParameter(keyword);
        this.loading = true;
        this.unsubcribers.push(locationService.search(param).subscribe(
            res => {
                this.locations = res.data;
                this.loading = false;
            },
            err => {
                this.loading = false;
            }
        ));
    }

}