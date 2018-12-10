<template>
    <div class="outbound-shipping">

        <div class="grid-100 tablet-grid-100">

            <div class="grid-100 tablet-grid-100 container">
                <span class="component-title bold">Outbound Shipping </span>
            </div>
            <div class="grid-100 tablet-grid-100 container margin-top-50 ">

                <div class="tablet-grid-25 container date-grid-20">
                    <label class="input-label">Shipped Date Range</label>
                    <date-range @selectDateRange="onSelectShippedDateRange" :default-time-from="shippingSearchParam.shippedTimeFrom" :default-time-to="shippingSearchParam.shippedTimeTo"> </date-range>
                </div>
                <div class="tablet-grid-25 container date-grid-20">
                    <label class="input-label">Order Date Range</label>
                    <date-range @selectDateRange="onSelectOrderDateRange" :default-time-from="shippingSearchParam.orderedDateFrom" :default-time-to="shippingSearchParam.orderedDateTo"> </date-range>
                </div>
            </div>

            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-25 tablet-grid-25">
                    <label class="input-label">Search Order Numbers</label>
                    <div>
                        <input type="text" v-model="shippingSearchParam.keyword" placeholder="Order / PO / Ref. /CNTR / SN" v-rx-event:input="searchByInput" />
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25">
                    <label class="input-label">Search Tracking Numbers</label>
                    <div>
                        <input type="text" v-model="shippingSearchParam.trackingNo" placeholder="Tracking" v-rx-event:input="searchTrackingNumbers" />
                    </div>
                </div>
                <div class="grid-15 tablet-grid-25">
                    <label class="input-label">Facility</label>
                    <div>
                        <facility-select v-model="shippingSearchParam.facility" @change="onSelectFacilityChange"></facility-select>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Order Status</label>
                    <div>
                        <el-select no-match-text="No Data" v-model="shippingSearchParam.useless" placeholder="All" @change="onSelectOrderStatus" :disabled="loading">
                            <el-option v-for="statu in shippingStatus" :key="statu.name" :label="statu.name" :value="statu.name">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>

            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-20 tablet-grid-25">
                    <predefined-customer-select v-model="shippingSearchParam.customerId" @change="onselectCustomerChange" :customerIds="customerIds"></predefined-customer-select>
                </div>
                <div class="grid-20 tablet-grid-25 ">
                    <label class="input-label">Retailer</label>
                    <div>
                        <organization-auto-complete :clearable="true" v-model="shippingSearchParam.retailerId" @change="onselectCustomerChange" :customerId="shippingSearchParam.customerId" tag="Retailer">
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
                            <th v-if="shippingReports.head" class="width-30"></th>
                            <th v-for="head in shippingReports.head" :key="head.id">{{head}}</th>

                        </tr>
                    </thead>
                    <tbody v-for="shipping in shippingReports.data" :key="shipping.id">
                        <tr>
                            <td v-if="shippingReports.head" class="cursor-point width-30" @click.stop.prevent="showChildItemTable(shipping['Order #'])">
                                <i class="fas fa-chevron-right dz-icon " v-if="!childItemShow[shipping['Order #']]"></i>
                                <i class="fas fa-chevron-down dz-icon" v-if="childItemShow[shipping['Order #']]"></i>
                            </td>
                            <td v-for="head in shippingReports.head" :key="head.id">
                                {{shipping[head]}}
                            </td>
                        </tr>

                        <tr class="child-table-total" v-if="childItemShow[shipping['Order #']]">
                            <td :colspan="shippingReports.head.length+1" class="padding-init table-cell" v-loading="itemLoading[shipping['Order #']]">
                                <div class="child">
                                    <table class="child-table">
                                        <thead>
                                            
                                            <tr>  
                                                <th v-if="getItemLeveLHead(shipping['Order #'])" class="cursor-point"></th>
                                                <th v-for="head in  getItemLeveLHead(shipping['Order #'])" :key="head.id">{{head}}</th>
                                            </tr>

                                        </thead>
                                        <tbody v-for="itemLevel in getItemLeveLData(shipping['Order #'])" :key="itemLevel.id" >
                                            <tr >
                                                    <td v-if="getItemLeveLHead(shipping['Order #'])" class="cursor-point width-30" @click.stop.prevent="showSNListTable(itemLevel,shipping['Order #'])"
                                                    :init="itemSNShowName = getItemSNShowName(itemLevel['Item ID'],itemLevel['Title'],itemLevel['UOM'],shipping['Order #'])">
                                                    <i class="fas fa-chevron-right dz-icon " v-if="! ItemShowSNDetais[itemSNShowName]"></i>
                                                    <i class="fas fa-chevron-down dz-icon" v-if=" ItemShowSNDetais[itemSNShowName]"></i>
                                                </td>
                                                <td v-for="head in getItemLeveLHead(shipping['Order #'])" :key="head.id">
                                                    <a v-if="(shipping['Carrier']==='UPSN' ||shipping['Carrier']==='FDEG') && head ==='Tracking#'" href="javascript:void(0)" @click.stop.prevent="clickTrackingNo(shipping['Carrier'],itemLevel[head])">
                                                        {{itemLevel[head]}}
                                                    </a>
                                                    <span v-if="(shipping['Carrier']!='UPSN' && shipping['Carrier']!='FDEG' && head ==='Tracking#')||head !='Tracking#'">
                                                        {{itemLevel[head]}}
                                                    </span>

                                                </td>

                                            </tr>
                                              <tr class="child-table-total" v-if="ItemShowSNDetais[itemSNShowName]">
                                                    <td :colspan="getItemLeveLHead(shipping['Order #']).length+1" class="padding-init table-cell" v-loading="ItemSNDetailoading[itemSNShowName]">
                                                        <div style="padding:15px;">SNDetails:</div>
                                                        <div class="sn-details">
                                                            <span v-for="itemSN in itemSNDetails[itemSNShowName]" :key="itemSN.id">{{itemSN}}</span>
                                                        </div>                                            
                                                    </td>
                                            
                                                </tr> 
                                        </tbody>
                                    </table>

                                    <simplified-pager v-if="setPageVisibility(shipping['Order #'])" :keyId="shipping['Order #']" :totalCount="getToTalCount(shipping['Order #'])" :customizePageSize="getPageSize(shipping['Order #'])" @reloadContent="searchItemLevelReportFromPager"></simplified-pager>

                                </div>

                            </td>

                        </tr>

                    </tbody>
                </table>
                <pager :totalCount="searchResultPaging.totalCount" :customizePageSize="shippingSearchParam.paging.pageSize" @reloadContent="triggerSearchFromPager"></pager>

            </div>
        </div>
    </div>

</template>
<style lang="scss" src="./shipping.scss" />