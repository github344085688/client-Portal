<template>
  <div class="inventory-aging">

    <div class="grid-100 tablet-grid-100 ">
      <div class="grid-100 tablet-grid-100 container">
        <span class="component-title bold">Historical Inventory Aging Report </span>
      </div>
      <div class="grid-100 tablet-grid-100 container" style="margin-bottom:0">
        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Title</label>
          <div>
            <multiple-organization-auto-complete v-model="searchParam.titleIds" :customerId="searchParam.customerId"
              :clearable="true" tag="Title">
            </multiple-organization-auto-complete>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25">
          <single-date-range :label="'Date From'" @selectSingleDateRange="onSingleDateFeomRange" />
        </div>
        <div class="grid-20 tablet-grid-25">
          <single-date-range :label="'Date To'" @selectSingleDateRange="onSingleDateToRange" />
        </div>
        <div class="grid-20 tablet-grid-25">
          <predefined-customer-select v-model="searchParam.customerId" @change="onselectCustomerChange">
          </predefined-customer-select>
        </div>
        <div class="grid-20 tablet-grid-25">
          <facility-select v-model="searchParam.facility" :customerId="searchParam.customerId"
                           @change="onSelectFacilityChange"></facility-select>
        </div>
      </div>
      <div class="grid-100 tablet-grid-100 container">
        <div class="grid-20 tablet-grid-25 container">
          <label class="input-label">Search Item</label>
          <div>
            <item-auto-complete :placeholder="'Item ID or Description'" v-model="searchParam.itemSpecId"
                                @change="onItemSelectChange" :clearable="true" >
            </item-auto-complete>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Receipt ID</label>
          <div>
            <tags-input v-model="searchParam.receiptIds" :fill="'RN-'"></tags-input>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25"></div>
      </div>
        <div class="d-flex margin-top-15 justify-content-end">
            <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" class="mr-4" @click="exportExcel"
                          :value="'Export To Excel'" :is-loading="exportLoading"></waitting-btn>

            <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" @click="searchReport" :value="'Search'"
                          :is-loading="loading" :disabled="loading"></waitting-btn>

        </div>
      <div class="grid-100 tablet-grid-100" v-loading="loading">

        <table class="table-client" v-fixed-head>
          <thead>
            <tr>
              <th v-for="head in inventoryAgingReports.head" :key="head" >

                {{head}}</th>
            </tr>
          </thead>

          <tbody v-for="summary in currentPageDates" :key="summary.id">

          <tr>
            <td v-for="head in inventoryAgingReports.head" :key="head">
             {{summary[head]}}
            </td>
          </tr>
          </tbody>
        </table>
        <pager :totalCount="inventoryAgingReports.data.length" :currentPage="paging.pageNo"
               :customizePageSize="paging.pageSize" @reloadContent="triggerSearchFromPager"></pager>

      </div>
    </div>
  </div>

</template>
<style lang="scss" src="./historicalInventoryAging.scss" />
