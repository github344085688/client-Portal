<template>
    <div class="invenroty-activity">
        <div class="grid-100 tablet-grid-100">

            <div class="grid-100 tablet-grid-100 container">
                <span class="component-title bold">Inventory Activity </span>
            </div>
            <div class="grid-100 tablet-grid-100 container margin-top-50 ">
                <date-range @selectDateRange="onSelectDateRange" :default-time-from = "activitySearchParam.timeFrom"  :default-time-to ="activitySearchParam.timeTo"> </date-range>
            </div>
            <div class="grid-100 tablet-grid-100 container avenirNext-Medium">
                <span class="component-title">Sort By: </span>
            </div>
            <div class="grid-100 tablet-grid-100 container ">
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Search Item</label>
                    <div>
                        <item-auto-complete :placeholder="'Item ID or Description'" v-model="activitySearchParam.itemSpecId" @change="onItemSelectChange" :clearable="true" :customerIds="customerIds">
                        </item-auto-complete>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Facility</label>
                    <div>
                        <facility-select v-model="activitySearchParam.facility" @change="onSelectFacilityChange"></facility-select>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25" >
                        <predefined-customer-select v-model="activitySearchParam.customerId" @change="onselectCustomerChange" :customerIds="customerIds"></predefined-customer-select>
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
                            <th v-for="head in activityReports.head" :key="head">{{head}}</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="activity in activityReports.data" :key="activity.id">
                            <td v-for="head in activityReports.head" :key="head">
                                {{activity[head]}}
                            </td>
                        </tr>

                    </tbody>
                </table>
                <pager :totalCount="searchResultPaging.totalCount" :customizePageSize="activitySearchParam.paging.pageSize" @reloadContent="triggerSearchFromPager"></pager>

            </div>
        </div>
    </div>
</template>
<style lang="scss" src="./activity.scss" />