
import WiseVue from "@shared/wise-vue";
import { Component, Prop } from "vue-property-decorator";
import template from "./tags-input.vue";
import { forEach, trim, compact, flattenDeep } from "lodash-es";
@Component({
    mixins: [template],
    name: 'tags-input',

})

export default class RadioBtn extends WiseVue {

    @Prop({
        default: () => {
           return [];
        }
    })
    value!: any;
    @Prop({
        default: ''
    })
    fill!: string;
    @Prop({
        default: false
    })
    upperCase!: Boolean;
    @Prop({
        default: 'Enter'
    })
    placeholder!: string;
    text: string = '';
    keyCode: string = '';

    add(txt: string) {
        if (txt != '') {
            txt = txt.replace(/[\r\n]/g, "");
            txt = trim(txt);
            if (txt.length > 0) {
                if (!this.hasPrefix(txt)) {
                    txt = `${this.fill}${txt}`;
                }
                if (this.value.indexOf(txt) == -1) {
                    this.value.push(txt);
                }
                this.text = "";
            }
        }
        if (this.upperCase) {
            this.upperCaseText(this.value);
        }
        this.$emit("input", this.value);
        if (txt != '') {
            this.$emit("addTags", this.value);
        }
    }

    split(txt: string) {
        if (txt != '' && this.keyCode === 'v') {
            let _this = this;
            let valueList: Array<any> = [];
            let txtList = txt.split(",");
            if (this.upperCase) {
                this.upperCaseText(this.value);
            }
            forEach(txtList, function(text) {
                valueList.push(trim(text).split("\n"));
            });
            valueList = compact(flattenDeep(valueList));
            forEach(valueList, function (text) {
                if (!_this.hasPrefix(trim(text))) {
                    text = `${_this.fill}${trim(text)}`;
                }
                if (_this.value.indexOf(trim(text)) == -1) {
                    _this.value.push(trim(text));
                }
            });
            this.text = "";
        }
        this.$emit("input", this.value);
    }

    private hasPrefix(inputTxt: string) {
    return inputTxt.indexOf(this.fill) > -1;
    }

    upperCaseText(listArr: Array<any>) {
        forEach(listArr, function (text, index) {
            listArr[index] = text.toUpperCase();
        });
    }

    del(index: number, tag: string) {
        if (!tag) {
            this.$emit("removeTags", this.value[index]);
            this.value.splice(index, 1);
        }
        this.$emit("input", this.value);
    }
    delTip(index: number) {
        this.$emit("removeTags", this.value[index]);
        this.value.splice(index, 1);
        this.$forceUpdate();
        this.$emit("input", this.value);
    }

    created() {
        let _this = this;
        document.addEventListener('keydown', function(event) {
            _this.keyCode = event.key;
        });
    }
}



