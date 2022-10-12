<template>
    <div v-if="facilities.length>1">
        <label class="input-label">Facility<span v-if="selectValue.name=='All'">(Record up limit to 1000)</span></label>
        <div class="unis-multiselect" style="padding: 0 !important; height: auto">
            <el-select v-model="selectValue" filterable :clearable="clearable" :value-key="'id'" remote ref="input" :disabled="isDisabled"
                no-match-text="No Data" no-data-text="No Data" placeholder="Input to search" @change="onSelectChange"
                :loading="loading" loading-text="Loading">
                <el-option v-for="facility in facilities" :key="facility.id" :label="facility.name" :value="facility">
                </el-option>
            </el-select>
        </div>
    </div>

</template>
<style lang="scss" src="./facility-select.scss">
