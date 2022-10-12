<template>
    <div class="loadSearchForm">
        <div v-show="!isAdvanced">
            <el-row>
                <el-col :span="12">
                    <div>
                        <input type="text" v-model="searchParams.keyword" placeholder="ID /Bol# /PO# /Container# /reference# /seal#"/>
                    </div>
                </el-col>
                <el-col :span="2">
                    <waitting-btn 
                        btn-class="unis-btn unis-btn-primary h-40-p"
                        @click="_searchLoads" 
                        value="SEARCH"
                        btn-type="button"
                        :is-loading="loading"> 
                    </waitting-btn>
                </el-col>
                <el-col :span="2">
                    <waitting-btn
                        v-if="showExport"
                        btn-class="unis-btn unis-btn-primary h-40-p"
                        @click="_exportReceipt" 
                        value="Export"
                        btn-type="button"
                        :is-loading="loading"> 
                    </waitting-btn>
                </el-col>
            </el-row>
        </div>
        <el-row>
            <el-col :span="4">
                <a href="#" @click="isAdvanced = !isAdvanced" class="searchKey">
                    <span v-show="!isAdvanced">Advanced</span>
                    <span v-show="isAdvanced">Keyword</span> Search
                </a>
            </el-col>
        </el-row>
        <div v-show="isAdvanced">
            <el-row :gutter="20">
                <el-col :span="6">
                    <label class="input-label">Receipt ID</label>
                    <div>
                        <tags-input v-model="searchParams.receiptIds" fill="RN-" placeholder="Enter Receipt ID"></tags-input>
                    </div>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">Entry ID</label>
                    <div>
                        <input type="text" v-model="searchParams.entryId" placeholder="Enter Entry ID" v-inputAutoFill="'ET-'"/>
                    </div>
                </el-col>
                <el-col :span="6">
                    <predefined-customer-select v-model="searchParams.customerIds" @change="onselectCustomerChange" ref="customer">
                    </predefined-customer-select>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <label class="input-label">Title</label>
                    <multiple-organization-auto-complete v-model="searchParams.titleIds" :customerId="searchParams.customerIds" tag="Title" >
                    </multiple-organization-auto-complete>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">Carrier</label>
                    <multiple-organization-auto-complete v-model="searchParams.carrierId" :customerId="searchParams.customerIds" tag="Carrier" >
                    </multiple-organization-auto-complete>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">Container</label>
                    <div>
                        <tags-input v-model="searchParams.containerNos" placeholder="Enter Container"></tags-input>
                    </div>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">Item</label>
                    <div>
                        <item-auto-complete 
                            placeholder="Input to search item" 
                            v-model="searchParams.itemSpecId"
                            :clearable="true" 
                            :customerId="searchParams.customerIds"
                            name="itemSpecId">
                        </item-auto-complete>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <label class="input-label">Appointment Time From</label>
                    <date-picker 
                        v-model="searchParams.appointmentTimeFrom" 
                        type="datetime" 
                        format="YYYY-MM-DD HH:mm"
                        value-type="YYYY-MM-DDTHH:mm"
                        placeholder="Select AppointmentTime">
                    </date-picker>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">Appointment Time To</label>
                    <date-picker 
                        v-model="searchParams.appointmentTimeTo" 
                        type="datetime" 
                        format="YYYY-MM-DD HH:mm"
                        value-type="YYYY-MM-DDTHH:mm"
                        placeholder="Select AppointmentTime">
                    </date-picker>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">ETA From</label>
                    <date-picker 
                        v-model="searchParams.etaFrom" 
                        type="datetime" 
                        format="YYYY-MM-DD HH:mm"
                        value-type="YYYY-MM-DDTHH:mm"
                        placeholder="Select ETA From">
                    </date-picker>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">ETA To</label>
                    <date-picker 
                        v-model="searchParams.etaTo" 
                        type="datetime" 
                        format="YYYY-MM-DD HH:mm"
                        value-type="YYYY-MM-DDTHH:mm"
                        placeholder="Select ETA To">
                    </date-picker>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <label class="input-label">Reference</label>
                    <div>
                        <tags-input v-model="searchParams.referenceNos" placeholder="Enter Reference"></tags-input>
                    </div>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">PO</label>
                    <div>
                        <tags-input v-model="searchParams.poNos" placeholder="Enter PO"></tags-input>
                    </div>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">BOL</label>
                    <div>
                        <tags-input v-model="searchParams.bolNos" placeholder="Enter BOL"></tags-input>
                    </div>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">Seal</label>
                    <div>
                        <tags-input v-model="searchParams.sealNos" placeholder="Enter Seal"></tags-input>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <label class="input-label">SN List</label>
                    <div>
                        <tags-input v-model="searchParams.snList" placeholder="Enter SN List"></tags-input>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <label class="input-label">Date Created From</label>
                    <date-picker 
                        v-model="searchParams.createdWhenFrom" 
                        type="datetime" 
                        format="YYYY-MM-DD HH:mm"
                        value-type="YYYY-MM-DDTHH:mm"
                        placeholder="Select Date Created From">
                    </date-picker>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">Date Created To</label>
                    <date-picker 
                        v-model="searchParams.createdWhenTo" 
                        type="datetime" 
                        format="YYYY-MM-DD HH:mm"
                        value-type="YYYY-MM-DDTHH:mm"
                        placeholder="Select Date Created To">
                    </date-picker>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">Devanned Date From</label>
                    <date-picker 
                        v-model="searchParams.devannedTimeFrom" 
                        type="datetime" 
                        format="YYYY-MM-DD HH:mm"
                        value-type="YYYY-MM-DDTHH:mm"
                        placeholder="Select Devanned Date From">
                    </date-picker>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">Devanned Date To</label>
                    <date-picker 
                        v-model="searchParams.devannedTimeTo" 
                        type="datetime" 
                        format="YYYY-MM-DD HH:mm"
                        value-type="YYYY-MM-DDTHH:mm"
                        placeholder="Select Devanned Date To">
                    </date-picker>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <label class="input-label">Created By</label>
                    <el-select 
                        v-model="searchParams.createdBy"
                        clearable
                        filterable
                        remote
                        :remote-method="getUsers"
                        placeholder="Select Created By">
                        <el-option
                            v-for="(item, index) in users"
                            :key="index"
                            :label="getUserName(item)"
                            :value="item.username">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">Sort By</label>
                    <el-select 
                        v-model="searchParams.expirationDate"
                        clearable
                        placeholder="Select Sort By">
                        <el-option
                            v-for="(item, index) in sorts"
                            :key="index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">Receipt Type</label>
                    <el-select 
                        v-model="searchParams.receiptType"
                        clearable
                        placeholder="Select Receipt Type">
                        <el-option
                            v-for="(item, index) in receiptTypes"
                            :key="index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">Dynamic Keyword</label>
                    <div>
                        <input type="text" v-model="searchParams.dynamicKeyword" :placeholder="'Enter Dynamic Keyword'"/>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <label class="input-label">Sub Receipt Type</label>
                    <el-select 
                        v-model="searchParams.subReceiptType"
                        clearable
                        placeholder="Select Sub Receipt Type">
                        <el-option
                            v-for="(item, index) in subReceiptTypes"
                            :key="index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">Carton No.</label>
                    <tags-input v-model="searchParams.cartonNos" placeholder="Enter carton No"></tags-input>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="2">
                    <waitting-btn 
                        btn-class="unis-btn unis-btn-primary h-40-p"
                        @click="_searchLoads" 
                        value="SEARCH"
                        btn-type="button"
                        :is-loading="loading">
                    </waitting-btn>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .loadSearchForm {
        margin: 0 10px 10px 10px;
        .searchKey {
            color: #00a6e8;
            display: block;
            margin: 10px 0;
        }
    }
    .el-row {
        margin-bottom: 20px;
        &:last-child {
        margin-bottom: 0;
        }
    }
</style>