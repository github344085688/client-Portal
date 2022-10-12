<template>
    <div>
        <div class="head grid-100">
            <h2>Driver Manager</h2>
            <div class="control right grid-100">
                <button class="unis-btn unis-btn-primary color-white grid-15 right">Create New Driver</button>
                <button class="unis-btn unis-btn-primary color-white grid-10 right" style="margin: 0 15px">Export</button>
            </div>
        </div>
        <div class="filter-area grid-100">
            <div>
                <div class="grid-20">
                    <input type="text" placeholder="Search driver name" v-model="filterName">
                </div>
                <div class="grid-20">
                    <el-select no-match-text="No Data" v-model="primaryCompany" placeholder="Primary Company">
                        <el-option v-for="(item, index) in ['Company1', 'Company2']" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="grid-20">
                    <el-select no-match-text="No Data" v-model="terminalCode" placeholder="Terminal Code">
                        <el-option v-for="(item, index) in ['terminalCode1', 'terminalCode2']" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="grid-20">
                    <el-select no-match-text="No Data" v-model="status" placeholder="Status">
                        <el-option v-for="(item, index) in ['status1', 'status2']" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="grid-20">
                    <el-select no-match-text="No Data" v-model="payGroup" placeholder="PayGroup">
                        <el-option v-for="(item, index) in ['payGroup1', 'payGroup2']" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="control right grid-100">
                <button class="unis-btn unis-btn-primary color-white grid-15 right">Search</button>
            </div>
        </div>

        <div class="driver-list grid-100">
            <table class="table-client">
                <thead>
                    <tr>
                        <template v-for="head in tavleHead">
                            <th :key="head">{{head}}</th>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <tr class="child-table-total" >
                        <!-- <template v-for="(driver, index)  in driverList">
                            <td :key="index">{{driver}}</td>
                        </template> -->
                        <td>edge</td>
                        <td>edge2</td>
                        <td>company</td>
                        <td>123411</td>
                        <td>18050862385</td>
                        <td>adadfd</td>
                        <td>code123</td>
                        <td>group122</td>
                        <td>Active</td>
                        <td>
                            <div class="action-btns">
                                <el-dropdown :hide-on-click="false">
                                    <span class="el-dropdown-link">...</span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item>Mark as inactive driver</el-dropdown-item>
                                        <el-dropdown-item>Export dirver details</el-dropdown-item>
                                        <el-dropdown-item>Delete driver</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </td>
                    </tr>
                    <tr class="child-table-total" >
                        <!-- <template v-for="(driver, index)  in driverList">
                            <td :key="index">{{driver}}</td>
                        </template> -->
                        <td>edge</td>
                        <td>edge2</td>
                        <td>company</td>
                        <td>123411</td>
                        <td>18050862385</td>
                        <td>adadfd</td>
                        <td>code123</td>
                        <td>group122</td>
                        <td>Active</td>
                        <td>
                            <div class="action-btns">
                                <el-dropdown :hide-on-click="false">
                                    <span class="el-dropdown-link">...</span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item>Mark as inactive driver</el-dropdown-item>
                                        <el-dropdown-item>Export dirver details</el-dropdown-item>
                                        <el-dropdown-item>Delete driver</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </td>
                    </tr>
                    <tr class="child-table-total" >
                        <!-- <template v-for="(driver, index)  in driverList">
                            <td :key="index">{{driver}}</td>
                        </template> -->
                        <td>edge</td>
                        <td>edge2</td>
                        <td>company</td>
                        <td>123411</td>
                        <td>18050862385</td>
                        <td>adadfd</td>
                        <td>code123</td>
                        <td>group122</td>
                        <td>Active</td>
                        <td>
                            <div class="action-btns">
                                <el-dropdown :hide-on-click="false">
                                    <span class="el-dropdown-link">...</span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item>Mark as inactive driver</el-dropdown-item>
                                        <el-dropdown-item>Export dirver details</el-dropdown-item>
                                        <el-dropdown-item>Delete driver</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- <pager :totalCount="searchResultPaging.totalNum" :customizePageSize="searchParams.page.pageSize" @reloadContent="triggerSearchFromPager"></pager> -->
        </div>
    </div>
</template>
<style scoped lang="scss" src="./driverList.scss" />