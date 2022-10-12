<template>
    <div class="advance-search">
        <div class="icon">
            <span v-if="searchNum > 0">{{searchNum}}</span> Filter
        </div>
        <el-dialog
            :title="panel + ' Advance Search'"
            :visible.sync="showAdvance"
            @close='closeDialog'
            width="40%"
            class="dialog-search"
            :append-to-body="true"
            :center="true"
            :close-on-click-modal="false"
            :modal="false">
            <div class="advance-box" v-if="panel">
                <div class="search-list">
                    <div class="grid-100">
                        <label for="" class="grid-100">limit {{limitDays}}days:</label>
                        <div class="grid-100 d-flex mt-2">
                            <div class="grid-40 pl-0">
                                <el-select class="grid-50 pl-0" style="margin-bottom: 14px"  no-match-text="No Data" v-model="searchList[panel].timeType" placeholder="Select" @change="changeTimeType">
                                    <el-option v-for="(item, keyIndex) in searchList[panel].timeTypeArr" :key="keyIndex" :label="item.key" :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="grid-40 pl-0 pr-0">
                                <el-date-picker
                                    v-model="searchList[panel].time"
                                    type="daterange"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    :picker-options="pickerOptions"
                                    :clearable="false"
                                    :editable="false">
                                </el-date-picker>
                            </div>
                        </div>
                    </div>
                    <div class="grid-100" v-for="(advanceSearch, listIndex) in searchList[panel].searchParams" :key="listIndex">
                        <div class="grid-25">
                            <el-select no-match-text="No Data" v-model="advanceSearch.name" placeholder="Select rule" @change="judgeRuleType(advanceSearch, searchData[panel].searchParams)">
                                <el-option v-for="(item, index) in searchData[panel].searchParams" :key="index" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="grid-25">
                            <el-select style="margin-bottom: 14px"  no-match-text="No Data" v-model="advanceSearch.opt" placeholder="Select" @change="changeOpt(advanceSearch)">
                                <el-option v-for="(item, keyIndex) in advanceSearch.optArr" :key="keyIndex" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="grid-30">
                            <tags-input v-if="advanceSearch.type == 'input' && advanceSearch.multiple" v-model="advanceSearch.value" :fill="advanceSearch.keyFix ? advanceSearch.keyFix : ''"></tags-input>
                            <input type="text" v-if="advanceSearch.type == 'input' && !advanceSearch.multiple" v-model="advanceSearch.value">

                            <el-select :multiple="advanceSearch.multiple" style="margin-bottom: 14px" v-if="advanceSearch.type == 'select'"  no-match-text="No Data" v-model="advanceSearch.value" placeholder="Select">
                                <el-option v-for="(item, index) in advanceSearch.selectArr" :key="index" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="grid-20">
                            <button class="unis-btn unis-btn-secondary" style="margin: 0px 10px 0 0px" @click="removeAdanceSearch(panel, listIndex, advanceSearch)">Remove</button>
                        </div>
                    </div>
                </div>
                <div class="add-search-item">
                    <div class="grid-100">
                        <strong @click="addAdvanceSearch(panel)">+</strong>
                        <span @click="addAdvanceSearch(panel)">Add new rule</span>
                    </div>
                </div>
                <div class="control">
                    <div class="grid-100 clearfix" style="padding: 0">
                        <button class="unis-btn unis-btn-primary color-white grid-20 right" style="margin: 5px 10px 0 0px" @click="searchByParams(panel, searchList[panel])">Search</button>
                        <button class="unis-btn unis-btn-secondary grid-20 right" style="margin: 5px 10px 0 0px" @click="resetAdvanSearch(panel)">Reset</button>
                        <button class="unis-btn unis-btn-primary color-white grid-20 right" style="margin: 5px 10px 0 0px" @click="unassociated(panel)" v-if="searchList[panel].associated">Unassociated</button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<style lang="scss" src="./advanceSearch.scss"></style>