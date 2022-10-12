<template>
  <div class="outbound-inquiry">

    <div class="grid-100 tablet-grid-100 ">

      <div class="grid-100 tablet-grid-100 container">
        <span class="component-title bold">Outbound Inquiry </span>
      </div>
      <div class="grid-100 tablet-grid-100 container margin-top-50 ">
        <div class="tablet-grid-20 date-grid-20 container">
          <label class="input-label">Created Date Range</label>
          <date-range @selectDateRange="onSelectCreateDateRange" :default-time-from="searchParam.createdWhenFrom"
            :default-time-to="searchParam.createdWhenTo"> </date-range>
        </div>
        <div class="tablet-grid-20 date-grid-20 container">
          <label class="input-label">Appointment Date Range</label>
          <date-range @selectDateRange="onSelectAppointmentDateRange" :default-time-from="searchParam.appointmentTimeFrom"
            :default-time-to="searchParam.appointmentTimeTo"> </date-range>
        </div>
        <div class="tablet-grid-20 date-grid-20 container">
          <label class="input-label">MABD Date Range</label>
          <date-range @selectDateRange="onSelectMabdDateRange" :default-time-from="searchParam.mabdFrom"
            :default-time-to="searchParam.mabdTo"> </date-range>
        </div>
        <div class="tablet-grid-20 date-grid-20 container">
          <label class="input-label">Shipped Date Range</label>
          <date-range @selectDateRange="onSelectLoadCompleteDateRange" :default-time-from="searchParam.shippedTimeFrom"
            :default-time-to="searchParam.shippedTimeTo" :mode-type="modeType"> </date-range>
        </div>

      </div>
      <div class="grid-100 tablet-grid-100 container">
        <div class="grid-20 tablet-grid-25 ">
          <label class="input-label">Search By</label>
          <div>
            <tags-input v-model="searchParam.keywords" placeholder="Order / PO / Ref / Load / SN / Tracking No / Trailer Number/ BOL / MBOL"></tags-input>
          </div>
        </div>

        <div class="grid-20 tablet-grid-25 ">
          <label class="input-label">Item Keyword </label>
          <div>
            <tags-input v-model="searchParam.itemKeywords" placeholder="Item ID / UPC Code / AKA "></tags-input>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25">
          <predefined-customer-select v-model="searchParam.customerId" @change="onselectCustomerChange"></predefined-customer-select>
        </div>
        <div class="grid-20 tablet-grid-25 ">
            <facility-select v-model="searchParam.facility" :customerId="searchParam.customerId" @change="onSelectFacilityChange" :isShowFacilityAll="true"></facility-select>
        </div>

        <div class="grid-20 tablet-grid-25 ">
            <label class="input-label"> Title</label>
            <div>
               <multiple-organization-auto-complete v-model="searchParam.titleIds" :customerId="searchParam.customerId" :clearable="true" tag="Title">
               </multiple-organization-auto-complete>
           </div>
       </div>

      </div>

      <div class="grid-100 tablet-grid-100 container">
          <div class="grid-20 tablet-grid-25 " v-if="currentTagName === 'All'">
              <label class="input-label"> Order Status</label>
              <div>
                <el-select no-match-text="No Data" v-model="searchParam.statuses" multiple placeholder="All">
                  <el-option v-for="status in statues" :key="status" :label="status"  :value="status">
                  </el-option>
                </el-select>
              </div>
            </div>
          <div class="grid-20 tablet-grid-25 ">
              <label class="input-label"> Load Status</label>
              <div>
                <el-select no-match-text="No Data" v-model="searchParam.loadStatuses"  multiple  placeholder="All" >
                  <el-option v-for="status in loadStatues" :key="status" :label="status"  :value="status">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="grid-20 tablet-grid-25 container" v-if="searchParam.itemSpecIds">
                <label class="input-label"> Item </label>
                <div>
                   <item-auto-complete :placeholder="'Item ID Or Description'" v-model="searchParam.itemSpecId"
                                       @change="onselectChange" :clearable="true" :customerId="searchParam.customerId">

                   </item-auto-complete>
                </div>
            </div>
            <div class="grid-20 tablet-grid-25 " v-if = "searchParam.orderIds">
              <label class="input-label"> Order ID</label>
              <div>
                <tags-input v-model="searchParam.orderIds"></tags-input>
              </div>
            </div>

      </div>

        <div class="wid100 padding-top-15 d-flex justify-content-between p-0 mb-4">

            <div class="col p-0">
                <customize-table v-model="searchParam.headers" :customerId="searchParam.customerId"
                                 :reportCategory="searchParam.reportCategory" :customizeType="'outbound'"
                                 @selectCustomizeTable="onSelectCustomizeTable"></customize-table>
            </div>

            <waitting-btn btn-class="unis-btn unis-btn-primary h-40-p" class="mr-4" @click="batchDownloadPdf"
                          :value="'Download PDF'"
                          :is-loading="exportPdfLoading"></waitting-btn>
            <waitting-btn btn-class="unis-btn unis-btn-primary h-40-p" class="mr-4"
                          @click="onSelectExportName('Expanding Level(.xls)')" :value="'Export To Excel'"
                          :is-loading="exportLoading"></waitting-btn>
            <waitting-btn btn-class="unis-btn unis-btn-primary h-40-p" @click="searchReport" :value="'Search'"
                          :is-loading="loading" :disabled="!customizeComplete"></waitting-btn>
        </div>
        <div class="wid100">

            <ul class="nav-tabs" style="width: 65%; border-bottom:none">
          <li :class="{'active':currentTagName==='All','first':true}" @click="onClickStatuTab('All')"><a>All</a></li>
          <li :class="{'active':currentTagName==='Open'}" @click="onClickStatuTab('Open')"><a>Open</a></li>
          <li :class="{'active':currentTagName==='Scheduled'}" @click="onClickStatuTab('Scheduled')"><a>Scheduled</a></li>
          <li :class="{'active':currentTagName==='Daily Shipped'}" @click="onClickStatuTab('Daily Shipped')">
            <a>Daily Shipped</a>
          </li>
          <li :class="{'active':currentTagName==='MTD Shipped'}" @click="onClickStatuTab('MTD Shipped')">
            <a>MTD Shipped</a>
          </li>
        </ul>
            <div class="br-t-1 br-unfinished wid-100"></div>

      </div>
      <div class="grid-100 tablet-grid-100" style="margin: 10px 0px;">
        <predefined-table-layout :reportCategory="searchParam.reportCategory" @groupViewLayoutChange="onGroupViewLayoutChange"
          @viewModeChange="onViewModeChange" :isShowModes="'true'"></predefined-table-layout>
      </div>

      <div class="grid-100 tablet-grid-100" v-loading="loading">
      
          <table class="table-client" v-fixed-head>
            <thead>
              <tr v-if="inquiryReports.head">
                <th style="width: 40px; vertical-align: middle" >
                  <input type="checkbox" class="unis-checkbox" id="selected_pdf" :checked="isSelectedAll" @click ="selectAll">
                  <label for="selected_pdf">
                      <span class="pl-3_5"></span>
                  </label>
                </th>
                  <th v-for="head in inquiryReports.head" :key="head" draggable="true" @dragstart="dragStart($event)">
                      <div class="d-flex">
                          {{head}}
                          <div class="d-flex flex-column " style="margin-top: -3px">
                              <span style="transform: scale(0.4, 0.4) !important; display: flex;">
                                  <i  class=" icon-47 icon-up cursor-p"  v-if="head =='Rush' " :class="{'ft-aLink':sortingField[head]== 1}"  @click="sortingFields(head,1)"></i>
                              </span>
                              <span style="transform: scale(0.4, 0.4) !important; display: flex;margin-top: -5px">
                                   <i  class="icon-47 cursor-p" v-if="head =='Rush' " :class="{'ft-aLink':sortingField[head]== -1}" @click="sortingFields(head,-1)"></i>
                              </span>

                          </div>

                      </div>
                  </th>
                <th style="width:100px">PDF</th>
                <th style="width:100px">MBOL</th>
                <th style="width:100px">Packing List</th>
                <th style="width:100px">Generic Packing List</th>
                <th style="width:100px">Action</th>
              </tr>
            </thead>
            <tbody>
              <slot v-for="(orderInquirys,gkey) in inquiryReports.data">
                <tr style="border-bottom: 1px solid #dddd;" v-if="gkey!='dbSource'">
                  <td :colspan="inquiryReports.head.length+1">
                    <img src="../../../../../assets/images/right-deltoid .svg" style="width:12px;">
                    {{gkey}}
                  </td>
                </tr>
                <slot v-for="(orderInquiry,index) in orderInquirys" name>
                  <tr :class="{'group-tr':gkey!='dbSource'}">
                    <td>
                      <slot>
                          <input type="checkbox" class="unis-checkbox" :checked= "isChecked(orderInquiry)" :id="'inqueryPdf_'+index"  @click ="selectSingle(orderInquiry)">
                          <label :for="'inqueryPdf_'+ index">
                              <span class="pl-3_5"></span>
                          </label>
                      </slot>

                    </td>
                    <td v-for="head in inquiryReports.head" :key="head" class="action-td">
                      <div v-show="head === 'Action' && (orderInquiry['Status']==='Open' || orderInquiry['Status']==='Imported')">
                        <h3>...</h3>
                        <div class="nav-box">
                            <div @click.stop.prevent="editOrder(orderInquiry['Order #'])">Edit</div>
                            <div @click.stop.prevent="cancel(orderInquiry)">Cancel</div>
                        </div>
                      </div>
                      <div v-if="head === '' && tableModeName==='Nested Layout'" class="cursor-point width-30"
                          @click.stop.prevent="showChildItemTable(getItemLevelKey(orderInquiry),orderInquiry.facilityName)">
                          <i class="fas fa-chevron-right dz-icon " v-if="!childrenShow[getItemLevelKey(orderInquiry)]"></i>
                          <i class="fas fa-chevron-down dz-icon" v-if="childrenShow[getItemLevelKey(orderInquiry)]"></i>
                      </div>
                     <p v-if="!isDynTxt(head)">{{Array.isArray(orderInquiry[head]) ? orderInquiry[head].join('&nbsp;&nbsp;&nbsp;') : orderInquiry[head]}}
                         <span  v-permission-check="'Outbound::OrderEntry_write'" v-if="head==='Order #'"  style="width: 61px; display: inline-block;" >
                             <button  v-if="orderInquiry['Status']==='Open' ||orderInquiry['Status']==='Imported'" class="unis-btn unis-btn-primary h-32" style="min-width: inherit!important; font-size: 0.625rem!important;" @click.stop.prevent="editOrder(orderInquiry[head])">Edit</button>
                             </span>
                     </p>
                     <p  style="word-break: break-all" v-for="val in analysisDynTxt(orderInquiry[head],head)" v-if="isDynTxt(head)">
                       {{val}}
                     </p>
                    </td>
                    <td style="display:flex">
                       <slot v-if="orderInquiry.allAssociatedFileId">
                          <img src="@/assets/images/pdf.png" width="20" height="20" >
                          <a style="color:blue;cursor: pointer;" @click.stop.prevent ="downloadPdf(orderInquiry)">
                          <span>{{orderInquiry.referenceNo}}.pdf</span>
                        </a>
                       </slot>
                    &nbsp;
                    </td>
                    <td>
                      <slot v-if="orderInquiry['loadId']">
                      <img src="@/assets/images/pdf.png" width="20" height="20">
                      <a style="color:blue;cursor: pointer;" @click.stop.prevent="downloadMBOL(orderInquiry)">
                        <span>{{orderInquiry["mBol"] ? orderInquiry["mBol"] : (orderInquiry["bolNo"] ? orderInquiry["bolNo"]: orderInquiry["loadId"]) }}.pdf</span>
                      </a>
                     </slot>
                    </td>
                    <td>
                      <img src="@/assets/images/pdf.png" width="20" height="20">
                      <a style="color:blue;cursor: pointer;" @click.stop.prevent="downloadPackingListPdf(orderInquiry)">
                        <span>{{orderInquiry.orderId}}_PackingList.pdf</span>
                      </a>
                    </td>
                    <td>
                      <img src="@/assets/images/pdf.png" width="20" height="20">
                      <a style="color:blue;cursor: pointer;" @click.stop.prevent="downloadGenericPackingListPdf(orderInquiry)">
                        <span>{{orderInquiry.orderId}}_GenericPackingList.pdf</span>
                      </a>
                    </td>
                      <td>
                          <a style="color:blue;cursor: pointer;" @click.stop.prevent="attachmentUpload(orderInquiry)">
                              Attachment
                          </a>
                      </td>
                  </tr>
            
                  <tr class="child-table-total" v-if="childrenShow[getItemLevelKey(orderInquiry)] &&tableModeName==='Nested Layout'">
                    <td :colspan="inquiryReports.head.length+3" class="padding-init table-cell" v-loading="itemLoading[getItemLevelKey(orderInquiry)]">
                      <div class="child">
                        <table class="child-table">
                          <thead>
  
                            <tr>
                              <th v-if="getItemLeveLHead(getItemLevelKey(orderInquiry))" class="cursor-point"></th>
                              <th v-for="head in  getItemLeveLHead(getItemLevelKey(orderInquiry))" :key="head">{{head}}</th>
                            </tr>
  
                          </thead>
                          <tbody>
                            <slot v-for="itemLevel in getItemLeveLData(getItemLevelKey(orderInquiry))" name>
                              <tr>
                                <td v-if="getItemLeveLData(getItemLevelKey(orderInquiry))" class="cursor-point width-30" 
                                @click.stop.prevent="showIDLevelAndCartonLevel(itemLevel, orderInquiry.facilityName)">
                                  <i class="fas fa-chevron-right dz-icon " v-if=" !childrenShow[getIdLevelKey(itemLevel)]"></i>
                                  <i class="fas fa-chevron-down dz-icon" v-if=" childrenShow[getIdLevelKey(itemLevel)]"></i>
                                </td>
                                <td v-for="head in getItemLeveLHead(getItemLevelKey(orderInquiry))" :key="head">
                                  {{itemLevel[head]}}
                                </td>
                              </tr>
                              <tr class="third-child-table" v-if="childrenShow[getIdLevelKey(itemLevel)]">
                                <td  class="padding-init table-cell"
                                  v-loading="itemLoading[getIdLevelKey(itemLevel)]">
                                  <div class="child" v-if=" getLeveLData(getIdLevelKey(itemLevel)) && getLeveLData(getIdLevelKey(itemLevel)).length >0 ">
                                    <table class="child-table">
                                      <thead>
                                        <tr>
                                          <th class="download-icon">
                                            <i class="el-icon-loading" v-if="itemExcelLoadingObj[getIdLevelKey(itemLevel)]"></i>
                                            <a  @click="downLoadIdLevelItemLevel(itemLevel, orderInquiry.facilityName)" v-if="!itemExcelLoadingObj[getIdLevelKey(itemLevel)]">
                                                <i class="el-icon-download"></i> 
                                            </a>
                                          </th>
                                          <th v-for="head in getLeveLHead(getIdLevelKey(itemLevel))" :key="head">{{head}}</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr v-for="idLevel in getLeveLData(getIdLevelKey(itemLevel))">
                                          <td></td>
                                          <td v-for="head in getLeveLHead(getIdLevelKey(itemLevel))" :key="head">
                                            {{idLevel[head]}}
                                          </td>
                                        </tr>
                                        <tr v-if=" !getLeveLData(getIdLevelKey(itemLevel)) || getLeveLData(getIdLevelKey(itemLevel)).length === 0 ">
                                            <td></td>
                                            <td :colspan=" getLeveLData(getIdLevelKey(itemLevel)).length ? getLeveLData(getIdLevelKey(itemLevel)).length : getLeveLHead(getItemLevelKey(orderInquiry)).length+1" class="center">
                                                No Datas
                                            </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <simplified-pager v-if="setPageVisibility(getIdLevelKey(itemLevel))" :currentDate="itemLevel"
                                      :totalCount="getToTalCount(getIdLevelKey(itemLevel))" :customizePageSize="getPageSize(getIdLevelKey(itemLevel))"
                                      @reloadContent="searchIDLevelReportFromPager"></simplified-pager>
                                  </div>
                                </td>
  
                              </tr>
                              <tr class="third-child-table" v-if="childrenShow[getIdLevelKey(itemLevel)]">
                                <td class="padding-init table-cell"
                                  v-loading="itemLoading[getCartonLevelKey(itemLevel)]" v-if="cartonCurrentPageDate[getCartonLevelKey(itemLevel)]&& cartonCurrentPageDate[getCartonLevelKey(itemLevel)].length>0 ">
                                  <div class="child">
                                    <table class="child-table">
                                      <thead>
                                        <tr>
                                          <th class="download-icon">
                                            <i class="el-icon-loading" v-if="itemExcelLoadingObj[getCartonLevelKey(itemLevel)]"></i>
                                            <a style="text-decoration: none" @click="downLoadCartonLevelItemLevel(itemLevel, orderInquiry.facilityName)" v-if="!itemExcelLoadingObj[getCartonLevelKey(itemLevel)]">
                                                <i class="el-icon-download"></i>  
                                            </a>
                                          </th>
                                          <th v-for="head in getLeveLHead(getCartonLevelKey(itemLevel))" :key="head">{{head}}</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr v-for="cartonLevel in cartonCurrentPageDate[getCartonLevelKey(itemLevel)]">
                                          <td></td>
                                          <td v-for="head in getLeveLHead(getCartonLevelKey(itemLevel))" :key="head">
                                            {{cartonLevel[head]}}
                                          </td>
                                        </tr>
                                        <tr v-if="!cartonCurrentPageDate[getCartonLevelKey(itemLevel)]|| cartonCurrentPageDate[getCartonLevelKey(itemLevel)].length === 0 ">
                                          <td></td>
                                          <td :colspan="getLeveLHead(getCartonLevelKey(itemLevel)).length ? getLeveLHead(getCartonLevelKey(itemLevel)).length : getLeveLHead(getItemLevelKey(orderInquiry)).length+1" class="center">
                                              No Datas
                                          </td>
                                      </tr>
                                      </tbody>
                                    </table>
                                    <simplified-pager v-if="setPageVisibility(getCartonLevelKey(itemLevel))" :currentDate="itemLevel"
                                      :totalCount="getToTalCount(getCartonLevelKey(itemLevel))" :customizePageSize="getPageSize(getCartonLevelKey(itemLevel))"
                                      @reloadContent="searchCartonLevelReportFromPager"></simplified-pager>
                                  </div>
                                </td>
  
                              </tr>
                            </slot>
                          </tbody>
                        </table>
  
                        <simplified-pager v-if="setPageVisibility(getItemLevelKey(orderInquiry))" :keyId="getItemLevelKey(orderInquiry)"
                          :totalCount="getToTalCount(getItemLevelKey(orderInquiry))" :customizePageSize="getPageSize(getItemLevelKey(orderInquiry))"
                          @reloadContent="searchItemLevelReportFromPager"></simplified-pager>
  
                      </div>
  
                    </td>
  
                  </tr>
                </slot>
              </slot>
            </tbody>
          </table>

        <pager :totalCount="searchResultPaging.totalCount" :customizePageSize="searchParam.paging.limit" @reloadContent="triggerSearchFromPager"></pager>

      </div>
    </div>
    <form @submit.stop.prevent="popUpConfig.submitFunc">
        <pop-up-windows v-show="popUpConfig.isShow" :height="popUpConfig.height" :tlitle="popUpConfig.title" :isSubmit="popUpConfig.isSubmit" @cancel="popUpConfig.cancelFunc()">
            <div class="grid-100 tablet-grid-100 container" v-show="popUpConfig.modal==='Attachment'" >
                <div class="grid-100 tablet-grid-100">
                    <table-drag-drop
                            :is-show="popUpConfig.isShow"
                            :tag="'order'"
                            :fileTagId="attachmentOrder['orderId']"
                            :accept="''"
                            :getFileById="'id'"
                            :accessUrl="attachmentOrder['accessUrl']"
                    ></table-drag-drop>
                </div>
            </div>
            <div v-show="popUpConfig.modal==='cancel'" class="cancel">
              <input v-model="cancelNote" v-validate="'required'" name="cancelNote" type="textarea" :class="{'input': true, 'is-danger': errors.has('cancelNote')}">
              <span>{{ errors.first('cancelNote') }}</span>
            </div>
        </pop-up-windows>
    </form>
  </div>

</template>
<style lang="scss" src="./inquiry.scss" />
