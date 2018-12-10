import Vue from "vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./pictures-show.vue";
import { uniqBy } from 'lodash-es';

@Component({
    mixins: [template]
})
export default class PicturesShow extends Vue {
    @Prop({ default: [] })
    phptoList!: Array<any>;

    isShow: number = -1;

    leave() {
        this.$emit("leaves", this.isShow);
    }

}
