<template>
    <div class="shipment-activity">

        <div class="grid-100 tablet-grid-100">

            <div class="grid-100 tablet-grid-100 container">
                <span class="component-title bold">Invoice </span>
            </div>
            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Company</label>
                    <div>
                        <Companyid-select v-bind:change.sync="searchInvoice.data.CompanyID" :app="'TMS'" @change="searchInvoiceByPaging">
                        </Companyid-select>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container">  
                        <label class="input-label">Customer</label>               
                    <invoice-customer v-bind:change.sync="searchInvoice.data.Customer" :app="'tms'"  @change="searchInvoiceByPaging"></invoice-customer>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Payment Status</label>
                    <div>
                        <el-select no-match-text="No Data" v-model="searchInvoice.data.PaymentStatus" placeholder="All"
                            @change="onSelectPaymentStatus" :disabled="loading">
                            <el-option v-for="statu in paymentStatus" :key="statu.value" :label="statu.name" :value="statu.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Order</label>
                    <div>
                        <input type="text" v-model="searchInvoice.data.Order" placeholder="Order" v-rx-event:input="searchByInput" />
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">PO #</label>
                    <div>
                        <input type="text" v-model="searchInvoice.data.PO" placeholder="PO #" v-rx-event:input="searchByInput" />
                    </div>
                </div>
            </div>
            <div class="grid-100 tablet-grid-100 container margin-bot">
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Load #</label>
                    <div>
                        <input type="text" v-model="searchInvoice.data.Load" placeholder="PO #" v-rx-event:input="searchByInput" />
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">PRO</label>
                    <div>
                        <input type="text" v-model="searchInvoice.data.PRO" placeholder="PRO" v-rx-event:input="searchByInput" />
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Ref #</label>
                    <div>
                        <input type="text" v-model="searchInvoice.data.RefNumber" placeholder="Ref #" v-rx-event:input="searchByInput" />
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Container #</label>
                    <div>
                        <input type="text" v-model="searchInvoice.data.ContainerNo" placeholder="Container #"
                            v-rx-event:input="searchByInput" />
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Address</label>
                    <div>
                        <input type="text" v-model="searchInvoice.data.Address " placeholder="Address" v-rx-event:input="searchByInput" />
                    </div>
                </div>

            </div>
            <div class="grid-100 tablet-grid-100 container margin-bot">
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Invoice #</label>
                    <div>
                        <input type="text" v-model="searchInvoice.data.InvoiceNumber" placeholder="Invoice #"
                            v-rx-event:input="searchByInput" />
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    
                </div>
            </div>
            <div class="grid-100 tablet-grid-100 container margin-top-50">

                <div class="grid-50 tablet-grid-50 container  ">
                    <static-customize-table  :tableFileds="tableHeader" :disabled="loading"></static-customize-table>
                </div>
                <div class="grid-50 tablet-grid-50 container">
                    <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" class="right" @click="exportExcel" :value="'Export'"
                        :is-loading="exportLoading" :disabled="exportLoading"> </waitting-btn>
                </div>
            </div>

            <div class="grid-100 tablet-grid-100" v-loading="loading" style="overflow-x: auto; min-height: 60px;">
                <table class="table-client" v-if="tableHeader.length > 0">
                    <thead>
                        <tr>
                            <th v-if="tableHeader.length > 0" class="width-30"></th>
                            <template v-for="head in tableHeader">
                                <th v-if="head.checked == 1" :key="head.fieldId">{{head.fieldName}}</th>
                            </template>
                        </tr>
                    </thead>
                    <tbody v-for="(dataList,index) in tableDataList" :init=" itemDetail = tableData[dataList]" v-if="tableData[dataList]">
                        <tr>
                            <td v-if="itemDetail.InvoiceHeader">
                                <i class="fas fa-chevron-right dz-icon" v-if="! tableData[dataList].isClick" @click="showItemDetail(dataList,true)"
                                    style="cursor: pointer;"></i>
                                <i class="fas fa-chevron-down dz-icon" v-if="tableData[dataList].isClick" @click="showItemDetail(dataList,false)"
                                    style="cursor: pointer;"></i>
                            </td>
                            <template v-for="head in tableHeader">
                                <td v-if="head.checked == 1" :key="head.fieldId">
                                    {{itemDetail.InvoiceHeader[head.fieldName]}}</td>
                            </template>
                        </tr>
                        <tr class="child-table-total" v-show="tableData[dataList].isClick">
                            <td :colspan="tableHeader.length+1" class="padding-init table-cell">
                                <div class="child">
                                    <table class="child-table">
                                        <thead>
                                            <tr>
                                                <th v-for="head in  getItemLeveLHead(itemDetail.InvoiceDetails)" :key="head.HeaderID">{{head}}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="detail in itemDetail.pageDetails">
                                                <td v-for="head in  getItemLeveLHead(itemDetail.InvoiceDetails)" :key="head.HeaderID">
                                                    {{detail[head]}}
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>
                                    <simplified-pager class="tetext_right" v-if="itemDetail.InvoiceDetails.length > 10"
                                        :keyId="dataList" :totalCount="itemDetail.ToTalCount" :customizePageSize="itemDetail.PageSize"
                                        @reloadContent="searchItemLevelReportFromPager"></simplified-pager>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <pager :totalCount="searchInvoice.data.TotalNumber" :customizePageSize="searchInvoice.data.PageSize"
            @reloadContent="triggerSearchFromPager"></pager>
    </div>

</template>
<style lang="scss" src="./invoice.scss" />