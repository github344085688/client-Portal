import { Component, Prop, Watch, Emit, PropSync } from 'vue-property-decorator';
import template from './index.vue';
import { Row, Col } from 'element-ui';
import * as _ from 'lodash';
import PopUpWindows from "@components/pop-up-windows/pop-up-windows";
import { Vue } from "vue-property-decorator";
import DatePicker from 'vue2-datepicker';
import SwitchButton from "@components/switch-button/switch-button";
import predefinedCustomerSelect from '@components/predefined-customer-select/predefined-customer-select';
import errorHanlder from '@shared/error-handler';

interface PopUpConfig {
    height?: number | string;
    title?: string;
    isSubmit?: Boolean;
    cancelFunc?: Function;
    submitFunc?: Function;
}

@Component({
    mixins: [template],
    components: {
        ElRow: Row,
        ElCol: Col,
        PopUpWindows,
        DatePicker,
        SwitchButton,
        predefinedCustomerSelect
    }
})

export default class UpdateListWindows extends Vue {
    @PropSync('isShow', { type: Boolean }) syncIsShow!: Boolean;
    @Emit()
    updateDate(configJson: any) {
        return configJson;
    }
    loading: boolean = false;
    updateData: any = {};

    popUpConfig: PopUpConfig = {
        title: 'Update List',
        height: 500,
        isSubmit: true,
        submitFunc: () => {
            this.confirm();
        },
        cancelFunc: () => {
            this.cancelFunc();
        }
    };
    configJson: any = {};
    customerId: string = '';

    onselectCustomerChange(payload: any) {
        this.updateData.customerId = payload.id;
    }

    confirm() {
        this.$emit('updateData', this.updateData);
    }

    cancelFunc() {
        this.syncIsShow = false;
    }

    async fileUpload(element: any) {
        await this.excelFileValidate(element.srcElement.files[0]).then(res => {
            this.updateData.excelDataFile = res;
        }).catch(err => {
            errorHanlder.handle(err);
        });
    }

    excelFileValidate(files: any) {
        const fileName = files.name;
        const temp = fileName.toLowerCase().split(".");
        const fileType = temp[temp.length - 1];
        return new Promise((resolve, reject) => {
            if (fileType != "xls" && fileType != "xlsx") {
                files.value = "";
                reject('Please upload Excel file!');
            } else {
                resolve(files);
            }
        });
    }

}