<template>
    <div class="shipment-activity">

        <div class="grid-100 tablet-grid-100">

            <div class="grid-100 tablet-grid-100 container">
                <span class="component-title bold">Shipment Activity </span>
            </div>
            <div class="grid-100 tablet-grid-100 container margin-top-50 ">

                <div class="tablet-grid-25 container date-grid-20" >
                    <date-range @selectDateRange="onSelectShippedDateRange" :defaultTimeFrom="defaultTimeFrom" :defaultTimeTo="defaultTimeTo" :disabled="loading" > </date-range>
                </div>
            </div>

            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-25 tablet-grid-25 container search-by">
                    <label class="input-label">Search By</label>
                    <div>
                        <location-auto-complete v-model="searchParams.searchBy" :placeholder="'Shipper / Consignee / PO / Load / PRO / Ref. / CNTR / Addresss'" @change="onLocationSelectChange"  :clearable="true" :customerId="customerId" :disabled="loading">
                        </location-auto-complete>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Shipment Type</label>
                    <div>
                         <el-select no-match-text="No Data" v-model="searchParams.shipmentType" placeholder="All" @change="onSelectDropdownList" :disabled="loading">
                            <el-option v-for="st in shipmentType" :key="st.value" :label="st.name" :value="st.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Status</label>
                    <div>
                        <el-select no-match-text="No Data" v-model="searchParams.status" placeholder="All" @change="onSelectDropdownList" :disabled="loading">
                            <el-option v-for="s in status" :key="s.value" :label="s.name" :value="s.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                 <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Freight Term</label>
                    <div>
                        <el-select no-match-text="No Data" v-model="searchParams.freightTerm" placeholder="All" @change="onSelectDropdownList" :disabled="loading">
                            <el-option v-for="ft in freightTerm" :key="ft.value" :label="ft.name" :value="ft.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>

            <div class="grid-100 tablet-grid-100 container margin-top-50">

                <div class="grid-50 tablet-grid-50 container  ">
                    <static-customize-table :tableFileds="tableHeader" :disabled="loading" @selectCustomizeTable="onSelectCustomizeTable"></static-customize-table>
                </div>
                <div class="grid-50 tablet-grid-50 container">
                    <waitting-btn btn-class="unis-btn unis-btn-primary color-white" class="right" @click="exportExcel" :value="'Export'" :is-loading="exportLoading" :disabled="loading"> </waitting-btn>
                </div>
            </div>

            <div class="grid-100 tablet-grid-100" v-loading="loading">
                <table class="table-client">
                    <thead>
                        <tr>
                            <template v-for="head in tableHeader">
                                <th v-if="head.checked == 1" :key="head.fieldId">{{head.fieldName}}</th>
                            </template>
                        </tr>
                    </thead>
                    <tbody v-for="(item,index) in data" :key="item.id">
                        <tr class="child-table-total" >
                            <template v-for="head in tableHeader">
                                <td v-if="head.checked == 1 && head.fieldName == 'PRO#'" :key="head.fieldId">
                                    <router-link tag="a" class="fa delete-text-decoration link-btn" target="_blank" :to="{name:'Tracking',query:{order_pro:item[head.col_header_db_col_name]}}">{{item[head.col_header_db_col_name]}}</router-link>
                                </td>
                                <td v-else-if="head.checked == 1 && head.fieldName == 'Freight Term'" :key="head.fieldId">{{getFreightTermText(item[head.col_header_db_col_name])}}</td>
                                <td v-else-if="head.checked == 1 && head.col_header_db_col_name == 'docs'" :key="head.fieldId"
                                    style="cursor: pointer; position: relative; top: 30px " @mouseenter="showPhotoView=index">
                                    <pictures-show :phptoList="item['docs']" @leaves="PhotoViewLeave" :style="{'display':showPhotoView==index?'block':'none'}"></pictures-show>
                                    <img src="../../../../../assets/images/images-icon.svg" width="30" height="40" alt="" v-if="item['docs'].length == 1">
                                    <img src="../../../../../assets/images/folder.svg" width="30" height="40" alt="" v-if="item['docs'].length > 1">
                                </td>

                                <td v-else-if="head.checked == 1" :key="head.fieldId">{{item[head.col_header_db_col_name]}}</td>
                            </template>
                        </tr>

                    </tbody>
                </table>
                <pager :totalCount="searchResultPaging.totalNum" :customizePageSize="searchParams.page.pageSize" @reloadContent="triggerSearchFromPager"></pager>

            </div>
        </div>
    </div>

</template>
<style lang="scss" src="./shipment-activity.scss" />