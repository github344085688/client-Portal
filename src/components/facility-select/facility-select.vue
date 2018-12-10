<template>

    <el-select v-model="selectValue" filterable :clearable="clearable"  :value-key ="'id'" remote ref="input" no-match-text="No Data" no-data-text="No Data" placeholder="Input to search" @change="onSelectChange" :loading="loading" loading-text="Loading">
        <el-option v-for="facility in facilities" :key="facility.id" :label="facility.name" :value="facility">
        </el-option>
    </el-select>

</template>
<style lang="scss" src="./facility-select.scss">
