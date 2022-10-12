<template>
  <div class="inventory-status">

    <div class="grid-100 tablet-grid-100 ">

      <div class="grid-100 tablet-grid-100 container">
        <span class="component-title bold">Inventory Status </span>
      </div>
      <div class="grid-100 tablet-grid-100 container">

        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Search By</label>
          <div>
            <!-- <input type="text" v-model="searchParam.itemKeyword" placeholder="Item ID / UPC Code / AKA "
              v-rx-event:input="searchByInput" /> -->
            <!-- <item-auto-complete :placeholder="'Item ID or Description'" v-model="searchParam.itemSpecId"
                                :clearable="true" :customerId="searchParam.customerId">
            </item-auto-complete> -->
            <multiple-item-auto-complete :placeholder="'Item ID or Description'" v-model="searchParam.itemSpecIds"
                   :clearable="true" >
            </multiple-item-auto-complete>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Lot No</label>
          <div>
            <!-- <input type="text" v-model="searchParam.lotNo" placeholder="Lot No"/> -->
            <tags-input v-model="searchParam.lotNos"></tags-input>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25">
            <predefined-customer-select v-model="searchParam.customerId" @change="onselectCustomerChange"></predefined-customer-select>
          </div>
        <div class="grid-20 tablet-grid-25">
            <facility-select v-model="searchParam.facility" :customerId="searchParam.customerId" @change="onSelectFacilityChange"></facility-select>
        </div>

        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Title</label>
          <div>
            <multiple-organization-auto-complete v-model="searchParam.titleIds" @change="onselectTitleChange"
                                        :customerId="searchParam.customerId"
                                        :clearable="true" tag="Title">
            </multiple-organization-auto-complete>
          </div>
        </div>

      </div>
      <div class="grid-100 tablet-grid-100 container">
        <div class="grid-20 tablet-grid-25 container">
          <label class="input-label">Description</label>
          <div>
            <input type="text" v-model="searchParam.description" placeholder="Description"/>
          </div>
        </div>
      </div>

        <div class="wid100 padding-top-15 d-flex justify-content-between p-0">

            <div class="col  p-0">
          <customize-table v-model="searchParam.headers" :customerId="searchParam.customerId"
                           :reportCategory="searchParam.reportCategory"
                           @selectCustomizeTable="onSelectCustomizeTable"></customize-table>
        </div>
            <predefined-export-btn  class=" mr-4" :value="'Export To Excel'" :export-dates="exportDates"
                                   @selectExportName="onSelectExportName"
                                   :is-loading="exportLoading"></predefined-export-btn>
            <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p"  @click="searchReport" :value="'Search'"
                          :is-loading="loading" :disabled="!customizeComplete"></waitting-btn>
      </div>

      <div class="grid-100 tablet-grid-100" style="margin: 10px 0px;">
        <predefined-table-layout :reportCategory="searchParam.reportCategory"
                                 @groupViewLayoutChange="onGroupViewLayoutChange"></predefined-table-layout>
      </div>

      <div class="grid-100 tablet-grid-100" v-loading="loading">

        <table class="table-client" v-fixed-head>
          <thead>
          <tr v-if="inventoryStatusReports.head">
            <th></th>
            <th v-for="head in inventoryStatusReports.head" :key="head.id" draggable="true"
                @dragstart="dragStart($event)">{{head}}
            </th>
          </tr>
          </thead>
          <tbody>
          <slot v-for="(inventoryStatus,gkey) in inventoryStatusReports.data">
            <tr style="border-bottom: 1px solid #dddd;" v-if="gkey!='dbSource'">
              <td :colspan="inventoryStatusReports.head.length+1">
                <img src="../../../../../assets/images/right-deltoid .svg" style="width:12px;">
                {{gkey}}
              </td>
            </tr>
            <slot v-for="(inventoryStatu,index) in inventoryStatus" name>
              <tr :class="{'group-tr':gkey!='dbSource'}">
                <td                  @click.stop.prevent="showItemLevelTable(getStatusItemLevelKey(inventoryStatu),inventoryStatu)">
                  <i class="fas fa-chevron-right dz-icon " v-if="!childrenShow[getStatusItemLevelKey(inventoryStatu)]"></i>
                  <i class="fas fa-chevron-down dz-icon" v-if="childrenShow[getStatusItemLevelKey(inventoryStatu)]"></i></td>
                <td v-for="head in inventoryStatusReports.head" :key="head.id">
                  <a v-if="toInventoryDetail(inventoryStatu,head)" href="javascript:void(0)"
                     @click="goToInventoryDetail(inventoryStatu,head)">
                    {{inventoryStatu[head]}}
                  </a>
                  <span v-if="!toInventoryDetail(inventoryStatu,head)">
                      {{inventoryStatu[head]}}
                    </span>
                </td>
              </tr>
              <tr class="child-table-total"  v-if="childrenShow[getStatusItemLevelKey(inventoryStatu)] " >
                <td :colspan="inventoryStatusReports.head.length+1" class="padding-init table-cell"  style="vertical-align: top" v-loading="itemLoading[getStatusItemLevelKey(inventoryStatu)]">
                  <div class="child" >
                    <table class="child-table" >
                      <thead >
                      <tr>
                        <th v-for="head in getLeveLHead(getStatusItemLevelKey(inventoryStatu))" :key="head.id">{{head}}</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="Detail in getLeveLData(getStatusItemLevelKey(inventoryStatu))" :key="Detail.id">
                        <td v-for="showHead in getLeveLHead(getStatusItemLevelKey(inventoryStatu))" :key="showHead.id">
                          {{Detail[showHead]}}
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>

                </td>
              </tr>
            </slot>
          </slot>
          </tbody>
        </table>


        <pager :totalCount="searchResultPaging.totalCount" :currentPage="searchParam.paging.pageNo"
               :customizePageSize="searchParam.paging.limit"
               @reloadContent="triggerSearchFromPager"></pager>

      </div>
    </div>
  </div>

</template>
<style lang="scss" src="./status.scss"/>
