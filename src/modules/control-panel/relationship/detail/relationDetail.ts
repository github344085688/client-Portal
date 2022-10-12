import { filter, forEach, cloneDeep, findIndex, find } from 'lodash-es';
import { Component, Prop, Provide, Watch, Emit, Vue } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import tlp from "./relationDetail.vue";
import WaittingBtn from '@components/waitting-button/waitting-btn';
import controlPanelService from '@services/control-panel/controlPanelService';
import errorHandler from "@shared/error-handler";
@Component({
    mixins: [tlp],
    components: {
        WaittingBtn
    }
})
export default class RelationDetail extends WiseVue {
    panelName: String = '';
    panelId: any = '';
    panelRelationshipList: any = [];
    panelApikeys: any = [];
    allApikeys: any = {};
    allPanel: any = [];
    addPanel: any = '';
    saving: Boolean = false;

    created() {
        this.getPanelName();
        this.getPanelRelationship();
        this.getAllPanelApikes();
    }

    getPanelRelationship() {
        controlPanelService.getPanelRelationshipDetail(this.panelName).subscribe(
            (res: any) => {
                if (res[0]) {
                    this.panelId = res[0].id;
                    this.panelApikeys = JSON.parse(res[0].apiKeys);
                    this.panelRelationshipList = JSON.parse(res[0].relationship) || [];
                }
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    filterCanChoose(allApiRelationship: any, leftKey: any, rightKey: any) {
        let filterResult: Boolean = false;
        forEach(allApiRelationship, (apiRelationship: any) => {
            if (leftKey == apiRelationship.linkkey && rightKey == apiRelationship.targetKey) {
                filterResult = true;
            }
        });
        return filterResult;
    }

    getAllPanelApikes() {
        controlPanelService.getAllPanelApikeys().subscribe(
            (res: any) => {
                forEach(res, (item, index) => {
                    if (item.panelName != this.panelName) {
                        this.allPanel.push(item.panelName);
                    }
                    this.allApikeys[item.panelName] = JSON.parse(item.apiKeys);
                });
                this.$forceUpdate();
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    getPanelName() {
        this.panelName = this.$route.params.panel;
    }

    addApiRelationship(targetPanel: any) {
        targetPanel.relationshipList.push({
            isDefault: false,
            isOpen: true,
            linkkey: "",
            linkkeyName: "",
            relationshipType: 1,
            targetKey: "",
            targetKeyName: "",
        });
    }

    removeApiRelationship(targetPanel: any, index: any) {
        this.popups({
            title: 'Delete',
            content: 'Are you sure delete this field relationship?',
            cancel: 'No',
            confirm: 'Yes'
        }).then(() => {
            targetPanel.relationshipList.splice(index, 1);
            console.log(targetPanel.relationshipList);
        });
    }

    addPanelRelationship() {
        if (!this.addPanel) {
            return;
        }
        let filterObj = filter(this.panelRelationshipList, (o: any) => {
            return o.targetPanel == this.addPanel;
        });
        if (filterObj.length > 0) {
            errorHandler.handle(`Relationship for ${this.panelName} is already exists.`);
            return;
        }
        this.panelRelationshipList.push({
            targetPanel: this.addPanel,
            relationshipList: [
                {
                    isDefault: false,
                    isOpen: true,
                    linkkey: "",
                    linkkeyName: "",
                    relationshipType: 1,
                    targetKey: "",
                    targetKeyName: "",
                }
            ]
        });
        this.addPanel = '';
    }

    updatePanelRelationship() {
        this.saving = true;
        let updatePanelInfo: any = {
            id: this.panelId,
            panelName: this.panelName,
            apiKeys: this.panelApikeys,
            relationship: cloneDeep(this.panelRelationshipList)
        };
        // this.removeEmptyRelationShip(updatePanelInfo.relationship);
        controlPanelService.updatePanelRelationship(updatePanelInfo).subscribe(
            (res: any) => {
                this.saving = false;
                this.popups({
                    title: 'Update Relationship',
                    content: 'Save Successful',
                    confirm: 'OK'
                }).then(
                    (res: any) => {
                        this.$router.go(0);
                    }
                );
            },
            (err: any) => {
                errorHandler.handle(err);
                this.saving = false;
            }
        );
    }

    removeEmptyRelationShip(relationship: any) {
        forEach(relationship, (panel: any, index: any) => {
            if (panel.relationshipList.length == 0) {
                relationship.splice(index, 1);
            } else {
                forEach(panel.relationshipList, (perShip: any, perIndex: any) => {
                    if (!perShip.linkkey || !perShip.targetKey) {
                        panel.relationshipList.splice(perIndex, 1);
                    }
                });
            }
        });
    }

    changeSelect(type: String, apiRelationship: any, apiArr: any) {
        if (type == 'link') {
            apiRelationship.linkkeyName = filter(apiArr, (o) => {
                return o.api == apiRelationship.linkkey;
            })[0].apiName;
        } else {
            apiRelationship.targetKeyName = filter(apiArr, (o) => {
                return o.api == apiRelationship.targetKey;
            })[0].apiName;
        }
    }

    goBackPanelRelationList() {
        this.$router.replace({
            name: 'Relationship',
        });
    }
}