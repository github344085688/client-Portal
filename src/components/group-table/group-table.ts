
import { forEach } from 'lodash-es';
import WiseVue from "@shared/wise-vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import template from "./group-table.vue";
import dragIntoGroups from "../drag-into-groups/drag-into-groups";
import HierarchyOptionSelect from "../hierarchy-option-select/hierarchy-option-select";
@Component({
    mixins: [template],
    name: 'drop-waitting-btn',
    components: {
        dragIntoGroups,
        HierarchyOptionSelect
    }

})

export default class GroupTable extends WiseVue {

    @Prop({ default: '' })
    value!: string;


    tableFileds: Array<any> = [{ checked: true, fieldName: 'Default View', viewMoudle: "Default View", subsets: [] },
    { checked: false, fieldName: 'Expanded View', viewMoudle: "Expanded View", subsets: [] }];
    currentLayout: any = {};
    isCreateNewLayout: boolean = false;
    loading: boolean = false;
    setSelectFieldName: string = '';
    mounted() {
        this.funFilterChecked(this.tableFileds);
    }

    private funFilterChecked(objs: Array<any>) {
        forEach(objs, (obj: any) => {
            if (obj.checked) {
                this.currentLayout = obj;
                this.setSelectFieldName = obj.fieldName;
            }
            this.funFilterChecked(obj.subsets);
        });
    }

    private funChangeTableFileds(objs: Array<any>, fieldName: string) {
        forEach(objs, (obj: any) => {
            if (obj.fieldName == fieldName) {
                obj.checked = true;
                this.currentLayout = obj;
                this.setSelectFieldName = obj.fieldName;
                this.$emit("setEmitLayoutList", this.currentLayout);
            } else obj.checked = false;
            this.funChangeTableFileds(obj.subsets, fieldName);
        });
    }

    getEmitSelectGroup(selectGroups: any) {
        if (this.currentLayout.fieldName != selectGroups.selectGroups.fieldName) {
            this.funChangeTableFileds(this.tableFileds, selectGroups.selectGroups.fieldName);

        }
    }

    getEmitCreateNewLayout() {
        this.isCreateNewLayout = true;
    }

    getEmitDeleteLayout(deleteGroups: any, index: number) {
        forEach(this.tableFileds, (tableFiled) => {
            if (tableFiled.viewMoudle == deleteGroups.viewMoudle) {
                tableFiled.subsets.splice(index, 1);
                if (deleteGroups.checked) {
                    this.funChangeTableFileds(this.tableFileds, tableFiled.fieldName);
                }
            }
        });
    }

    getEmitEmptyLayout() {
        this.funChangeTableFileds(this.tableFileds, this.setSelectFieldName);
    }

    getEmitCancelDropesList() {
        this.isCreateNewLayout = false;
        this.funChangeTableFileds(this.tableFileds, this.setSelectFieldName);
    }

    getEmitUpDataNewLayout(newLayout: any) {
        if (newLayout.dragLayout) {
            let newLayoutList = {
                groupLIst: newLayout.dragLayout.dropesList,
                fieldName: ' '
            };
            this.$emit("setEmitLayoutList", newLayoutList);
        }
    }

    getEmitSaveNewLayout(newLayout: any) {
        let newLayoutList = {
            checked: true,
            fieldName: newLayout.fieldName,
            groupLIst: newLayout.dropesList,
            viewMoudle: this.currentLayout.viewMoudle,
        };
        forEach(this.tableFileds, (filed) => {
            if (filed.viewMoudle == this.currentLayout.viewMoudle) {
                filed.subsets = [...filed.subsets, ...[newLayoutList]];
            }
        });
        this.funChangeTableFileds(this.tableFileds, newLayout.fieldName);
        this.setSelectFieldName = this.currentLayout.fieldName;
        this.isCreateNewLayout = false;
        this.loading = false;
    }
}