import { filter, forEach, cloneDeep, findIndex, find } from 'lodash-es';
import { Component, Prop, Provide, Watch, Emit, Vue } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import tlp from "./terminalZone.vue";
import PredefinedExportBtn from "@components/predefined-export-btn/predefined-export-btn";
import UnisProductModal from "@components/unisProductModal";
import TmsTerminalService from '@services/tms/tms-terminal-service';
import errorHandler from "@shared/error-handler";
import { map } from 'lodash';

@Component({
    mixins: [tlp],
    components: {
        PredefinedExportBtn,
        UnisProductModal
    }
})
export default class TerminalZone extends WiseVue {
    btns: any = ['Import', 'Export', 'Download template'];
    exportLoading: Boolean = false;
    viewModule: string = 'Zone view';

    tabTit: any = [];
    tabArr: any = [];
    tableHead: any = ['Zip code', 'State', 'Zone', 'Straight-line distance (Miles) ', 'Travel time (Minutes)', 'Longitude', 'Latitude'];

    searchParams: any = {
        terminal_id: ''
    };
    importChoose: any = '';
    formData: any = {};
    loadingUpload: Boolean = false;
    importError: Boolean = false;
    editProductModal: any = '';
    loadingZone: Boolean = false;
    zoneDetail: any = {};
    zoneList: any = [];
    showChooseZone: any = [];
    changeZoneData: any = {
        terminal_zone_array: []
    };
    fileObj: any = {};

    mounted() {
        this.init();
    }

    tab(index: any) {
        this.tabArr = [];
        forEach(this.tabTit, (item) => {
            this.tabArr.push(false);
        });
        this.tabArr[index] = true;
        this.showChooseZone = this.zoneList[this.tabTit[index]] || [];
    }

