<template>

   <el-select  v-model="selectValue"
    :filterable="filterable" 
    :clearable="clearable"
    :placeholder="placeholder"
    ref="input"
    no-match-text="No Data"
    @change="selectChange"
    @clear='remove'>
        <el-option
             v-for="item in options"
             :key="item"
             :label="item"
             :value="item">
        </el-option>
    </el-select>

</template>
<style lang="scss" src="./element-select.scss">