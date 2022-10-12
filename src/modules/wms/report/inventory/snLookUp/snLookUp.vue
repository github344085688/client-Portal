<template>
  <div class="inventory-aging">

    <div class="grid-100 tablet-grid-100 ">

      <div class="grid-100 tablet-grid-100 container">
        <span class="component-title bold">Serial No Look Up </span>
      </div>
      <div class="grid-100 tablet-grid-100 container"  v-if="!isShowType">

        <div class="grid-40 tablet-grid-50 container">
          <label class="input-label">Serial No</label>
          <div>
            <!-- <input type="text" v-model="searchParam.sns" placeholder="Serial No"/> -->
            <tags-input v-model="searchParam.sns"></tags-input>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25">
          <predefined-customer-select v-model="searchParam.customerId" :facility="searchParam.facility"
                                      @change="onselectCustomerChange"></predefined-customer-select>
        </div>
        <div class="grid-20 tablet-grid-25">
          <facility-select v-model="searchParam.facility" :customerId="searchParam.customerId"
                           @change="onSelectFacilityChange"></facility-select>
        </div>
        <!-- <div class="grid-20 tablet-grid-25 container">
          <label class="input-label">Search Item</label>
          <div>
            <item-auto-complete :placeholder="'Item ID or Description'" v-model="searchParam.itemSpecId"
                                @change="onItemSelectChange" :clearable="true" >
            </item-auto-complete>
          </div>
        </div> -->

        <div class="grid-20 tablet-grid-25 container">
          <label class="input-label">Search Item</label>
          <div>
            <multiple-item-auto-complete :placeholder="'Item ID or Description'" v-model="searchParam.itemSpecIds"
                                 :clearable="true" >
            </multiple-item-auto-complete>
          </div>
        </div>

      </div>

      <div class="grid-100 tablet-grid-100 container"  v-if="!isShowType">
        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Receipt ID</label>
          <div>
            <!-- <input type="text" v-model="searchParam.sns" placeholder="Serial No"/> -->
            <tags-input v-model="searchParam.receiptIds" :fill="'RN-'"></tags-input>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Order ID</label>
          <div>
            <!-- <input type="text" v-model="searchParam.sns" placeholder="Serial No"/> -->
            <tags-input v-model="searchParam.orderIds" :fill="'DN-'"></tags-input>
          </div>
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
          <label class="input-label">Supplier</label>
          <div>
            <organization-auto-complete v-model="searchParam.supplierId" :customerId="searchParam.customerId"
              :clearable="true" tag="Supplier">
            </organization-auto-complete>
          </div>
        </div>
        <div class="grid-20 tablet-grid-20 ">
          <label class="input-label"> Status</label>
          <div>
            <el-select no-match-text="No Data" v-model="searchParam.statuses" multiple placeholder="Select">
              <el-option v-for="status in statues" :key="status" :label="status" :value="status">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>

      

      <div class="grid-100 tablet-grid-100 container" v-if="isShowType">
        <div class="grid-20 tablet-grid-25">
          <predefined-customer-select v-model="searchParam.customerId" :facility="searchParam.facility"
            @change="onselectCustomerChange"></predefined-customer-select>
        </div>
        <div class="grid-20 tablet-grid-25">
          <facility-select v-model="searchParam.facility" :customerId="searchParam.customerId"
            @change="onSelectFacilityChange"></facility-select>
        </div>
        <div class="grid-20 tablet-grid-25">
          <label class="input-label"> type</label>
          <div>
            <el-select no-match-text="No Data" v-model="searchParam.type" placeholder="Select" clearable>
              <el-option v-for="type in types" :key="type" :label="type" :value="type">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="tablet-grid-25  date-grid-20">
          <label class="input-label">Date Range</label>
          <date-range @selectDateRange="onSelectCreateDateRange" :default-time-from="searchParam.dateFrom"
            :default-time-to="searchParam.dateTo"> </date-range>
        </div>
      </div>

        <div class="wid100 padding-top-15 d-flex justify-content-between p-0 mb-4">

            <div class="col p-0">
                <span><a href="javascript:void(0)" @click="toggleSearchConditions()">Toggle search conditions</a></span>
            </div>
            <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" class="mr-4" @click="exportExcel"
                          :value="'Export To Excel'" :is-loading="exportLoading"></waitting-btn>
            <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" class="" @click="searchReport"
                          :value="'Search'"
                          :is-loading="loading"></waitting-btn>
        </div>


      <div class="grid-100 tablet-grid-100" v-loading="loading">

        <table class="table-client" v-fixed-head>
          <thead>
            <tr>
              <th v-for="head in snLookUpReports.head" :key="head.id" draggable="true" @dragstart="dragStart($event)">

                {{head}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="snLookUpReport in snLookUpReports.data">
              <td v-for="head in snLookUpReports.head" :key="head.id">
                <a v-if="isLinkField(head)" href="javascript:void(0)" @click="goInquiryDetail(snLookUpReport,head)">
                  {{snLookUpReport[head]}}
                </a>
                <span v-if="!isLinkField(head)">
                  {{snLookUpReport[head]}}
                </span>

              </td>
            </tr>
          </tbody>
        </table>

        <pager :totalCount="searchResultPaging.totalCount" :currentPage="searchParam.paging.pageNo"
          :customizePageSize="searchParam.paging.limit" @reloadContent="triggerSearchFromPager"></pager>

      </div>
    </div>
  </div>

</template>
<style lang="scss" src="./snLookUp.scss" />
