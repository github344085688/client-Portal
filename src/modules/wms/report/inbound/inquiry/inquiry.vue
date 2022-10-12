<template>
  <div class="inbound-inquiry">

    <div class="grid-100 tablet-grid-100 ">

      <div class="grid-100 tablet-grid-100 container">
        <span class="component-title bold">Inbound Received </span>
      </div>
      <div class="grid-100 tablet-grid-100 container margin-top-50 ">
        <div class="tablet-grid-20 date-grid-20 container">
          <label class="input-label">Created Date Range</label>
          <date-range @selectDateRange="onSelectCreateDateRange" :default-time-from="searchParam.createdWhenFrom"
            :default-time-to="searchParam.createdWhenTo"> </date-range>
        </div>
        <div class="tablet-grid-20 date-grid-20 container">
          <label class="input-label">Appointment Date Range</label>
          <date-range @selectDateRange="onSelectAppointmentDateRange"
            :default-time-from="searchParam.appointmentTimeFrom" :default-time-to="searchParam.appointmentTimeTo">
          </date-range>
        </div>
        <div class="tablet-grid-20 date-grid-20 container">
          <label class="input-label">In Yard Date Range</label>
          <date-range @selectDateRange="onSelectInYardDateRange" :default-time-from="searchParam.inYardTimeFrom"
            :default-time-to="searchParam.inYardTimeTo"> </date-range>
        </div>
        <div class="tablet-grid-20 date-grid-20 container">
          <label class="input-label">Received Date Range</label>
          <date-range @selectDateRange="onSelectCloseDateRange" :default-time-from="searchParam.receivedTimeFrom "
            :default-time-to="searchParam.receivedTimeTo" :mode-type="modeType"> </date-range>
        </div>

      </div>
      <div class="grid-100 tablet-grid-100 container avenirNext-Medium">
        <span class="component-title">Sort By: </span>
      </div>
      <div class="grid-100 tablet-grid-100 container">
        <div class="grid-20 tablet-grid-25 ">
          <label class="input-label">Search By</label>
          <div>
            <!-- <input type="text" v-model="searchParam.keyword" placeholder="Receipt / PO / Ref. / CNTR "
              v-rx-event:input="searchByInput" /> -->
              <tags-input v-model="searchParam.keywords" placeholder="Receipt / PO / Ref. / CNTR "></tags-input>
          </div>
        </div>

        <div class="grid-20 tablet-grid-25 ">
          <label class="input-label">Item Keyword </label>
          <div>
            <!-- <input type="text" v-model="searchParam.itemKeyword" placeholder="Item ID / UPC code / AKA "
              v-rx-event:input="searchByInput" /> -->
              <tags-input v-model="searchParam.itemKeywords" placeholder="Item ID / UPC Code / AKA "></tags-input>
          </div>
        </div>
        <div class="grid-20 tablet-grid-25">
          <predefined-customer-select v-model="searchParam.customerId" @change="onselectCustomerChange">
          </predefined-customer-select>
        </div>
        <div class="grid-20 tablet-grid-25 ">
          <facility-select v-model="searchParam.facility" :customerId="searchParam.customerId" :isShowFacilityAll="true"
            @change="onSelectFacilityChange"></facility-select>
        </div>

        <div class="grid-20 tablet-grid-25">
          <label class="input-label"> Title</label>
          <div>
            <multiple-organization-auto-complete v-model="searchParam.titleIds" :customerId="searchParam.customerId"
              :clearable="true" tag="Title">
            </multiple-organization-auto-complete>
          </div>
        </div>
      </div>
      <div class="grid-100 tablet-grid-100 container">

        <div class="grid-20 tablet-grid-25 container" v-if="currentTagName==='All'">
          <label class="input-label">inquiry Status</label>
          <div>
            <el-select no-match-text="No Data" v-model="searchParam.statuses" multiple placeholder="All">
              <el-option v-for="status in receiptStatus" :key="status" :label="status" :value="status">
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
        <div class="grid-20 tablet-grid-25 container" v-if="showReceiptTags">
          <label class="input-label"> Receipt ID</label>
          <div>
            <tags-input v-model="searchParam.receiptIds"></tags-input>
          </div>
        </div>

      </div>

      <div class="wid100 padding-top-15 d-flex justify-content-between p-0">

        <div class="col-8 p-0">
          <customize-table v-model="searchParam.headers" :customerId="searchParam.customerId" :customizeType="'inbound'"
            :reportCategory="searchParam.reportCategory" @selectCustomizeTable="onSelectCustomizeTable">
          </customize-table>
        </div>

          <waitting-btn btn-class="unis-btn unis-btn-primary h-40-p" class="mr-4"  @click="batchDownloadPdf" :value="'Download PDF'"
                        :is-loading="exportPdfLoading"> </waitting-btn>
          <predefined-export-btn  class="mr-4" :value="'Export To Excel'" :export-dates="exportDates"
                                 @selectExportName="onSelectExportName" :is-loading="exportLoading"></predefined-export-btn>
          <waitting-btn btn-class="unis-btn unis-btn-primary h-40-p"  @click="searchReport" :value="'Search'"
                        :is-loading="loading" :disabled="!customizeComplete"> </waitting-btn>

      </div>
      <div class="wid100">

        <ul class="nav-tabs" style="width: 65%; border-bottom:none">
          <li :class="{'active':currentTagName==='All','first':true}" @click="onClickStatuTab('All')"><a>All</a></li>
          <li :class="{'active':currentTagName==='Open'}" @click="onClickStatuTab('Open')"><a>Open</a></li>
          <li :class="{'active':currentTagName==='Scheduled'}" @click="onClickStatuTab('Scheduled')"><a>Scheduled</a>
          </li>
          <li :class="{'active':currentTagName==='Daily Received'}" @click="onClickStatuTab('Daily Received')">
            <a>Daily Received</a>
          </li>
          <li :class="{'active':currentTagName==='MTD Received'}" @click="onClickStatuTab('MTD Received')">
            <a>MTD Received</a>
          </li>
        </ul>
          <div class="br-t-1 br-unfinished wid-100"></div>

      </div>
      <div class="grid-100 tablet-grid-100" style="margin: 10px 0px;">
        <predefined-table-layout :reportCategory="searchParam.reportCategory"
          @groupViewLayoutChange="onGroupViewLayoutChange" @viewModeChange="onViewModeChange" :isShowModes="'true'">
        </predefined-table-layout>
      </div>

      <div class="grid-100 tablet-grid-100" v-loading="loading">
        <table class="table-client" v-fixed-head>
          <thead>
            <tr v-if="inquiryReports.head">
              <!---->
              <th style="width: 40px; vertical-align: middle">
                <input type="checkbox" :checked="isSelectedAll" name="layouts" id="selected_pdf" class="unis-checkbox" @click ="selectAll">
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
              <th style="width:100px">Action</th>
            </tr>
          </thead>
          <tbody>
            <slot v-for="(inquirys,gkey) in inquiryReports.data">
              <tr style="border-bottom: 1px solid #dddd;" v-if="gkey!='dbSource'">
                <td></td>
                <td :colspan="inquiryReports.head.length+1">
                  <img src="../../../../../assets/images/right-deltoid .svg" style="width:12px;">
                  {{gkey}}
                </td>
              </tr>
              <slot v-for="(inquiry,index) in inquirys" name>
                <tr :class="{'group-tr':gkey!='dbSource'}">
                  <td>
                    <slot >
                      <input class="unis-checkbox" type="checkbox" :checked= "isChecked(inquiry)" :id="'inqueryPdf_'+index"  @click ="selectSingle(inquiry)" :disabled = "(inquiry['Status'] == 'Closed' ||inquiry['Status'] == 'Force Closed') ? false : true">
                      <label class="checkbox pred-checkbox" :for="'inqueryPdf_'+ index">
                        <span class="pl-3_5"></span>
                      </label>
                    </slot>

                  </td>
                  <td v-for="head in inquiryReports.head" :key="head" class="action-td">
                    <div v-show="head === 'Action' && (inquiry['Status']==='Open' || inquiry['Status']==='Imported')">
                      <h3>...</h3>
                      <div class="nav-box">
                          <div @click.stop.prevent="editReport(inquiry['Receipt #'])">Edit</div>
                          <div @click.stop.prevent="cancel(inquiry)">Cancel</div>
                      </div>
                    </div>
                    <div v-show="head === '' && tableModeName==='Nested Layout'" class="cursor-point width-30"
                      @click.stop.prevent="showItemLevelTable(getItemLevelKey(inquiry),inquiry.facilityName)">
                      <i class="fas fa-chevron-right dz-icon " v-if="!childrenShow[getItemLevelKey(inquiry)]"></i>
                      <i class="fas fa-chevron-down dz-icon" v-if="childrenShow[getItemLevelKey(inquiry)]"></i>
                    </div>
                    <p v-if="!isDynTxt(head)">{{inquiry[head]}}
                        <span v-permission-check="'Inbound::ReceiptEntry_write'" v-if="head==='Receipt #'"  style="width: 61px; display: inline-block;" >

