<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="4">
                <el-row>
                    <predefined-customer-select 
                        v-model="searchParams.customerId" 
                        @change="loadAppointmentList(1)">
                    </predefined-customer-select>
                </el-row>
                <el-row>
                    <facility-select 
                        v-model="searchParams.facility" 
                        :customerId="searchParams.customerId" 
                        :isShowFacilityAll="true"
                        @change="loadAppointmentList(1)">
                    </facility-select>
                </el-row>
                <el-row>
                    <date-picker 
                        v-model="appointmentDate"
                        :inline="datePickOptions.inline"
                        @change="handleClick">
                    </date-picker>
                </el-row>
            </el-col>
            <el-col :span="17" :offset="3">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="Total" name="total">
                        <el-row :gutter="12">
                            <el-col :span="4" v-for="(item, index) in appointmentHours" :key="index">
                                <el-badge :value="isTimeAvailable(index, item) ? '+': ''" type="info" class="add" @click.stop.native="addAppointment(index)">
                                    <el-card shadow="hover" class="card" @click.stop.native="clickTimeBlock(index, item)" :class="{ blue: isTimeAvailable(index, item) }">
                                        <el-row>{{item.hour}}:00</el-row>
                                        <el-row>
                                            <el-badge :value="`${item.available}/${item.total}`" type="info"></el-badge>
                                        </el-row>
                                    </el-card>
                                </el-badge>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="Inbound" name="Inbound">
                        <el-row :gutter="12">
                            <el-col :span="4" v-for="(item, index) in appointmentHours" :key="index">
                                <el-badge :value="isTimeAvailable(index, item) ? '+': ''" type="info" class="add" @click.stop.native="addAppointment(index)">
                                    <el-card shadow="hover" class="card" @click.stop.native="clickTimeBlock(index, item)" :class="{ blue: isTimeAvailable(index, item) }">
                                        <el-row>{{item.hour}}:00</el-row>
                                        <el-row>
                                            <el-badge :value="`${item.available}/${item.total}`" type="info"></el-badge>
                                        </el-row>
                                    </el-card>
                                </el-badge>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="Outbound" name="Outbound">
                        <el-row :gutter="12">
                            <el-col :span="4" v-for="(item, index) in appointmentHours" :key="index">
                                <el-badge :value="isTimeAvailable(index, item) ? '+': ''" type="info" class="add" @click.stop.native="addAppointment(index)">
                                    <el-card shadow="hover" class="card" @click.stop.native="clickTimeBlock(index, item)" :class="{ blue: isTimeAvailable(index, item) }">
                                        <el-row>{{item.hour}}:00</el-row>
                                        <el-row>
                                            <el-badge :value="`${item.available}/${item.total}`" type="info"></el-badge>
                                        </el-row>
                                    </el-card>
                                </el-badge>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
        <el-row v-loading="loading">
            <table class="table-client" v-fixed-head>
                <thead>
                    <tr>
                        <th v-for="(head, index) in appointmentView.head" :key="index">
                            {{head}}
                        </th>
                    </tr>
                </thead>
                <tbody v-for="(appointment, $index) in appointmentView.body" :key="$index">
                    <tr>
                        <td v-for="(item, index) in appointmentView.head" :key="index">
                            <span>
                                {{appointment[appointmentView.headMap[item]]}}
                            </span>
                            <template v-if="appointment.status==='Active' && item === 'Actions'" v-permission-check="'facility::appointmentMake_write'">
                                <a href="#" @click="editAppointment(appointment)">
                                    <b>Edit</b>
                                </a>
                                |
                                <a href="#" @click="removeAppointment(appointment.id, $index)">
                                    <b>Cancel</b>
                                </a>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
            <pager 
                :totalCount="appointmentList.length" 
                :currentPage="paging.pageNo"
                :customizePageSize="paging.pageSize" 
                @reloadContent="reloadContent">
            </pager>
        </el-row>
    </div>
</template>
<style scoped lang="scss">
    .card{
        text-align: center;
    }
    /deep/ .el-card{
        margin-bottom: 5px;
        .el-card__body{
            padding: 5px!important;
        }
    }
    .el-row {
        margin-bottom: 5px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .blue {
        background-color: #00a6e8;
        color: #fff;
    }
    .add {
        top: 5px;
        right: 15px;
        cursor: pointer;
        display: block;
    }
    /deep/ .el-tabs__content {
        padding-left: 15px;
    }
</style>