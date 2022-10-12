
import WiseVue from "@shared/wise-vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./predefined-export-btn.vue";
import { filter } from 'lodash-es';
@Component({
    mixins: [template],
    name: 'predefined-export-btn',

})

export default class PredefinedExportBtn extends WiseVue {

    show: boolean = false;
    @Prop({
        default: function () {
            return [];
        }
    })
    exportDates!: Array<any>;

    @Prop({ default: "" })
    btnClass!: string;

    @Prop({ default: false })
    isLoading!: boolean;

    @Prop({ default: "" })
    value!: string;

    disabled: any = false;

    @Watch("isLoading")
    loadingStatuUpdate() {
        this.disabled = this.isLoading;
    }
    mounted() {
    }

    customizeTableShow() {
        this.show = !this.show;
    }

    selectExportName(exportName: string) {
        this.show = false;
        this.$emit("selectExportName", exportName);
    }

    created() {
        document.addEventListener('click', (e: any) => {
            if (!this.$el.contains(e.target)) {
                this.show = false;
            }
        });
    }

}



