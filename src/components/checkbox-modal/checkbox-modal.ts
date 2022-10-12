import WiseVue from "@shared/wise-vue";
import { Component, Prop } from "vue-property-decorator";
import template from "./checkbox-modal.vue";
import Checkbox from "../checkbox/checkbox";
import ButtonSet from "../button-set/button-set";
@Component({
    mixins: [template],
    name: 'checkbox-modal',
    components: {
            Checkbox,
            ButtonSet,
        }
})

export default class AccessorialModal extends WiseVue {
    @Prop({default: "checkboxModal"})
    modalName !: string;

    @Prop({default: function() {return []; }})
    accAry !: any;

    @Prop({default: function() {return []; }})
    choseAccAry !: any;

    @Prop()
    title !: string;

    set: Set<number> = new Set<number>();
    styleObj: object = {
        overflow: 'scroll',
        overflowX: 'hidden'
    };

    validateSelected(id: number) {
        if (this.set.size > this.choseAccAry.length) {
            return this.set.has(id);
        } else {
            return  new Set<number>(this.choseAccAry).has(id);
        }
    }

    changes(id: number) {
        if (Array.from(this.choseAccAry).length > 0) {
            this.set = new Set<number>(this.choseAccAry);
            if (this.set.has(id)) {
                this.set.delete(id);
                this.$emit('updateAcc',  {modalName: this.modalName, chosedAry: Array.from(this.set)});
            } else {
                this.set.add(id);
                this.$emit('updateAcc',  {modalName: this.modalName, chosedAry: Array.from(this.set)});
            }
        } else if (!this.set || this.set.size <= 0) {
            this.set = new Set<number>();
            this.setChange(id);
        } else if (this.set.size > 0 && Array.from(this.choseAccAry).length <= 0) {
            this.setChange(id);
        }
    }
    setChange(id: any) {
         if (this.set.has(id)) {
            this.set.delete(id);
        } else {
            this.set.add(id);
        }
    }

    clearSet() {
      this.set = new Set<number>();
    }

    cancelSelect() {
        this.$emit("cancelOptional");
        this.clearSet();
        this.$modal.hide(this.modalName);
    }
    saveSelect() {
        if (this.set.size <= 0 && this.choseAccAry.length > 0) {
            this.set = new Set<number>(this.choseAccAry);
        }
        this.$emit("saveAcc", {modalName: this.modalName, chosedAry: Array.from(this.set)});
        this.$modal.hide(this.modalName);
        this.clearSet();
    }
}