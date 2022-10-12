import CustomerWiseVue from "@shared/customer-wise-vue";
import DatePicker from 'vue2-datepicker';
import { Component, Watch } from "vue-property-decorator";
import { Row, Col, Tabs, TabPane, Card, Badge, Table, TableColumn, Button } from "element-ui";
import Pager from "@components/pager/pager";
import * as moment from 'moment';
import template from "./index.vue";
import errorHanlder from '@shared/error-handler';
import predefinedCustomerSelect from '@components/predefined-customer-select/predefined-customer-select';
import facilitySelect from '@components/facility-select/facility-select';
import marketplaceService from "@/services/marketplace-service";
import waittingBtn from "@/components/waitting-button/waitting-btn";
import updateListWindows from "./components";
import util from "@shared/util";
import ItemAutoComplete from "@components/itemspec-auto-complete/itemspec-auto-complete";

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
        predefinedCustomerSelect,
        facilitySelect,
        waittingBtn,
        updateListWindows,
        ItemAutoComplete
    }
})

export default class Marketplace extends CustomerWiseVue {
    searchParam: any = {};
    updateListLoading: boolean = false;
    exportLoading: boolean = false;
    searchListLoading: boolean = false;
    updateListWindowsIsShow: boolean = false;
    newListData: object = {};
    viewList: object = {
        head: [],
        data: []
    };
    list: Array<any> = [];
    paging: Paging = {
        pageSize: 10,
        currentPage: 1
    };
    updateListWindowsIndex: number = 0;

    onselectCustomerChange(payload: any) {
        this.searchParam.customerId = payload.id;
    }

    showPopUpWindows() {
        this.updateListWindowsIsShow = true;
        this.updateListWindowsIndex++;
    }

    updateList(newListData: any) {
        const updateData = new FormData();
        updateData.append("excelDataFile", newListData.excelDataFile);
        updateData.append("customerId", newListData.customerId);
        this.updateListLoading = true;
        marketplaceService.updateList(updateData).subscribe(
            res => {
                this.updateListLoading = false;
                this.updateListWindowsIsShow = false;
            },
            err => {
                this.updateListLoading = false;
                errorHanlder.handle(err);
            }
        );
    }

    searchList(currentPage: number) {
        this.searchListLoading = true;
        marketplaceService.searchList(this.searchParam).subscribe(
            res => {
                this.searchListLoading = false;
                this.list = res.results.data;
                this.viewList = {
                    data: this.list.slice((currentPage - 1) * this.paging.pageSize, currentPage * this.paging.pageSize),
                    head: res.results.head
                };
            },
            err => {
                this.searchListLoading = false;
                errorHanlder.handle(err);
            }
        );
    }

    reloadContent(page: Paging) {
        this.paging = {
            pageSize: page.pageSize,
            currentPage: page.currentPage
        };
        this.searchList(page.currentPage);
    }

    exportToExcel() {
        this.exportLoading = true;
        marketplaceService.export(this.viewList).then(
            res => {
                this.exportLoading = false;
                util.exportFile(res, "marketplace.xlsx");
            },
            err => {
                this.exportLoading = false;
                errorHanlder.handle(err);
            }
        );
    }
}