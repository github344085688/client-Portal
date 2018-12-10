
import WiseVue from "../../shared/wise-vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./customize-table.vue";
import { filter } from 'lodash-es';
@Component({
    mixins: [template],
    name: 'customize-table',

})

export default class CustomizeTable extends WiseVue {

    show: boolean = false;
    @Prop({
        default: function () {
            return [];
        }
    })
    tableFileds!: Array<any>;
    tableFiledsRet: Array<any> = [];
    mounted() {
    }

    customizeTableShow() {
        this.show = !this.show;
    }

    checkedFiled(fileds: any) {
        if (fileds) {
            fileds.checked = !fileds.checked;
            this.emitParent();
        }
    }
    emitParent() {
        this.tableFiledsRet = filter(this.tableFileds, { checked: true });
        this.$emit("selectCustomizeTable", this.tableFiledsRet);
    }

    created() {
        document.addEventListener('click', (e: any) => {
            if (!this.$el.contains(e.target)) {
                this.show = false;
            }
        });
    }

}



