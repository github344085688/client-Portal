<template>

   <el-select v-model="selectValue" class="select-icon"
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
             v-for="item in orders"
             :key="item.id"
             :label="item.id"
             :value="item.id">
        </el-option>
    </el-select>

</template>
<style lang="scss" src="./order-auto-complete.scss">