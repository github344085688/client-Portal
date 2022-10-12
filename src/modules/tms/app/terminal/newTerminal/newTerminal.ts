import { filter, forEach, cloneDeep, findIndex, find } from 'lodash-es';
import { Component, Prop, Provide, Watch, Emit, Vue } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import tlp from "./newTerminal.vue";
import UnisProductModal from "@components/unisProductModal";
import WaittingBtn from '@components/waitting-button/waitting-btn';
import TmsTerminalService from '@services/tms/tms-terminal-service';
import errorHandler from "@shared/error-handler";
import { isJSDocThisTag } from 'typescript';

@Component({
    mixins: [tlp],
    components: {
        UnisProductModal,
        WaittingBtn
    }
})
export default class NewTerminal extends WiseVue {
    terminalId: any = '';
    statusArr: any = [
        {label: 'Active', value: 1},
        {label: 'Inactive', value: 0},
    ];
    editProductModal: any = 'removeConfirm';
    contanctIndex: number = 0;
    terminalInfo: any = {
        terminalStatus: '',
        terminalType: '',
        location_main_contact_array: [
            {
                contact_id: 0,
                contact_name: '',
                contact_title: '',
                contact_phone: '',
                contact_email: ''
            }
        ]
    };
    loadingSave: Boolean = false;
    loadingTerminal: Boolean = false;

    created() {
        this.terminalId = this.$route.params.id;
        if (this.terminalId && this.terminalId != 'null') {
            this.getTerminalDetail();
        }
    }

    addContact() {
        this.terminalInfo.location_main_contact_array.push({
            contact_id: 0,
            contact_name: '',
            contact_title: '',
            contact_phone: '',
            contact_email: ''
        });
        this.$forceUpdate();
    }

    getTerminalDetail() {
        this.loadingTerminal = true;
        TmsTerminalService.getTerminalDetail(this.terminalId).subscribe(
            (res: any) => {
                this.terminalInfo = res.data;
                this.loadingTerminal = false;
                this.terminalInfo.location_main_contact_array = [];
                forEach(this.terminalInfo.contacts, (item) => {
                    this.terminalInfo.location_main_contact_array.push({
                        contact_id: item.contact_id,
                        contact_name: item.name,
                        contact_title: item.title,
                        contact_phone: item.phone,
                        contact_email: item.email
                    });
                });
            },
            (err: any) => {
                this.loadingTerminal = false;
                errorHandler.handle(err);
            }
        );
    }

    saveTerminal() {
        if (this.judgeInfo()) {
            delete this.terminalInfo.contacts;
            this.loadingSave = true;
            TmsTerminalService.saveTerminal(this.terminalInfo).subscribe(
                (res: any) => {
                    this.loadingSave = false;
                    if (res.location_id) {
                        this.$router.push({
                            name: 'TerminalDetail',
                            params: {
                                id: res.location_id
                            }
                        });
                    }
                },
                (err: any) => {
                    this.loadingSave = false;
                    errorHandler.handle(err);
                }
            );
        }
    }

    cleanPhone() {
        this.terminalInfo.phone = '';
        this.terminalInfo.label = '';
    }

    judgeInfo() {
        if (this.terminalInfo.status == undefined) {
            errorHandler.handle('Please select status');
            return false;
        }
        if (!this.terminalInfo.terminal_name || !this.notEmptyString(this.terminalInfo.terminal_name)) {
            errorHandler.handle('Please fill in terminal name');
            return false;
        }
        if (!this.terminalInfo.terminal_code || !this.notEmptyString(this.terminalInfo.terminal_code)) {
            errorHandler.handle('Please fill in terminal code');
            return false;
        }
        if (!this.terminalInfo.address_01 || !this.notEmptyString(this.terminalInfo.address_01)) {
            errorHandler.handle('Please fill in address1');
            return false;
        }
        if (!this.terminalInfo.city || !this.notEmptyString(this.terminalInfo.city)) {
            errorHandler.handle('Please fill in city');
            return false;
        }
        if (!this.terminalInfo.state || !this.notEmptyString(this.terminalInfo.state)) {
            errorHandler.handle('Please fill in state');
            return false;
        }
        if (!this.terminalInfo.country || !this.notEmptyString(this.terminalInfo.country)) {
            errorHandler.handle('Please fill in country');
            return false;
        }
        if (!this.terminalInfo.zip || !this.notEmptyString(this.terminalInfo.zip)) {
            errorHandler.handle('Please fill in zip');
            return false;
        }
        if (this.terminalInfo.terminal_type == 'Revenue' && !this.terminalInfo.gp_code) {
            errorHandler.handle('It is required that Revenue terminal has GP Location Code');
            return false;
        }
        return true;
    }

    notEmptyString(str: any) {
        if (str) {
            if (str.split(' ').join('').length == 0) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    removeContanct(index: any) {
        this.contanctIndex = index;
        this.$modal.show(this.editProductModal);
    }

    sureRemove() {
        this.terminalInfo.location_main_contact_array.splice(this.contanctIndex, 1);
        this.$forceUpdate();
        this.$modal.hide(this.editProductModal);
    }

    closeModal() {
        this.$modal.hide(this.editProductModal);
    }

    goTerminalListPage() {
        this.$router.push({
            name: 'TerminalList',
        });
    }
}