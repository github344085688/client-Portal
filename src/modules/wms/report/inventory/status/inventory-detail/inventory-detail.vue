<template>
    <div class="invenroty-status">

        <div class="grid-100 tablet-grid-100">

            <div class="grid-100 tablet-grid-100 container">
                <span class="component-title bold">Inventory Detail </span>
            </div>

            <div class="grid-100 tablet-grid-100 container avenirNext-Medium">
                <span class="component-title">Item ID: {{currentItem.name}}</span>
            </div>
 
            <div class="grid-100 tablet-grid-100 container avenirNext-Medium">
                <span class="component-title">Title: {{currentTitle.basic.name}}</span>
            </div>
            <div class="grid-100 tablet-grid-100 container margin-top-15">
                <div class="grid-50 tablet-grid-50 container  ">
                    <waitting-btn btn-class="button-unis color-white" @click="backToStatus" :value="backPath" > </waitting-btn>
                </div>
                <!-- <div class="grid-50 tablet-grid-50 container">
                    <waitting-btn btn-class="button-unis color-white" class="right" @click="exportExcel" :value="'Export To Excel'" :is-loading="exportLoading"> </waitting-btn>
                </div> -->
            </div>

            <div class="grid-100 tablet-grid-100" v-loading="loading">
                <table class="table-client" v-fixed-head>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>QTY</th>
                            <th>Unit</th>
                            <th>Status</th>
                            <th>LP @ Location </th>
                            <th>LP Configuration</th>
                            <th>Customer</th>
                            <th>Title</th>
                            <th>SN</th>
                            <th>Lot No.</th>
                            <th>Expiration Date</th>
                            <th>Mfg Date</th>
                            <th>Shelf Life Days</th>
                            <th>Receipt ID</th>
                            <th>Order ID</th>                       

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="inventory in inventories" :key="inventory.id">
                            <td>
                                {{ itemSpecMap[inventory.itemSpecId].name}}
                            </td>
                            <td>{{inventory.qty}}</td>   
                            <td>{{unitMap[inventory.unitId].name}}</td>
                            <td>{{inventory.status}}</td>
                            <td>{{inventory.lpId}} @ {{lpMap[inventory.lpId].location}}</td>
                            <td>{{lpMap[inventory.lpId].confName}}</td>
                            <td>{{inventory.customerName}}</td>
                            <td>{{inventory.titleName}}</td>
                            <td>{{inventory.sn}}</td>
                            <td>{{inventory.lotNo}}</td>
                            <td>{{inventory.expirationDate}}</td>
                            <td>{{inventory.mfgDate}}</td>
                            <td>{{inventory.shelfLifeDays}}</td>
                            <td>{{inventory.receiptId}}</td>
                            <td>{{inventory.orderId}}</td>
                        </tr>

                    </tbody>
                </table>
                <pager :totalCount="searchResultPaging.totalCount" :customizePageSize="inventorySearchParam.paging.pageSize" @reloadContent="triggerSearchFromPager"></pager>

            </div>
        </div>
    </div>

</template>
<style lang="scss" src="./inventory-detail.scss" />