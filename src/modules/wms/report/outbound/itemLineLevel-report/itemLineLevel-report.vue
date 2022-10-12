<template>
  <div class="invenroty-status">

    <div class="grid-100 tablet-grid-100">

      <div class="grid-100 tablet-grid-100 container">
        <span class="component-title bold">Inventory Status (Allocated) </span>
      </div>

      <div class="grid-100 tablet-grid-100 container avenirNext-Medium">
        <span class="component-title">Item ID: {{currentInfo.itemID}}</span>
      </div>

      <div class="grid-100 tablet-grid-100 container avenirNext-Medium">
        <span class="component-title">Title: {{currentInfo.titleName}}</span>
      </div>
      <div class="grid-100 tablet-grid-100 container margin-top-15">

        <!-- <div class="grid-50 tablet-grid-50 container">
                    <waitting-btn btn-class="unis-btn unis-btn-primary color-white" class="right" @click="exportExcel" :value="'Export To Excel'" :is-loading="exportLoading"> </waitting-btn>
                </div> -->
      </div>

      <div class="grid-100 tablet-grid-100" v-loading="loading">
        <table class="table-client" v-fixed-head>
          <thead>
              <tr>
                    <th v-for="head in itemLevelList.head" :key="head">
                            {{head}}
                          </th>
              </tr>
           
          </thead>
          <tbody>

            <tr v-for="itemlevel in itemLevelList.data" :key="itemlevel.id">
              <td v-for="head in itemLevelList.head" :key="head.id">
                <span>
                  {{itemlevel[head]}}
                </span>

              </td>
            </tr>


          </tbody>
        </table>
        <pager :totalCount="searchResultPaging.totalCount" :currentPage="searchParam.paging.pageNo" :customizePageSize="searchParam.paging.limit"
          @reloadContent="triggerSearchFromPager"></pager>

      </div>
    </div>
  </div>

</template>
<style lang="scss" src="./itemLineLevel-report.scss" />
