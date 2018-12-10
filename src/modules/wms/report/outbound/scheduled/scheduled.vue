<template>
    <div class="outbound-scheduled">

        <div class="grid-100 tablet-grid-100">

            <div class="grid-100 tablet-grid-100 container">
                <span class="component-title bold">Outbound Scheduled </span>
            </div>

            <div class="grid-100 tablet-grid-100 container margin-top-50 ">
                <div class="tablet-grid-25 date-grid-20 container">
                    <label class="input-label">Scheduled Date Range</label>
                    <date-range @selectDateRange="onSelectScheduledDateRange" :default-time-from="scheduledSearchParam.scheduleDateFrom" :default-time-to="scheduledSearchParam.scheduleDateTo"> </date-range>
                </div>
                <div class="tablet-grid-25 container date-grid-20">
                    <label class="input-label">Order Date Range</label>
                    <date-range @selectDateRange="onSelectOrderDateRange" :default-time-from="scheduledSearchParam.orderedDateFrom" :default-time-to="scheduledSearchParam.orderedDateTo"> </date-range>
                </div>
            </div>

            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-25 tablet-grid-25">
                    <label class="input-label">Search Order Numbers</label>
                    <div>
                        <order-auto-complete v-model="scheduledSearchParam.orderId" :placeholder="'Order / PO / Ref. /CNTR'" @change="onOrderSelectChange" :clearable="true" :facility="scheduledSearchParam.facility" :customerIds="customerIds">
                        </order-auto-complete>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25">
                    <label class="input-label">Search Tracking Numbers</label>
                    <div>
                        <input type="text" v-model="scheduledSearchParam.trackingNo" placeholder="Tracking" v-rx-event:input="searchTrackingNumbers" />
                    </div>
                </div>

                <div class="grid-15 tablet-grid-25">
                    <label class="input-label">Facility</label>
                    <div>
                        <facility-select v-model="scheduledSearchParam.facility" @change="onSelectFacilityChange"></facility-select>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 ">
                    <label class="input-label">Order Status</label>
                    <div>
                        <el-select no-match-text="No Data" v-model="scheduledSearchParam.useless" placeholder="All" @change="onSelectOrderStatus">
                            <el-option v-for="statu in shippingStatus" :key="statu.name" :label="statu.name" :value="statu.name">
                            </el-option>
                        </el-select>
                    </div>
                </div>

            </div>

            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-20 tablet-grid-25">
                    <predefined-customer-select v-model="scheduledSearchParam.customerId" @change="onselectCustomerChange" :customerIds="customerIds"></predefined-customer-select>
                </div>
                <div class="grid-20 tablet-grid-25">
                    <label class="input-label">Retailer</label>
                    <div>
                        <organization-auto-complete v-model="scheduledSearchParam.retailerId"  @change="onselectCustomerChange" :customerId="scheduledSearchParam.customerId" :clearable="true" tag="Retailer">
                        </organization-auto-complete>
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
                            <th v-for="head in scheduledReports.head" :key="head.id">{{head}}</th>

                        </tr>
                    </thead>
                    <tbody v-for="scheduled in scheduledReports.data" :key="scheduled.id">
                        <tr>
                            <td v-if="scheduledReports.head" class="cursor-point width-30" @click.stop.prevent="showChildItemTable(scheduled['Order Number'])">
                                <i class="fas fa-chevron-right dz-icon " v-if="!childItemShow[scheduled['Order Number']]"></i>
                                <i class="fas fa-chevron-down dz-icon" v-if="childItemShow[scheduled['Order Number']]"></i>
                            </td>
                            <td v-for="head in scheduledReports.head" :key="head.id">
                                {{scheduled[head]}}
                            </td>
                        </tr>
                        <tr class="child-table-total" v-if="childItemShow[scheduled['Order Number']]">
                            <td :colspan="scheduledReports.head.length+1" class="padding-init table-cell" v-loading="itemLoading[scheduled['Order Number']]">
                                <div class="child">
                                    <table class="child-table">
                                        <thead>
                                            <tr>
                                                <th v-for="head in  getItemLeveLHead(scheduled['Order Number'])" :key="head.id">{{head}}</th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            <tr v-for="itemLevel in getItemLeveLData(scheduled['Order Number'])" :key="itemLevel.id">
                                                <td v-for="head in getItemLeveLHead(scheduled['Order Number'])" :key="head.id">

                                                    <a v-if="(scheduled['Carrier']==='UPSN' ||scheduled['Carrier']==='FDEG') && head ==='Tracking#'" href="javascript:void(0)" @click.stop.prevent="clickTrackingNo(scheduled['Carrier'],itemLevel[head])">
                                                        {{itemLevel[head]}}
                                                    </a>
                                                    <span v-if="(scheduled['Carrier']!='UPSN' && scheduled['Carrier']!='FDEG' && head ==='Tracking#') || head !='Tracking#'">
                                                        {{itemLevel[head]}}
                                                    </span>

                                                </td>

                                            </tr>
                                        </tbody>
                                    </table>

                                    <simplified-pager v-if="setPageVisibility(scheduled['Order Number'])" :keyId="scheduled['Order Number']" :totalCount="getToTalCount(scheduled['Order Number'])" :customizePageSize="getPageSize(scheduled['Order Number'])" @reloadContent="searchItemLevelReportFromPager"></simplified-pager>

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