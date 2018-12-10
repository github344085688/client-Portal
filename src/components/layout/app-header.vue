<template>
  <div class="header-bar">
    <dl>
      <img class="link" src="../../assets/images/header_icons/square-icon.svg" alt="">
      <img class="ative" src="../../assets/images/header_icons/square-icon-ative.svg" alt="">
      Apps
      <i class="el-icon-arrow-down"></i>
      <div class="ul-box">
        <img src="../../assets/images/header_icons/arrow-up-icon.svg" alt="">
        <ul>
          <li @click="switchSideBarMenu('transportation')">
            <img class="link" src="../../assets/images/header_icons/truck-trailer-icon.svg" alt="">
            <img class="ative" src="../../assets/images/header_icons/truck-trailer-icon-ative.svg" alt="">
            Transportation</li>
          <li @click="switchSideBarMenu('warehousing')">
            <img  class="link" src="../../assets/images/header_icons/warehouse-icon.svg" alt="">
            <img class="ative" src="../../assets/images/header_icons/warehouse-icon-ative.svg" alt="">
            Warehousing</li>
        </ul>
      </div>
    </dl>
    <dl>
      <img class="link" src="../../assets/images/header_icons/wrench-icon.svg" alt="">
      <img class="ative" src="../../assets/images/header_icons/wrench-icon-ative.svg" alt="">
      Tools
      <i class="el-icon-arrow-down"></i>
      <div class="ul-box">
        <img src="../../assets/images/header_icons/arrow-up-icon.svg" alt="">
        <ul>
          <li @click="switchSideBarMenu('tools')">
            <img class="link" src="../../assets/images/header_icons/truck-trailer-icon.svg" alt="">
            <img class="ative" src="../../assets/images/header_icons/truck-trailer-icon-ative.svg" alt="">
            Tracking</li>
        </ul>
      </div>
    </dl>
    <dl>
      <img class="link" src="../../assets/images/header_icons/noteboox-icon.svg" alt="">
      <img class="ative" src="../../assets/images/header_icons/noteboox-icon-ative.svg" alt="">
      Reports <i class="el-icon-arrow-down"></i>
    </dl>
    <div class="log-out" >
      <div class="log-icon">{{userName}}</div><i class="el-icon-arrow-down"></i>
      <div class="log-out_box" @click="loginOut">
        Logout
      </div>
    </div>
  </div>
</template>
<style lang="scss" src="./app-header.scss"/>
