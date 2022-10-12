<template>
  <div class="scheduled-summary">

    <div class="grid-100 tablet-grid-100">

      <div class="grid-100 tablet-grid-100 container">
        <span class="component-title bold">Return Label</span>
      </div>
      <div class="grid-100 tablet-grid-100 mb-3">
        <div class="grid-20 tablet-grid-25 ">
          <predefined-customer-select v-model="searchParam.customerId" @change="onselectCustomerChange">
          </predefined-customer-select>
        </div>
        <div class="grid-20 tablet-grid-25">
          <facility-select v-model="searchParam.facility" :customerId="searchParam.customerId"
            @change="onSelectFacilityChange"></facility-select>
        </div>

        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Title:</label>
          <div>
            <multiple-organization-auto-complete v-model="searchParam.titleIds" :customerId="searchParam.customerId"
              :clearable="true" tag="Title">
            </multiple-organization-auto-complete>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25">
          <label class="input-label">WISE DN#:<span style="color: red;">*</span></label>
          <tags-input v-model="searchParam.orderIds" placeholder=" "></tags-input>
        </div>
        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Shipment Tracking / Pro:<span style="color: red;">*</span></label>
          <tags-input v-model="searchParam.proNos" placeholder=" "></tags-input>
        </div>
      </div>

      <div class="grid-100 tablet-grid-100 mb-3">
        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Reference:<span style="color: red;">*</span></label>
          <tags-input v-model="searchParam.referenceNos" placeholder=" "></tags-input>
        </div>
        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Sales Order:<span style="color: red;">*</span></label>
          <tags-input v-model="searchParam.soNos" placeholder=" "></tags-input>
        </div>
        <div class="grid-20 tablet-grid-25">
          <label class="input-label">SN:<span style="color: red;">*</span></label>
          <tags-input v-model="searchParam.sns" placeholder=" "></tags-input>
        </div>
        <div class="grid-40 tablet-grid-25">
          <label class="input-label">SOID:<span style="color: red;">*</span></label>
          <tags-input v-model="searchParam.soIds" placeholder=" "></tags-input>
        </div>

      </div>

      <div class="grid-100 tablet-grid-100">
        <div class="grid-50 tablet-grid-25" v-if="orderItemLineDynamicFields.dynTxtPropertyValue14 == 'MTM Serial Number'">
          <label class="input-label">MTM SN: </label>
          <tags-input v-model="searchParam.mtmSns" placeholder=" "></tags-input>
        </div>
        <div class="grid-50 tablet-grid-25" v-if="orderItemLineDynamicFields.dynTxtPropertyValue15 == 'MTM Machine Number'">
          <label class="input-label">MTM Machine#: </label>
          <tags-input v-model="searchParam.mtmIds" placeholder=" "></tags-input>
        </div>
      </div>


      <div class="d-flex justify-content-end">
          <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" class="mr-4" @click="batchDownload"
            :value="'Batch DownLoad'" :is-loading="exportLoading"> </waitting-btn>
          <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p"  @click="searchReport" :value="'Search'"
            :is-loading="loading"> </waitting-btn>

      </div>
    </div>

    <div class="grid-100 tablet-grid-100" v-loading="loading">
      <table class="table-client" v-fixed-head>
        <thead>
          <tr>
            <th v-for="head in dataReports.head" :key="head" v-if="head != 'Return Label'">
              {{head}}
            </th>
            <th style="width: 40px;" v-if="dataReports.head">
              <input type="checkbox" :checked="isSelectedAll" @click="selectAll" name="layouts" id="selected_pdf" class="unis-checkbox">
              <label for="selected_pdf">
                  <span class="pl-3_5"></span>
              </label>
            </th>
            <th v-for="head in dataReports.head" :key="head" v-if="head == 'Return Label'">
              {{head}}
            </th>
          </tr>

        </thead>
        <tbody v-for="(data,index) in dataReports.data" :key="index">
          <tr>
            <td v-for="head in dataReports.head" :key="head" v-if="head != 'Return Label'">
              <span>
                {{getNames(data[head])}}
              </span>
            </td>
            <td>
              <slot v-if="data['Return Label']">
                <input type="checkbox" :checked="isChecked(data)" :id="'inqueryPdf_'+index" @click="selectSingle(data)" class="unis-checkbox">
                <label :for="'inqueryPdf_'+ index">
                  <span class="pl-3_5"></span>
                </label>
              </slot>
            </td>
            <td v-for="head in dataReports.head" :key="head" v-if="head == 'Return Label'">
              <span>
                <a href="javascript:void(0)" @click="download(data)">{{getNames(data[head])}}</a>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <pager :totalCount="paging.totalCount" :currentPage="paging.pageNo" :customizePageSize="paging.pageSize"
        @reloadContent="triggerSearchFromPager" :pageOptions="pageOptions"></pager>
    </div>
  </div>
  </div>

</template>
<style lang="scss" src="./returnLabel.scss" />