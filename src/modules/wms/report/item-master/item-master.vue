<template>
    <div class="item-master">

        <div class="grid-100 tablet-grid-100">

            <div class="grid-100 tablet-grid-100 container">
                <span class="component-title bold">Item Master</span>
            </div>

            <div class="grid-100 tablet-grid-100">
                <div class="grid-20 tablet-grid-25 ">
                    <predefined-customer-select v-model="searchParam.customerId" >
                    </predefined-customer-select>
                </div>
                <div class="grid-40 tablet-grid-25 " style="padding-left: 15px;">
                    <label class="input-label">Keyword </label>
                    <div>
                        <input type="text"v-model="searchParam.keyword" placeholder="Item ID / UPC Code / AKA ">
                    </div>
                </div>


                <div class="grid-20 tablet-grid-25 ">
                    <label class="input-label">Status </label>
                    <div>
                        <el-select  no-match-text="No Data" multiple no-data-text="No Data" v-model="searchParam.statuses" placeholder="Select">
                            <el-option v-for="statuse in ['Active', 'Inactive', 'Discontinue']" :key="statuse" :label="statuse"
                                       :value="statuse">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div class="grid-20 tablet-grid-25">
                    <label class="input-label">Item Group</label>
                    <div>
                        <multiple-item-group-complete v-model="searchParam.groupIds" :customerId="searchParam.customerId"
                                                             :clearable="true" tag="ItemGroup">
                        </multiple-item-group-complete>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100">
                    <div class="grid-20 tablet-grid-15" style="padding-left: 1px">
                        <label class="input-label">Supplier</label>
                        <div>
                            <multiple-organization-auto-complete v-model="searchParam.supplierIds" :customerId="searchParam.customerId"
                                                        :clearable="true" tag="Supplier">
                            </multiple-organization-auto-complete>
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25">
                        <label class="input-label">Title</label>
                        <div>
                            <multiple-organization-auto-complete v-model="searchParam.titleIds" :customerId="searchParam.customerId"
                                                                 :clearable="true" tag="Title">
                            </multiple-organization-auto-complete>
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label">Name</label>
                        <div >
                            <input type="text" :placeholder="''"
                                   v-model="searchParam.eqName"
                                   :name="'eqName'"
                            />
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label">Tag </label>
                        <div>
                            <el-select multiple no-match-text="No Data"  no-data-text="No Data" v-model="searchParam.tags" placeholder="Select">
                                <el-option v-for="tag in  ['Product', 'Material']" :key="tag" :label="tag"
                                           :value="tag">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>

                <div class="grid-100 tablet-grid-100">
                    <div class="grid-20 tablet-grid-25 " style="margin-top: 20px">
                        <label class="input-label">Require Collect Seasonal Pack </label>
                        <switch-button v-model="searchParam.requireCollectSeasonalPack"></switch-button>
                    </div>
                    <div class="grid-20 tablet-grid-25 " style="margin-top: 20px">
                        <label class="input-label">Require Case UPC Approval</label>
                        <switch-button v-model="searchParam.hasItemUpcCodeCollect"></switch-button>
                    </div>
                    <div class="grid-20 tablet-grid-25 " style="margin-top: 20px">
                        <label class="input-label">Including Disabled UOM</label>
                        <switch-button v-model="searchParam.includingDisabledUOM"></switch-button>
                    </div>
                </div>
            </div>

            <div class="d-flex margin-top-15 justify-content-end mb-4">
                <div class="mr-4">
                    <span>Export To Email: </span>
                    <input type="text" :placeholder="''" v-model="exportEmail" name="exportEmail" style="width: 200px;height: 30px;
                                        min-height: 30px !important;" />

                </div>
                <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" class="mr-4" @click="exportExcel"
                              :value="'Export To Excel'" :is-loading="exportLoading"> </waitting-btn>
                <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p"  @click="searchItemMasters" :value="'Search'"  :is-loading="loading"> </waitting-btn>
            </div>
        </div>

        <div class="grid-100 tablet-grid-100" v-loading="loading">
            <table class="table-client" v-fixed-head>
                <thead>

                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Tags</th>
                    <th>Status</th>
                    <th>Customer</th>
                    <!--<th>Title</th>-->
                    <th>Supplier</th>
                    <th>Billing Grade</th>
                    <th>Grade</th>
                    <th>Item Group</th>
                    <th>Has Serial Number</th>
                    <th>UPC</th>
                    <th>Stack</th>
                    <th>Bundle</th>
                </tr>

                </thead>
                <tbody >
               <tr  v-for="item in itemMasters" :key="item.id">
                    <td>
                        {{item.id}}
                    </td>
                    <td>
                        {{item.itemDisplayName}}
                    </td>
                    <td>{{item.desc}}</td>
                    <td><span v-for="tag in item.tags" style="margin: 5px;">
                            {{tag}}&nbsp;
                        </span></td>
                    <td>{{item.status}}</td>
                    <td>{{item.customer.name}}</td>
                    <!--<td><span v-for="title in item.titleInfos">-->
                            <!--{{title.name}}&nbsp;-->
                        <!--</span>-->
                    <!--</td>-->
                    <td><span v-for="supplier in item.supplierInfos" style=" display: inline-block; border-radius: 4px; padding:5px 2px; margin: 3px 5px 0 0 ;  background: #faf9de">
                            {{supplier.name}}&nbsp;
                        </span>
                    </td>
                    <td>{{item.billingGrade}}</td>
                    <td>{{item.grade}}</td>
                    <td>{{item.itemGroupName}}</td>
                    <td>{{item.hasSerialNumber ? 'Yes' : 'No'}}</td>
                    <td>{{item.upcCode}}</td>
                    <td>{{item.stack}}</td>
                    <td>{{item.bundle ? 'Yes' : 'No'}}</td>
                </tr>


                </tbody>
            </table>
            <pager :totalCount="searchParam.paging.totalCount" :currentPage="searchParam.paging.pageNo"
                   :customizePageSize="searchParam.paging.pageSize" @reloadContent="triggerSearchFromPager"></pager>
        </div>
    </div>
</template>
<style lang="scss" src="./item-master.scss" />
