<template>
    <el-tabs v-model="activeName" @tab-click="loadPlatformTab">
        <el-tab-pane label="User directory" name="userDirectory">
            <el-row>
                <el-col :span="4">
                    <label class="input-label">user</label>
                    <div >
                        <input type="text" placeholder="please enter user name"
                                v-model="searchParams.username"
                                :name="'user'"
                        />
                    </div>
                </el-col>
                <el-col :span="4" :offset="1">
                    <label class="input-label">employee Id</label>
                    <div >
                        <input type="text" placeholder="please enter employee Id"
                                v-model="searchParams.employeeId"
                                :name="'employee Id'"
                        />
                    </div>
                </el-col>
                <el-col :span="4" :offset="1">
                    <label class="input-label"></label>
                    <waitting-btn 
                        btn-class="unis-btn unis-btn-primary h-40-p"
                        @click="loadUserDirectory()" 
                        value="Search"
                        btn-type="button"
                        :is-loading="loading"> 
                    </waitting-btn>
                </el-col>
                <el-col :span="2" :offset="8">
                    <span @click="downloadUserDirectory()" class="downloadButton">Export to CSV</span>
                </el-col>
            </el-row>
            <el-row v-loading="loading">
                <table class="table-client">
                    <thead>
                        <tr>
                            <th v-for="(head, index) in userDirectoryView.head" :key="index">
                                {{head}}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr  v-for="(userDirectory, $index) in userDirectoryView.body" :key="$index" @click="showUserPreference(userDirectory)">
                            <td v-for="(item, index) in userDirectoryView.head" :key="index">
                                <span v-if="item === 'Status'">
                                    {{['Inactive', 'Active'][+userDirectory[userDirectoryView.headMap['Status']]]}}
                                </span>
                                <span v-else>
                                    {{userDirectory[userDirectoryView.headMap[item]]}}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <pager 
                    :totalCount="userDirectoryList.length" 
                    :currentPage="paging.pageNo"
                    :customizePageSize="paging.pageSize" 
                    @reloadContent="reloadContent">
                </pager>
                <user-preferences
                    ref="userPreference"
                    v-bind:isShow.sync="userPreferenceShow"
                    :key="userPreferencesKey"
                    :platformAccessList="selectedPlatFormAccessList"
                    :currentUserDirectory="currentUserDirectory"
                    @loadUserDirectory="loadUserDirectory"
                >
                </user-preferences>
            </el-row>
        </el-tab-pane>
        <el-tab-pane label="Platform list" name="platformList">
            <el-row :gutter="20">
                <el-col :span="12" v-loading="loading">
                    <div class="box-card platform-list">
                        <div class="box-row row-padding" :class="currentRow ===index ? 'active': ''" ref="platFormRow" v-for="(count, platformName, index) in platformList" :key="index" @click="clickRow(index, platformName, count)">
                            <div class="itemText">
                                {{platformName | camelCase}} 
                            </div>
                            <div class="userBottom">
                                {{count}} users
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="box-card platformList">
                        <div class="box-row">
                            <div class="itemText">
                               {{selectedPlatFormUser.platformName | camelCase}}
                            </div>
                            <div class="userBottom">
                                {{selectedPlatFormUser.count}} users
                            </div>
                            <a @click="downloadPlatformUsers" class="download">Export to CSV</a>
                        </div>
                        <el-row style="margin: 20px 0;">
                            <el-col :span="8">
                                <label class="input-label">role</label>
                                <el-select v-model="userSearchParams.roleNames" placeholder="please select role" clearable>
                                    <el-option
                                        v-for="role in roles"
                                        :key="role"
                                        :label="role"
                                        :value="role">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="8" :offset="1">
                                <label class="input-label">user name</label>
                                <div >
                                    <input type="text" placeholder="please enter user name"
                                            v-model="userSearchParams.username"
                                            :name="'user'"
                                    />
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <label class="input-label">employee Id</label>
                                <div >
                                    <input type="text" placeholder="please enter employee Id"
                                            v-model="userSearchParams.employeeId"
                                            :name="'employee Id'"
                                    />
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4" :offset="18">
                                <waitting-btn 
                                    btn-class="unis-btn unis-btn-primary h-40-p"
                                    @click="loadPlatformUsers(1)" 
                                    value="Search"
                                    btn-type="button"
                                    :is-loading="loading"> 
                                </waitting-btn>
                            </el-col>
                        </el-row>
                        <el-row v-loading="loading">
                                <table class="table-client">
                                    <thead>
                                        <tr>
                                            <th v-for="(head, index) in platformUsersView.head" :key="index">
                                                {{head}}
                                            </th>
                                        </tr>
                                    </thead>
                                </table>
                                <div class="table-box">
                                    <table class="table-client">
                                        <tbody>
                                            <tr  v-for="(platformUser, $index) in platformUsersView.body" :key="$index">
                                                <td v-for="(item, index) in platformUsersView.head" :key="index">
                                                    <el-select v-if="item === 'Role'" v-model="platformUser[platformUsersView.headMap['Role']]" @change="roleParamsConfig(platformUser, $index)">
                                                        <el-option
                                                            v-for="role in roles"
                                                            :key="role"
                                                            :label="role"
                                                            :value="role">
                                                        </el-option>
                                                    </el-select>
                                                    <span v-else>
                                                        {{platformUser[platformUsersView.headMap[item]]}}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            <pager 
                                :totalCount="platformUsers.length" 
                                :currentPage="paging.pageNo"
                                :customizePageSize="paging.pageSize" 
                                @reloadContent="reloadPlatformUserList">
                            </pager>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </el-tab-pane>
    </el-tabs>
</template>
<style lang="scss" scoped>
    .itemText {
        font-size: 18px;
        color: #444545;
        font-weight: bold;
        line-height: 24px;
        height: 24px;
    }
    .userBottom {
        border: 1px solid #DADADA;
        border-radius: 2px;
        width: 67px;
        height: 24px;
        color: #989A9C;
        align-items: center;
        font-weight: bold;
        font-size: 13px;
        line-height: 16px;
        text-align: center;
        padding: 2px;
        margin-left: 20px;
    }
    .box-card {
        height: 820px;
        cursor: pointer;
        border: 1px solid #CECECE;
        border-radius: 2px;
        &.platform-list {
            overflow-y: auto;
        }
        .box-row {
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }
        .box-row:hover {
            background: #F9F9F9;
        }
        .box-row.active {
            background: #444545;
            border-radius: 1px 1px 0px 0px;
            .itemText {
                color: #FFFFFF;
            }
            .userBottom {
                background: #777879;
                color: #FFFFFF;
            }
        }
        .row-padding {
            padding: 24px 20px;
        }
        .table-box {
            height: 380px;
            overflow: auto;
            .table-client, .table-tracking {
                table-layout: fixed;
            }
        }
        .download {
            color: #2478fa;
            flex-grow: 2;
            text-align: right;
            text-decoration: underline;
            cursor: pointer;
        }
    }
    .platformList {
        padding: 24px;
    }
    .downloadButton {
        color: #2478fa;
        text-decoration: underline;
        margin-top: 35px;
        display: inline-block;
        cursor: pointer;
    }
</style>