<template>
  <div class="receiving-summary">
    <div class="grid-100 tablet-grid-100">
      <div class="grid-100 tablet-grid-100 container">
        <span class="component-title bold">Dropship OBO</span>
      </div>

      <div class="grid-100 tablet-grid-100">
        <div class="grid-20 tablet-grid-25">
          <predefined-customer-select
            v-model="searchParam.customerId"
            @change="onselectCustomerChange"
          ></predefined-customer-select>
        </div>

        <!-- <div class="grid-20 tablet-grid-25">
          <facility-select
            v-model="searchParam.facility"
            :customerId="searchParam.customerId"
            @change="onSelectFacilityChange"
          ></facility-select>
        </div> -->

        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Apply Cut Off Time(24 Hours)</label>
          <div>
            <input
              type="text"
              name="cutOffTime"
              v-model="searchParam.cutOffTime"
              placeholder="hh:mm"
            />
          </div>
        </div>

        <div class="tablet-grid-20 date-grid-20 container">
          <label class="input-label">Schedule Date Range</label>
          <div>
            <date-range
              @selectDateRange="onSelectDateRange"
              :default-time-from="searchParam.timeFrom"
              :default-time-to="searchParam.timeTo"
            >
            </date-range>
          </div>
        </div>
      </div>

      <div class="d-flex margin-top-15 justify-content-end">
        <waitting-btn
          btn-class="unis-btn unis-btn-primary color-white h-40-p"
          class="mr-4"
          @click="exportExcel"
          :value="'Export To Excel'"
          :is-loading="exportLoading"
        >
        </waitting-btn>
        <waitting-btn
          btn-class="unis-btn unis-btn-primary color-white h-40-p"
          @click="searchReport"
          :value="'Search'"
          :is-loading="loading"
        >
        </waitting-btn>
      </div>
    </div>

    <div class="grid-100 tablet-grid-100" v-loading="loading" style="margin-top: 20px">
      <table class="table-client" v-fixed-head>
        <thead>
          <tr>
            <th v-for="head in dropshipOBOReports.head" :key="head">
              {{ head }}
            </th>
          </tr>
        </thead>
        <tbody >
          <tr v-for="dropshipOBO in dropshipOBOReports.data" :key="dropshipOBO.id">
            <td v-for="head in dropshipOBOReports.head" :key="head">
              {{ dropshipOBO[head] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ------------------------------------------------------------------------------------- -->

    <div class="grid-100 tablet-grid-100" style="margin-top: 40px">
      <div class="grid-100 tablet-grid-100 container">
        <span class="component-title bold">Cut Off Time (System Set Up)</span>
      </div>
    </div>

    <div class="grid-100 tablet-grid-100" v-loading="cutOffTimeLoading">
      <table class="table-client" v-fixed-head>
        <thead>
          <tr>
            <th>Facility</th>
            <th>Carrier</th>
            <th>Delivery Service</th>
            <th>Cut Off Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in cutOffTimes" :key="data.id">
            <td>{{ data.facilityName }}</td>
            <td>{{ data.carrierName }}</td>
            <td>
              <span
                v-for="(deliveryService, index) in data.deliveryServices"
                :key="deliveryService"
                >{{ deliveryService
                }}<span v-if="index != data.deliveryServices.length - 1"
                  >,
                </span></span
              >
            </td>
            <td>{{ data.orderCutOffTime }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ------------------------------------------------------------------------------------- -->

    <div class="grid-100 tablet-grid-100" style="margin-top: 40px">
      <div class="grid-100 tablet-grid-100 container">
        <span class="component-title bold">Holidays in 2021</span>
      </div>
    </div>

    <div class="grid-100 tablet-grid-100" v-loading="holidayLoading">
      <table class="table-client" v-fixed-head>
        <thead>
          <tr>
            <th>Date</th>
            <th>Desc</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="holiday in holidays" :key="holiday.date">
            <td>{{ holiday.date }}</td>
            <td>{{ holiday.desc }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style lang="scss" src="./dropship-obo.scss" />
