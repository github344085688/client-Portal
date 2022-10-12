<template>
    <form @submit.stop.prevent="popUpConfig.submitFunc">
        <pop-up-windows 
            v-show="syncIsShow" 
            :height="popUpConfig.height" 
            :tlitle="popUpConfig.title" 
            :isSubmit="popUpConfig.isSubmit" 
            @cancel="popUpConfig.cancelFunc()">
            <el-row type="flex" align="middle">
                <el-col :span="2">
                    <switch-button v-model="isActive" @change="removePlatFormList"></switch-button>
                </el-col>
                <el-col :span="2">
                    Active user
                </el-col>
            </el-row>
            <el-row style="margin:10px 0;">
                <el-col :span="4">
                    <div>
                        Manage user access
                    </div>
                </el-col>
            </el-row>
            <el-row v-for="(access, index) in syncPlatformAccessList" :key="index" style="margin: 10px 0;" type="flex" align="middle">
                <el-col :span="1">
                    <input type="checkbox"
                        :id="access.name"
                        class="unis-checkbox"
                        :checked="isChecked(access)"
                        :disabled="!isActive"
                        @click="toggleSelection(access, index)">
                    <label :for="access.name">
                        <span></span>
                    </label>
                </el-col>
                <el-col :span="8">
                    <div>
                        {{access.name}}
                    </div>
                </el-col>
                <el-col :span="8">
                    <el-select v-model="access.roleNames" no-data-text="--" :disabled="!isActive" @change="changeUserAccess(access, index)">
                        <el-option
                            v-for="role in roles"
                            :key="role"
                            :label="role"
                            :value="role">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
        </pop-up-windows>
    </form>
</template>
<style lang="scss" scoped>
    .unis-switch > span:last-child{
        margin-left: 0!important;
    }
</style>