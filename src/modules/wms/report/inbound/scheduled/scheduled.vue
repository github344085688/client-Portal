<template>
    <div class="inbound-scheduled">

        <div class="grid-100 tablet-grid-100">

            <div class="grid-100 tablet-grid-100 container">
                <span class="component-title bold">Inbound Scheduled </span>
            </div>
            <div class="grid-100 tablet-grid-100 container margin-top-50 ">
                <date-range @selectDateRange="onSelectDateRange" :default-time-from = "scheduledSearchParam.createdTimeFrom"  :default-time-to ="scheduledSearchParam.createdTimeTo"> </date-range>
            </div>
            <div class="grid-100 tablet-grid-100 container avenirNext-Medium">
                <span class="component-title">Sort By: </span>
            </div>
            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-40 tablet-grid-25 container">
                    <label class="input-label">Search Receipt Numbers</label>
                    <div>
                        <receipt-auto-complete :placeholder="'Receipt / PO / Ref. /CNTR / SN'" v-model="scheduledSearchParam.receiptId" @change="onReceiptSelectChange" :facility="scheduledSearchParam.facility" :clearable="true" :customerIds="customerIds">
                        </receipt-auto-complete>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Facility</label>
                    <div>
                        <facility-select v-model="scheduledSearchParam.facility" @change="onSelectFacilityChange"></facility-select>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 ">
                    <predefined-customer-select v-model="scheduledSearchParam.customerId" @change="onselectCustomerChange" :customerIds="customerIds"></predefined-customer-select>
                </div>

                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Receipt Status</label>
                    <div>
                        <el-select no-match-text="No Data" v-model="scheduledSearchParam.useless" placeholder="All" @change="onselectReceiptStatus">
                            <el-option v-for="receiptStatu in receiptStatus" :key="receiptStatu.name" :label="receiptStatu.name" :value="receiptStatu.name">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>

            <div class="grid-100 tablet-grid-100 container margin-top-15">

                <div class="grid-50 tablet-grid-50 container  ">
                    <customize-table :tableFileds="tableFileds" @selectCustomizeTable="onSelectCustomizeTable"></customize-table>
                </div>
                <div class="grid-50 tablet-grid-50 container">
                     <predefined-export-btn   :value="'Export To Excel'" btn-class="right" :export-dates="exportDates" @selectExportName="onSelectExportName" :is-loading="exportLoading"></predefined-export-btn>
                </div>
            </div>

            <div class="grid-100 tablet-grid-100" v-loading="loading">
                <table class="table-client" v-fixed-head>
                    <thead>

                        <tr>
                            <th v-if="scheduledReports.head" class="width-30"></th>
                            <th v-for="head in scheduledReports.head" :key="head">{{head}}</th>

                        </tr>

                    </thead>
                    <tbody v-for="scheduled in scheduledReports.data" :key="scheduled.id">

                        <tr>

                            <td v-if="scheduledReports.head" class="cursor-point width-30" @click.stop.prevent="showChildItemTable(scheduled['Reciept #'])">
                                <i class="fas fa-chevron-right dz-icon " v-if="!childItemShow[scheduled['Reciept #']]"></i>
                                <i class="fas fa-chevron-down dz-icon" v-if="childItemShow[scheduled['Reciept #']]"></i>
                            </td>
                            <td v-for="head in scheduledReports.head" :key="head">
                                {{scheduled[head]}}
                            </td>

                        </tr>

                        <tr class="child-table-total" v-if="childItemShow[scheduled['Reciept #']]">
                            <td :colspan="scheduledReports.head.length+1" class="padding-init table-cell" v-loading="itemLoading[scheduled['Reciept #']]">
                                <div class="child">
                                    <table class="child-table">
                                        <thead>
                                            <tr>
                                                <th v-for="head in  getItemLeveLHead(scheduled['Reciept #'])" :key="head">{{head}}</th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            <tr v-for="itemLevel in getItemLeveLData(scheduled['Reciept #'])" :key="itemLevel.id">
                                                <td v-for="head in getItemLeveLHead(scheduled['Reciept #'])" :key="head">
                                                    {{itemLevel[head]}}
                                                </td>

                                            </tr>
                                        </tbody>
                                    </table>

                                    <simplified-pager v-if="setPageVisibility(scheduled['Reciept #'])" :keyId="scheduled['Reciept #']" :totalCount="getToTalCount(scheduled['Reciept #'])" :customizePageSize="getPageSize(scheduled['Reciept #'])" @reloadContent="searchItemLevelReportFromPager"></simplified-pager>

                                </div>

                            </td>

                        </tr>

                    </tbody>
                </table>
                <pager :totalCount="searchResultPaging.totalCount" :customizePageSize="scheduledSearchParam.paging.pageSize" @reloadContent="triggerSearchFromPager"></pager>

            </div>
        </div>
    </div>

</template>
<style lang="scss" src="./scheduled.scss" />