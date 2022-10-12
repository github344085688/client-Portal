<template>
    <div>
        <div class="relationship-head clearfix">
            <button class="unis-btn unis-btn-primary color-white grid-10 right" style="margin: 0 15px" @click="goBackPanelRelationList">Exit</button>
            <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" class="grid-10 right" @click="updatePanelRelationship" :value="'Save'" :is-loading="saving"></waitting-btn>
            <h2>Relationship for {{panelName}} panel</h2>
        </div>
        <div class="relation-detail grid-100">
            <div class="relation-with">
                <div class="relation-with-per-panel" v-for="(item, index) in panelRelationshipList" :key="index">
                    <label for="">With {{item.targetPanel}}</label>
                    <div class="table-relation">
                        <table>
                            <thead>
                                <tr>
                                    <th>{{panelName}} Panel fields</th>
                                    <th>{{item.targetPanel}} Panel fields</th>
                                    <th>Relation Type</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(apiRelationship, apiIndex) in item.relationshipList" :key="apiIndex">
                                    <td>
                                        <el-select no-match-text="No Data" :disabled="apiRelationship.isDefault" v-model="apiRelationship.linkkey" @change="changeSelect('link', apiRelationship, panelApikeys)">
                                            <el-option v-for="(api, perIndex) in panelApikeys" :disabled="!apiRelationship.isDefault && filterCanChoose(item.relationshipList, api.apiName, apiRelationship.targetKey)" :key="perIndex" :label="api.apiName" :value="api.api">
                                            </el-option>
                                        </el-select>
                                    </td>
                                    <td>
                                        <el-select no-match-text="No Data" :disabled="apiRelationship.isDefault" v-model="apiRelationship.targetKey" @change="changeSelect('target', apiRelationship, allApikeys[item.targetPanel])">
                                            <el-option v-for="(api, perIndex) in allApikeys[item.targetPanel]" :disabled="!apiRelationship.isDefault && filterCanChoose(item.relationshipList, apiRelationship.linkkey, api.apiName)" :key="perIndex" :label="api.apiName" :value="api.api">
                                            </el-option>
                                        </el-select>
                                    </td>
                                    <td class="relation-type">
                                        <div class="grid-25">
                                            <div class="type-icon one-one"></div>
                                            <el-radio v-model="apiRelationship.relationshipType" :label="1">One to One</el-radio>
                                        </div>
                                        <div class="grid-25">
                                            <div class="type-icon one-many"></div>
                                            <el-radio v-model="apiRelationship.relationshipType" :label="2">One to Many</el-radio>
                                        </div>
                                        <div class="grid-25">
                                            <div class="type-icon many-one"></div>
                                            <el-radio v-model="apiRelationship.relationshipType" :label="3">Many to One</el-radio>
                                        </div>
                                        <div class="grid-25">
                                            <div class="type-icon many-many"></div>
                                            <el-radio v-model="apiRelationship.relationshipType" :label="4">Many to Many</el-radio>
                                        </div>
                                    </td>
                                    <td>
                                        <!-- <button class="unis-btn unis-btn-primary color-white grid-40">Close</button> -->
                                        <el-switch class="grid-50"
                                            v-model="apiRelationship.isOpen"
                                            active-text="On"
                                            inactive-text="Off">
                                        </el-switch>
                                        <button v-if="!apiRelationship.isDefault" class="unis-btn unis-btn-primary color-white grid-50" @click="removeApiRelationship(item, apiIndex)">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="add-ship-btn">
                        <button class="unis-btn unis-btn-primary color-white grid-15 right" @click="addApiRelationship(item)">Add Relationship</button>
                    </div>
                </div>
                <div>
                    <div class="grid-20">
                        <el-select no-match-text="No Data" v-model="addPanel">
                            <el-option v-for="(panel, perIndex) in this.allPanel" :key="perIndex" :label="panel" :value="panel">
                            </el-option>
                        </el-select>
                    </div>
                    <button class="unis-btn unis-btn-primary color-white grid-20" style="height: 40px" @click="addPanelRelationship">Add Panel Relationship</button>
                </div>
            </div>
        </div>

    </div>
</template>
<style lang="scss" src="./relationDetail.scss" />