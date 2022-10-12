<template>
    <div v-if="customerIds.length>1">
        <label class="input-label">Customer</label>
        <div class="unis-multiselect" style="padding: 0 !important; height: auto">
            <el-select v-model="selectValue" filterable :clearable="clearable" :disabled="isDisabled" remote ref="input" no-match-text="No Data" no-data-text="No Data" placeholder="Input to search" @change="onSelectChange" :loading="loading" loading-text="Loading">
                <el-option v-for="org in orgs" :key="org.id" :label="org.name" :value="org.id">
                </el-option>
            </el-select>
        </div>
    </div>

</template>
<style lang="scss" src="./predefined-customer-select.scss">