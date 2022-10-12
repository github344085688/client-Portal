<template>
  <div class="input">
      <input type="text" v-model="inputValue" :placeholder="placeholder"
             @blur="handleBlur($event)"
      />

  </div>
</template>
<style lang="scss" src="./fill-input.scss">
