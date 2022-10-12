<template>
  <div class="inventory-aging">

    <div class="grid-100 tablet-grid-100 ">

      <div class="grid-100 tablet-grid-100 container">
        <span class="component-title bold">Current Onhand Inventory Aging Report  </span>
      </div>
      <div class="grid-100 tablet-grid-100 container" style="margin-bottom:0">

        <div class="grid-20 tablet-grid-25 container">
          <label class="input-label">Search By</label>
          <div>
            <!-- <input type="text" v-model="searchParam.itemKeyword" placeholder="Item ID / Description  " v-rx-event:input="searchByInput" /> -->
            <item-auto-complete :placeholder="'Item ID or Description'" v-model="searchParam.itemSpecId"
              @change="onItemSelectChange" :clearable="true" :customerId="searchParam.customerId">
            </item-auto-complete>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25">
          <predefined-customer-select v-model="searchParam.customerId" @change="onselectCustomerChange">
          </predefined-customer-select>
        </div>
        <div class="grid-20 tablet-grid-25">
          <facility-select v-model="searchParam.facility" :customerId="searchParam.customerId"
            @change="onSelectFacilityChange"></facility-select>
        </div>

        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Title</label>
          <div>
            <multiple-organization-auto-complete v-model="searchParam.titleIds" :customerId="searchParam.customerId"
              :clearable="true" tag="Title">
            </multiple-organization-auto-complete>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25">
          <single-date-range :label="'End Date'" @selectSingleDateRange="onSingleDateRange" />
        </div>
      </div>
      <div class="grid-100 tablet-grid-100 container">
        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Aging Bucket</label>
          <div>
            <input type="number" v-model="searchParam.agingDates"  onkeyup="this.value=this.value.replace(/\./g,'')" min="0">
          </div>
        </div>
        <div class="grid-20 tablet-grid-25"></div>
      </div>
        <div class="wid100 padding-top-15 d-flex justify-content-between p-0 mb-4">

            <div class="col p-0">
          <customize-table v-model="searchParam.headers" :customerId="searchParam.customerId"
            :reportCategory="searchParam.reportCategory" @selectCustomizeTable="onSelectCustomizeTable">
          </customize-table>
        </div>

          <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" class="mr-4" @click="exportExcel"
            :value="'Export To Excel'" :is-loading="exportLoading"> </waitting-btn>


          <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" @click="searchReport" :value="'Search'"
            :is-loading="loading" :disabled="!customizeComplete"> </waitting-btn>

      </div>

      <div class="grid-100 tablet-grid-100" style="margin: 10px 0px;">
        <predefined-table-layout :reportCategory="searchParam.reportCategory"
          @groupViewLayoutChange="onGroupViewLayoutChange"></predefined-table-layout>
      </div>

      <div class="grid-100 tablet-grid-100" v-loading="loading">

        <table class="table-client" v-fixed-head>
          <thead>
            <tr>
              <th v-for="head in inventoryAgingReports.head" :key="head.id" draggable="true"
                @dragstart="dragStart($event)">

                {{head}}</th>
            </tr>
          </thead>
          <tbody>
            <slot v-for="(inventoryAging,gkey) in inventoryAgingReports.data">
              <tr style="border-bottom: 1px solid #dddd;" v-if="gkey!='dbSource'">
                <td :colspan="inventoryAgingReports.head.length+1">
                  <img src="../../../../../assets/images/right-deltoid .svg" style="width:12px;">
                  {{gkey}}
                </td>
              </tr>
              <slot v-for="(inventoryStatu,index) in inventoryAging" name>
                <tr :class="{'group-tr':gkey!='dbSource'}">
                  <td v-for="head in inventoryAgingReports.head" :key="head.id">
                    <a v-if="toInventoryDetail(head)" href="javascript:void(0)">
                      {{inventoryStatu[head]}}
                    </a>
                    <span v-if="!toInventoryDetail(head)">
                      {{inventoryStatu[head]}}
                    </span>

                  </td>
                </tr>
              </slot>
            </slot>
          </tbody>
        </table>



        <pager :totalCount="searchResultPaging.totalCount" :currentPage="searchParam.paging.pageNo"
          :customizePageSize="searchParam.paging.limit" @reloadContent="triggerSearchFromPager"></pager>

      </div>
    </div>
  </div>

</template>
<style lang="scss" src="./aging.scss" />
