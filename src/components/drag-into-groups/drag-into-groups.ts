import { forEach, clone } from 'lodash-es';
import WiseVue from "@shared/wise-vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import template from "./drag-into-groups.vue";
import LodingNode from "../loding-node/loding-node";
import PredefinedDialogs from "../predefined-dialogs/predefined-dialogs";
@Component({
    mixins: [template],
    name: 'drag-into-groups',
    components: {
        LodingNode,
        PredefinedDialogs
    }
})

export default class DragIntoGroups extends WiseVue {

    @Prop({ default: '' })
    value!: string;


    @Prop({ default: false })
    isDragIntoGroups!: boolean;

    @Watch("newLayou", { deep: true })
    newLayouUpdate() {
        this.isInputError = false;
    }

    partValue: string = '';
    dropesList: Array<any> = [];
    isLoading: boolean = false;
    isPopUp: boolean = false;
    newLayou: any = {};
    inputPlaceholder: string = 'Please enter a name';
    isInputError: boolean = false;
    isSaveLayoutAs: boolean = false;
    mounted() {

    }

    onDrop(event: any, ppindex: any) {
        if (this.dropesList.findIndex((item: any) => item.value === this.value) > -1) return;
        this.dropesList.push({ value: this.value });
        this.isSaveLayoutAs = true;
        this.funEmitSaveCreateNewLayout({ dragLayout: {dropesList: this.dropesList} });
    }

    onAllowDrop(event: any) {
        event.preventDefault();
    }

    onSortOrders(value: any) {
        value.sort = -value.sort;
        this.funEmitSaveCreateNewLayout({ dragLayout: {dropesList: this.dropesList} });
        this.$forceUpdate();
    }

    onRemoveDropesList(item: any, index: number) {
        delete item.sort;
        this.dropesList.splice(index, 1);
        if (this.dropesList.length > 0) {
            this.funEmitSaveCreateNewLayout({ dragLayout: {dropesList: this.dropesList}  });
        } else {
            this.isSaveLayoutAs = false;
            this.$emit("setEmitEmptyLayout");
        }
    }

    onCancelDropesList() {
        this.$emit("setEmitCancelDropesList");
    }

    onSaveLayoutAs() {
        if (this.dropesList.length > 0) {
            this.isPopUp = true;
        }
    }

   private funEmitSaveCreateNewLayout(Layout: any) {
        this.$emit("setEmitUpDataNewLayout", Layout);
    }

    onPermutationItems(list: any, index: number) {
        forEach(this.dropesList, (list) => {
            delete list.sort;
        });
        this.dropesList[index].sort = 1;
        this.funEmitSaveCreateNewLayout({ dragLayout: {dropesList: this.dropesList} });
        this.$forceUpdate();
    }

    onPopUpCancel() {
        this.isPopUp = false;
        this.isLoading = false;
        if (this.newLayou.fieldName) {
            this.newLayou.fieldName = '';
        }
    }

    onSaveNewLayou() {
        if (!this.newLayou.fieldName) {
            this.inputPlaceholder = 'You have to enter a name!';
            this.isInputError = true;
            return;
        }
        this.newLayou.dropesList =  this.dropesList;
        this.isLoading = true;
        this.$emit("setEmitSaveNewLayout", this.newLayou);
    }
}