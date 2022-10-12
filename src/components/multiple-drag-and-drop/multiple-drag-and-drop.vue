<template>
  <div class=" multiple-drag-and-drop " ref="select_frame" id="drop_area" :style="{'height':isShow? height + 'px' : '0px', 'font-size': isShow? '18px' : '0px'}">
    <div class="drop-or-browse d-flex justify-content-center  p-0  dropbox ">
      <input type="file"
             @change="addImg" ref="inputer" name="file"
             :multiple="'multiple'"
             :accept="accept">
        <img class="align-self-center flex1" src="../../assets/images/cioud.svg" width="32" style="cursor: pointer ; color: #ffffff" height="32"/>
        <span class="neutral-grey f-z12 align-self-center flex1" style="margin: 0 5px;" >Drag and drop or</span>
        <span class="align-self-center blue flex1" v-if="files.length==0">browse</span>
    </div>
    <div class="itemLists" v-if="isShow">
      <div class="item" style="font-size: 14px;height: 30px" v-for="(files,index) in filesNames " :key="index">
          <div class="unis-uploading-state">
              <div class="details">
                  <div class="mation">
                      <span style="white-space:nowrap; color: #ffffff">{{files.name}}</span>
                  </div>
                  <a style="cursor: pointer" v-if="files.id" @click.stop.prevent="downloadFile(files)">Download<span class="loading"  v-if="mapDownloadLoading[files.id]" style="margin-left: 25px; color: #ffffff; "></span></a>
              </div>
              <i class="unis-cross" style="cursor: pointer" @click.stop.prevent="removeFile(files, index)">
                  <input type="button"  >
              </i>
          </div>
          </div>

    </div>
    <waitting-btn v-if="isShow"
                  btn-class="unis-btn unis-btn-primary unis-sm unis-btn unis-btn-primary color-white"
                  @click="onUpload" 
                  value="Upload"
                  btn-type="button"
                  :is-loading="isLoading"
                  style="font-size: 14px"> 
    </waitting-btn>
      <!-- <button  v-if="isShow" type="button" style="font-size: 14px" class="unis-btn unis-btn-primary unis-sm unis-btn unis-btn-primary color-white" @click="onUpload">Upload <span class="loading"  v-if="isLoading" style="margin-left: 25px; color: #ffffff; "></span></button> -->
    </div>
</template>
<style lang="scss" src="./multiple-drag-and-drop.scss"/>
