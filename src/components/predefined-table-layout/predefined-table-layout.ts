import WiseVue from "@shared/wise-vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./predefined-table-layout.vue";
import customizationService from "@services/wms/customization-service";
import session from '@shared/session';
import { forEach, remove, filter, cloneDeep, find, trimEnd } from 'lodash-es';
import PredefinedDialogs from "../predefined-dialogs/predefined-dialogs";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import errorHanlder from '@shared/error-handler';
import util from '@shared/util';
@Component({
    mixins: [template],
    name: 'predefined-table-layout',
    components: {
        PredefinedDialogs,
        WaittingBtn
    }
})

export default class PredefinedTableLayout extends WiseVue {

    @Prop({ default: "" })
    reportCategory!: string;

    @Prop({ default: false })
    isShowModes!: boolean;

    @Watch("reportCategory")
    onReportCategoryChange() {
        this.show = false;
        this.selectedLayoutName = "Select Layout";
        this.searchCustomizationGroupView();
    }

    groupViewCustomization: any = { groupColumns: [], sortFields: [] };
    groupViewLayouts: any = [];
    show: boolean = false;
    isCreateLayout: boolean = false;
    isPopDialog: boolean = false;
    loading: boolean = false;
    selectedLayoutName: string = "Select Layout";
    selectedViewModeName: string = "Nested Layout";
    showMode: boolean = false;
    viewModes: any = ['Nested Layout', 'Flat Layout'];
    onClickViewModeSelect() {
        this.showMode = !this.showMode;
        this.show = false;
    }

    onSelecViewMode(viewMode: string) {
        this.selectedViewModeName = viewMode;
        this.showMode = false;
        this.emitSelectViewMode();
    }

    onClickLayoutSelect() {
        this.show = !this.show;
    }

    onClickIsCreateNewLayout() {
        this.isCreateLayout = true;
        this.initGroupViewLayouts();
        this.emitSelectLayout();
    }

    onClickDefaultLayout() {
        this.show = false;
        this.initGroupViewLayouts();
        this.emitSelectLayout();
    }

    private initGroupViewLayouts() {
        this.groupViewLayouts.forEach((item: any) => {
            item.selected = false;
        });
        this.selectedLayoutName = "Select Layout";

    }

    onClickDeleteLayout(layout: any, index: number) {
        util.deleteMessageBox(`Are you sure would like to delete layout '${layout.name}' ?`, 'Delete Layout', () => {
            customizationService.deleteCustomizationGroupView(layout.id).subscribe((res) => {
                util.popUpSucceedMessage("Delete success!");
                if (layout.name === this.selectedLayoutName) {
                    this.selectedLayoutName = 'Select Layout';
                }
                this.groupViewLayouts.splice(index, 1);
                this.emitSelectLayout();
            }, (err) => {
                errorHanlder.handle(err);
            });
        });
    }

    onDrop(event: any) {
        let dragText = event.dataTransfer.getData('Text');
        dragText = trimEnd(dragText);
        if (this.groupViewCustomization.groupColumns.findIndex((item: any) => item === dragText) > -1) return;
        this.groupViewCustomization.groupColumns.push(dragText);
        this.groupViewCustomization.sortFields.push({ name: dragText, sort: null });
        this.emitDragColumn();
    }

    onAllowDrop(event: any) {
        event.preventDefault();
    }

    onSelectLayout(layout: any) {

        this.groupViewLayouts.forEach((item: any) => {
            item.selected = false;
        });
        layout.selected = true;
        this.selectedLayoutName = layout.name;
        this.show = false;
        this.emitSelectLayout();
    }

    onSortField(dropItem: any) {
        if (dropItem.sort === 'asc') {
            dropItem.sort = 'desc';
        } else {
            dropItem.sort = 'asc';
        }
        this.emitDragColumn();
    }

    onRemoveFieldName(dropItem: any) {
        remove(this.groupViewCustomization.groupColumns, (item: any) => item === dropItem.name);
        remove(this.groupViewCustomization.sortFields, (item: any) => item.name === dropItem.name);
        this.$forceUpdate();
        this.emitDragColumn();
    }

    onCancelLayout() {
        this.isCreateLayout = false;
        this.show = false;
        this.showMode = false;
        this.groupViewCustomization = { groupColumns: [], sortFields: [] };
        this.emitDragColumn();
    }

    onPopUpDialog() {
        this.isPopDialog = true;
    }

    onPopUpCancel() {
        this.isPopDialog = false;
    }

    onSaveLayout() {
        this.createCustomizationGroupView();
    }

    private searchCustomizationGroupView() {
        let params = { userId: session.getUserId(), reportCategories: [this.reportCategory] };
        customizationService.searchCustomizationGroupView(params).subscribe((res) => {
            this.groupViewLayouts = res;
        }, (err) => {
            errorHanlder.handle(err);
        });
    }

    private createCustomizationGroupView() {
        let params: any = { userId: session.getUserId(), reportCategory: this.reportCategory };
        params.groupColumns = this.groupViewCustomization.groupColumns;
        params.name = this.groupViewCustomization.name;
        if (!this.groupViewCustomization.name) {
            return;
        }
        this.loading = true;
        customizationService.createCustomizationGroupView(params).subscribe((res) => {
            this.loading = false;
            let newLayout = cloneDeep(params);
            newLayout.id = res.id;
            newLayout.selected = true;
            this.groupViewLayouts.push(newLayout);

            this.selectedLayoutName = newLayout.name;
            util.popUpSucceedMessage("Save success!");
            this.groupViewCustomization = { groupColumns: [], sortFields: [] };
            this.show = false;
            this.isCreateLayout = false;
            this.isPopDialog = false;
        }, (err) => {
            errorHanlder.handle(err);
        });
    }

    private emitDragColumn() {
        this.$emit("groupViewLayoutChange", this.groupViewCustomization);
    }

    private emitSelectLayout() {
        this.$emit("groupViewLayoutChange", find(this.groupViewLayouts, { selected: true }));
    }

    private emitSelectViewMode() {
        this.$emit("viewModeChange", this.selectedViewModeName);
    }

    mounted() {
        this.searchCustomizationGroupView();
    }

    created() {
        document.addEventListener('click', (e: any) => {
            if (!this.$el.contains(e.target)) {
                if (this.show) {
                    this.show = false;
                }
                if (this.showMode) {
                    this.showMode = false;
                }

            }
        });
    }
}



