<template>
  <div class="inventory-search-content">
    <div class="position-re">
     <div class="content">
        <div class="left-content">
            <div class="grid-100 tablet-grid-100" style="margin-bottom:25px;"> 
                <span class="component-title bold">Inventory Search </span>  
              </div>  
          <div class="grid-100 tablet-grid-100">             
              <div class="grid-100 tablet-grid-100 container">
                  <div class="grid-15 tablet-grid-15 ">   
                    <label class="input-label">switch view:</label>
                    <div>
                      <img style="width:38px; height: 28px;" src="../../../assets/images/list-icon.svg">
                      <router-link :to="{ name: 'InventoryTable'}">
                        <img style="width:38px; height: 28px;" src="../../../assets/images/table-icon-in.svg">
                      </router-link>
                    </div>
                  </div>
                <div class="grid-85 tablet-grid-85 ">
                    <label class="input-label">Search By:</label>
                    <div>
                      <item-auto-complete :placeholder="'Item ID / UPC / Case UPC / Item Description'" v-model="inventorySearchParam.itemSpecId" @change="onItemSelectChange"
                        :clearable="true" :customerIds="customerIds">
                      </item-auto-complete>
                    </div>                  
                </div>
              
              </div>
            <div class="grid-100 tablet-grid-100 container">
              <div class="grid-50 tablet-grid-50 ">
                <label class="input-label">Facility</label>
                <div>
                  <facility-select v-model="inventorySearchParam.facility" @change="onSelectFacilityChange"></facility-select>
                </div>
              </div>
              <div class="grid-50 tablet-grid-50 ">
                <label class="input-label">Inventory Status</label>
                <div>
                  <el-select no-match-text="No Data" v-model="inventorySearchParam.useless" placeholder="All" @change="onSelectInventoryStatusChange"
                    :disabled="loading">
                    <el-option v-for="statu in inventoryStatus" :key="statu.name" :label="statu.name" :value="statu.name">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="grid-100 tablet-grid-100 container" >
              <!-- <div class="grid-50 tablet-grid-50 container  " style="display:none;">
                <radio-btn :label="'Include Inactive'" v-bind:selectData.sync="inventorySearchParam.inactive"></radio-btn>
              </div>
              <div class="grid-50 tablet-grid-50 container"  style="display:none;">
               <drop-waitting-btn class="right" @click="exportExcel" :isexport="true" :value="'Export To Excel'"
                      :selectList="exportList" :is-loading="exportLoading"></drop-waitting-btn>
              </div> -->
              <div class="grid-50 tablet-grid-50 " v-if="customerIds.length > 1">                 
                      <predefined-customer-select v-model="inventorySearchParam.customerId" @change="onselectCustomerChange" :customerIds="customerIds"></predefined-customer-select>
                
              </div>
              <div  :class="customerIds.length > 1 ? 'grid-50 tablet-grid-50' : 'grid-100 tablet-grid-100'" :style="{'marginTop':customerIds.length > 1 ? '24px' : '8px'}">
                  <waitting-btn btn-class="button-unis color-white" class="right" @click="exportExcel" :value="'Export To Excel'" :is-loading="exportLoading"> </waitting-btn>
              </div>
            </div>           

            <div class="grid-100 tablet-grid-100" v-loading="loading" :style="{'marginTop':loading ? '40px' : '0px'}">
            </div>
            <div class="grid-100 tablet-grid-100  no-details-search" v-if="!loading && ! inventoryReports.data">
              No results to show !<br>
              Start by searching for an item by Item /Order #/ Lp /Lot # /UPC /SN /Equipment #
            </div>


            <div class="grid-100 tablet-grid-100 container " v-if="inventoryReports.data && inventoryReports.data.length>0">
              <div class="details-of-search">
                <div class="title">Results for :{{inventorySearchParam['orderId']}}</div>
                <div class="search-box">
                  <div>Sort results by</div>
                  <div class="search-box">
                    <el-select no-match-text="No Data" v-model="sortFieldByItem" placeholder="search" @change="onItemSortresultsby">
                      <el-option v-for="sorts in inventoryReports.head" :key="sorts" :label="sorts" :value="sorts">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="select-bix">                    
                    <drop-waitting-btn  class="right" @click="sortInventory"
                      :value="'Sort: Ascending'" :selectList="sortOrderList"></drop-waitting-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ul class="inventory-list" v-if="inventoryReports.data && inventoryReports.data.length>0">
            <li v-for="(inventory,index) in inventoryReports.data" :key="inventory.id" @click="searchILPDetails(inventory,index)" 
              :class="{'isActive':expandedinventoryDetail==index}" > 
              <div class="title">
                <div class="id" v-html="inventory['Item ID']" ></div>
                <div class="name" style="min-width:120px;">Total:{{inventory['Total']}}</div>
                <div class="name" style="min-width:120px;">UOM:{{inventory['UOM']}}</div>
              </div>
              
              <dl class="sort-result">               
                <dd style="width:100%;">
                  <label style="width:17%;">Description:</label>
                  <span >{{inventory["Description"]}}</span>
                </dd>
              </dl>
                <dl class="sort-result">    
                <dd v-for="head in inventoryReports.head " :key="head.id" v-if="filterInventoryReport(head)">
                  <label>{{head}}:</label>
                  <span v-html="inventory[head]"></span>
                </dd>
              </dl>
            </li>            
          </ul>
          <pager :totalCount="searchInventoryPaging.totalCount" :customizePageSize="inventorySearchParam.paging.pageSize"
            @reloadContent="triggerSearchFromPager"></pager>
        </div>


        <div class="mindle-content"></div>

        <div class="right-content">

          <div class="grid-70 tablet-grid-70 container " v-if="pagedLPDetails.data && pagedLPDetails.data.length>0">
            <div class="details-of-search" style="margin-top: 30px;">
              <div class="search-box">
                <div>Sort results by</div>
                <div class="search-box">
                  <el-select no-match-text="No Data" v-model="sortFieldByLp" placeholder="search" @change="onLPSortresultsby">
                    <el-option v-for="sorts in pagedLPDetails.head" :key="sorts" :label="sorts" :value="sorts">
                    </el-option>
                  </el-select>
                </div>
                <div class="select-bix">
                  <drop-waitting-btn :iconClass="'el-icon-caret-bottom'" class="right" @click="sortLPDetails"
                    :value="'Sort: Ascending'" :selectList="sortOrderList"></drop-waitting-btn>
                </div>
              </div>
            </div>
          </div>
          <div class="grid-100 tablet-grid-100 container ">
            <ul class="lp-details">
              <li v-for="(lpDetails, index) in pagedLPDetails.data" @click="searchItemSNDetails(lpDetails)"
                :class="{'isActive':lpDetails.isExpandedLPDetail}" :init = "LpDetailsfilerName = gitLpDetailsfilerName(lpDetails)">
                <table class="lpDetailTable">
                  <tbody>
                    <tr>
                      <td :colspan="4" style="padding-left: 15px;">{{lpDetails['LP']}}</td>
                    </tr>
                    <tr>  
                      <td class="align-right">Description:</td>
                     <td :colspan="3">{{lpDetails['Description']}}</td>    
                   </tr> 
                    <tr>
                      <td class="align-right">Item:</td>
                      <td width="32%">{{lpDetails['Item ID']}}</td>
                      <td class="align-right" width="18%">Location:</td>
                      <td width="32%">{{lpDetails['Location']}}</td>
                    </tr>                
                    <tr>
                      <td class="align-right">UOM:</td>
                      <td width="32%">{{lpDetails['UOM']}}</td>
                      <td class="align-right" width="18%">Quantity:</td>
                      <td width="32%">{{lpDetails['Quantity']}}</td>
                    </tr>
                    <tr>
                      <td class="align-right">LP Config:</td>
                      <td width="32%">{{lpDetails['LP Config']}}</td>
                      <td class="align-right" width="18%">Pallet TiHi:</td>
                      <td width="32%">{{lpDetails['Pallet TiHi']}}</td>
                    </tr>
                    <tr >
                      <td class="align-right">Lot #:</td>
                      <td width="32%">{{lpDetails['Lot #']}}</td>
                      <td class="align-right" width="18%">Manufacture Date:</td>
                      <td width="32%">{{lpDetails['Manufacture Date']}}</td>
                    </tr>
                    <tr >
                      <td class="align-right">Expiration Date:</td>
                      <td width="32%">{{lpDetails['Expiration Date']}}</td>
                      <td class="align-right" width="18%">Shelf Life Days:</td>
                      <td width="32%">{{lpDetails['Shelf Life Days']}}</td>
                    </tr>
                    <tr >
                      <td class="align-right">Inventory Status:</td>
                      <td width="32%">{{lpDetails['Inventory Status']}}</td>
                      <td class="align-right" width="18%">Document #:</td>
                      <td width="32%">{{lpDetails['document #']}}</td>
                    <tr >
                      <td class="align-right">PO #:</td>
                      <td width="32%">{{lpDetails['PO #']}}</td>
                      <td class="align-right" width="18%">Ref:</td>
                      <td width="32%">{{lpDetails['Ref #']}}</td>
                    </tr>
                    <tr >
                      <td class="align-right">Date Received:</td>
                      <td width="32%">{{lpDetails['date Received']}}</td>
                      <td class="align-right" width="18%">UPC:</td>
                      <td width="32%">{{lpDetails['UPC']}}</td>
                    </tr>                   
                  </tbody>
                </table>
                <dl class="dl-serial" v-show="lpDetails.isExpandedLPDetail">
                  <dt>
                    <label style="color:black">Serial Numbers:</label>
                    <!--<label><i class="el-icon-arrow-up"></i></label>-->
                  </dt>
                  <dd v-for="sn in SNLeveTotalCount[LpDetailsfilerName]">{{sn}}</dd>
                </dl>
              </li>
            </ul>   
            <pager :totalCount="lpLeveTotalCount.length" :customizePageSize="lpLevePageSize"
            @reloadContent="triggerInventoryLPDetailsre"></pager>            
          </div>        
        </div>
      </div>
    </div>
  </div>

</template>
<style lang="scss" src="./inventorySearch.scss" />