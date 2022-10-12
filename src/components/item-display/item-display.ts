
import WiseVue from "@shared/wise-vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import template from "./item-display.vue";


@Component({
    mixins: [template],
    name: 'ItemDisplay',
})
export default class ItemDisplay extends WiseVue {
    @Prop({default: ''})
    item!: any;

    itemName: string = '';

    @Watch("item", { deep : true })
    watchItem(val: any) {
        console.log(val);
        if (val) this.itemName = this.fiterItemName(val);
    }

    mounted() {
        if (this.item) this.itemName = this.fiterItemName(this.item);
    }

    private  fiterItemName(item: any) {
        let itemName = '';
        let scopeItemSpec: any = {};
        if (item.name) {
            scopeItemSpec = item;
        } else if (item.itemSpecName) {
            scopeItemSpec.name = item.itemSpecName;
            scopeItemSpec.desc = item.itemSpecDesc;
            scopeItemSpec.shortDescription = item.shortDescription;
        } else if (item.itemName) {
            scopeItemSpec.name = item.itemName;
            scopeItemSpec.desc = item.itemDesc;
            scopeItemSpec.shortDescription = item.shortDescription;
        }
        let itemDisplayName = scopeItemSpec.name;
        if (scopeItemSpec.shortDescription && scopeItemSpec.desc) {
            itemName = itemDisplayName + " (" + scopeItemSpec.shortDescription + ")";
        } else if (scopeItemSpec.shortDescription) {
            itemName = itemDisplayName + " (" + scopeItemSpec.shortDescription + ")";
        } else if (scopeItemSpec.desc) {
            itemName = itemDisplayName + " (" + scopeItemSpec.desc + ")";
        } else {
            itemName = itemDisplayName;
        }

        return itemName;
    }
}