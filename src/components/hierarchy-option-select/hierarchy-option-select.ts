
import WiseVue from "@shared/wise-vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./hierarchy-option-select.vue";
import { filter, forEach } from 'lodash-es';
@Component({
    mixins: [template],
    name: 'hierarchy-option-select',

})

export default class HierarchyOptionSelectt extends WiseVue {

    show: boolean = false;
    @Prop({
        default: function () {
            return [];
        }
    })
    tableFileds!: Array<any>;

    @Prop({
        default: ""
    })
    selectFieldName!: string;

    @Watch("selectFieldName")
    selectFieldNameUpdate() {
        this.privateSelectFieldName = this.selectFieldName;
    }

    tableFiledsRet: Array<any> = [];

    privateSelectFieldName: string = "";


    mounted() {
        this.privateSelectFieldName = this.selectFieldName;
    }

    customizeTableShow() {
        this.show = !this.show;
    }

    filterChecked(objs: Array<any>) {
        forEach(objs, (obj: any) => {
            if (obj.checked) {
                obj.checked = false;
            }
            this.filterChecked(obj.subsets);
        });
    }

    checkedFiled(fileds: any) {
        if (!fileds.checked) {
            this.filterChecked(this.tableFileds);
            fileds.checked = true;
            this.show = !this.show;
            this.privateSelectFieldName = fileds.fieldName;
            this.emitSelectGroups({ selectGroups: fileds });
        }

    }

    emitSelectGroups(selectObj: any) {
        this.$emit('setEmitSelectGroup', selectObj);
    }
    created() {
        document.addEventListener('click', (e: any) => {
            if (!this.$el.contains(e.target)) {
                this.show = false;
            }
        });
    }

    onCreateNewLayout() {
        this.show = !this.show;
        this.$emit('setEmitCreateNewLayout');
    }

    onDeleteLayout(fileds: any, index: number) {
        this.show = !this.show;
        this.$emit('setEmitDeleteLayout', fileds, index);
    }
}