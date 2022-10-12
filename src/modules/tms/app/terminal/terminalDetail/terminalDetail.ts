import { filter, forEach, cloneDeep, findIndex, find } from 'lodash-es';
import { Component, Prop, Provide, Watch, Emit, Vue } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import tlp from "./terminalDetail.vue";
import TmsTerminalService from '@services/tms/tms-terminal-service';
import errorHandler from "@shared/error-handler";

@Component({
    mixins: [tlp],
    components: {}
})
export default class TerminalDetail extends WiseVue {
    terminalInfo: any = {};

    mounted() {
        let id = this.$route.params.id;
        if (id) {
            this.getTerminalDetail(id);
        } else {
            errorHandler.handle('Terminal id error.');
        }
    }

    getTerminalDetail(id: any) {
        TmsTerminalService.getTerminalDetail(id).subscribe(
            (res: any) => {
                this.terminalInfo = res.data;
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    goDetailPage() {
        this.$router.push({
            name: 'TerminalZone',
            params: {
                id: this.$route.params.id
            }
        });
    }

    goEditPage() {
        this.$router.push({
            name: 'NewTerminal',
            params: {
                id: this.$route.params.id
            }
        });
    }

    goMatrixPage() {
        this.$router.push({
            name: 'TerminalMatrix',
            query: {
                id: this.terminalInfo.terminal_id,
                code: this.terminalInfo.terminal_code
            }
        });
    }

    goTerminalListPage() {
        this.$router.push({
            name: 'TerminalList',
        });
    }
}