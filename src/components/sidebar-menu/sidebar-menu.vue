<template>

    <!-- <ul style="display: none">
        <li class="nav-item " :class="{'open': menuItem.display === 'block'}" v-for="menuItem in menuData" :key="menuItem.title" @click.stop.prevent="clickLi(menuItem)" >
            <a v-bind:href="[menuItem.url]" class="nav-link nav-toggle" v-permission-check="menuItem.permissions">
                <div class="yellow-bg" v-if="judgeIsShowYellowTip(menuItem) "></div>
                <img :src="menuItem.imgSrc" />
                <span class="title" :class="{'yellow-color':menuItem.display === 'block' &&  !menuItem.subMenu}">{{menuItem.title}}</span>
                <span class="arrow" v-if="menuItem.subMenu && menuItem.subMenu.length > 0" style="float:right">
                    <i class="fas" :class="{'fa-angle-down': menuItem.display === 'block'}"></i>
                    <i class="fas " :class="{'fa-angle-right': menuItem.display != 'block'}"></i>
                </span>
            </a>
            <transition name="fade" mode="out-in" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:leave="leave" v-bind:css="false">
                <template v-if="menuItem.subMenu && menuItem.subMenu.length > 0">

                    <sidebar-menu :menu-data="menuItem.subMenu" class="sub-menu"  v-show="menuItem.display === 'block'" ></sidebar-menu>

                </template>
            </transition>
        </li>
    </ul> -->

    <div>
        <div :class="{'item_connect': true, 'active': menuItem && menuItem.display == 'block'}" v-for="menuItem in menuData" :key="menuItem.title" @click.stop.prevent="clickLi(menuItem)" v-show="menuItem.title" v-permission-check="menuItem.permissions">
            <div class="item_box">
                <div class="img-box">
                    <img :src="menuItem.imgSrc || require('../../../static/img/calculator.png')">
                </div>
                <div class="pro-ab">
                    <div class="text-box">
                        <a class="unis-a">
                            <img :src="require('../../assets/images/navbar/left_arrow_sh.svg')" alt="">
                            <div class="text">{{menuItem.title}}</div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>
<style lang="scss" src="./sidebar-menu.scss" />

