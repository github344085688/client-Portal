import CustomerWiseVue from "@/shared/customer-wise-vue";
import { Component, Prop, Watch, Emit, PropSync } from 'vue-property-decorator';
import template from './index.vue';
import { Row, Col, CheckboxGroup, Checkbox, Select, Option } from "element-ui";
import SwitchButton from "@components/switch-button/switch-button";
import * as _ from 'lodash';
import PopUpWindows from "@components/pop-up-windows/pop-up-windows";
import errorHanlder from '@shared/error-handler';
import idManagementService from '@services/idManagement-service';

interface List {
    head?: object;
    body?: Array<object>;
    headMap?: object;
}

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
        ElCheckboxGroup: CheckboxGroup,
        ElCheckbox: Checkbox,
        PopUpWindows,
        SwitchButton,
        ElRow: Row,
        ElCol: Col,
        ElSelect: Select,
        ElOption: Option
    }
})

export default class UserPreference extends CustomerWiseVue {
    @PropSync('isShow', { type: Boolean }) syncIsShow!: Boolean;
    @Prop(Array) readonly platformAccessList!: Array<any>;
    @Prop() currentUserDirectory!: any;
    loading: boolean = false;
    preferences: any = {
        isActive: true,
        access: []
    };
    syncCurrentUserDirectory: any = this.currentUserDirectory;
    syncPlatformAccessList: Array<any> = this.platformAccessList || [];
    roles: Array<string> = ['admin', 'general', 'client'];
    updateRoleList: any = {
        userName: '',
        deletedRoles: [],
        newRoles: []
    };
    originalRoles: Array<any> = [];
    updatedOriginalRoles: Array<any> = [];
    originalRolesObj: any = {};
    isActive: boolean = true;

    popUpConfig: PopUpConfig = {
        title: '',
        height: 754,
        isSubmit: true,
        submitFunc: () => {
            this.confirm();
        },
        cancelFunc: () => {
            this.cancelFunc();
        }
    };


    mounted() {
        this.updateRoleList.userName = this.currentUserDirectory.username;
        const roleNamesArray = this.currentUserDirectory?.roleNames?.split(',') || [];
        this.originalRoles = roleNamesArray;
        this.updatedOriginalRoles = JSON.parse(JSON.stringify(this.originalRoles));
        roleNamesArray?.map((item: any) => {
            const separator = /Application\/|-platform-/;
            const accessToRole = item.split(separator);
            this.$set(this.originalRolesObj, accessToRole[1], accessToRole[2]);
            this.originalRolesObj = _.pickBy(this.originalRolesObj, _.identity);
        });
        this.syncPlatformAccessList = this.platformAccessList?.map(item => {
            return {
                ...item,
                roleNames: this.originalRolesObj[item.name] || ''
            };
        });
    }

    toggleSelection(access: any, $index: number) {
        const currentRoleName = `Application/${access.name}-platform-${access.roleNames}`;
        const initRole = this.roles.includes(access.roleNames) ? access.roleNames : 'admin';
        const newRolesIndex = this.updateRoleList.newRoles.indexOf(currentRoleName);
        const deletedRolesIndex = this.updateRoleList.deletedRoles.indexOf(currentRoleName);
        const updatedOriginalRolesIndex = this.updatedOriginalRoles.indexOf(currentRoleName);
        const fullInitRole = `Application/${access.name}-platform-${initRole}`;
        if (this.isChecked(access)) {
            newRolesIndex > -1 && this.updateRoleList.newRoles.splice(newRolesIndex, 1);
            deletedRolesIndex === -1 && this.originalRoles.indexOf(currentRoleName) > -1 && this.updateRoleList.deletedRoles.push(currentRoleName);
            this.updatedOriginalRoles.splice(updatedOriginalRolesIndex, 1);
            this.$set(this.syncPlatformAccessList[$index], 'roleNames', '');
        } else {
            this.originalRoles.indexOf(fullInitRole) === -1 && this.updateRoleList.newRoles.indexOf(fullInitRole) === -1 && this.updateRoleList.newRoles.push(fullInitRole);
            this.updatedOriginalRoles.push(fullInitRole);
            this.$set(this.syncPlatformAccessList[$index], 'roleNames', initRole);
        }
    }

    changeUserAccess(access: any, $index: number) {
        const currentRoleName = `Application/${access.name}-platform-${access.roleNames}`;
        const isExist = this.updatedOriginalRoles.some((item, index) => {
            const separator = /Application\/|-platform-/;
            const accessToRole = item.split(separator);
            if (accessToRole[1] === access.name) {
                const oldRoleName = `Application/${access.name}-platform-${accessToRole[2]}`;
                this.originalRoles.indexOf(oldRoleName) > -1 && this.updateRoleList.deletedRoles.push(oldRoleName);
                const newRolesIndex = this.updateRoleList.newRoles.indexOf(oldRoleName);
                newRolesIndex > -1 && this.updateRoleList.newRoles.splice(newRolesIndex, 1);
                this.updateRoleList.newRoles.push(currentRoleName);
                this.updatedOriginalRoles.splice(index, 1);
                this.updatedOriginalRoles.push(currentRoleName);
                this.$set(this.syncPlatformAccessList[$index], 'roleNames', access.roleNames);
                return true;
            }
        });
        if (!isExist) {
            this.originalRoles.indexOf(currentRoleName) === -1 && this.updateRoleList.newRoles.push(currentRoleName);
            this.updatedOriginalRoles.push(currentRoleName);
            this.$set(this.syncPlatformAccessList[$index], 'roleNames', access.roleNames);
        }
    }

    isChecked(access: any) {
        const roleName = `Application/${access.name}-platform-${access.roleNames}`;
        return this.updatedOriginalRoles.includes(roleName);
    }

    private confirm() {
        idManagementService.updateRoleListOfUser(this.updateRoleList).subscribe(
            res => {
                this.$message.success('update success');
                this.syncIsShow = false;
                this.$emit('loadUserDirectory');
            },
            err => {
                errorHanlder.handle(err);
            }
        );
    }

    cancelFunc() {
        this.syncIsShow = false;
    }

    removePlatFormList() {
        this.updateRoleList.deletedRoles = this.updatedOriginalRoles;
        this.updatedOriginalRoles = [];
        this.syncPlatformAccessList = this.platformAccessList?.map(item => {
            return {
                ...item,
                roleNames: ''
            };
        });
    }

}