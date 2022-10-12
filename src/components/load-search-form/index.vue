<template>
    <div class="loadSearchForm">
        <div v-show="!isAdvanced">
            <el-row>
                <el-col :span="12">
                    <div>
                        <input type="text" v-model="searchParams.keyword" :placeholder="'ID /Load# /MasterBol#'"/>
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
                    <label class="input-label">Load ID</label>
                    <div>
                        <tags-input v-model="searchParams.loadIds" :fill="'LOAD-'" :placeholder="'Enter Load ID'"></tags-input>
                    </div>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">Load NO</label>
                    <div>
                        <tags-input v-model="searchParams.loadNos" :placeholder="'Enter Load NO'"></tags-input>
                    </div>
                </el-col>
                <el-col :span="6">
                    <predefined-customer-select v-model="searchParams.customerIds" @change="onselectCustomerChange">
                    </predefined-customer-select>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">Load Type</label>
                    <el-select 
                        v-model="searchParams.type"
                        clearable
                        placeholder="Select Load Type">
                        <el-option
                            v-for="(item, index) in typeList"
                            :key="index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <label class="input-label">Order ID</label>
                    <div>
                        <tags-input v-model="searchParams.orderId" :fill="'DN-'" :placeholder="'Enter Order ID'"></tags-input>
                    </div>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">MBOL</label>
                    <div>
                        <tags-input v-model="searchParams.masterBolNos" :placeholder="'Enter master Bol Nos.'"></tags-input>
                    </div>
                </el-col>
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
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <label class="input-label">Carrier</label>
                    <multiple-organization-auto-complete v-model="searchParams.carrierId" :customerId="searchParams.customerIds" tag="Carrier" >
                    </multiple-organization-auto-complete>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">Trailer</label>
                    <div>
                        <input type="text" v-model="searchParams.trailer" :placeholder="'Enter trailer'"/>
                    </div>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">Container</label>
                    <div>
                        <input type="text" v-model="searchParams.containerNO" :placeholder="'Enter Container'"/>
                    </div>
                </el-col>
                <el-col :span="6">
                    <label class="input-label">BOL Nos</label>
                    <div>
                        <tags-input v-model="searchParams.bolNos" :placeholder="'Enter master bolNos'"></tags-input>
                    </div>
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