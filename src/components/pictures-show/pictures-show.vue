<template>
  <div class="pictures-show">
    <div class="pictures_box">
      <i class="el-icon-close close" @click="leave"></i>
      <ul :style="{'width':phptoList.length>6? 275*phptoList.length+'px':'1100px'}">
        <li v-for="item in phptoList" :style="{'width':phptoList.length>6? '270px':'340px'}">
          <a target="_blank" :href="item['file_original_url']">
            <div class="img-box">
              <img v-if="! item['file_thumbnail_url']" src="../../assets/images/d-img.jpg"/>
              <img :src="item['file_thumbnail_url']" alt="" v-if="item['file_thumbnail_url']"
                   :style="{'width':phptoList.length>6? '200px':'280px'}">
            </div>
            <label>{{item['file_category_name']}}</label>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss" src="./pictures-show.scss">
