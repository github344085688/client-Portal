import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import ControlPanelService from "@services/control-panel/controlPanelService";
import errorHandler from "@shared/error-handler";
import template from "./messages.vue";
import { MessageBox } from 'element-ui';

@Component({
    mixins: [template],
    name: 'messages',
    components: {
        WaittingBtn
    }
})
export default class Messages extends Vue {
    showMessage: Boolean = false;
    sending: Boolean = false;
    showList: Boolean = false;
    contacts: any = [];
    selectContactPhone: any = '';
    messageText: string = '';
    customerId: any = '';
    orderId: any = '';
    mesTitle: string = '';
    currentType: string = '';
    chatUrl: string = '';
    clientId: any = '';

    get watchOrder() {
        return this.$store.state.orderInfo;
    }
    @Watch('watchOrder')
    async initMessageAndContactsList(orderInfo: any) {
        this.selectContactPhone = '';
        this.contacts = [];
        this.currentType = 'order';
        if (orderInfo.order_pro) {
            this.mesTitle = `(orderPro: ${orderInfo.order_pro})`;
        } else {
            this.mesTitle = `(orderID: ${orderInfo.order_id})`;
        }
        this.customerId = orderInfo.billto_id;
        this.orderId = orderInfo.order_id;
        this.resetMessageInfo();
        this.createConstacts(orderInfo);
        this.clientId = await this.getTmsClientId();
        if (this.clientId) {
            this.checkoutChanel(orderInfo.order_id);
        } else {
            errorHandler.handle('ClientId error');
        }
    }

    get watchTrip() {
        return this.$store.state.tripInfo;
    }
    @Watch('watchTrip')
    initTripInfo(tripInfo: any) {
        this.currentType = 'trip';
        this.selectContactPhone = '';
        this.contacts = [];
        this.mesTitle = `(Trip: ${tripInfo.trip_no})`;
        this.showMessage = false;
        if (tripInfo.driver_phone) {
            this.selectContactPhone = tripInfo.driver_phone;
            this.contacts.push({
                type: 'Driver',
                name: tripInfo.driver_firstname + ' ' + tripInfo.driver_lastname,
                phone: tripInfo.driver_phone
            });
        } else {
            errorHandler.handle('Driver phone number is empty');
        }
    }

    getTmsClientId() {
        return new Promise((resolve: any, reject: any) => {
            ControlPanelService.getTmsClientId().subscribe(
                (res: any) => {
                    if (res) {
                        resolve(res);
                    } else {
                        reject('');
                    }
                },
                (err: any) => {
                    reject('');
                    errorHandler.handle(err);
                }
            );
        });
    }

    checkoutChanel(orderId: any) {
        let params: any = {
            CustomerId: this.customerId,
            OrderId: orderId
        };
        ControlPanelService.checkChannel(params).subscribe(
            (res: any) => {
                if (!res.Result) {
                    this.createChannel(params);
                } else {
                    this.chatUrl = `${MESSAGE_URL}/messages?ClientId=${this.clientId}&CustomerID=${this.customerId}&OrderID=${orderId}`;
                    this.showMessage = true;
                }
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    createChannel(params: any) {
        ControlPanelService.createChannel(params).subscribe(
            (res: any) => {
                this.chatUrl = `${MESSAGE_URL}/messages?ClientId=${this.clientId}&CustomerID=${this.customerId}&OrderID=${params.OrderId}`;
                this.showMessage = true;
            },
            (err: any) => {
                errorHandler.handle(err);
            }
        );
    }

    sendPhoneMessage() {
        if (!this.selectContactPhone) {
            errorHandler.handle('Invalid phone number');
            return;
        }
        let params: any = {};
        if (this.currentType == 'order') {
            params = {
                CustomerID: this.customerId,
                OrderID: this.orderId,
                MessageContent: this.messageText,
                SentToNumber: this.selectContactPhone
            };
        } else {
            params = {
                MessageContent: this.messageText,
                SentToNumber: this.selectContactPhone
            };
        }
        this.sending = true;
        ControlPanelService.sendMessage(params).subscribe(
            (res: any) => {
                if (!res.Result) {
                    errorHandler.handle(res.ErrorMsg);
                } else {
                    MessageBox.alert(`Send Message success.`, 'Send Success', {
                        confirmButtonText: 'Ok',
                    });
                }
                this.sending = false;
            },
            (err: any) => {
                errorHandler.handle(err);
                this.sending = false;
            }
        );
    }

    resetMessageInfo() {
        this.contacts = [];
        this.selectContactPhone = '';
        this.messageText = '';
    }

    createConstacts(info: any) {
        if (info.billto_phone) {
            this.contacts.push({
                type: 'Bill To',
                name: info.billto_name,
                phone: info.billto_phone
            });
        }
        if (info.consignee_phone) {
            this.contacts.push({
                type: 'Consignee',
                name: info.consignee_name,
                phone: info.consignee_phone
            });
        }
        if (info.driver_phone) {
            this.contacts.push({
                type: 'Driver',
                name: info.driver_firstname + ' ' + info.driver_lastname,
                phone: info.driver_phone
            });
        }
        if (info.shipper_phone) {
            this.contacts.push({
                type: 'Shipper',
                name: info.shipper_name,
                phone: info.shipper_phone
            });
        }
    }
}