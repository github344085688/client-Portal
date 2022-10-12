<template>
    <div class="add-item-wrap">
        <span class="per-item" v-for="(item, index) in showValueArr">
            <strong>{{item}}</strong>
            <i @click="removeItem(index)">x</i>
        </span>
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
                    :value="item.id"
                    >
                </el-option>
        </el-select>
    </div>
</template>
<style lang="scss" src="./multiple-item-auto-complete.scss">