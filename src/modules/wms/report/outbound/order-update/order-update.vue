<template>
    <div class="outbound-inquiry">

        <div class="grid-100 tablet-grid-100 ">

            <div class="grid-100 tablet-grid-100 container">
                <span class="component-title bold">Outbound order update </span>
            </div>
            <div class="grid-100 tablet-grid-100 container margin-top-50 ">
                <div class="tablet-grid-20 date-grid-20 container">
                    <label class="input-label">Created Date Range</label>
                    <date-range @selectDateRange="onSelectCreateDateRange"
                                :default-time-from="searchParam.createdWhenFrom"
                                :default-time-to="searchParam.createdWhenTo"></date-range>
                </div>
                <div class="tablet-grid-20 date-grid-20 container">
                    <label class="input-label">Appointment Date Range</label>
                    <date-range @selectDateRange="onSelectAppointmentDateRange"
                                :default-time-from="searchParam.appointmentTimeFrom"
                                :default-time-to="searchParam.appointmentTimeTo"></date-range>
                </div>
                <div class="tablet-grid-20 date-grid-20 container">
                    <label class="input-label">MABD Date Range</label>
                    <date-range @selectDateRange="onSelectMabdDateRange" :default-time-from="searchParam.mabdFrom"
                                :default-time-to="searchParam.mabdTo"></date-range>
                </div>
                <div class="tablet-grid-20 date-grid-20 container">
                    <label class="input-label">Shipped Date Range</label>
                    <date-range @selectDateRange="onSelectLoadCompleteDateRange"
                                :default-time-from="searchParam.shippedTimeFrom"
                                :default-time-to="searchParam.shippedTimeTo" :mode-type="modeType"></date-range>
                </div>

            </div>
            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-20 tablet-grid-25 ">
                    <label class="input-label">Search By</label>
                    <div>
                        <tags-input v-model="searchParam.keywords"
                                    placeholder="Order / PO / Ref / Load / SN / Tracking No"></tags-input>
                    </div>
                </div>

                <div class="grid-20 tablet-grid-25 ">
                    <label class="input-label">Item Keyword </label>
                    <div>
                        <tags-input v-model="searchParam.itemKeywords"
                                    placeholder="Item ID / UPC Code / AKA "></tags-input>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25">
                    <predefined-customer-select v-model="searchParam.customerId"
                                                @change="onselectCustomerChange"></predefined-customer-select>
                </div>
                <div class="grid-20 tablet-grid-25 ">
                    <facility-select v-model="searchParam.facility" :customerId="searchParam.customerId"
                                     @change="onSelectFacilityChange" :isShowFacilityAll="false"></facility-select>
                </div>

                <div class="grid-20 tablet-grid-25 ">
                    <label class="input-label"> Title</label>
                    <div>
                        <multiple-organization-auto-complete v-model="searchParam.titleIds"
                                                             :customerId="searchParam.customerId" :clearable="true"
                                                             tag="Title">
                        </multiple-organization-auto-complete>
                    </div>
                </div>

            </div>

            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-20 tablet-grid-25 " v-if="currentTagName === 'All'">
                    <label class="input-label"> Order Status</label>
                    <div>
                        <el-select no-match-text="No Data" v-model="searchParam.statuses" multiple placeholder="All">
                            <el-option v-for="status in statues" :key="status" :label="status" :value="status">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 ">
                    <label class="input-label"> Load Status</label>
                    <div>
                        <el-select no-match-text="No Data" v-model="searchParam.loadStatuses" multiple
                                   placeholder="All">
                            <el-option v-for="status in loadStatues" :key="status" :label="status" :value="status">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container" v-if="searchParam.itemSpecIds">
                    <label class="input-label"> Item </label>
                    <div>
                        <item-auto-complete :placeholder="'Item ID Or Description'" v-model="searchParam.itemSpecId"
                                            @change="onselectChange" :clearable="true"
                                            :customerId="searchParam.customerId">

                        </item-auto-complete>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 " v-if="searchParam.orderIds">
                    <label class="input-label"> Order ID</label>
                    <div>
                        <tags-input v-model="searchParam.orderIds"></tags-input>
                    </div>
                </div>

            </div>

            <div class="wid100 padding-top-15 d-flex justify-content-between p-0">

                <div class="col p-0">
                    <customize-table v-model="searchParam.headers" :customerId="searchParam.customerId"
                                     :reportCategory="searchParam.reportCategory" :customizeType="'outbound'"
                                     @selectCustomizeTable="onSelectCustomizeTable"></customize-table>
                </div>
                <waitting-btn btn-class="unis-btn unis-btn-primary h-40-p" class=" mr-4"
                              @click="searchReport" :value="'Search'" :is-loading="loading"
                              :disabled="!customizeComplete"></waitting-btn>
                <waitting-btn btn-class="unis-btn unis-btn-primary h-40-p" class=" mr-4" @click="uploadLabel"
                              :value="'Upload Label'"></waitting-btn>
                <waitting-btn btn-class="unis-btn unis-btn-primary h-40-p"  @click="batchUploadLabel"
                              :value="'Batch Upload Label'"></waitting-btn>
            </div>
            <div class="grid-100 tablet-grid-100">
            </div>
            <div class="grid-100 tablet-grid-100 pr-0" style="margin: 10px 0px;">
                <waitting-btn btn-class="unis-btn unis-btn-primary h-40-p" class="right mb-2" @click="editOrders"
                              :is-loading="isEditOrdersloading" :value="'Edit Orders'"
                              :disabled="isDisabledEditOrders"></waitting-btn>
            </div>
