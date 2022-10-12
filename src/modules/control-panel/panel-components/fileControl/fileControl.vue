<template>
    <div class="file-control grid-100" v-loading="uploading">
        <el-checkbox style="margin-bottom: 15px" v-model="excludeLinkedFiles">Exclude linked files</el-checkbox>
        <div class="file-list-con">
            <div class="per-file grid-33" v-for="(item, index) in files" :key="index" v-show="excludeLinkedFiles ? !item.isLinked : true">
                <!-- <img :src="item.file_thumbnail_url" alt=""> -->
                <div class="min-img" :style="`background-image: url(${item.file_thumbnail_url})`" @click="showMaxImg(item.file_original_url)"></div>
                <p>{{item.file_name}}</p>
                <waitting-btn btn-class="unis-btn unis-btn-primary color-white right h-40-p"
                    @click="deleteFile(item, index)" :value="'Delete'"
                    :is-loading="item.deleting"> </waitting-btn>
                <el-select no-match-text="No Data" v-model="item.task_group_id" placeholder="Select task" @change="linkFiletoTask(item)">
                    <el-option v-for="(item, index) in taskGroupArr" :key="index" :label="item.orderPro" :value="item.taskGroupId">
                    </el-option>
                </el-select>

                <el-select no-match-text="No Data" v-model="item.file_category_id" placeholder="Category" @change="selectFileCategory(item)">
                    <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.file_category_name" :value="item.file_category_id">
                    </el-option>
                </el-select>
            </div>
        </div>
        <el-upload
            class="upload-dom"
            drag
            :auto-upload="true"
            :http-request="autoUpload"
            multiple
            action="">
            <div class="el-upload__text">
                <i class="el-icon-upload"></i>
                <span>Drag and drop files here or <em>browse</em></span></div>
            <div class="el-upload__tip" slot="tip"></div>
        </el-upload>

        <el-dialog :visible.sync="dialogVisible" :modal="false">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<style lang="scss" scoped src="./fileControl.scss"></style>