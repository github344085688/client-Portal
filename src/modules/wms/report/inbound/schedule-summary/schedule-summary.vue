<template>
  <div class="scheduled-summary">

    <div class="grid-100 tablet-grid-100">

      <div class="grid-100 tablet-grid-100 container">
        <span class="component-title bold">Scheduled Summary</span>
      </div>
      <div class="grid-100 tablet-grid-100 container margin-top-50 ">
        <date-range @selectDateRange="onSelectDateRange" :default-time-from="searchParam.appointmentTimeFrom "
          :default-time-to="searchParam.appointmentTimeTo"> </date-range>
      </div>
      <div class="grid-100 tablet-grid-100 container avenirNext-Medium">
        <span class="component-title">Sort By: </span>
      </div>
      <div class="grid-100 tablet-grid-100">
        <div class="grid-20 tablet-grid-25 ">
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

      <div class="d-flex margin-top-15 justify-content-end">
          <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" class="mr-4" @click="exportExcel"
                        :value="'Export To Excel'" :is-loading="exportLoading"> </waitting-btn>
          <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p"  @click="searchReport" :value="'Search'"
                        :is-loading="loading"> </waitting-btn>
      </div>
    </div>

    <div class="grid-100 tablet-grid-100" v-loading="loading">
      <table class="table-client" v-fixed-head>
        <thead>

          <tr>
            <th v-for="head in scheduledSummaryReports.head" :key="head">

              {{head}}</th>
          </tr>

        </thead>
        <tbody v-for="summary in currentPageDates" :key="summary.id">

          <tr>
            <td v-for="head in scheduledSummaryReports.head" :key="head">
              <a v-if="isLinkField(head)" href="javascript:void(0)" @click="goInquiryDetail(summary,head)">
                {{summary[head]}}
              </a>
              <span v-if="!isLinkField(head)">
                {{summary[head]}}
              </span>
            </td>

          </tr>


        </tbody>
      </table>
      <pager :totalCount="scheduledSummaryReports.data.length" :currentPage="paging.pageNo"
        :customizePageSize="paging.pageSize" @reloadContent="triggerSearchFromPager"></pager>

    </div>
  </div>
  </div>

</template>
<style lang="scss" src="./schedule-summary.scss" />
