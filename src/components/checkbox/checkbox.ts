import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import template from "./checkbox.vue";


@Component({
    mixins: [template],
    name: 'checkbox',
})
export default class Checkbox extends Vue {
    @Prop({default: 'Stackable?'})
    content!: string;

    @Prop()
    listIndex!: number;

    @Prop()
    id!: number;

    @Prop()
    styleDown!: string;

    @Prop({default: false})
    isSelect!: boolean;

    @Prop({default: true})
    resets!: boolean;

    @Prop()
    calculating!: boolean;

    isModify: boolean = false;
    checked: boolean = false;

    @Watch("resets")
    reset() {
       this.checked = false;
    }
    onClick() {
        if (!this.calculating) {
            this.checked = !this.checked;
        }
    }
    selected() {
            this.onClick();
            this.$emit('changeSelect', {listIndex: this.listIndex, id: this.id, checked: this.checked});
        }
    mounted() {
          if (this.styleDown) {
                this.isModify = !this.isModify;
        }
        this.checked = this.isSelect;
    }
}