<button class="unis-btn unis-btn-primary h-32" style="min-width: inherit!important; font-size: 0.625rem!important;" v-if="inquiry['Status']==='Open' ||inquiry['Status']==='Imported'" @click.stop.prevent="editReport(inquiry[head])">Edit</button>
                            </span>
                    </p>
                    <p style="word-break: break-all" v-for="val in analysisDynTxt(inquiry[head],head)" 
                      v-if="isDynTxt(head)">
                      {{val}}
                    </p>
                  </td>
                  <td style="display:flex; white-space: nowrap" >
                      <div v-if="inquiry['Status'] == 'Closed' ||inquiry['Status'] == 'Force Closed'">
                          <img src="@/assets/images/pdf.png" width="20" height="20" >
                          <a style="color:blue;cursor: pointer;" @click.stop.prevent ="downloadPdf(inquiry)">
                              <span>{{inquiry['Receipt #']}}_document.pdf</span>
                          </a>
                      </div>


                  </td>
                    <td>
                        <a style="color:blue;cursor: pointer;" @click.stop.prevent="attachmentUpload(inquiry)">
                            Attachment
                        </a>
                    </td>
                </tr>
                <tr class="child-table-total"
                  v-if="childrenShow[getItemLevelKey(inquiry)] && tableModeName === 'Nested Layout'">
                  <td></td>
                  <td :colspan="inquiryReports.head.length+1" class="padding-init table-cell"
                    v-loading="itemLoading[getItemLevelKey(inquiry)]">
                    <div class="child">
                      <table class="child-table">
                        <thead>
                          <tr>
                            <th v-if="getLeveLHead(getItemLevelKey(inquiry))" class="cursor-point"></th>
                            <th v-for="head in getLeveLHead(getItemLevelKey(inquiry))" :key="head">

                              {{head}}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <slot v-for="itemLevel in getLeveLData(getItemLevelKey(inquiry))" name>
                            <tr>
                              <td v-if="getLeveLData(getItemLevelKey(inquiry))" class="cursor-point width-30"
                                @click.stop.prevent="showIDLevelAndCartonLevel(itemLevel, inquiry.facilityName)">
                                <i class="fas fa-chevron-right dz-icon "
                                  v-if=" !childrenShow[getIdLevelKey(itemLevel)]"></i>
                                <i class="fas fa-chevron-down dz-icon"
                                  v-if=" childrenShow[getIdLevelKey(itemLevel)]"></i>
                              </td>
                              <td v-for="head in getLeveLHead(getItemLevelKey(inquiry))" :key="head">
                                {{itemLevel[head]}}
                              </td>
                            </tr>
                            <tr class="third-child-table" v-if="childrenShow[getIdLevelKey(itemLevel)]">
                              <td
                                class="padding-init table-cell" v-loading="itemLoading[getIdLevelKey(itemLevel)]">
                                <div class="child"
                                  v-if=" getLeveLData(getIdLevelKey(itemLevel)) && getLeveLData(getIdLevelKey(itemLevel)).length >0 ">
                                  <table class="child-table">
                                    <thead>
                                      <tr>
                                        <th class="download-icon">
                                          <i class="el-icon-loading"
                                            v-if="itemExcelLoadingObj[getIdLevelKey(itemLevel)]"></i>
                                          <a @click="downLoadIdLevelItemLevel(itemLevel,inquiry.facilityName)"
                                            v-if="!itemExcelLoadingObj[getIdLevelKey(itemLevel)]">
                                            <i class="el-icon-download"></i>
                                          </a>
                                        </th>
                                        <th v-for="head in getLeveLHead(getIdLevelKey(itemLevel))" :key="head">

                                          {{head}}</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr v-for="idLevel in idLevelCurrentPageDate[getIdLevelKey(itemLevel)]">
                                        <td></td>
                                        <td v-for="head in getLeveLHead(getIdLevelKey(itemLevel))" :key="head">
                                          {{idLevel[head]}}
                                        </td>
                                      </tr>
                                      <tr
                                        v-if=" !getLeveLData(getIdLevelKey(itemLevel)) || getLeveLData(getIdLevelKey(itemLevel)).length === 0 ">
                                        <td></td>
                                        <td
                                          :colspan=" getLeveLData(getIdLevelKey(itemLevel)).length ? getLeveLData(getIdLevelKey(itemLevel)).length : getLeveLHead(getItemLevelKey(inquiry)).length+1"
                                          class="center">
                                          No Datas
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <simplified-pager v-if="setPageVisibility(getIdLevelKey(itemLevel))"
                                    :currentDate="itemLevel" :totalCount="getToTalCount(getIdLevelKey(itemLevel))"
                                    :customizePageSize="getPageSize(getIdLevelKey(itemLevel))"
                                    @reloadContent="searchIDLevelReportFromPager"></simplified-pager>
                                </div>
                              </td>
                            </tr>
                            <tr class="third-child-table" v-if="childrenShow[getIdLevelKey(itemLevel)]">
                              <td :colspan="getLeveLHead(getItemLevelKey(inquiry)).length+1"
                                class="padding-init table-cell" v-loading="itemLoading[getCartonLevelKey(itemLevel)]"
                                v-if="cartonCurrentPageDate[getCartonLevelKey(itemLevel)]&& cartonCurrentPageDate[getCartonLevelKey(itemLevel)].length>0 ">
                                <div class="child">
                                  <table class="child-table">
                                    <thead>
                                      <tr>
                                        <th class="download-icon">
                                          <i class="el-icon-loading"
                                            v-if="itemExcelLoadingObj[getCartonLevelKey(itemLevel)]"></i>
                                          <a style="text-decoration: none"
                                            @click="downLoadCartonLevelItemLevel(itemLevel, inquiry.facilityName)"
                                            v-if="!itemExcelLoadingObj[getCartonLevelKey(itemLevel)]">
                                            <i class="el-icon-download"></i>
                                          </a>
                                        </th>
                                        <th v-for="head in getLeveLHead(getCartonLevelKey(itemLevel))" :key="head">

                                          {{head}}</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr v-for="cartonLevel in cartonCurrentPageDate[getCartonLevelKey(itemLevel)]">
                                        <td></td>
                                        <td v-for="head in getLeveLHead(getCartonLevelKey(itemLevel))" :key="head">
                                          {{cartonLevel[head]}}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <simplified-pager v-if="setPageVisibility(getCartonLevelKey(itemLevel))"
                                    :currentDate="itemLevel" :totalCount="getToTalCount(getCartonLevelKey(itemLevel))"
                                    :customizePageSize="getPageSize(getCartonLevelKey(itemLevel))"
                                    @reloadContent="searchCartonLevelReportFromPager"></simplified-pager>
                                </div>
                              </td>

                            </tr>
                          </slot>
                        </tbody>
                      </table>

                      <simplified-pager v-if="setPageVisibility(getItemLevelKey(inquiry))" :currentDate="inquiry"
                        :totalCount="getToTalCount(getItemLevelKey(inquiry))"
                        :customizePageSize="getPageSize(getItemLevelKey(inquiry))"
                        @reloadContent="searchItemLevelReportFromPager"></simplified-pager>

                    </div>

                  </td>
                  <td></td>
                </tr>
              </slot>
            </slot>
          </tbody>
        </table>
        <pager :totalCount="searchResultPaging.totalCount" :currentPage="searchParam.paging.pageNo"
          :customizePageSize="searchParam.paging.limit" @reloadContent="triggerSearchFromPager"></pager>

      </div>
    </div>
    <form @submit.stop.prevent="popUpConfig.submitFunc">
        <pop-up-windows v-show="popUpConfig.isShow" :height="popUpConfig.height" :tlitle="popUpConfig.title" :isSubmit="popUpConfig.isSubmit" @cancel="popUpConfig.cancelFunc()">
             <div class="grid-100 tablet-grid-100 container" v-show="popUpConfig.modal === 'Attachment'">
              <div class="grid-100 tablet-grid-100">
                  <table-drag-drop
                          :is-show="popUpConfig.isShow"
                          :tag="'receipt'"
                          :fileTagId="attachmentReceipt['Receipt #']"
                          :accept="''"
                          :getFileById="'fileId'"
                          :accessUrl="attachmentReceipt['accessUrl']"
                  ></table-drag-drop>
              </div>
            </div>
            <div v-show="popUpConfig.modal==='cancel'" class="cancel">
              <input v-model="reason" v-validate="'required'" name="reason" type="textarea" :class="{'input': true, 'is-danger': errors.has('reason')}">
              <span>{{ errors.first('reason') }}</span>
            </div>
        </pop-up-windows>
    </form>
  </div>

</template>
<style lang="scss" src="./inquiry.scss" />
