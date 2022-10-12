import CustomerWiseVue from "@shared/customer-wise-vue";
import DatePicker from 'vue2-datepicker';
import { Component, Watch } from "vue-property-decorator";
import { Row, Col, Tabs, TabPane, Card, Badge, Table, TableColumn, Button } from "element-ui";
import Pager from "@components/pager/pager";
import idManagementService from '@services/idManagement-service';
import * as moment from 'moment';
import tlp from "./index.vue";
import errorHanlder from '@shared/error-handler';
import WaittingBtn from "@components/waitting-button/waitting-btn";
import UserPreferences from "./components/userPreferences/index";
import * as _ from 'lodash';
import util from "@shared/util";

interface List {
    head: Array<string>;
    headMap: object;
    body: Array<any>;
}

interface Paging {
    pageSize: number;
    currentPage: number;
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
        WaittingBtn,
        UserPreferences
    }
})

export default class IdManagement extends CustomerWiseVue {
    loading: Boolean = false;
    activeName: string = 'userDirectory';
    searchParams: any = {
        username: '',
        employeeId: ''
    };
    userSearchParams: any = {
        username: '',
        employeeId: '',
        roleNames: '',
        applicationName: ''
    };
    userDirectoryList: Array<any> = [];
    userDirectoryView: List = {
        head: [],
        headMap: {},
        body: []
    };
    currentUserDirectory: any = {};
    paging: Paging = {
        pageSize: 10,
        currentPage: 1
    };
    userPreferenceShow: boolean = false;
    platformList: Array<any> = [];
    originalPlatformList: Array<any> = [];
    platformListView: Array<any> = [];
    platFormAccessList: Array<any> = [];
    selectedPlatFormAccessList: Array<any> = [];
    userPreferencesKey: number = 0;
    currentRow: number = 0;
    platformUsers: Array<any> = [];
    platformUsersView: List = {
        head: [],
        headMap: {},
        body: []
    };
    selectedPlatFormUser: any = {};
    roles: Array<string> = ['admin', 'general', 'client'];
    updateRoleList: any = {
        userName: '',
        deletedRoles: [],
        newRoles: []
    };

    mounted() {
    }

    loadUserDirectory() {
        this.loading = true;
        const params = {
            username: this.searchParams.username ? `${this.searchParams.username}*` : '',
            employeeId: `${this.searchParams.employeeId}`
        };
        idManagementService.userDirectory(params).subscribe(
            res => {
                this.loading = false;
                this.userDirectoryList = res;
                this.userDirectoryView = {
                    head: ['User First', 'User Last', 'Employee ID', 'Email', 'Platform access', 'Status'],
                    headMap: {
                        'User First': 'firstName',
                        'User Last': 'lastName',
                        'Employee ID': 'employeeId',
                        'Email': 'email',
                        'Platform access': 'applicationName',
                        'Status': 'active'
                    },
                    body: []
                };
                this.reloadContent({currentPage: 1, pageSize: 10});
                this.platFormAccessList = _.map(this.userDirectoryList, function(item) {
                    return {
                        username: item.username,
                        name: item.applicationName,
                        roleNames: item.roleNames
                    };
                });
            },
            (err: any) => {
                this.loading = false;
                errorHanlder.handle(err);
            }
        );
    }

    loadPlatformList() {
        this.loading = true;
        idManagementService.platformList().subscribe(
            res => {
                this.loading = false;
                this.platformList = res;
                this.userSearchParams.applicationName = Object.keys(res)[0];
                this.selectedPlatFormUser = {
                    platformName: Object.keys(res)[0],
                    count: Object.values(res)[0]
                };
                this.loadPlatformUsers();
            },
            err => {
                this.loading = false;
                errorHanlder.handle(err);
            }
        );
    }

