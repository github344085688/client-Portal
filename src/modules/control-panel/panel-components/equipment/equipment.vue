<template>
    <div class="small-cover" style="padding-top: 15px" v-loading="loadEquipment">
        <div class="panel_c_wrap" style="height: 100%; background: #fff">
            <div class="small-title" style="height: auto">
                <h2 class="clearfix"> 
                    <strong style="font-weight: bold">Equipment</strong>
                    <div class="equipment-select grid-40 right pr-0">
                        <el-select style="height: 20px" no-match-text="No Data" v-model="currentType"  placeholder="Select Equipment" @change="switchType(currentType)">
                            <el-option v-for="(item, index) in typeArr" :key="index" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </h2>
                <div class="search-area d-flex">
                    <div class="grid-50 pl-0">
                        <label for="">Search by name</label>
                        <input type="text" @input="filterEquipmentByName" v-model="equipmentName">
                    </div>
                    <div class="grid-50 pr-0">
                        <label for="">Group</label>
                        <el-select style="height: 20px" no-match-text="No Data" v-model="currentGroup" clearable  placeholder="Select Group" @change="switchGroup(currentGroup)">
                            <el-option v-for="(item, index) in groupsArr" :key="index" :label="item.vehicle_group_ancestry" :value="item.vehicle_group_ancestry">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="small-panel-common-table">
                <div class="table-out">
                    <table>
                        <thead>
                            <tr>
                                <th>Name
                                    <!-- <span>
                                        <el-dropdown>
                                            <span class="el-dropdown-link">···</span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item @click.native="switchType('Truck')">Truck</el-dropdown-item>
                                                <el-dropdown-item @click.native="switchType('Trailer')">Trailer</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </span> -->
                                </th>
                                <th>Location</th>
                                <th>Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in showList" :key="index">
                                <td class="pl-1">
                                    <drag :transfer-data="item" @dragstart="setDragType(currentType)" @dragend="setDragType(null)">{{item.vehicle_name}}
                                    </drag>
                                </td>
                                <td>
                                    <drag :transfer-data="item" @dragstart="setDragType(currentType)" @dragend="setDragType(null)">
                                        <p class="pl-4 pr-4" style="word-break: break-all">{{item.current_location ? item.current_location.location : ''}}</p>
                                    </drag>
                                </td>
                                <td>
                                    <drag :transfer-data="item" @dragstart="setDragType(currentType)" @dragend="setDragType(null)">{{item.vehicle_no}}
                                    </drag>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="./equipment.scss"></style>