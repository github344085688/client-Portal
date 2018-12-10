<template>

   <el-select v-model="selectValue"
    filterable
    :clearable="clearable"
    remote
    ref="input"
    no-match-text="No Data"
    no-data-text="No Data" 
    placeholder="Input to search"
    @change="onSelectChange"
    :remote-method="remoteMethod"
    :loading="loading"
    loading-text="Loading"  
    >
        <el-option
             v-for="address in addressList"
             :key="address.id"
             :label="address.name"
             :value="address.id">
               <span>{{ address.name }}<span class="address-span">{{formateAddress(address) }}</span>
               
               </span>
        </el-option>
    </el-select>

</template>
<style lang="scss" src="./address-auto-complete.scss">