<template>

   <el-select v-model="selectValue"
    filterable
    :clearable="clearable"
    remote
    ref="input"
    no-match-text="No Data"
    no-data-text="No Data" 
    :placeholder="placeholder"
    :search-text="searchText"
    @change="onSelectChange"
    :remote-method="remoteMethod"
    :loading="loading"
    loading-text="Loading"  
    >
        <el-option
            v-for="(org, index) in orgs"
            :key="index"
            :label="org.vehicle_name"
            :value="org.vehicle_id">
        </el-option>
    </el-select>

</template>
<style lang="scss" src="./tms-trailer-auto-complete.scss">