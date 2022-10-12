<template>

   <el-select v-model="selectValue"
    filterable
    :clearable="clearable"
    remote
    ref="input"
    no-match-text="No Data"
    no-data-text="No Data" 
    :placeholder="placeholder"
    @change="onSelectChange"
    :remote-method="remoteMethod"
    :loading="loading"
    loading-text="Loading"  
    >
        <el-option
            v-for="org in orgs"
            :key="org.location_id"
            :label="org.location_name"
            :value="org.location_id">
        </el-option>
    </el-select>

</template>
<style lang="scss" src="./tms-carrier-auto-complete.scss">