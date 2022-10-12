<template>
    <div class="marketplace">
        <div class="grid-100 tablet-grid-100 ">
            <div class="grid-100 tablet-grid-100 container">
                <span class="component-title bold">Marketplace</span>
            </div>
            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-20 tablet-grid-25">
                    <predefined-customer-select v-model="searchParam.customerId" @change="onselectCustomerChange">
                    </predefined-customer-select>
                </div>
                <div class="grid-20 tablet-grid-20">
                    <label class="input-label">Keyword</label>
                    <item-auto-complete 
                        :placeholder="'Enter SKU'" 
                        v-model="searchParam.itemSpecId"
                        :customerId="searchParam.customerId"
                        :clearable="true"
                        :name="'itemSpecId'">
                    </item-auto-complete>
                </div>
            </div>
        </div>
        <el-row :gutter="2" class="margin-top-15">
            <el-col :span="2" :offset="18">
                <waitting-btn
                    class="mr-4"
                    btn-class="unis-btn unis-btn-primary h-40-p"
                    value="updateList"
                    @click="showPopUpWindows"
                    :is-loading="updateListLoading">
                </waitting-btn>
            </el-col>
        </el-row>
        <el-row :gutter="2" class="margin-top-15">
            <el-col :span="2" :offset="18">
                <waitting-btn
                    class="mr-4"
                    btn-class="unis-btn unis-btn-primary h-40-p"
                    value="Export To Excel"
                    @click="exportToExcel"
                    :is-loading="exportLoading">
                </waitting-btn>
            </el-col>
            <el-col :span="2" :offset="2">
                <waitting-btn
                    class="mr-4"
                    btn-class="unis-btn unis-btn-primary h-40-p"
                    value="Search"
                    @click="searchList(1)"
                    :is-loading="searchListLoading">
                </waitting-btn>
            </el-col>
        </el-row>
        <el-row v-loading="searchListLoading">
            <table class="table-client" v-fixed-head>
                <thead>
                    <tr>
                        <th v-for="(head, index) in viewList.head" :key="index">
                            {{head}}
                        </th>
                    </tr>
                </thead>
                <tbody v-for="(item, $index) in viewList.data" :key="$index">
                    <tr>
                        <td v-for="(head, index) in viewList.head" :key="index">
                            <span>
                                {{item[head]}}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <pager
                :totalCount="list.length" 
                :currentPage="paging.currentPage"
                :customizePageSize="paging.pageSize" 
                @reloadContent="reloadContent">
            </pager>
        </el-row>
        <update-list-windows ref="updateListWindows"
            v-bind:isShow.sync="updateListWindowsIsShow"
            @updateData="updateList"
            :key="updateListWindowsIndex"
        >
        </update-list-windows>
    </div>
</template>