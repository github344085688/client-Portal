<template>
<div>
<div  class="row grid-100 tablet-grid-100 container simple-landing">

    <div  class="grid-40 tablet-grid-50 margin-top-40 margin-bottom-35">
        <label  class="input-label">&nbsp;</label>
        <input name="keyword" v-model="orderSearch.keyword" type="text" placeholder="Search" class="input-search track-search search" @keypress.enter="search" />
        <span  class="error-message"><p ></p></span>
    </div>

</div>
<div class="grid-100 tablet-grid-100 container margin-top-30" >
    <div class="grid-15 tablet-grid-50 container">
       <span style="font-size: 20px;font-weight: 900;">My Order</span> 
    </div>
    <div class="grid-15 tablet-grid-25 container">
        <input type="radio" id="rdiOUTBOUND" v-model="orderSearch.orderType" value="outbound"> <label for="rdiOUTBOUND" title="Click to deselect" class="radio" style="top:0px"></label><span style="padding-left:10px">OUTBOUND</span>
    </div>
    <div class="grid-15 tablet-grid-25 container">
        <input type="radio" id="rdiINBOUND" checked  value="inbound" v-model="orderSearch.orderType"> <label for="rdiINBOUND" title="Click to deselect" class="radio"  style="top:0px"></label><span class="radioText" style="padding-left:10px">INBOUND</span>
    </div>
    <div class="grid-60 tablet-grid-50 container">
    </div>
</div>
<div class="grid-100 tablet-grid-100" v-loading="loading">
    <table class="table-client">
        <thead>
            <tr>
                <th></th>
                <th>Status</th>
                <th>ORDER #</th>
                <th>ORDER DATE</th>
                <th>SHIP FROM</th>
                <th>SHIP TO</th>
                <th>Carrier</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="order in orders" :key="order.id">
                <td><input type="radio" :id="order.id" :name="order.id" :value="order.id" /> <label :for="order.id" :title="order.id" class="radio"></label></td>
                <td>{{order.status}}</td>
                <td>{{order.id}}</td>
                <td>{{order.createdWhen}}</td>
                <td>{{order.shipFrom}}</td>
                <td>{{order.shipToAddress? order.shipToAddress.name: ''}}{{order.shipToAddress? ',' + order.shipToAddress.state: ''}}</td>
                <td>{{order.carrierName}}</td>
                <td><button title="edit" class="edit-row" style="visibility: visible;"></button> <button title="delete" class="delete-row" style="visibility: visible;"></button></td>
            </tr>
           
        </tbody>
    </table>
</div>
 <pager :totalCount="searchResultPaging.totalCount" :customizePageSize="searchPaging.pageSize" @reloadContent="triggerSearchFromPager"  ></pager> 
<!-- <scroll-pager  :totalCount="searchResultPaging.totalCount" :customizePageSize="searchPaging.pageSize" @reloadContent="triggerScrollSearch" :loading="loading"/> -->
</div>
</template>

