<template>
  <div class="generic-transload-report">

    <div class="grid-100 tablet-grid-100">

      <div class="grid-100 tablet-grid-100 container">
        <span class="component-title bold">Generic Transload Report</span>
      </div>
      <div class="grid-100 tablet-grid-100 container margin-top-50 ">
        <div class="tablet-grid-20 date-grid-20 container">
          <label class="input-label">Ship Date</label>
          <date-range @selectDateRange="onSelectCreateDateRange"
            :default-time-from="searchParam.shipDateFrom" :default-time-to="searchParam.shipDateTo">
          </date-range>
        </div>
        <div class="tablet-grid-20 date-grid-20 container">
          <label class="input-label">Receive Date</label>
          <date-range @selectDateRange="onSelectAppointmentDateRange"
            :default-time-from="searchParam.receiveDateFrom"
            :default-time-to="searchParam.receiveDateTo">
          </date-range>
        </div>
        <div class="tablet-grid-20 date-grid-20 container">
          <label class="input-label">Task Create Time</label>
          <date-range @selectDateRange="onSelectInYardDateRange"
            :default-time-from="searchParam.timeFrom" :default-time-to="searchParam.timeTo">
          </date-range>
        </div>
      </div>
      <div class="grid-100 tablet-grid-100 container">
        <div class="grid-20 tablet-grid-20">
          <predefined-customer-select v-model="searchParam.customerId"
            @change="onselectCustomerChange">
          </predefined-customer-select>
        </div>
        <div class="grid-20 tablet-grid-20 ">
          <facility-select v-model="searchParam.facility" :customerId="searchParam.customerId"
            :isShowFacilityAll="true" @change="onSelectFacilityChange"></facility-select>
        </div>
        <div class="grid-20 tablet-grid-20">
          <label class="input-label">Receipt ID </label>
          <div>
            <tags-input v-model="searchParam.receiptIds" placeholder=" "></tags-input>
          </div>
        </div>
        <div class="grid-20 tablet-grid-20">
          <label class="input-label">Order ID </label>
          <div>
            <tags-input v-model="searchParam.orderIds" placeholder=" "></tags-input>
          </div>
        </div>
        <div class="grid-20 tablet-grid-20">
          <label class="input-label">Container No </label>
          <div>
            <tags-input v-model="searchParam.containerNos" placeholder=" "></tags-input>
          </div>
        </div>

      </div>

      <div class="grid-100 tablet-grid-100 container">
        <div class="grid-20 tablet-grid-20">
          <label class="input-label">Carton No </label>
          <div>
            <tags-input v-model="searchParam.cartonNos" placeholder=" "></tags-input>
          </div>
        </div>
        <div class="grid-20 tablet-grid-20">
          <label class="input-label">Destination </label>
          <div>
            <tags-input v-model="searchParam.destinations" placeholder=" "></tags-input>
          </div>
        </div>

        <div class="grid-20 tablet-grid-25">
          <label class="input-label">ItemSpec</label>
          <div>
            <multiple-item-auto-complete :placeholder="''" v-model="searchParam.itemSpecIds"
              :clearable="true">
            </multiple-item-auto-complete>
          </div>
        </div>
        <div class="grid-20 tablet-grid-20">
          <label class="input-label">Trailer </label>
          <div>
            <tags-input v-model="searchParam.trailers" placeholder=" "></tags-input>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Status </label>
          <div>
            <el-select type="danger" no-match-text="No Data" v-model="searchParam.status"
              :clearable="true" placeholder="Select">
              <el-option v-for="status in ['Available', 'Shipped']" :key="status" :label="status"
                :value="status">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end">

        <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" class="mr-4"
          @click="exportExcel" :value="'Export To Excel'" :is-loading="exportLoading">
        </waitting-btn>

        <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" @click="searchReport"
          :value="'Search'" :is-loading="loading"></waitting-btn>
      </div>
    </div>

    <div class="grid-100 tablet-grid-100" v-loading="loading" style="margin-top:20px">
      <table class="table-client" v-fixed-head>
        <thead>

          <tr>
            <th v-for="head in genericTransloadReport.head" :key="head">

              {{head}}
            </th>
          </tr>

        </thead>
        <tbody v-for="report in genericTransloadReport.data" :key="report.id">

          <tr>
            <td v-for="head in genericTransloadReport.head" :key="head">
              {{report[head]}}
            </td>

          </tr>

        </tbody>
      </table>
      <pager :totalCount="searchResultPaging.totalCount" :currentPage="searchParam.paging.pageNo"
        :customizePageSize="searchParam.paging.pageSize" @reloadContent="triggerSearchFromPager">
      </pager>

    </div>
  </div>
</template>

<style lang="scss" src="./generic-transload-report.scss"/>
