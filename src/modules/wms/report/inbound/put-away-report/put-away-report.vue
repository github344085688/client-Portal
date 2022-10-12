<template>
    <div class="put-away-report">

        <div class="grid-100 tablet-grid-100">

            <div class="grid-100 tablet-grid-100 container">
                <span class="component-title bold">Put Away Report </span>
            </div>
            <div class="grid-100 tablet-grid-100 container margin-top-50 ">
                <div class="tablet-grid-20 date-grid-20 container">
                    <label class="input-label">Receiving Date</label>
                    <date-range @selectDateRange="onSelectCreateDateRange"
                                :default-time-from="searchParam.receivingDateFrom"
                                :default-time-to="searchParam.receivingDateTo"></date-range>
                </div>
                <div class="tablet-grid-20 date-grid-20 container">
                    <label class="input-label">Putaway Date</label>
                    <date-range @selectDateRange="onSelectAppointmentDateRange"
                                :default-time-from="searchParam.putawayDateFrom"
                                :default-time-to="searchParam.putawayDateTo">
                    </date-range>
                </div>
                <div class="tablet-grid-20 date-grid-20 container">
                    <label class="input-label">RN Import Date</label>
                    <date-range @selectDateRange="onSelectInYardDateRange"
                                :default-time-from="searchParam.receiptImportDateFrom"
                                :default-time-to="searchParam.receiptImportDateTo"></date-range>
                </div>

            </div>
            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-20 tablet-grid-20">
                    <predefined-customer-select v-model="searchParam.customerId" @change="onselectCustomerChange">
                    </predefined-customer-select>
                </div>
                <div class="grid-20 tablet-grid-20 ">
                    <facility-select v-model="searchParam.facility" :customerId="searchParam.customerId"
                                     :isShowFacilityAll="true"
                                     @change="onSelectFacilityChange"></facility-select>
                </div>
                <div class="grid-20 tablet-grid-20">
                    <label class="input-label">Receipt ID </label>
                    <div>
                        <input type="text" v-model="searchParam.receiptId" :placeholder="'Enter width'"/>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-20">
                    <label class="input-label">Receipt Status</label>
                    <div>
                        <el-select no-match-text="No Data" v-model="searchParam.status"  :clearable="true" placeholder="Select" >
                            <el-option v-for="status in receiptStatus" :key="status" :label="status" :value="status">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-20">
                    <label class="input-label">Entry ID </label>
                    <div>
                        <input type="text" v-model="searchParam.entryId" :placeholder="'Enter entry id'"/>
                    </div>
                </div>
            </div>

            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-20 tablet-grid-20">
                    <label class="input-label">Item</label>
                    <div>
                        <item-auto-complete :placeholder="'Input to search item'" v-model="searchParam.itemSpecId"
                                            :clearable="true" :customerId="searchParam.customerId"
                                            :name="'itemSpecId'"

                        >
                            <!--@change="onSelectItem"-->
                        </item-auto-complete>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25">
                    <label class="input-label"> Report Type</label>
                    <div>
                        <el-select type="danger" no-match-text="No Data" v-model="searchParam.reportType" :clearable="true"
                                   placeholder="Select">
                            <el-option v-for="receive in ['Operation Report', 'Default']" :key="receive"
                                       :label="receive"
                                       :value="receive">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25">
                    <label class="input-label">Receipt Task Status</label>
                    <div>
                        <el-select type="danger" no-match-text="No Data" v-model="searchParam.receiptTaskStatus" :clearable="true"
                                   placeholder="Select">
                            <el-option
                                    v-for="receive in ['New', 'In Progress', 'On Hold', 'Exception', 'Closed', 'Force Closed', 'Cancelled']"
                                    :key="receive" :label="receive"
                                    :value="receive">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25">
                    <label class="input-label">Putaway Task Status</label>
                    <div>
                        <el-select type="danger" no-match-text="No Data" v-model="searchParam.putawayTaskStatus" :clearable="true"
                                   placeholder="Select">
                            <el-option
                                    v-for="receive in ['New', 'In Progress', 'On Hold', 'Exception', 'Closed', 'Force Closed', 'Cancelled']"
                                    :key="receive" :label="receive"
                                    :value="receive">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-20">
                    <label class="input-label">Receipt TaskId </label>
                    <div>
                        <fill-input v-model="searchParam.receiptTaskId" :fill="'TASK-'" :placeholder="'Enter Receipt TaskId'">   </fill-input>
                    </div>
                </div>
            </div>

            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-20 tablet-grid-20">
                    <label class="input-label">Putaway Task</label>
                    <div>
                        <fill-input v-model="searchParam.putawayTaskId" :fill="'TASK-'" :placeholder="'Enter Receipt TaskId'">   </fill-input>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-20">
                    <label class="input-label">Reference</label>
                    <div>
                        <input type="text" v-model="searchParam.referenceNo" :placeholder="'Enter Reference'"/>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-20">
                    <label class="input-label">Purchase Order No.</label>
                    <div>
                        <input type="text" v-model="searchParam.poNo" :placeholder="'Enter Purchase Order No'"/>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-20">
                    <label class="input-label">BOL</label>
                    <div>
                        <input type="text" v-model="searchParam.bolNo" :placeholder="'Enter Bol'"/>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25">
                    <label class="input-label">Pending Putaway</label>
                    <div>
                        <el-select type="danger" no-match-text="No Data" v-model="searchParam.pendingPutaway" :clearable="true"
                                   placeholder="Select">
                            <el-option v-for="receive in ['Yes', 'No']" :key="receive" :label="receive"
                                       :value="receive">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>


            <div class="d-flex justify-content-end">


                    <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" class="mr-4" @click="exportExcel"
                                  :value="'Export To Excel'" :is-loading="exportLoading"></waitting-btn>

                    <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p"  @click="searchReport"
                                  :value="'Search'"
                                  :is-loading="loading"></waitting-btn>
            </div>
        </div>

        <div class="grid-100 tablet-grid-100" v-loading="loading">
            <table class="table-client" v-fixed-head>
                <thead>

                <tr>
                    <th v-for="head in putAwayReport.head" :key="head">

                        {{head}}
                    </th>
                </tr>

                </thead>
                <tbody v-for="report in putAwayReport.data" :key="report.id">

                <tr>
                    <td v-for="head in putAwayReport.head" :key="head">
                        {{report[head]}}
                    </td>

                </tr>


                </tbody>
            </table>
            <pager :totalCount="searchResultPaging.totalCount" :currentPage="searchParam.paging.pageNo"
                   :customizePageSize="searchParam.paging.pageSize" @reloadContent="triggerSearchFromPager"></pager>

        </div>
    </div>
</template>

<style lang="scss" src="./put-away-report.scss"/>
