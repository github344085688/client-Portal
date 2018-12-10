<template>
    <div class="invenroty-adjustment">

        <div class="grid-100 tablet-grid-100">

            <div class="grid-100 tablet-grid-100 container">
                <span class="component-title bold">Inventory Adjustment </span>
            </div>
            <div class="grid-100 tablet-grid-100 container margin-top-50 ">
                <date-range @selectDateRange="onSelectDateRange" :default-time-from = "adjustmentSearchInfo.timeFrom"  :default-time-to ="adjustmentSearchInfo.timeTo"> </date-range>
            </div>
            <div class="grid-100 tablet-grid-100 container avenirNext-Medium">
                <span class="component-title">Sort By: </span>
            </div>
            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Search Item</label>
                    <div>
                        <item-auto-complete :placeholder="'Item ID or Description'" v-model="adjustmentSearchInfo.itemSpecId" @change="onItemSelectChange" :clearable="true" :customerIds="customerIds">
                        </item-auto-complete>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Facility</label>
                    <div>
                        <facility-select v-model="adjustmentSearchInfo.facility" @change="onSelectFacilityChange"></facility-select>

                    </div>
                </div>
                <div class="grid-20 tablet-grid-25" v-show="customerIds.length>1">
                        <predefined-customer-select v-model="adjustmentSearchInfo.customerId" @change="onselectCustomerChange" :customerIds="customerIds"></predefined-customer-select>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Adjust Types</label>
                    <div>
                        <el-select no-match-text="No Data" v-model="adjustmentSearchInfo.useless" placeholder="All" @change="onSelectAdjustTypes">
                            <el-option v-for="type in adjustTypes" :key="type.name" :label="type.name" :value="type.name">
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
                    <waitting-btn btn-class="button-unis color-white" class="right" @click="exportExcel" :value="'Export To Excel'" :is-loading="exportLoading"> </waitting-btn>
                </div>
            </div>

            <div class="grid-100 tablet-grid-100" v-loading="loading">
                <table class="table-client" v-fixed-head>
                    <thead>
                        <tr>
                            <th v-for="head in adjustmentReports.head" :key="head" >{{head}}</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="adjustment in adjustmentReports.data" :key="adjustment.id">
                            <td v-for="head in adjustmentReports.head" :key="head" >
                                {{adjustment[head]}}
                            </td>
                        </tr>

                    </tbody>
                </table>
                <pager :totalCount="searchResultPaging.totalCount" :customizePageSize="adjustmentSearchInfo.paging.pageSize" @reloadContent="triggerSearchFromPager"></pager>

            </div>
        </div>
    </div>
</template>
<style lang="scss" src="./adjustment.scss" />