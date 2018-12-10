<template>
    <div class="inbound-receipt">

        <div class="grid-100 tablet-grid-100 ">

            <div class="grid-100 tablet-grid-100 container">
                <span class="component-title bold">Inbound Receiving </span>
            </div>
            <div class="grid-100 tablet-grid-100 container margin-top-50 ">
                <date-range @selectDateRange="onSelectDateRange" :default-time-from = "receiptedSearchParam.startTime"  :default-time-to ="receiptedSearchParam.endTime"> </date-range>
            </div>
            <div class="grid-100 tablet-grid-100 container avenirNext-Medium">
                <span class="component-title">Sort By: </span>
            </div>
            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-40 tablet-grid-25 container">
                    <label class="input-label">Search By</label>
                    <div>
                        <input type="text" v-model="receiptedSearchParam.keyword" placeholder="Receipt / PO / Ref. /CNTR / SN"  v-rx-event:input="searchByInput" />                     
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Facility</label>
                    <div>
                        <facility-select v-model="receiptedSearchParam.facility" @change="onSelectFacilityChange"></facility-select>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25" >
                    <predefined-customer-select v-model="receiptedSearchParam.customerId" @change="onselectCustomerChange" :customerIds="customerIds"></predefined-customer-select>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Receipt Status</label>
                    <div>
                        <el-select no-match-text="No Data" v-model="receiptedSearchParam.useless" placeholder="All" @change="onSelectReceiptStatus">
                            <el-option v-for="receiptStatu in receiptStatus" :key="receiptStatu.name" :label="receiptStatu.name" :value="receiptStatu.name">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>

            <div class="grid-100 tablet-grid-100 container margin-top-15">

                <div class="grid-50 tablet-grid-50 container">
                    <customize-table :tableFileds="tableFileds" @selectCustomizeTable="onSelectCustomizeTable"></customize-table>
                </div>
                <div class="grid-50 tablet-grid-50 container">
                        <predefined-export-btn  btn-class="right"  :value="'Export To Excel'" :export-dates="exportDates" @selectExportName="onSelectExportName" :is-loading="exportLoading"></predefined-export-btn>
                </div>
            </div>

            <div class="grid-100 tablet-grid-100" v-loading="loading">
                <table class="table-client" v-fixed-head >
                    <thead>
                        <tr>
                            <th v-if="receiptedReports.head" class="cursor-point"></th>
                            <th v-for="head in receiptedReports.head" :key="head.id">{{head}}</th>

                        </tr>
                    </thead>
                    <tbody v-for="receipt in receiptedReports.data" :key="receipt.id">
                        <tr>
                            <td v-if="receiptedReports.head" class="cursor-point width-30" @click.stop.prevent="showChildItemTable(receipt['Reciept #'])">
                                <i class="fas fa-chevron-right dz-icon " v-if="!childItemShow[receipt['Reciept #']]"></i>
                                <i class="fas fa-chevron-down dz-icon" v-if="childItemShow[receipt['Reciept #']]"></i>
                            </td>
                            <td v-for="head in receiptedReports.head" :key="head.id" >
                                {{receipt[head]}}
                            </td>
                        </tr>
                        <tr class="child-table-total" v-if="childItemShow[receipt['Reciept #']]">
                            <td :colspan="receiptedReports.head.length+1" class="padding-init table-cell" v-loading="itemLoading[receipt['Reciept #']]">
                                <div class="child">
                                    <table class="child-table">
                                        <thead>

                                            <tr>
                                                <th v-if="getItemLeveLHead(receipt['Reciept #'])" class="cursor-point"></th>
                                                <th v-for="head in  getItemLeveLHead(receipt['Reciept #'])" :key="head.id">{{head}}</th>
                                            </tr>

                                        </thead>
                                        <tbody v-for="itemLevel in getItemLeveLData(receipt['Reciept #'])" :key="itemLevel.id">
                                            <tr>
                                                <td v-if="getItemLeveLData(receipt['Reciept #'])" class="cursor-point width-30" @click.stop.prevent="showSNListTable(itemLevel,receipt['Reciept #'])"
                                                    :init="itemSNShowName = getItemSNShowName(itemLevel['Item ID'],itemLevel['Title'],itemLevel['Received UOM'])">
                                                    <i class="fas fa-chevron-right dz-icon " v-if="! ItemShowSNDetais[itemSNShowName]"></i>
                                                    <i class="fas fa-chevron-down dz-icon" v-if=" ItemShowSNDetais[itemSNShowName]"></i>
                                                </td>
                                                <td v-for="head in getItemLeveLHead(receipt['Reciept #'])" :key="head.id">
                                                    {{itemLevel[head]}}
                                                </td>
                                            </tr>
                                            <tr class="child-table-total" v-if="ItemShowSNDetais[itemSNShowName]">
                                                <td :colspan="getItemLeveLHead(receipt['Reciept #']).length+1" class="padding-init table-cell" v-loading="ItemSNDetailoading[itemSNShowName]">
                                                    <div style="padding:15px;">SNDetails:</div>
                                                    <div class="sn-details">
                                                        <span v-for="itemSN in itemSNDetails[itemSNShowName]" :key="itemSN.id">{{itemSN}}</span>
                                                    </div>
                                        
                                                </td>
                                        
                                            </tr>
                                        </tbody>
                                    </table>

                                    <simplified-pager v-if="setPageVisibility(receipt['Reciept #'])" :keyId="receipt['Reciept #']" :totalCount="getToTalCount(receipt['Reciept #'])" :customizePageSize="getPageSize(receipt['Reciept #'])" @reloadContent="searchItemLevelReportFromPager"></simplified-pager>

                                </div>

                            </td>

                        </tr>
                    </tbody>
                </table>
                <pager :totalCount="searchResultPaging.totalCount" :customizePageSize="receiptedSearchParam.paging.pageSize" @reloadContent="triggerSearchFromPager"></pager>

            </div>
        </div>
    </div>

</template>
<style lang="scss" src="./receipt.scss" />
