<template>
  <div class="invenroty-activity">
    <div class="grid-100 tablet-grid-100">

      <div class="grid-100 tablet-grid-100 container">
        <span class="component-title bold">Inventory Activity </span>
      </div>
      <div class="grid-100 tablet-grid-100 container margin-top-50 ">
        <label class="input-label"> Date Range</label>
        <date-range @selectDateRange="onSelectDateRange" :default-time-from="activitySearchParam.timeFrom"
          :default-time-to="activitySearchParam.timeTo" :limit30DayRange="true"> </date-range>
      </div>
      <div class="grid-100 tablet-grid-100 container avenirNext-Medium">
        <span class="component-title">Sort By: </span>
      </div>
      <div class="grid-100 tablet-grid-100 container ">
        <div class="grid-20 tablet-grid-25 container">
          <label class="input-label">Search Item</label>
          <div>
            <!-- <item-auto-complete :placeholder="'Item ID or Description'" v-model="activitySearchParam.itemSpecId"
              @change="onItemSelectChange" :clearable="true" :customerId="activitySearchParam.customerId">
            </item-auto-complete> -->
            <multiple-item-auto-complete :placeholder="'Item ID or Description'" v-model="activitySearchParam.itemSpecIds"
                            :clearable="true" >
            </multiple-item-auto-complete>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25 container">
          <label class="input-label">Description</label>
          <div>
            <input type="text" v-model="activitySearchParam.description" placeholder="Description" />
          </div>
        </div>
        <div class="grid-20 tablet-grid-25">
          <predefined-customer-select v-model="activitySearchParam.customerId" :facility="activitySearchParam.facility"
            @change="onselectCustomerChange"></predefined-customer-select>
        </div>
        <div class="grid-20 tablet-grid-25">
          <facility-select v-model="activitySearchParam.facility" :customerId="activitySearchParam.customerId" :isShowFacilityAll="true"
            @change="onSelectFacilityChange"></facility-select>
        </div>

        <div class="grid-20 tablet-grid-25">
          <label class="input-label">Title</label>
          <div>
            <multiple-organization-auto-complete v-model="activitySearchParam.titleIds"
              :customerId="activitySearchParam.customerId" :clearable="true" tag="Title">
            </multiple-organization-auto-complete>
          </div>
        </div>
      </div>

        <div class="d-flex margin-top-15 justify-content-end align-items-end">
          <predefined-export-btn class=" mr-4"  :value="'Export To Excel'" :export-dates="exportDates"
            @selectExportName="onSelectExportName" :is-loading="exportLoading"></predefined-export-btn>
          <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p"  @click="search" :value="'Search'"
            :is-loading="loading">
          </waitting-btn>
      </div>

      <div class="grid-100 tablet-grid-100" v-loading="loading">
        <table class="table-client" v-fixed-head>
          <thead>
            <tr>
              <th v-if="activityReports.head " class="cursor-point"></th>
              <th v-for="head in activityReports.head" :key="head">

                {{head}}</th>

            </tr>
          </thead>
          <tbody>
            <slot v-for="activity in activityReports.data" name>
              <tr>
                <td v-if="activityReports.head " class="cursor-point width-30"
                  @click.stop.prevent="showItemLevelTable(getActivityItemLevelKey(activity),activity)">
                  <i class="fas fa-chevron-right dz-icon " v-if="!childrenShow[getActivityItemLevelKey(activity)]"></i>
                  <i class="fas fa-chevron-down dz-icon" v-if="childrenShow[getActivityItemLevelKey(activity)]"></i>
                </td>
                <td v-for="head in activityReports.head" :key="head">
                  <a v-if="isLinkField(activity,head)" href="javascript:void(0)"
                    @click="goInquiryDetail(activity,head)">
                    {{activity[head]}}
                  </a>
                  <span v-if="!isLinkField(activity,head)">
                    {{activity[head]}}
                  </span>

                </td>
              </tr>
              <tr class="child-table-total" v-if="childrenShow[getActivityItemLevelKey(activity)] ">
                <td :colspan="activityReports.head.length+1" class="padding-init table-cell"
                  v-loading="itemLoading[getActivityItemLevelKey(activity)]">
                  <div class="child">
                    <table class="child-table">
                      <thead>
                        <tr>
                          <th class="download-icon" v-if="getLeveLHead(getActivityItemLevelKey(activity)).length>0">
                            <i class="el-icon-loading" v-if="itemExcelLoading"></i>
                            <a style="text-decoration: none" @click="downLoadActivityItemLevel(activity)"
                              v-if="!itemExcelLoading">
                              <i class="el-icon-download"></i>
                            </a>
                          </th>
                          <th v-for="head in getLeveLHead(getActivityItemLevelKey(activity))" :key="head.id"
                            :class="{'pred-th':head == 'Note'}">

                            {{head}}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <slot v-for="itemLevel in itemActivityCurrentPageDate[getActivityItemLevelKey(activity)]" name>
                          <tr>
                            <th></th>
                            <td v-for="head in getLeveLHead(getActivityItemLevelKey(activity))" :key="head.id">

                              <a v-if="isLinkField(itemLevel,head)" href="javascript:void(0)"
                                @click="goInquiryDetail(itemLevel,head)">
                                {{itemLevel[head]}}
                              </a>
                              <span v-if="!isLinkField(itemLevel,head)">
                                {{itemLevel[head]}}
                              </span>

                            </td>
                          </tr>
                        </slot>
                        <tr
                          v-if="!itemLoading[getActivityItemLevelKey(activity)] && (!getLeveLData(getActivityItemLevelKey(activity)) || getLeveLData(getActivityItemLevelKey(activity)).length === 0)">
                          <td :colspan="getLeveLHead(getActivityItemLevelKey(activity)).length" class="center">
                            No Datas
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <simplified-pager v-if="setPageVisibility(getActivityItemLevelKey(activity))"
                      :currentDate="activity" :totalCount="getToTalCount(getActivityItemLevelKey(activity))"
                      :customizePageSize="getPageSize(getActivityItemLevelKey(activity))"
                      @reloadContent="searchActivityItemLevelReportFromPager"></simplified-pager>

                  </div>

                </td>

              </tr>
            </slot>

          </tbody>
        </table>
        <pager :totalCount="searchResultPaging.totalCount" :currentPage="activitySearchParam.paging.pageNo"
          :customizePageSize="activitySearchParam.paging.pageSize" @reloadContent="triggerSearchFromPager"></pager>

      </div>
    </div>
  </div>
</template>
<style lang="scss" src="./activity.scss" />
