<template>
  <div class="unis-switch" style="display: block">
    <input type="checkbox" :name="name"  :checked="value" :disabled="disabled">
    <span class="unis-switch-style" @click.stop.prevent="onClickBottom()"></span>
  </div>
</template>
