<template>
  <div class="invenroty-table">

    <div class="grid-100 tablet-grid-100">

      <div class="grid-100 tablet-grid-100 container">
        <span class="component-title bold">Inventory Search </span>
      </div>
      <div class="grid-100 tablet-grid-100 container">
        <div class="container" style="float: left; margin-right: 20px;">
          <label class="input-label">switch view:</label>
          <div>
              <router-link :to="{ name: 'Inventory'}">
                  <img style="width:38px; height: 28px;" src="../../../assets/images/list-icon-in.svg">
              </router-link>
              <img style="width:38px; height: 28px;" src="../../../assets/images/table-icon.svg">
          </div>
        </div>
        <div class="grid-25 tablet-grid-25 container">
          <label class="input-label">Search Item</label>
          <div>
            <item-auto-complete :placeholder="'Item ID / UPC / Case UPC / Item Description'" v-model="inventorySearchParam.itemSpecId"
              @change="onItemSelectChange" :clearable="true" :customerIds="customerIds">
            </item-auto-complete>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25 container">
          <label class="input-label">Inventory Status</label>
          <div>
            <el-select no-match-text="No Data" v-model="inventorySearchParam.useless" placeholder="All" @change="onSelectInventoryStatusChange"
              :disabled="loading">
              <el-option v-for="statu in inventoryStatus" :key="statu.name" :label="statu.name" :value="statu.name">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25 container">
          <label class="input-label">Facility</label>
          <div>
            <facility-select v-model="inventorySearchParam.facility" @change="onSelectFacilityChange"></facility-select>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25">
          <predefined-customer-select v-model="inventorySearchParam.customerId" @change="onselectCustomerChange"
            :customerIds="customerIds"></predefined-customer-select>
        </div>
        <!-- <div class="grid-25 tablet-grid-25 container" style="margin-top: 23px">
            <radio-btn :label="'Include Inactive'" v-bind:selectData.sync="inventorySearchParam.Inactive"></radio-btn>
        </div> -->
      </div>

      <div class="grid-100 tablet-grid-100 container margin-top-15">

        <div class="grid-20 tablet-grid-20 " style="width: 200px;">
          <!--<waitting-btn btn-class="button-unis color-white"   @click="exportExcel" :value="'Expand All'" :is-loading="exportLoading"> </waitting-btn>-->
        </div>
        <div class="grid-20 tablet-grid-20 " style="width: 250px;">
          <customize-table :tableFileds="tableFileds" @selectCustomizeTable="onSelectCustomizeTable"></customize-table>
        </div>
        <div class="grid-20 tablet-grid-20 right" style="width: 250px;">
          <waitting-btn btn-class="button-unis color-white" class="right" @click="exportExcel" :value="'Export To Excel'"
            :is-loading="exportLoading"> </waitting-btn>

          <!-- <drop-waitting-btn @click="selectExportExcel" :iconClass="'el-icon-arrow-down'"
                             :value="'Export To Excel'" :selectList="exportList"
                             :is-loading="exportLoading"></drop-waitting-btn>-->
        </div>
      </div>

      <div class="grid-100 tablet-grid-100" v-loading="loading">
        <table class="table-client" v-fixed-head>
          <thead>
            <tr>
              <th v-if="inventoryReports.head" class="width-30"></th>
              <th v-for="head in inventoryReports.head" :key="head.id">{{head}}</th>
            </tr>
          </thead>
          <tbody v-for="inventory in inventoryReports.data" :key="inventory.id">
            <tr>
              <td v-if="inventoryReports.head" class="cursor-point width-30" @click.stop.prevent="searchLPDetails(inventory)"
                :init="getLPDetailFilterNmae=funGetLPDetailFilterNmae(inventory)">
                <i class="fas fa-chevron-right dz-icon " v-if="!inventory[getLPDetailFilterNmae]"></i>
                <i class="fas fa-chevron-down dz-icon" v-if="inventory[getLPDetailFilterNmae]"></i>
              </td>
              <td v-for="head in inventoryReports.head" :key="head.id">
                {{inventory[head]}}
              </td>
            </tr>

            <tr class="child-table-total" v-if="inventory[getLPDetailFilterNmae]">
              <td :colspan="inventoryReports.head.length+1" class="padding-init table-cell"  >
                <div class="child" style="  background-color: rgba(0, 0, 0, 0.1);">
                  <table class="child-table" style=" margin-bottom: 20px;">
                    <thead>
                      <tr>
                        <th class="width-30"></th>
                        <th v-for="head in  inventoryLPDetailsres.head" :key="head.id">{{head}}</th>
                      </tr>
                    </thead>
                    <tbody v-for="itemLevel in inventoryLPDetailsres[getLPDetailFilterNmae]" :key="itemLevel.id">
                      <tr>
                        <td class="cursor-point width-30" @click.stop.prevent="searchSNDetails(itemLevel)" :init="getSNDetailFilterNmae=funGetSNDetailFilterNmae(itemLevel)">
                          <i class="fas fa-chevron-right dz-icon " v-if="!itemLevel[getSNDetailFilterNmae]"></i>
                          <i class="fas fa-chevron-down dz-icon" v-if="itemLevel[getSNDetailFilterNmae]"></i>
                        </td>
                        <td v-for="head in  inventoryLPDetailsres.head" :key="head.id">
                          {{itemLevel[head]}}
                        </td>

                      </tr>
                      <tr v-if="itemLevel[getSNDetailFilterNmae]" style = " background-color: rgba(0, 0, 0, 0.1);">
                        <td :colspan="inventoryLPDetailsres.head.length+1" class="padding-init table-cell" >
                          <div style="    margin: 0 25px;">
                            <dl class="dl-serial">
                              <dt>
                                Serial Numbers:
                              </dt>
                              <dd v-for="sn in inventorySNDetailsres[getSNDetailFilterNmae]">{{sn}}</dd>
                            </dl>
                          </div>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                  <simplified-pager v-if="lpLeveTotalCount[getLPDetailFilterNmae].length > 10" :keyId="getLPDetailFilterNmae"
                    :totalCount="lpLeveTotalCount[getLPDetailFilterNmae].length" :customizePageSize="lpLevePageSize[getLPDetailFilterNmae]?lpLevePageSize[getLPDetailFilterNmae]:10"
                    @reloadContent="inventoryLPDetailsReportFromPager" ></simplified-pager>
                </div>
              </td>
            </tr>

          </tbody>
        </table>
        <pager :totalCount="searchResultPaging.totalCount" :customizePageSize="inventorySearchParam.paging.pageSize"
          @reloadContent="triggerSearchFromPager"></pager>

      </div>
    </div>

  </div>

</template>
<style lang="scss" src="./inventoryTable.scss" />