<!-- talbel  -->
            <div class="grid-100 tablet-grid-100" v-loading="loading">

                <table class="table-client" v-fixed-head>
                    <thead>
                    <tr v-if="inquiryReports.head">
                        <th style="width: 40px;vertical-align: middle">
                            <input type="checkbox" class="unis-checkbox" id="selectAll" :checked="isSelectedAll" @click="selectAll">
                            <label for="selectAll">
                                <span></span>
                            </label>
                        </th>
                        <th v-if="inquiryReports.head &&tableModeName==='Nested Layout'" class="cursor-point"></th>
                        <th v-for="head in inquiryReports.head" :key="head" draggable="true"
                            @dragstart="dragStart($event)">{{head}}
                        </th>
                        <th style="width:100px">PDF</th>
                    </tr>
                    </thead>
                    <tbody>
                    <slot v-for="(orderInquirys,gkey) in inquiryReports.data">
                        <tr style="border-bottom: 1px solid #dddd; vertical-align: middle" v-if="gkey!='dbSource'">
                            <td :colspan="inquiryReports.head.length+1">
                                <img src="../../../../../assets/images/right-deltoid .svg" style="width:12px;">
                                {{gkey}}
                            </td>
                        </tr>
                        <slot v-for="(orderInquiry,index) in orderInquirys" name>
                            <tr :class="{'group-tr':gkey!='dbSource'}">
                                <td >
                                    <slot>
                                        <input type="checkbox" class="unis-checkbox" :checked="isChecked(orderInquiry)"
                                               :id="orderInquiry.orderId" @click="selectSingle(orderInquiry)">
                                        <label :for="orderInquiry.orderId">
                                            <span></span>
                                        </label>
                                    </slot>

                                </td>
                                <td v-if="inquiryReports.head &&tableModeName==='Nested Layout'"
                                    class="cursor-point width-30"
                                    @click.stop.prevent="showChildItemTable(getItemLevelKey(orderInquiry),orderInquiry.facilityName)">
                                    <i class="fas fa-chevron-right dz-icon "
                                       v-if="!childrenShow[getItemLevelKey(orderInquiry)]"></i>
                                    <i class="fas fa-chevron-down dz-icon"
                                       v-if="childrenShow[getItemLevelKey(orderInquiry)]"></i>
                                </td>
                                <td v-for="head in inquiryReports.head" :key="head">
                                    <p v-if="!isDynTxt(head)">{{orderInquiry[head]}}</p>
                                    <p style="word-break: break-all"
                                       v-for="val in analysisDynTxt(orderInquiry[head],head)" v-if="isDynTxt(head)">
                                        {{val}}
                                    </p>
                                </td>
                                <td style="display:flex">
                                    <slot v-if="orderInquiry.allAssociatedFileId">
                                        <img src="@/assets/images/pdf.png" width="20" height="20">
                                        <a style="color:blue;cursor: pointer;"
                                           @click.stop.prevent="downloadPdf(orderInquiry)">
                                            <span>{{orderInquiry.referenceNo}}.pdf</span>
                                        </a>
                                    </slot>

                                </td>
                            </tr>

                            <tr class="child-table-total"
                                v-if="childrenShow[getItemLevelKey(orderInquiry)] &&tableModeName==='Nested Layout'">
                                <td :colspan="inquiryReports.head.length+3" class="padding-init table-cell"
                                    v-loading="itemLoading[getItemLevelKey(orderInquiry)]">
                                    <div class="child">
                                        <table class="child-table">
                                            <thead>

                                            <tr>
                                                <th v-if="getItemLeveLHead(getItemLevelKey(orderInquiry))"
                                                    class="cursor-point"></th>
                                                <th v-for="head in  getItemLeveLHead(getItemLevelKey(orderInquiry))"
                                                    :key="head">{{head}}
                                                </th>
                                            </tr>

                                            </thead>
                                            <tbody>
                                            <slot v-for="itemLevel in getItemLeveLData(getItemLevelKey(orderInquiry))"
                                                  name>
                                                <tr>
                                                    <td v-if="getItemLeveLData(getItemLevelKey(orderInquiry))"
                                                        class="cursor-point width-30"
                                                        @click.stop.prevent="showIDLevelAndCartonLevel(itemLevel, orderInquiry.facilityName)">
                                                        <i class="fas fa-chevron-right dz-icon "
                                                           v-if=" !childrenShow[getIdLevelKey(itemLevel)]"></i>
                                                        <i class="fas fa-chevron-down dz-icon"
                                                           v-if=" childrenShow[getIdLevelKey(itemLevel)]"></i>
                                                    </td>
                                                    <td v-for="head in getItemLeveLHead(getItemLevelKey(orderInquiry))"
                                                        :key="head">
                                                        {{itemLevel[head]}}
                                                    </td>
                                                </tr>
                                                <tr class="third-child-table"
                                                    v-if="childrenShow[getIdLevelKey(itemLevel)]">
                                                    <td :colspan="getLeveLHead(getItemLevelKey(orderInquiry)).length+1"
                                                        class="padding-init table-cell"
                                                        v-loading="itemLoading[getIdLevelKey(itemLevel)]">
                                                        <div class="child"
                                                             v-if=" getLeveLData(getIdLevelKey(itemLevel)) && getLeveLData(getIdLevelKey(itemLevel)).length >0 ">
                                                            <table class="child-table">
                                                                <thead>
                                                                <tr>
                                                                    <th class="download-icon">
                                                                        <i class="el-icon-loading"
                                                                           v-if="itemExcelLoadingObj[getIdLevelKey(itemLevel)]"></i>
                                                                        <a @click="downLoadIdLevelItemLevel(itemLevel, orderInquiry.facilityName)"
                                                                           v-if="!itemExcelLoadingObj[getIdLevelKey(itemLevel)]">
                                                                            <i class="el-icon-download"></i>
                                                                        </a>
                                                                    </th>
                                                                    <th v-for="head in getLeveLHead(getIdLevelKey(itemLevel))"
                                                                        :key="head">{{head}}
                                                                    </th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                <tr v-for="idLevel in getLeveLData(getIdLevelKey(itemLevel))">
                                                                    <td></td>
                                                                    <td v-for="head in getLeveLHead(getIdLevelKey(itemLevel))"
                                                                        :key="head">
                                                                        {{idLevel[head]}}
                                                                    </td>
                                                                </tr>
                                                                <tr v-if=" !getLeveLData(getIdLevelKey(itemLevel)) || getLeveLData(getIdLevelKey(itemLevel)).length === 0 ">
                                                                    <td></td>
                                                                    <td :colspan=" getLeveLData(getIdLevelKey(itemLevel)).length ? getLeveLData(getIdLevelKey(itemLevel)).length : getLeveLHead(getItemLevelKey(orderInquiry)).length+1"
                                                                        class="center">
                                                                        No Datas
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                            <simplified-pager
                                                                    v-if="setPageVisibility(getIdLevelKey(itemLevel))"
                                                                    :currentDate="itemLevel"
                                                                    :totalCount="getToTalCount(getIdLevelKey(itemLevel))"
                                                                    :customizePageSize="getPageSize(getIdLevelKey(itemLevel))"
                                                                    @reloadContent="searchIDLevelReportFromPager"></simplified-pager>
                                                        </div>
                                                    </td>

                                                </tr>
                                                <tr class="third-child-table"
                                                    v-if="childrenShow[getIdLevelKey(itemLevel)]">
                                                    <td :colspan="getLeveLHead(getItemLevelKey(orderInquiry)).length+1"
                                                        class="padding-init table-cell"
                                                        v-loading="itemLoading[getCartonLevelKey(itemLevel)]"
                                                        v-if="cartonCurrentPageDate[getCartonLevelKey(itemLevel)]&& cartonCurrentPageDate[getCartonLevelKey(itemLevel)].length>0 ">
                                                        <div class="child">
                                                            <table class="child-table">
                                                                <thead>
                                                                <tr>
                                                                    <th class="download-icon">
                                                                        <i class="el-icon-loading"
                                                                           v-if="itemExcelLoadingObj[getCartonLevelKey(itemLevel)]"></i>
                                                                        <a style="text-decoration: none"
                                                                           @click="downLoadCartonLevelItemLevel(itemLevel, orderInquiry.facilityName)"
                                                                           v-if="!itemExcelLoadingObj[getCartonLevelKey(itemLevel)]">
                                                                            <i class="el-icon-download"></i>
                                                                        </a>
                                                                    </th>
                                                                    <th v-for="head in getLeveLHead(getCartonLevelKey(itemLevel))"
                                                                        :key="head">{{head}}
                                                                    </th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                <tr v-for="cartonLevel in cartonCurrentPageDate[getCartonLevelKey(itemLevel)]">
                                                                    <td></td>
                                                                    <td v-for="head in getLeveLHead(getCartonLevelKey(itemLevel))"
                                                                        :key="head">
                                                                        {{cartonLevel[head]}}
                                                                    </td>
                                                                </tr>
                                                                <tr v-if="!cartonCurrentPageDate[getCartonLevelKey(itemLevel)]|| cartonCurrentPageDate[getCartonLevelKey(itemLevel)].length === 0 ">
                                                                    <td></td>
                                                                    <td :colspan="getLeveLHead(getCartonLevelKey(itemLevel)).length ? getLeveLHead(getCartonLevelKey(itemLevel)).length : getLeveLHead(getItemLevelKey(orderInquiry)).length+1"
                                                                        class="center">
                                                                        No Datas
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                            <simplified-pager
                                                                    v-if="setPageVisibility(getCartonLevelKey(itemLevel))"
                                                                    :currentDate="itemLevel"
                                                                    :totalCount="getToTalCount(getCartonLevelKey(itemLevel))"
                                                                    :customizePageSize="getPageSize(getCartonLevelKey(itemLevel))"
                                                                    @reloadContent="searchCartonLevelReportFromPager"></simplified-pager>
                                                        </div>
                                                    </td>

                                                </tr>
                                            </slot>
                                            </tbody>
                                        </table>

                                        <simplified-pager v-if="setPageVisibility(getItemLevelKey(orderInquiry))"
                                                          :keyId="getItemLevelKey(orderInquiry)"
                                                          :totalCount="getToTalCount(getItemLevelKey(orderInquiry))"
                                                          :customizePageSize="getPageSize(getItemLevelKey(orderInquiry))"
                                                          @reloadContent="searchItemLevelReportFromPager"></simplified-pager>

                                    </div>

                                </td>

                            </tr>
                        </slot>
                    </slot>
                    </tbody>
                </table>

                <pager :totalCount="searchResultPaging.totalCount" :customizePageSize="searchParam.paging.limit"
                       @reloadContent="triggerSearchFromPager"></pager>

            </div>
        </div>

            <pop-up-windows v-show="upload" :tlitle="'Upload Label'" :isSubmit="false" @cancel="emitCancel" :height="500">
                <div class="grid-100 tablet-grid-100 container">
                    <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label"> Document Type</label>
                        <div>
                            <el-select no-match-text="No Data" v-model="uploadParam.documentType" placeholder=" ">
                                <el-option v-for="documentType in documentTypes" :key="documentType" :label="documentType" :value="documentType">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25 " v-if="uploadParam.documentType.indexOf('Shipping Label') > -1">
                        <label class="input-label">Master Tracking No</label>
                        <input type="text" v-model="uploadParam.trackingNo">
                    </div>
                    <div class="grid-20 tablet-grid-25 " v-if="uploadParam.documentType.indexOf('Shipping Label') > -1">
                        <label class="input-label"> Tracking Nos</label>
                        <tags-input v-model="uploadParam.trackingNos" ></tags-input>
                    </div>
                    <!-- <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label"> File Type</label>
                        <div>
                            <el-select no-match-text="No Data" v-model="uploadParam.fileType" placeholder=" ">
                                <el-option v-for="fileType in fileTypes" :key="fileType" :label="fileType" :value="fileType">
                                </el-option>
                            </el-select>
                        </div>
                    </div> -->
                </div>
                <multiple-drag-and-drop :is-show="upload" v-model="fileIds" :height="150" @onUpload="onUploadLabel(fileIds)"
                    :accept="'image/jpeg,image/png,application/pdf'" :acceptTypeLimit="'image/jpeg,image/png,application/pdf'"
                    :unloadParam="uploadParam"
                    :uploadSucceedIsDeleteFileName="true">
                </multiple-drag-and-drop>
                <table class="table-client">
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Document Type</th>
                            <th>File Type</th>
                            <th>Created By</th>
                            <th>Created Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="orderFile in clientDocuments">
                            <td>
                                <a href="#" @click="downloadFile(orderFile)" style="text-decoration:none;">
                                    <span class="glyphicon glyphicon-file"></span>
                                    {{orderFile.fileName}}
                                </a>
                            </td>
                            <td>{{orderFile.documentType}}</td>
                            <td>{{orderFile.fileType}}</td>
                            <td>{{orderFile.createdBy}}</td>
                            <td>{{orderFile.createdWhen}}</td>
                            <td><a href="#" @click="deleteFileEntry(orderFile.id)"><b>Delete</b></a></td>
                        </tr>
                    </tbody>
                </table>
                <pager :totalCount="uploadPaging.totalCount" :customizePageSize="uploadParam.paging.limit"
                       @reloadContent="uploadLoadContent"></pager>
            </pop-up-windows>
