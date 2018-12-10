<template>
  <div >
    <label class="radio-btn">
      <input type="checkbox" class="option-checkbox checkbox" v-model="innerValue" checked="true" @click="clickBtn">
      {{label}}
    </label>
  </div>
</template>
<style lang="scss" src="./radio-btn.scss">