    async init() {
        this.tabTit = [];
        this.tabArr = [];
        this.tabTit = await this.getZoneCategory();
        forEach(this.tabTit, (item) => {
            this.tabArr.push(false);
        });
        if (this.$route.params.id) {
            this.searchParams.terminal_id = this.$route.params.id;
            // this.searchParams.terminal_id = '347975';
            this.getTerminalZoneDetail();
        } else {
            errorHandler.handle('Terminal_id error.');
        }
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

    changeViewModule() {
        this.showChooseZone = [];
        if (this.viewModule == 'All ZIP code view') {
            forEach(this.zoneList, (item, index) => {
                forEach(item, (data) => {
                    this.showChooseZone.push(data);
                });
            });
        } else {
            this.showChooseZone = this.zoneList[this.tabTit[0]] || [];
        }
    }

    getTerminalZoneDetail() {
        this.loadingZone = true;
        TmsTerminalService.getTerminalZone(this.searchParams).subscribe(
            (res: any) => {
                this.loadingZone = false;
                this.zoneDetail = res.data.terminal_list[0];
                this.zoneList = this.zoneDetail.zone_detail;
                if (this.tabTit.length == 0) {
                    this.tabArr = [];
                    forEach(this.zoneList, (item, index) => {
                        this.tabTit.push(index);
                        this.tabArr.push(false);
                    });
                }
                this.tabArr[0] = true;
                this.showChooseZone = this.zoneList[this.tabTit[0]] || [];
                this.changeZoneData.terminal_zone_array = [];
            },
            (err: any) => {
                this.loadingZone = false;
                errorHandler.handle(err);
            }
        );
    }

    goNewTerminalPage() {
        this.$router.push({
            name: 'NewTerminal',
            params: {
                id: 'null'
            }
        });
    }

    onSelectExportName(item: any) {
        if (item == 'Import') {
            this.importError = false;
            this.editProductModal = 'importCsv';
            this.fileObj = {};
            this.$modal.show(this.editProductModal);
        } else
        if (item == 'Export') {
            this.exportTerminalZone();
        } else {
            this.downloadTerminalZoneTemplate();
        }
    }

    changeZoneConfirm(zone: any) {
        let zoneFromat = {
            zone_id: zone.id,
            zone_category: zone.zone_category,
            zone_zip: zone.zip,
            zone_state: zone.state,
            zone_to_center_miles: zone.distance_to_center_miles,
            zone_to_center_minutes: zone.time_to_center_minutes,
            zone_lng: zone.lng,
            zone_lat: zone.lat
        };
        this.changeZoneData.terminal_zone_array.push(zoneFromat);
        this.editProductModal = 'confirmChange';
        this.$modal.show(this.editProductModal);
    }

    changeZone() {
        this.closeModal();
        this.loadingZone = true;
        this.showChooseZone = [];
        TmsTerminalService.updateZoneDetailList(this.searchParams.terminal_id, this.changeZoneData).subscribe(
            (res: any) => {
                // this.loadingZone = false;
                this.init();
            },
            (err: any) => {
                errorHandler.handle(err);
                this.loadingZone = false;
                this.getTerminalZoneDetail();
            }
        );
    }

    changeFile(file: any) {
        console.log(file);
        this.fileObj = file;
    }

    removeFile() {
        this.fileObj = {};
    }

    autoUpload() {
        this.formData = new FormData();
        this.formData.append('upfile', this.fileObj.raw);
        this.formData.append('terminal_id', this.searchParams.terminal_id);
        this.importTerminalZone(this.formData);
    }

    importTerminalZone(formData: any) {
        this.loadingUpload = true;
        TmsTerminalService.importTerminalZone(this.$route.params.id, formData).subscribe(
            (res: any) => {
                this.loadingUpload = false;
                if (res.status == -1) {
                    errorHandler.handle(res.message);
                    this.importError = true;
                } else {
                    this.$modal.hide('importSelect');
                    this.$modal.hide('importCsv');
                    this.editProductModal = 'importSuccess';
                    this.$modal.show(this.editProductModal);
                    this.importError = false;
                    // this.getTerminalZoneDetail();
                }
            },
            (err: any) => {
                errorHandler.handle(err);
                this.importError = false;
                this.loadingUpload = false;
            }
        );
    }

    continueImport() {
        if (this.importChoose == 'notImport') {
            this.formData.append('duplicate_terminal_handle_strategy', 'ignore');
        } else {
            this.formData.append('duplicate_terminal_handle_strategy', 'override');
        }
        this.importTerminalZone(this.formData);
    }

    downloadTerminalZoneTemplate() {
        this.exportLoading = true;
        TmsTerminalService.downLoadTerminalZoneTemplate().then(
            (res: any) => {
                this.exportLoading = false;
                let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel'}));
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', 'zoneTemplete.xls');
                document.body.appendChild(link);
                link.click();
            },
            (err: any) => {
                this.exportLoading = false;
                errorHandler.handle(err);
            }
        );
    }

    exportTerminalZone() {
        if (this.zoneList.length == 0) {
            errorHandler.handle('No data to export.');
            return;
        }
        this.exportLoading = true;
        TmsTerminalService.exportTerminalZone(this.searchParams.terminal_id).then(
            (res: any) => {
                this.exportLoading = false;
                let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel'}));
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', `terminalZone-${this.zoneDetail.terminal_code}.xls`);
                document.body.appendChild(link);
                link.click();
            },
            (err: any) => {
                this.exportLoading = false;
                errorHandler.handle(err);
            }
        );
    }

    getHeadherData(headData: any) {
        let head: string = '';
        if (headData) {
            map(headData, (value: any, index: any) => {
                head += `${value},`;
            });
            head += '\n';
        }
        return head;
    }

    closeModal() {
        this.$modal.hide(this.editProductModal);
    }

    closeModalAndRefresh() {
        this.$modal.hide(this.editProductModal);
        this.getTerminalZoneDetail();
    }

    triggerSearchFromPager(page: any) {
        this.searchParams.page = page.currentPage;
        this.searchParams.page_size = page.pageSize;
    }

    goTerminalZoneListPage() {
        this.$router.push({
            name: 'TerminalZoneList',
        });
    }
}