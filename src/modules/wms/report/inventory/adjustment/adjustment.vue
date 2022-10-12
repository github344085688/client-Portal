<template>
  <div class="inventory-adjustment">

    <div class="grid-100 tablet-grid-100 ">
      <div class="grid-100 tablet-grid-100 container">
        <span class="component-title bold">Inventory Adjustment </span>
      </div>
      <div class="grid-100 tablet-grid-100 container margin-top-50 ">

        <div class="tablet-grid-20 date-grid-20 container">
          <label class="input-label"> Date Range</label>
          <date-range @selectDateRange="onSelectDateRange" :default-time-from="searchParam.timeFrom"
            :default-time-to="searchParam.timeTo">
          </date-range>
        </div>


      </div>

      <div class="grid-100 tablet-grid-100 container">

        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Adjust ID</label>
          <div>
            <!-- <input type="text" v-model="searchParam.adjustId" @blur="fillAdjust" /> -->
            <tags-input v-model="searchParam.adjustIds" placeholder="" :fill="'ADJUST-'" :upperCase="true"></tags-input>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Search By</label>
          <div>
            <!-- <item-auto-complete :placeholder="'Item ID or Description'" v-model="searchParam.itemSpecId"
              @change="onItemSelectChange" :clearable="true" :customerId="searchParam.customerId">
            </item-auto-complete> -->
            <multiple-item-auto-complete :placeholder="'Item ID or Description'" v-model="searchParam.itemKeywords"
                                @change="onItemSelectChange" :clearable="true" >
            </multiple-item-auto-complete>
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
      </div>
      <div class="grid-100 tablet-grid-100 container">
        <div class="grid-20 tablet-grid-25">
          <label class="input-label"> Adjust Type</label>
          <div>
            <el-select no-match-text="No Data" v-model="searchParam.types" multiple placeholder="All"
              @change="onSelectAdjustmentTypes">
              <el-option v-for="type in adjustmentTypes" :key="type" :label="type" :value="type">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25">
          <label class="input-label"> Adjust Effect</label>
          <div>
            <el-select clearable no-match-text="No Data" v-model="searchParam.adjustEffect" placeholder="Select">
              <el-option v-for="adjust in adjustEffects" :key="adjust" :label="adjust" :value="adjust">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>

        <div class="wid100 padding-top-15 d-flex justify-content-between p-0 mb-4">

            <div class="col p-0">
          <customize-table v-model="searchParam.headers" :customerId="searchParam.customerId"
            :reportCategory="searchParam.reportCategory" @selectCustomizeTable="onSelectCustomizeTable">
          </customize-table>
        </div>

          <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" class="mr-4" @click="exportExcel"
            :value="'Export To Excel'" :is-loading="exportLoading"> </waitting-btn>


          <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p"  @click="searchReport" :value="'Search'"
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
              <th v-for="head in adjustmentReports.head" :key="head.id" draggable="true" @dragstart="dragStart($event)">

                {{head}}</th>
            </tr>
          </thead>
          <tbody>
            <slot v-for="(adjustmentReport,gkey) in adjustmentReports.data">
              <tr style="border-bottom: 1px solid #dddd;" v-if="gkey!='dbSource'">
                <td :colspan="adjustmentReports.head.length+1">
                  <img src="../../../../../assets/images/right-deltoid .svg" style="width:12px;">
                  {{gkey}}
                </td>
              </tr>
              <slot v-for="(inventoryStatu,index) in adjustmentReport" name>
                <tr :class="{'group-tr':gkey!='dbSource'}">
                  <td v-for="head in adjustmentReports.head" :key="head.id">
                    {{inventoryStatu[head]}}

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
<style lang="scss" src="./adjustment.scss" />