    loadPlatformUsers() {
        const userSearchParams = {
            ...this.userSearchParams,
            username: this.userSearchParams.username ? `${this.userSearchParams.username}*` : ``,
            roleNames: this.userSearchParams.roleNames ? [`Application/${this.userSearchParams.applicationName}-platform-${this.userSearchParams.roleNames}`] : ''
        };
        idManagementService.platformUsers(userSearchParams).subscribe(
            res => {
                this.originalPlatformList = JSON.parse(JSON.stringify(res));
                this.platformUsers = res;
                this.platformUsers.map(platformUser => {
                    platformUser.roleNames?.split(',').map((role: any) => {
                        const separator = RegExp(`Application\/|${this.userSearchParams.applicationName}-platform-`);
                        role.split(separator).some((item: string) => {
                            if (this.roles.includes(item)) {
                                platformUser.roleNames = item;
                                return true;
                            }
                        });
                    });
                });
                this.platformUsersView = {
                    head: ['User First', 'User Last', 'Employee ID', 'Role'],
                    headMap: {
                        'User First': 'firstName',
                        'User Last': 'lastName',
                        'Employee ID': 'employeeId',
                        'Role': 'roleNames'
                    },
                    body: []
                };
                this.reloadPlatformUserList({currentPage: 1, pageSize: 10});
            },
            err => {
                errorHanlder.handle(err);
            }
        );
    }

    reloadContent(page: Paging) {
        this.userDirectoryView.body = this.userDirectoryList.slice((page.currentPage - 1) * this.paging.pageSize, page.currentPage * this.paging.pageSize);
    }

    reloadPlatformUserList(page: Paging) {
        this.platformUsersView.body = this.platformUsers.slice((page.currentPage - 1) * this.paging.pageSize, page.currentPage * this.paging.pageSize);
    }

    showUserPreference(currentUserDirectory: any) {
        this.userPreferenceShow = true;
        this.currentUserDirectory = currentUserDirectory;
        this.userPreferencesKey++;
        this.selectedPlatFormAccessList = this.platFormAccessList.filter((access) => access.username === currentUserDirectory.username);
    }

    clickRow(index: number, platformName: string, count: number) {
        this.currentRow = index;
        this.userSearchParams.applicationName = platformName;
        this.loadPlatformUsers();
        this.selectedPlatFormUser = {
            platformName,
            count
        };
    }

    downloadPlatformUsers() {
        const userSearchParams = {
            ...this.userSearchParams,
            roleNames: this.userSearchParams.roleNames ? [`Application/${this.userSearchParams.applicationName}-platform-${this.userSearchParams.roleNames}`] : ''
        };
        idManagementService.downloadPlatformUsers(userSearchParams).then(
            res => {
                util.exportFile(res, "platformList.xlsx");
                this.$message.success('download success');
            },
            err => {
                errorHanlder.handle(err);
            }
        );
    }

    roleParamsConfig(userInfo: any, index: number) {
        this.updateRoleList = {
            userName: userInfo.username,
            deletedRoles: [],
            newRoles: []
        };
        const roleNamesArray = this.originalPlatformList[index]?.roleNames?.split(',') || [];
        const currentRole = `Application/${this.selectedPlatFormUser.platformName}-platform-${userInfo.roleNames}`;
        let originalRolesObj: any = {};
        roleNamesArray?.map((item: any) => {
            const separator = /Application\/|-platform-/;
            const accessToRole = item.split(separator);
            this.$set(originalRolesObj, accessToRole[1], accessToRole[2]);
            originalRolesObj = _.pickBy(originalRolesObj, _.identity);
        });
        if (Object.keys(originalRolesObj).includes(this.selectedPlatFormUser.platformName)) {
            const deletedRole = roleNamesArray?.filter((item: any) => item.indexOf(`${this.selectedPlatFormUser.platformName}`) > -1);
            this.updateRoleList.deletedRoles.push(deletedRole.toString());
            this.updateRoleList.newRoles.push(currentRole);
        } else {
            this.updateRoleList.newRoles.push(currentRole);
        }
        this.updateRoleListOfUser();
    }

    updateRoleListOfUser() {
        idManagementService.updateRoleListOfUser(this.updateRoleList).subscribe(
            res => {
                this.$message.success('update success');
            },
            err => {
                errorHanlder.handle(err);
            }
        );
    }

    loadPlatformTab(tab: any) {
        tab.name === 'platformList' && this.loadPlatformList();
    }

    downloadUserDirectory() {
        const params = {
            username: this.searchParams.username ? `${this.searchParams.username}*` : '',
            employeeId: `${this.searchParams.employeeId}`
        };
        idManagementService.downloadUserDirectory(params).then(
            res => {
                util.exportFile(res, "userDirectoryList.xlsx");
                this.$message.success('download success');
            },
            err => {
                errorHanlder.handle(err);
            }
        );
    }
}