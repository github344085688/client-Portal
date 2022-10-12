import { filter, forEach, cloneDeep, findIndex, find } from 'lodash-es';
import { Component, Prop, Provide, Watch, Emit, Vue } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import tlp from "./terminal.vue";
import Pager from "@components/pager/pager";
import PredefinedExportBtn from "@components/predefined-export-btn/predefined-export-btn";
import UnisProductModal from "@components/unisProductModal";
import TmsTerminalService from '@services/tms/tms-terminal-service';
import Session from '@shared/session';
import errorHandler from "@shared/error-handler";
@Component({
    mixins: [tlp],
    components: {
        Pager,
        PredefinedExportBtn,
        UnisProductModal,
    }
})
export default class Terminal extends WiseVue {
    btns: any = ['Import file', 'Export file', 'Download template'];
    searchParams: any = {
        search_company_id: '',
        search_term: '',
        // terminal_type: 'Revenue',
        page_size: 10,
    };
    searchResultPaging: any = {
        total: 0
    };
    formData: any = {};
    importChoose: any = '';
    loadingTerminal: Boolean = false;
    loadingUpload: Boolean = false;
    terminalList: any = [];
    importError: Boolean = false;
    editProductModal: any = '';
    primaryCompany: any = '';
    showImport: any = true;
    tableHead: any = ['Terminal name', 'Terminal code', 'Address', 'City ', 'State', 'Country', 'Zipcode', 'Phone', 'Terminal type', 'Status', 'Fax', 'Action'];
    exportLoading: Boolean = false;
    fileObj: any = {};

    mounted() {
        this.init();
    }

    init() {
        // this.getCompanyId();
        this.getTerminalList();
        this.$modal.show(this.editProductModal);
    }

    getCompanyId() {
        let companyInfo = Session.getAssignedCompanyFacilities();
        if (companyInfo) {
            this.searchParams.search_company_id = companyInfo[0].companyId;
        }
    }

    getTerminalList() {
        this.loadingTerminal = true;
        TmsTerminalService.getTerminal(this.searchParams).subscribe(
            (res: any) => {
                this.terminalList = res.data;
                this.searchResultPaging = res.page;
                this.loadingTerminal = false;
            },
            (err: any) => {
                this.loadingTerminal = false;
                errorHandler.handle(err);
            }
        );
    }

    getTerminalListByTerm() {
        this.searchParams.page = 1;
        this.getTerminalList();
    }

    triggerSearchFromPager(page: any) {
        this.searchParams.page = page.currentPage;
        this.searchParams.page_size = page.pageSize;
        this.getTerminalList();
    }

    onSelectExportName(item: any) {
        if (item == 'Import file') {
            this.importError = false;
            this.editProductModal = 'importCsv';
            this.fileObj = {};
            this.$modal.show(this.editProductModal);
        } else
        if (item == 'Export file') {
            this.exportTerminal();
        } else {
            this.downloadTerminalTemplate();
        }
    }

    goEditTerminalPage(id: any) {
        this.$router.push({
            name: 'NewTerminal',
            params: {
                id: id
            }
        });
    }

    goEditDetailPage(id: any) {
        this.$router.push({
            name: 'TerminalDetail',
            params: {
                id: id
            }
        });
    }

    goTerminalZonePage(id: any) {
        this.$router.push({
            name: 'TerminalZone',
            params: {
                id: id
            }
        });
    }

    goTerminalMatrixPage(id: any, code: string) {
        this.$router.push({
            name: 'TerminalMatrix',
            query: {
                id: id,
                code: code
            }
        });
    }

    changeFile(file: any) {
        this.fileObj = file;
    }

    removeFile() {
        this.fileObj = {};
    }

    autoUpload() {
        this.formData = new FormData();
        this.formData.append('upfile', this.fileObj.raw);
        this.importTerminal(this.formData);
    }

    importTerminal(formData: any) {
        this.loadingUpload = true;
        TmsTerminalService.importTerminal(formData).subscribe(
            (res: any) => {
                this.loadingUpload = false;
                if (res.error_type && res.error_type != 'duplicate_terminal') {
                    errorHandler.handle(res.message);
                    this.importError = true;
                } else
                if (res.error_type == 'duplicate_terminal') {
                    this.editProductModal = 'importSelect';
                    this.$modal.show(this.editProductModal);
                    this.importError = false;
                } else {
                    this.$modal.hide('importSelect');
                    this.$modal.hide('importCsv');
                    this.editProductModal = 'importSuccess';
                    this.$modal.show(this.editProductModal);
                    this.searchParams.page = 1;
                    this.searchParams.search_term = '';
                    this.getTerminalList();
                    this.importError = false;
                }
            },
            (err: any) => {
                this.importError = false;
                this.loadingUpload = false;
                errorHandler.handle(err);
            }
        );
    }

    continueImport() {
        if (this.importChoose == 'notImport') {
            this.formData.append('duplicate_terminal_handle_strategy', 'ignore');
        } else {
            this.formData.append('duplicate_terminal_handle_strategy', 'override');
        }
        this.importTerminal(this.formData);
    }

    downloadTerminalTemplate() {
        this.exportLoading = true;
        TmsTerminalService.downLoadTerminalTemplate().then(
            (res: any) => {
                this.exportLoading = false;
                let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel'}));
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', 'terminalTemplete.xls');
                document.body.appendChild(link);
                link.click();
            },
            (err: any) => {
                this.exportLoading = false;
                errorHandler.handle(err);
            }
        );
    }

    exportTerminal() {
        this.exportLoading = true;
        TmsTerminalService.exportTerminal().then(
            (res: any) => {
                this.exportLoading = false;
                let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel'}));
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', 'terminal.xls');
                document.body.appendChild(link);
                link.click();
            },
            (err: any) => {
                this.exportLoading = false;
                errorHandler.handle(err);
            }
        );
    }

    closeModal() {
        this.$modal.hide(this.editProductModal);
    }

    goNewTerminalPage() {
        this.$router.push({
            name: 'NewTerminal',
            params: {
                id: 'null'
            }
        });
    }
}