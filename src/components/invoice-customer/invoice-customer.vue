<template>     
    <el-select v-model="selectValue" :value-key ="'id'" no-match-text="No Data" no-data-text="No Data" placeholder="search Customer" @change="onSelectChange" >
        <el-option v-for="invoiceCustomer in invoiceCustomers" :key="invoiceCustomer.AccountID" :label="invoiceCustomer.VendorName" :value="invoiceCustomer.AccountID">
        </el-option>
    </el-select>
</template>
<style lang="scss" src="./invoice-customer.scss">
