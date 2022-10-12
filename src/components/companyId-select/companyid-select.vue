<template>     
    <el-select v-model="selectValue" :value-key ="'id'" no-match-text="No Data" no-data-text="No Data" placeholder="search Company Id" @change="onSelectChange" >
        <el-option v-for="companyId in companyIds" :key="companyId.id" :label="companyId" :value="companyId">
        </el-option>
    </el-select>
</template>
<style lang="scss" src="./companyid-select.scss">
