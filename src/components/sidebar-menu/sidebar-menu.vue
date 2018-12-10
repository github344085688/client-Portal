<template>

    <ul>
        <!-- <transition-group  tag="li" > -->
        <li class="nav-item " :class="{'open': menuItem.display === 'block'}" v-for="menuItem in menuData" :key="menuItem.title" @click.stop.prevent="clickLi(menuItem)" >
            <a v-bind:href="[menuItem.url]" class="nav-link nav-toggle">
                <div class="yellow-bg" v-if="judgeIsShowYellowTip(menuItem) "></div>
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
        <!-- </transition-group> -->
    </ul>
</template>
<style lang="scss" src="./sidebar-menu.scss" />

