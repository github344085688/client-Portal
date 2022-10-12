import { filter, forEach, cloneDeep, findIndex, find } from 'lodash-es';
import { Component, Prop, Provide, Watch, Emit, Vue } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import tlp from "./terminalZoneList.vue";
import Pager from "@components/pager/pager";
import PredefinedExportBtn from "@components/predefined-export-btn/predefined-export-btn";
import UnisProductModal from "@components/unisProductModal";
import TmsTerminalService from '@services/tms/tms-terminal-service';
import errorHandler from "@shared/error-handler";
import { map } from 'lodash';

@Component({
    mixins: [tlp],
    components: {
        Pager,
        PredefinedExportBtn,
        UnisProductModal
    }
})
export default class TerminalZone extends WiseVue {
    btns: any = ['Import', 'Export'];
    exportLoading: Boolean = false;
    viewModule: string = 'Zone view';

    filterName: String = '';
    primaryCompany: any = '';
    terminalCode: any = '';
    status: any = '';
    zoneTit: any = [];

    searchParams: any = {
        search_term: '',
        terminal_type: 'Revenue',
        page_size: 10,
        page: 1
    };
    searchResultPaging: any = {
        total: 0
    };
    tableHead: any = [];
    importChoose: any = '';
    loadingUpload: Boolean = false;
    importError: Boolean = false;
    editProductModal: any = '';
    formData: any = {};
    allData: any = [];
    loadingTerminalZone: Boolean = false;
    terminalZoneList: any = [];

    mounted() {
        this.init();
    }

    async init() {
        this.zoneTit = await this.getZoneCategory();
        this.tableHead = ['Terminal name', 'Terminal code'].concat(this.zoneTit).concat(['Total ZIP codes']);
        this.getTerminalZoneList();
    }

    getZoneCategory() {
        return new Promise((resolve: any, reject: any) => {
            TmsTerminalService.getZoneCategory().subscribe(
                (res: any) => {
                    resolve(res.data);
                },
                (err: any) => {
                    reject([]);
                    errorHandler.handle(err);
                }
            );
        });
    }

    getTerminalZoneList() {
        this.loadingTerminalZone = true;
        TmsTerminalService.getTerminalZone(this.searchParams).subscribe(
            (res: any) => {
                this.terminalZoneList = res.data.terminal_list;
                this.searchResultPaging.totalNum = res.page.total;
                this.loadingTerminalZone = false;
            },
            (err: any) => {
                this.loadingTerminalZone = false;
                errorHandler.handle(err);
            }
        );
    }

    onSelectExportName(item: any) {
        if (item == 'Import') {
            this.importError = false;
            this.editProductModal = 'importCsv';
            this.$modal.show(this.editProductModal);
        } else {
            this.exportTerminalZone();
        }
    }

    continueImport() {
        if (this.importChoose == 'notImport') {
            this.formData.append('duplicate_terminal_handle_strategy', 'ignore');
        } else {
            this.formData.append('duplicate_terminal_handle_strategy', 'override');
        }
    }

    downloadTerminalZoneTemplate() {
        TmsTerminalService.downLoadTerminalZoneTemplate().then(
            (res: any) => {
                let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel'}));
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', 'zoneTemplete.xls');
                document.body.appendChild(link);
                link.click();
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    exportTerminalZone() {
        // TmsTerminalService.exportTerminalZone().subscribe(
        //     (res: any) => {
        //         let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel'}));
        //         let link = document.createElement('a');
        //         link.style.display = 'none';
        //         link.href = url;
        //         link.setAttribute('download', 'terminalZones.xls');
        //         document.body.appendChild(link);
        //         link.click();
        //     },
        //     (err: any) => {
        //         errorHandler.handle(err);
        //     }
        // );
    }

    goZoneDetailPage(id: any) {
        this.$router.push({
            name: 'TerminalZone',
            params: {
                id: id
            }
        });
    }

    closeModal() {
        this.$modal.hide(this.editProductModal);
    }

    triggerSearchFromPager(page: any) {
        this.searchParams.page = page.currentPage;
        this.searchParams.page_size = page.pageSize;
        this.getTerminalZoneList();
    }
}