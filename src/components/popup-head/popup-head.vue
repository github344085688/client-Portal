<template>
  <transition name="fede">
    <div class="popup-head-box" :class="options.state" v-show="show">
      <div class="popup-head" >
      <span class=" left_box" :class="options.state" @click.stop="cancelBtn" >
        <i class="unis-cross" v-if="options.state == 'error'"></i>
        <i class="unis-draw" v-if="options.state == 'succeed'"></i>
      </span>
        <div class="conts" v-html="filtersErr()"></div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" src="./popup-head.scss"/>

