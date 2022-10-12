import { filter, forEach, cloneDeep, findIndex, uniq, groupBy, uniqBy } from 'lodash-es';
import { Component, Prop, Provide, Watch, Emit, Vue } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import tlp from "./terminalMatrix.vue";
import Pager from "@components/pager/pager";
import UnisProductModal from "@components/unisProductModal";
import PredefinedExportBtn from "@components/predefined-export-btn/predefined-export-btn";
import TmsTerminalService from '@services/tms/tms-terminal-service';
import WaittingBtn from '@components/waitting-button/waitting-btn';
import errorHandler from "@shared/error-handler";
@Component({
    mixins: [tlp],
    components: {
        Pager,
        PredefinedExportBtn,
        WaittingBtn,
        UnisProductModal
    }
})
export default class TerminalMatrix extends WiseVue {
    btns: any = ['Import file', 'Export file', 'Download template'];
    exportLoading: Boolean = false;
    editProductModal: any = '';
    searchParams: any = {
        terminal_id: '',
        terminal_type: "Revenue",
        include_inactive: 0,
    };

    terminalParams: any = {
        search_term: '',
        terminal_type: 'Revenue',
        page_size: 1000,
        include_inactive: 0
    };

    multipleView: Boolean = true;
    tableHead: any = [];
    tabLeft: any = [];
    tabNav: any = [];
    tableData: any = [];
    terminalCodeAndId: any = [];
    loadingMatrix: Boolean = false;
    loadingSave: Boolean = false;
    terminal_matrix_array: any = [];
    terminalList: any = [];
    selectTerminalData: any = {};
    selectTerminalMatrix: any = [];
    importError: boolean = false;
    formData: any = {};
    loadingUpload: boolean = false;
    fileObj: any = {};

    mounted() {
        this.init();
    }

    init() {
        let id = this.$route.query.id || '';
        if (id) {
            this.terminalParams.search_term = this.$route.query.code;
            this.multipleView = false;
            this.searchParams.terminal_id = id;
            this.getTerminalMatrixById();
        } else {
            this.getTerminalMatrix();
        }
    }

    getTerminalMatrix() {
        this.loadingMatrix = true;
        this.tableData = [];
        TmsTerminalService.getTerminalMatrix(this.searchParams).subscribe(
            (res: any) => {
                forEach(res.data.matrix_list, (item, index) => {
                    this.tableHead.push(item.delivery_terminal_code);
                });
                forEach(res.data.matrix_list, (item, index) => {
                    this.tabLeft.push(item.pickup_terminal_code);
                });
                this.tabNav = uniq(this.tabLeft.concat(this.tableHead));
                this.makeTerminalCodeAndId(res.data.matrix_list);
                this.makeAllDataArray();
                this.fillInData(res.data.matrix_list);
                this.loadingMatrix = false;
            },
            (err: any) => {
                errorHandler.handle(err);
                this.loadingMatrix = false;
            }
        );
    }

    getAllTerminalList() {
        this.tableData = [];
        this.searchParams = {
            terminal_id: '',
            terminal_type: "Revenue",
            include_inactive: 0,
        };
        this.multipleView = true;
        this.getTerminalMatrix();
    }

    getTerminalMatrixById() {
        this.loadingMatrix = true;
        TmsTerminalService.getTerminalMatrix(this.searchParams).subscribe(
            (res: any) => {
                this.selectTerminalMatrix = res.data.matrix_list;
                this.loadingMatrix = false;
            },
            (err: any) => {
                errorHandler.handle(err);
                this.loadingMatrix = false;
            }
        );
    }

    getTerminalList() {
        // if (!this.terminalParams.search_term) {
        //     errorHandler.handle('Please enter keywords.');
        //     return;
        // }
        this.tableData = [];
        this.terminalList = [];
        this.selectTerminalMatrix = [];
        this.loadingMatrix = true;
        this.selectTerminalData.terminal_id = '';
        if (this.terminalParams.search_term) {
            TmsTerminalService.getTerminal(this.terminalParams).subscribe(
                (res: any) => {
                    this.terminalList = res.data;
                    this.loadingMatrix = false;
                    if (this.terminalList.length == 0) {
                        errorHandler.handle('No data.');
                        return;
                    } else
                    if (this.terminalList.length == 1) {
                        this.selectTerminalData = res.data[0];
                        this.searchSelectTerminal();
                    } else {
                        this.editProductModal = 'selectOneTerminal';
                        this.$modal.show(this.editProductModal);
                    }
                },
                (err: any) => {
                    this.loadingMatrix = false;
                    errorHandler.handle(err);
                }
            );
        } else {
            this.multipleView = true;
            this.getTerminalMatrix();
        }
    }

    fillInData(apiData: any) {
        forEach(this.tableData, (item, index) => {
            forEach(apiData, (apiItem) => {
                forEach(item.array, (withItem) => {
                    if (apiItem.delivery_terminal_code == withItem.with && apiItem.pickup_terminal_code == item.pickupCode) {
                        withItem.matrix_transit_days = apiItem.days;
                        withItem.dest_terminal_code = apiItem.delivery_terminal_code;
                        withItem.dest_terminal_id = apiItem.delivery_terminal_id;
                        withItem.matrix_id = apiItem.id;
                        withItem.from_terminal_code = apiItem.pickup_terminal_code;
                        withItem.from_terminal_id = apiItem.pickup_terminal_id;
                    }
                });
            });
        });
    }

