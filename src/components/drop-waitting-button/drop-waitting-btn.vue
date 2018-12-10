<template>
  <div class="drop-waitting-btn">
    <button class="waitting-btn flexNowrap">
      <div class="selectValue">
        <span v-html="selectValue ? selectValue : value"></span>
        <div class="ball-pulse" v-if="isLoading" >
          <div style="width:6px; height:6px;"></div>
          <div style="width:6px; height:6px;"></div>
          <div style="width:6px; height:6px;"></div>
        </div>
      </div>
      <div v-if="isexport" class="icon-export"><span class="el-icon-caret-bottom"></span></div>
      <i v-if="! isexport" :class="selectValue=='Sort: Descending' ? 'transform-rotate' : ''"><img src="@/assets/images/arrow-up.svg"
          alt=""></i>
      <ul class="export-list" v-if="selectList.length>1">
        <li v-for="item in selectList" @click="clickBtn(item)">{{item}}</li>
      </ul>
    </button>
  </div>
</template>
<style lang="scss" src="./drop-waitting-btn.scss">