<template>
  <div class="header-bar" :class="{isBlur: isBlur}" style="padding-left: 30px">
    <dl>
      <img class="link" src="../../assets/images/header_icons/square-icon.svg" alt="">
      <img class="ative" src="../../assets/images/header_icons/square-icon-ative.svg" alt="">
      Apps
      <i class="el-icon-arrow-down"></i>
      <div class="ul-box">
        <img src="../../assets/images/header_icons/arrow-up-icon.svg" alt="">
        <ul>
          <li v-if="judgePermissionForMenu('transportation::transportation_read')" @click="switchSideBarMenu('transportation')">
            <img class="link" src="../../assets/images/header_icons/truck-trailer-icon.svg" alt="">
            <img class="ative" src="../../assets/images/header_icons/truck-trailer-icon-ative.svg" alt="">
            Transportation</li>
          <li v-if="judgePermissionForMenu('warehousing::warehousing_read')" @click="switchSideBarMenu('warehousing')">
            <img  class="link" src="../../assets/images/header_icons/warehouse-icon.svg" alt="">
            <img class="ative" src="../../assets/images/header_icons/warehouse-icon-ative.svg" alt="">
            Warehousing</li>
          <li  v-if="judgePermissionForMenu('controlPanel::controlPanel_read')" @click="switchSideBarMenu('controlpanel')">
            <img  class="link" src="../../assets/images/header_icons/table-icon.svg" alt="">
            <img class="ative" src="../../assets/images/header_icons/table-icon.svg" alt="">
            Controlpanel</li>
          <li  v-if="judgePermissionForMenu('idm::idm_read')" @click="switchSideBarMenu('idm')">
            <img  class="link" src="../../assets/images/header_icons/id-management-icon.svg" alt="">
            <img class="ative" src="../../assets/images/header_icons/id-management-icon.svg" alt="">
            ID Management</li>
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
