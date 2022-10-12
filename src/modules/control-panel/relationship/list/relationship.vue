<template>
    <div>
        <button class="unis-btn unis-btn-primary color-white grid-10 right" style="margin: 0 15px" @click="goBackViewPage">Exit</button>
        <div class="relationship">
            <div class="panel-ship-list">
                <div class="table-relation">
                    <table cellpadding="12" cellspacing="12">
                        <thead>
                            <tr>
                                <th>Object</th>
                                <th>Object fields</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in panelList" :key="index">
                                <td>
                                    <span v-if="item.panelName && item.id"  @click="goDetailPage(item.panelName)">{{item.panelName}}</span>
                                    <div v-else>
                                        <el-select no-match-text="No Data" v-model="item.panelName">
                                            <el-option v-for="(panel, perIndex) in allPanels" :disabled="filterCanAddPanel(panel.panelName)" :key="perIndex" :label="panel.panelName" :value="panel.panelName">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </td>
                                <td>
                                    <span v-for="(relationshipPanel, panelIndex) in item.relationshipPanel" :key="panelIndex" @click="goDetailPage(relationshipPanel)">{{relationshipPanel}}</span>
                                </td>
                                <td>
                                    <button class="unis-btn unis-btn-primary color-white" @click="goDetailPage(item.panelName)" v-show="item.panelName">Edit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button class="unis-btn unis-btn-primary color-white grid-20 right" @click="AddObject">Add Object Relationship</button>
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="./relationship.scss" />