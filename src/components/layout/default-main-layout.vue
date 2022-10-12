<template>
  <div>

    <!-- BEGIN CONTAINER -->
    <div class="sidebar-menu">

      <!-- <div class="page-sidebar navbar-collapse collapse side-bar side-bar-transition " :class="{isBlur:isBlur,'side-bar-show':showOrHideSideBar,'side-bar-hide':!showOrHideSideBar}">

        <div class="menu-tip">
          <div class="unis-image">
            <img src="@/assets/images/unis.svg" :class="{'img-show':showOrHideSideBar,'img-hide':!showOrHideSideBar}"
              alt="logo" />
          </div>
          <div class="nav-line" @click="clickLog">
            <img src="@/assets/images/nav-line.svg" alt="flex-logo" width="20" height="12" />
          </div>

        </div>
        <div class="module-title">{{showOrHideSideBar?project:''}}</div>
        <div  v-if="showOrHideSideBar">
          <sidebar-menu :menu-data="menuData" class="page-sidebar-menu"></sidebar-menu>
        </div>

      </div> -->


      <div class="unis-aside">
        <div :class="{'aside-fold': !showFirst, 'aside-unfold': true}">
          <div class="aside-controller" @click="clickLog">
               <b class="right">
                    <i class="right-arrow1"></i>
                    <i class="right-arrow2"></i>
               </b>
          </div>
          <div :class="{'parent-level-small': (menuItem.subMenu && menuItem.subMenu.length > 0) || !showFirst, 'parent-level-big': true}">
               <div class="log-big">
                    <img v-if="!enableSaasMode" :src="require('../../assets/images/navbar/logo.svg')" alt=""> 
                    <span v-else class="opera_logo">Opera8</span>
               </div>
               <div class="log-nano">
                    <img v-if="!enableSaasMode" :src="require('../../assets/images/navbar/logo-nano.svg')" alt="">
                    <span v-else class="opera_logo">O</span>
               </div>
               <sidebar-menu :menu-data="menuData" @chooseItem="chooseItem" class="page-sidebar-menu"></sidebar-menu>
          </div>
          <div :class="{'parent-details': true, 'fold-details': showSubMenu }">
            <div class="business-box">
              <div class="business">{{menuItem.title}}</div>
              <div :class="{'business-item': true, 'active': item.display == 'block'}" v-for="(item, index) in menuItem.subMenu" :key="index" @click="clickLi(item)">
                <a class="unis-a">{{item.title}}</a>
              </div>
            </div>
          </div>
      </div>
    </div>


      <app-header @sideBarMenuData="switchSideBarMenuData" :isBlur="isBlur" :class="{'sidebar-change':!showFirst}"></app-header>
      <!-- BEGIN CONTENT -->
      <div class="page-content-wrapper" :class="{'swapper-change':!showFirst}">
        <div class="page-content">
          <!-- BEGIN ACTUAL CONTENT -->
          <div>
            <div style="padding: 20px;">

              <router-view @toBlur="toBlur" v-if="!isRouterAlive">

              </router-view>
            </div>
          </div>

          <!-- END ACTUAL CONTENT -->
        </div>
      </div>
      <!-- END CONTENT -->
    </div>
  </div>
</template>
<style lang="scss" src="./default-main-layout.scss" scoped></style>
