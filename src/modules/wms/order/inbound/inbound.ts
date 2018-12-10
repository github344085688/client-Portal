import { Component, Prop, Provide } from "vue-property-decorator";
import WiseVue from "../../../../shared/wise-vue";
import tlp from "./inbound.vue";
import { Subscription } from 'rxjs/Subscription';
import Datepicker from 'vuejs-datepicker';
import organizaitonService from '../../../../services/organization-service';
import ElementSelect from "../../../../components/element-select/element-select";
import UserProfileSidebar from "../../../../components/layout/user-profile-sidebar";
import AddressAutoComplete from "../../../../components/address-auto-complete/address-auto-complete";
import ItemAutoComplete from "../../../../components/itemspec-auto-complete/itemspec-auto-complete";
import OrganizationAutoComplete from "../../../../components/organization-auto-complete/organization-auto-complete";



@Component({
    mixins: [tlp],
    components: {
        Datepicker,
        ElementSelect,
        OrganizationAutoComplete,
        UserProfileSidebar,
        ItemAutoComplete,
        AddressAutoComplete
    }
})
export default class Inbound extends WiseVue {

    soldTo = {};
    receipt = {};
    address = {};
    selectChange(payload: any) {
        this.soldTo = payload ? payload : {};
    }

    itemSelectChange(payload: any) {
        this.receipt = payload ? payload : {};
    }

    selectAddressChange(payload: any) {
        this.address = payload ? payload : {};
    }
    mounted() {
        organizaitonService.get("ORG-1").subscribe(
            org => {
                this.soldTo = org.basic;
            }
        );
    }
}