<!-- batch upload label -->
            <pop-up-windows v-show="batchUpload" :tlitle="'Batch Upload Label'":isSubmit="false" @cancel="emitCancel" :height="500">
                <multiple-drag-and-drop :is-show="batchUpload" v-model="fileIds" :height="150" @onUpload="onBatchUploadLabel(fileIds)"
                    :accept="'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'"
                    :acceptTypeLimit="'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'"
                    :uploadSucceedIsDeleteFileName="true">
                </multiple-drag-and-drop>
                <table class="table-client">
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Order</th>
                            <th>Document Type</th>
                            <th>File Type</th>
                            <th>Created By</th>
                            <th>Created Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr  v-for="orderFile in clientDocuments">
                            <td>
                                <a href="#" @click="downloadFile(orderFile)"  style="text-decoration:none;">
                                    <span class="glyphicon glyphicon-file"></span>
                                    {{orderFile.fileName}}
                                </a>
                            </td>
                            <td>{{orderFile.docId}}</td>
                            <td>{{orderFile.documentType}}</td>
                            <td>{{orderFile.fileType}}</td>
                            <td>{{orderFile.createdBy}}</td>
                            <td>{{orderFile.createdWhen}}</td>
                            <td><a href="#" @click="deleteFileEntry(orderFile.id)"><b>Delete</b></a></td>
                        </tr>
                    </tbody>
                </table>
                <pager :totalCount="uploadPaging.totalCount" :customizePageSize="uploadParam.paging.limit"
                       @reloadContent="uploadLoadContent"></pager>
            </pop-up-windows>


    </div>

</template>
<style lang="scss" src="./order-update.scss"/>