    makeTerminalCodeAndId(apiData: any) {
        forEach(apiData, (item, index) => {
            this.terminalCodeAndId.push({
                code: item.pickup_terminal_code,
                id: item.pickup_terminal_id
            });
            this.terminalCodeAndId.push({
                code: item.delivery_terminal_code,
                id: item.delivery_terminal_id
            });
        });
        this.terminalCodeAndId = uniqBy(this.terminalCodeAndId, 'code');
    }

    makeAllDataArray() {
        forEach(this.tabNav, (item, index) => {
            let dataItem: any = {
                pickupCode: item,
                array: []
            };
            forEach(this.tabNav, (perItem) => {
                dataItem.array.push({
                    with: perItem,
                    matrix_transit_days: ''
                });
            });
            this.tableData.push(dataItem);
        });
    }

    saveMatrix() {
        this.formartMatrixList();
        this.loadingSave = true;
        TmsTerminalService.updateTerminalMatrix({terminal_matrix_array: this.terminal_matrix_array}).subscribe(
            (res: any) => {
                this.loadingSave = false;
                this.editProductModal = 'confirmSave';
                this.$modal.show(this.editProductModal);
            },
            (err: any) => {
                this.loadingSave = false;
                errorHandler.handle(err);
            }
        );
    }

    formartMatrixList() {
        this.terminal_matrix_array = [];
        if (this.multipleView) {
            forEach(this.tableData, (item, index) => {
                forEach(item.array, (perItem, itemIndex) => {
                    if (!perItem.matrix_transit_days) {
                        perItem.from_terminal_code = item.pickupCode;
                        perItem.from_terminal_id = this.terminalCodeAndId[findIndex(this.terminalCodeAndId, (o: any) => {
                            return o.code == item.pickupCode;
                        })].id;
                        perItem.dest_terminal_code = this.terminalCodeAndId[findIndex(this.terminalCodeAndId, (o: any) => {
                            return o.code == perItem.with;
                        })].code;
                        perItem.dest_terminal_id = this.terminalCodeAndId[findIndex(this.terminalCodeAndId, (o: any) => {
                            return o.code == perItem.with;
                        })].id;
                        delete perItem.with;
                        this.terminal_matrix_array.push((perItem));
                    } else
                    if (perItem.matrix_transit_days && perItem.dest_terminal_id && perItem.from_terminal_id) {
                        delete perItem.with;
                        this.terminal_matrix_array.push((perItem));
                    }
                });
            });
        } else {
            forEach(this.selectTerminalMatrix, (item, index) => {
                let arr: any = {};
                arr.matrix_transit_days = item.days;
                arr.dest_terminal_code = item.delivery_terminal_code;
                arr.dest_terminal_id = item.delivery_terminal_id;
                arr.matrix_id = item.id;
                arr.from_terminal_code = item.pickup_terminal_code;
                arr.from_terminal_id = item.pickup_terminal_id;
                this.terminal_matrix_array.push((arr));
            });
        }
    }

    onSelectExportName(item: any) {
        if (item == 'Import file') {
            this.importError = false;
            this.editProductModal = 'importCsv';
            this.$modal.show(this.editProductModal);
        } else
        if (item == 'Export file') {
            this.exportTerminalmatrix();
        } else {
            this.downloadMatrixTemplate();
        }
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
        this.importMatrix(this.formData);
    }

    importMatrix(formData: any) {
        this.loadingUpload = true;
        TmsTerminalService.importMatrix(formData).subscribe(
            (res: any) => {
                this.loadingUpload = false;
                if (res.status == -1) {
                    errorHandler.handle(res.message);
                    this.importError = true;
                } else {
                    this.editProductModal = 'importSuccess';
                    this.$modal.hide('importCsv');
                    this.$modal.show(this.editProductModal);
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

    downloadMatrixTemplate() {
        this.exportLoading = true;
        TmsTerminalService.downLoadMatrixTemplate().then(
            (res: any) => {
                this.exportLoading = false;
                let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel'}));
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', 'matrixTemplete.xls');
                document.body.appendChild(link);
                link.click();
            },
            (err: any) => {
                this.exportLoading = false;
                errorHandler.handle(err);
            }
        );
    }

    selectTerminal(terminal: any) {
        forEach(this.terminalList, (item, index) => {
            item.selectTerminal = false;
        });
        terminal.selectTerminal = true;
        this.selectTerminalData = terminal;
        this.$forceUpdate();
    }

    searchSelectTerminal() {
        this.searchParams.terminal_id = this.selectTerminalData.terminal_id;
        this.multipleView = false;
        this.$modal.hide(this.editProductModal);
        this.getTerminalMatrixById();
    }

    goNewTerminalPage() {
        this.$router.push({
            name: 'NewTerminal',
            params: {
                id: 'null'
            }
        });
    }

    exportTerminalmatrix() {
        this.exportLoading = true;
        TmsTerminalService.exportTerminalmatrix(this.searchParams.terminal_id).then(
            (res: any) => {
                this.exportLoading = false;
                let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel'}));
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', 'matrix.xls');
                document.body.appendChild(link);
                link.click();
            },
            (err: any) => {
                this.exportLoading = false;
                errorHandler.handle(err);
            }
        );
    }

    closeAndRefresh() {
        this.$modal.hide(this.editProductModal);
        this.tableData = [];
        this.getTerminalMatrix();
    }

    closeModal() {
        this.$modal.hide(this.editProductModal);
    }
}