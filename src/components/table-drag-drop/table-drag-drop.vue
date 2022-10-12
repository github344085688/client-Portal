<template>
  <div class="table-drag-drop " v-if="isShow" ref="select_frame" id="drop_area" :style="{'font-size': isShow? '18px' : '0px'}">
      <div style="position: relative;  min-height: 150px;border: 1px dashed #979797; box-sizing: border-box;">
          <div class="drop-or-browse d-flex justify-content-center  p-0  dropbox " style="width: 80%;">
              <input type="file"
                     @change="addImg" ref="inputer" name="file"
                     :multiple="'multiple'"
                     :accept="accept">
              <img class="align-self-center flex1" src="../../assets/images/cioud.svg" width="32"
                   style="cursor: pointer ; color: #ffffff" height="32"/>
              <span class="neutral-grey f-z12 align-self-center flex1" style="margin: 0 5px;">Drag and drop or</span>
              <span class="align-self-center blue flex1" v-if="files.length==0">browse</span>
          </div>
          <div style="position: absolute; right: 0px; left: 80%; top: 0px; height: 54px;">
              <button  v-if="!files.id" type="button" style="font-size: 14px; height: 100%; line-height: 31px; border-radius: 0 6px 6px 0" class="unis-btn unis-btn-primary unis-sm unis-btn unis-btn-primary color-white" @click="onUpload">Upload <span class="loading"  v-if="isLoading" style="margin-left: 25px; color: #ffffff; "></span></button>
          </div>

          <div style="width: 100%" class="itemLists">
              <div class="item" style="font-size: 14px;height: 30px" v-for="(files,index) in uploadFiles " :key="index">
                  <div class="unis-uploading-state">
                      <div class="details">
                          <div class="mation">
                              <span style="white-space:nowrap; color: #ffffff">{{files.name}}</span>
                          </div>
                      </div>
                      <i class="unis-cross" style="cursor: pointer;  margin-left: 30px;" @click.stop.prevent="removeFile(files, index)">
                          <input type="button"  >
                      </i>
                  </div>
              </div>
          </div>
      </div>
    <div  v-if="isShow">
        <table class="table-client" style="margin-top: 20px;" v-loading="isFilesLoading">
            <thead>
            <tr>
                <th>File Name</th>
                <th>Update By</th>
                <th>Time</th>
                <th style="text-align: right !important;">Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(files,index) in filesNames " :key="index">
                <td>{{files.name}}</td>
                <td>{{files.createdBy}}</td>
                <td>{{files.createdWhen}}</td>
                <td style="text-align: right  " >
                    <a style="cursor: pointer; margin-left: 25px;" v-if="files.id" @click.stop.prevent="downloadFile(files)">Download<span class="loading"  v-if="mapDownloadLoading[files.id]" style="margin-left: 25px; color: #ffffff; "></span></a>
                    <a style="cursor: pointer; margin-left: 25px; color: red" @click.stop.prevent="removeFile(files, index)">Remove<span class="loading" v-if="mapRemoveLoading[files.id]" style="margin-left: 25px; color: red; "></span></a>
                </td>
            </tr>
            </tbody>
        </table>
    </div>

    </div>
</template>
<style lang="scss" src="./table-drag-drop.scss"/>
