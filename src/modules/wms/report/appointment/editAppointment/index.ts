import CustomerWiseVue from "@shared/customer-wise-vue";
import template from "./index.vue";
import { Component, Watch } from "vue-property-decorator";
import DatePicker from 'vue2-datepicker';
import { Row, Col, Tabs, TabPane, Card, Badge, Table, TableColumn, Button } from "element-ui";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import Pager from "@components/pager/pager";
import LoadReceiptList from "../components/loadReceiptList";
import PopUpWindows from "@components/pop-up-windows/pop-up-windows";
import appointmentService from '@services/appointment-service';
import loadService from '@services/load-service';
import receiptService from '@services/receipt-service';
import * as _ from 'lodash';
import * as moment from 'moment';
import errorHanlder from '@shared/error-handler';

interface Appointment {
    appointmentTime?: any;
    documentNos?: Array<string>;
    type?: string;
    customerId?: Array<string>;
    entryType?: string;
}
interface List {
    head?: object;
    body: Array<object>;
    headMap?: object;
}
interface Paging {
    pageSize: number;
    currentPage: number;
}

@Component({
    mixins: [template],
    components: {
        DatePicker,
        ElRow: Row,
        ElCol: Col,
        ElTabs: Tabs,
        ElTabPane: TabPane,
        ElCard: Card,
        ElBadge: Badge,
        ElTable: Table,
        ElTableColumn: TableColumn,
        ElButton: Button,
        Pager,
        WaittingBtn,
        LoadReceiptList,
        PopUpWindows
    }
})

export default class EditAppointment extends CustomerWiseVue {
    appointment: Appointment = {
        appointmentTime: new Date()
    };
    loading: Boolean = false;
    loadReceiptListShow: Boolean = false;
    selectedView: List =  {
        body: []
    };
    selectedList: Array<Appointment> = [];
    isNew: Boolean = true;
    appointmentType: string = '';
    submitLabel: string = 'Save';
    paging: Paging = {
        pageSize: 10,
        currentPage: 1
    };
    init() {
        const appointmentParams: any = localStorage.getItem('appointmentParams');
        const { type, appointmentId, appointmentTime } = JSON.parse(appointmentParams);
        this.appointment.entryType = type === 'Inbound' ? 'Receipt' : 'Load';
        this.appointmentType = type;
        this.isNew = appointmentId === 'new';
        let selectedLoadView = {
            head: ['Load ID', 'Load NO', 'Company', 'Status', 'MBOL', 'Customer', 'Carrier', 'Freight Term', 'Actions'],
            body: [],
            headMap: {
                'Load ID': 'id',
                'Load NO': 'loadNo',
                'Company': 'companyName',
                'Status': 'status',
                'MBOL': 'masterBolNo',
                'Customer': 'customerName',
                'Carrier': 'carrierName',
                'Freight Term': 'freightTerm'
            }
        };
        let selectedReceiptView = {
            head: ['RN', 'Company', 'Reference No.', 'Container No.', 'Purchase Order No.', 'Seal No', 'Customer', 'Status', 'Actions'],
            body: [],
            headMap: {
                'RN': 'id',
                'Company': 'companyName',
                'Reference No.': 'referenceNo',
                'Container No.': 'containerNo',
                'Purchase Order No.': 'poNo',
                'Seal No': 'sealNo',
                'Customer': 'customerName',
                'Status': 'status'
            }
        };
        this.selectedView = this.$route.params.type === 'Inbound' ? selectedReceiptView : selectedLoadView;
        if (this.isNew) {
            this.submitLabel = "Save";
            Object.assign(this.appointment, {
                appointmentTime: moment(appointmentTime).format('YYYY-MM-DDTHH:mm:ss'),
                type: type
            });
        } else {
            this.submitLabel = "Update";
            appointmentService.getAppointmentById(appointmentId).subscribe(
                res => {
                    Object.assign(this.appointment, res);
                    if (res.documentNos && res.documentNos.length > 0) {
                        this.initLoadReceiptList(res.documentNos);
                    }
                },
                err => {
                    errorHanlder.handle(err);
                }
            );
        }
    }

    initLoadReceiptList(ids: Array<string>) {
        let param: any = {};
        if (this.appointmentType === 'Outbound') {
            this.loading = true;
            param.loadIds = ids;
            loadService.searchLoad(param).subscribe(
                response => {
                    this.loading = false;
                    this.selectedList = response;
                    this.relevanceSelectedViewLists(1);
                },
                err => {
                    errorHanlder.handle(err);
                }
            );

        } else if (this.appointmentType === 'Inbound') {
            this.loading = true;
            param.receiptIds = ids;
            receiptService.searchReceipt(param).subscribe(
                response => {
                    this.loading = false;
                    this.selectedList = response;
                    this.relevanceSelectedViewLists(1);
                },
                err => {
                    this.loading = false;
                    errorHanlder.handle(err);
                }
            );
        }
    }

    relevanceSelectedViewLists(currentPage: number) {
        this.selectedView.body = this.selectedList.slice((currentPage - 1) * this.paging.pageSize, currentPage * this.paging.pageSize);
    }

    reloadContent(page: Paging) {
        this.relevanceSelectedViewLists(page.currentPage);
    }

    mounted() {
        this.init();
    }

    add() {
        this.loadReceiptListShow = true;
        this.appointment.documentNos =  _.map(this.selectedList, 'id');
        (this.$refs.loadReceiptList as any).init();
    }

    save() {
        if (!this.validateAppointTime()) return;
        this.loading = true;
        this.appointment.customerId = this.selectedList[0] && this.selectedList[0].customerId;
        if (this.isNew) {
            appointmentService.addAppointment(this.appointment).subscribe(
                res => {
                    if (res.error) {
                        this.$message.warning(`Error Found: ${res.error}`);
                    }
                    this.loading = false;
                    this.$router.replace({
                        name: 'MakeAppointment'
                    });
                },
                error => {
                    this.loading = false;
                    errorHanlder.handle(error);
                }
            );
        } else {
            appointmentService.updateAppointment(this.$route.params.appointmentId, this.appointment).subscribe(
                res => {
                    if (res.error) {
                        this.$message.warning(`Error Found: ${res.error}`);
                    }
                    this.loading = false;
                    this.$router.replace({
                        name: 'MakeAppointment'
                    });
                },
                error => {
                    this.loading = false;
                    errorHanlder.handle(error);
                }
            );
        }
    }

    getSelectedRecords(data: any) {
        let list = _.union(_.map(data, 'customerId'));
        if (list.length > 1) {
            this.$message.warning("Error: Customer is diff");
            return;
        }
        this.selectedList = data;
        this.appointment.documentNos = _.map(this.selectedList, 'id');
        this.relevanceSelectedViewLists(1);
    }

    cancel() {
        this.loading = true;
        this.$router.replace({
            name: 'MakeAppointment'
        });
    }

    validateAppointTime() {
        let isValidate = true;
        if (!this.appointment.documentNos || this.appointment.documentNos.length === 0) {
            if (this.$route.params.type === 'Inbound') {
               isValidate = false;
               this.$message.warning(`Select at least one receipt!`);
            } else {
                isValidate = false;
                this.$message.warning(`Select at least one load!`);
            }
        }
        return isValidate;
    }

    remove(id: string) {
        _.remove(this.selectedList, (item: any) => {
            return item.id === id;
        });
        _.remove(this.selectedView.body, (item: any) => {
            return item.id === id;
        });
        this.$forceUpdate();
        this.appointment.documentNos = _.map(this.selectedList, 'id');
    }
}