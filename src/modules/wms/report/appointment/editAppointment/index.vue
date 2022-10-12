<template>
    <div class="grid-100 tablet-grid-100">
        <div class="grid-100 tablet-grid-100 container">
            <span class="component-title bold">
                {{`${isNew ? 'New' : 'Edit'} ${appointmentType} Appointment`}}</span>
        </div>
        <div class="grid-100 tablet-grid-100 container">
            <div class="grid-20 tablet-grid-20">
                <label class="input-label">Appointment</label>
                <date-picker 
                    v-model="appointment.appointmentTime" 
                    type="datetime" 
                    format="YYYY-MM-DDTHH:mm:ss"
                    value-type="format"
                    placeholder="Select AppointmentTime">
                </date-picker>
            </div>
        </div>
        <div class="grid-100 tablet-grid-100 container">
            <div class="grid-20 tablet-grid-20">
                <label class="input-label">SCAC</label>
                <div>
                    <input type="text" v-model="appointment.scac" :placeholder="'Enter SCAC'"/>
                </div>
            </div>
            <div class="grid-20 tablet-grid-20">
                <label class="input-label">Contacts</label>
                <div>
                    <input type="text" v-model="appointment.contacts" :placeholder="'Enter Contacts'"/>
                </div>
            </div>
            <div class="grid-20 tablet-grid-20">
                <label class="input-label">Phone</label>
                <div>
                    <input type="text" v-model="appointment.phone" :placeholder="'Enter Phone'"/>
                </div>
            </div>
            <div class="grid-20 tablet-grid-20">
                <label class="input-label">License Plate</label>
                <div>
                    <input type="text" v-model="appointment.licensePlate" :placeholder="'Enter License Plate'"/>
                </div>
            </div>
            <div class="grid-20 tablet-grid-20">
                <label class="input-label">Driver License</label>
                <div>
                    <input type="text" v-model="appointment.driverLicense" :placeholder="'Enter Driver License'"/>
                </div>
            </div>
        </div>
        <div class="grid-100 tablet-grid-100 container">
            <div class="grid-20 tablet-grid-20">
                <label class="input-label">Driver Name</label>
                <div>
                    <input type="text" v-model="appointment.driverName" :placeholder="'Enter Driver Name'"/>
                </div>
            </div>
        </div>
        <div class="d-flex mt-3 mb-3">
            <div class="unis-steps current ">
                <span>3</span>Item List
            </div>
        </div>
        <el-row class="margin-bottom-15">
            <el-col :span="2" :offset="20">
                <waitting-btn 
                    btn-class="unis-btn unis-btn-primary h-40-p"
                    @click="add" 
                    :value="`Add ${appointment.entryType}`"
                    :is-loading="loading" 
                    :disabled="loading"> 
                </waitting-btn>
            </el-col>
        </el-row>
         <div class="grid-100 tablet-grid-100" v-loading="loading">
            <table class="table-client" v-fixed-head>
                <thead>
                    <tr>
                        <th v-for="(head, index) in selectedView.head" :key="index">
                            {{head}}
                        </th>
                    </tr>
                </thead>
                <tbody v-for="(load, index) in selectedView.body" :key="index">
                    <tr>
                        <td v-for="(item, index) in selectedView.head" :key="index">
                            <span>
                                {{load[selectedView.headMap[item]]}}
                            </span>
                            <template v-if="item === 'Actions'" v-permission-check="'facility::appointmentMake_write'">
                                    <a href="#" @click="remove(load.id)">
                                        <b>Remove</b>
                                    </a>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
            <pager 
                :totalCount="selectedList.length" 
                :currentPage="paging.pageNo"
                :customizePageSize="paging.pageSize" 
                @reloadContent="reloadContent">
            </pager>
        </div>
        <el-row :gutter="2" class="margin-top-15">
            <el-col :span="2" :offset="20">
                <waitting-btn 
                    btn-class="unis-btn unis-btn-primary h-40-p"
                    @click="save" 
                    :value="submitLabel"
                    :is-loading="loading" 
                    :disabled="loading"> 
                </waitting-btn>
            </el-col>
            <el-col :span="2">
                <waitting-btn 
                    btn-class="unis-btn unis-btn-primary h-40-p"
                    @click="cancel" 
                    :value="'Cancel'"
                    :is-loading="loading" 
                    :disabled="loading"> 
                </waitting-btn>
            </el-col>
        </el-row>
        <load-receipt-list
            ref="loadReceiptList"
            :entryType="appointment.entryType"
             v-bind:isShow.sync="loadReceiptListShow"
             :selectedRecordIds="appointment.documentNos"
            @getSelectedRecords="getSelectedRecords"
        >
        </load-receipt-list>
    </div>
</template>
<style lang="scss" scoped>
</style>