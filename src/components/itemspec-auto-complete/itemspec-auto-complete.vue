<template>

   <el-select class="select-icon" v-model="selectValue"
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
             v-for="item in itemSpecList"
             :key="item.id"
             :label="item.filtername"
             :value="item.id">
        </el-option>
    </el-select>

</template>
<style lang="scss" src="./itemspec-auto-complete.scss">