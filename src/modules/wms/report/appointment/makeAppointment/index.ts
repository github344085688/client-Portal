import CustomerWiseVue from "@shared/customer-wise-vue";
import DatePicker from 'vue2-datepicker';
import { Component, Watch } from "vue-property-decorator";
import { Row, Col, Tabs, TabPane, Card, Badge, Table, TableColumn, Button } from "element-ui";
import Pager from "@components/pager/pager";
import appointmentService from '@services/appointment-service';
import * as moment from 'moment';
import tlp from "./index.vue";
import errorHanlder from '@shared/error-handler';
import predefinedCustomerSelect from '@components/predefined-customer-select/predefined-customer-select';
import facilitySelect from '@components/facility-select/facility-select';
interface Appointment {
    id?: string;
    type?: string;
    appointmentTime?: string;
}

interface AppointmentView {
    head: Array<string>;
    headMap: object;
    body: Array<Appointment>;
}

interface Paging {
    pageSize: number;
    currentPage: number;
}

interface AppointmentHours {
    hour: string;
    available: number;
    total: number;
}
@Component({
    mixins: [tlp],
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
        predefinedCustomerSelect,
        facilitySelect
    }
})

export default class MakeAppointment extends CustomerWiseVue {
    loading: Boolean = false;
    appointmentDate: any = new Date();
    datePickOptions: Object = {
        inline: true
    };
    activeName: string = 'total';
    appointmentHours: Array<AppointmentHours> = [];
    appointmentDateFrom: string = moment().format('YYYY-MM-DDT00:00:00');
    appointmentDateTo: string | null = null;
    appointmentList: Array<Appointment> = [];
    appointmentView: AppointmentView = {head: [], headMap: {}, body: []};
    paging: Paging = {
        pageSize: 10,
        currentPage: 1
    };
    searchParams: any = {};

    handleClick() {
        this.appointmentHours = [];
        this.appointmentDateFrom = moment(this.appointmentDate).format(`YYYY-MM-DDT00:00:00`);
        this.appointmentDateTo = moment(this.appointmentDate).format(`YYYY-MM-DDT23:59:59`);
        this.loadAppointmentList(1);
    }

    isTimeAvailable(index: number, obj: AppointmentHours) {
        return moment().isBefore(this.appointmentDate.setHours(index)) && obj.available < obj.total;
    }

    setAppointmentHours() {
        this.appointmentHours = [];
        const params: Object = {
            type: this.activeName === 'total' ? '' : this.activeName,
            facilityId: this.getFacilityByUserSelect().id,
            appointmentDate: moment(this.appointmentDate.toString()).format('YYYY-MM-DD')
        };
        appointmentService.getAppointmentData(params).subscribe(
            res => {
                for (let i = 0; i < 24; i++) {
                    let hour: string = `${i}`.padStart(2, '0');
                    this.appointmentHours.push({
                        hour,
                        available: res[i].appointmentNo,
                        total: res[i].total
                    });
                }
            },
            err => {
                errorHanlder.handle(err);
            }
        );
    }

    clickTimeBlock(index: number, item: AppointmentHours) {
        this.appointmentDateFrom = moment(this.appointmentDate).format(`YYYY-MM-DDT${item.hour}:00:00`);
        this.appointmentDateTo = moment(this.appointmentDate).format(`YYYY-MM-DDT${item.hour}:59:59`);
        this.loadAppointmentList(1);
    }

    reloadContent(page: Paging) {
        this.loadAppointmentList(page.currentPage);
    }

    loadAppointmentList(currentPage: number) {
        this.loading = true;
        const params: Object = {
            loadStatuses: ["Shipped"],
            receiptStatuses: ["Closed", "Force Closed"],
            appointmentTimeFrom: this.appointmentDateFrom,
            appointmentTimeTo: this.appointmentDateTo
        };
        Object.assign(params, this.searchParams);
        appointmentService.loadAppointmentList(params).subscribe(
            res => {
                this.loading = false;
                this.appointmentList = res;
                this.appointmentView = {
                    head: ['Date Time', 'SCAC', 'L/R Info', 'Contacts', 'Phone', 'Status', 'Driver', 'Driver License', 'Actions'],
                    headMap: {
                        'Date Time': 'appointmentTime',
                        'SCAC': 'scac',
                        'L/R Info': 'documentNos',
                        'Contacts': 'contacts',
                        'Phone': 'phone',
                        'Status': 'status',
                        'Driver': 'driverName',
                        'Driver License': 'driverLicense'
                    },
                    body: this.appointmentList.slice((currentPage - 1) * this.paging.pageSize, currentPage * this.paging.pageSize)
                };
            },
            err => {
                this.loading = false;
                errorHanlder.handle(err);
            }
        );
    }

    editAppointment(appointment: Appointment) {
        let params: any = {
            appointmentId: appointment.id,
            type: appointment.type,
            appointmentTime: appointment.appointmentTime
        };
        localStorage.setItem('appointmentParams', JSON.stringify(params));
        this.$router.replace({
            name: 'EditAppointment',
            params: params
        });
    }

    removeAppointment(id: string, index: number) {
        this.popups({
            title: 'Would you like to cancel the this appointment?',
            content: '',
            cancel: 'No',
            confirm: 'Yes'
        }).then(() => {
            appointmentService.removeAppointment(id).subscribe(
                res => {
                    this.appointmentView.body.splice(index, 1);
                    let indexInList = this.appointmentList.findIndex((item) => {
                        return item.id == id;
                    });
                    this.appointmentList.splice(indexInList, 1);
                    this.$message({
                        type: 'success',
                        message: 'cancel success'
                    });
                },
                error => {
                    errorHanlder.handle(error);
                }
            );
        }).catch(() => {
            this.$message({
                type: 'info',
                message: 'cancel the operation'
            });
        });
    }

    addAppointment(hour: number) {
        const type = this.activeName;
        let params: {} = {
            appointmentId: 'new',
            type: type,
            appointmentTime: this.appointmentDate.setHours(hour)
        };

        if (type === 'total') {
            this.popups({
                title: 'Add Appointment Confirm ',
                content: 'Please choose the appointment type.',
                cancel: 'INBOUND',
                confirm: 'OUTBOUND'
            }).then((res: string) => {
                console.log(res);
                if (res === 'ok') {
                    Object.assign(params, {type: 'Outbound'});
                    localStorage.setItem('appointmentParams', JSON.stringify(params));
                    this.$router.replace({
                        name: 'EditAppointment',
                        params: params
                    });
                }
                if (res === 'cancel') {
                    Object.assign(params, {type: 'Outbound'});
                    localStorage.setItem('appointmentParams', JSON.stringify(params));
                    this.$router.replace({
                        name: 'EditAppointment',
                        params: params
                    });
                }
            }).catch((error: any) => {
                errorHanlder.handle(error);
            });
        } else {
            localStorage.setItem('appointmentParams', JSON.stringify(params));
            this.$router.replace({
                name: 'EditAppointment',
                params: params
            });
        }
    }

    mounted() {
        this.loadAppointmentList(1);
        this.setAppointmentHours();
    }

    get listenAppointmentHours() {
        const { appointmentDate, activeName } = this;
        return {
            appointmentDate,
            activeName
        };
    }

    @Watch('listenAppointmentHours')
    onChangeValue(newVal: object, oldVal: object) {
        this.setAppointmentHours();
    }

}