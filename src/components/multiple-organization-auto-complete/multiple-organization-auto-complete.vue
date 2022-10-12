<template>

  <el-select class="mul-select" v-model="selectValue" filterable :clearable="clearable" remote ref="input" no-match-text="No Data"
    no-data-text="No Data" placeholder="Input to search" @change="onSelectChange" :remote-method="remoteMethod"
    :loading="loading" multiple loading-text="Loading">
    <el-option v-for="org in orgs" :key="org.id" :label="org.name" :value="org.id">
    </el-option>
  </el-select>

</template>
<style lang="scss" src="./multiple-organization-auto-complete.scss">
