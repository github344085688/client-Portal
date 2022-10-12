import { filter, forEach, cloneDeep, findIndex, find } from 'lodash-es';
import { Component, Prop, Provide, Watch, Emit, Vue } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import tlp from "./relationship.vue";
import controlPanelService from '@services/control-panel/controlPanelService';
import errorHandler from "@shared/error-handler";
import { Switch } from 'element-ui';

Vue.use(Switch);
@Component({
    mixins: [tlp],
    components: {
    }
})
export default class Relationship extends WiseVue {
    panelList: any = [];
    allPanels: any = [];

    mounted() {
        this.getPanelList();
        this.getAllPanel();
    }

    getPanelList() {
        controlPanelService.getPanelRelationshipList().subscribe(
            (res: any) => {
                forEach(res, (panel: any) => {
                    panel.relationshipPanel = JSON.parse(panel.relationshipPanel);
                });
                this.panelList = res;
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    getAllPanel() {
        controlPanelService.getAllPanelApikeys().subscribe(
            (res: any) => {
                this.allPanels = res;
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    AddObject() {
        this.panelList.push({
            id: '',
            panelName: '',
            relationshipPanel: []
        });
    }

    filterCanAddPanel(perPanel: any) {
        let disabledAdd: Boolean = false;
        forEach(this.panelList, (panel: any) => {
            if (perPanel == panel.panelName) {
                disabledAdd = true;
            }
        });
        return disabledAdd;
    }

    goBackViewPage() {
        this.$router.replace({
            name: 'ControlPanel',
        });
    }

    goDetailPage(panel: any) {
        this.$router.replace({
            name: 'RelationDetail',
            params: {panel: panel}
        });
    }
}