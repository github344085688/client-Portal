<template>
    <form @submit.stop.prevent="popUpConfig.submitFunc">
        <pop-up-windows 
                    v-show="syncIsShow" 
                    :height="popUpConfig.height" 
                    :tlitle="popUpConfig.title" 
                    :isSubmit="popUpConfig.isSubmit" 
                    @cancel="popUpConfig.cancelFunc()">
            <el-row :gutter="24">
                <el-col :span="16">
                    <predefined-customer-select v-model="updateData.customerId" @change="onselectCustomerChange">
                    </predefined-customer-select>
                </el-col>
            </el-row>
            <el-row :gutter="24" style="margin-top: 10px;">
                <el-col :span="4">
                    <input type="file" 
                           id="excelDataFile"
                           name="excelDataFile" 
                           accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                           @change="fileUpload">
                </el-col>
            </el-row>
        </pop-up-windows>
    </form>
</template>
<style lang="scss" scoped>
    input[type="file"] {
        display: block;
    }
</style>