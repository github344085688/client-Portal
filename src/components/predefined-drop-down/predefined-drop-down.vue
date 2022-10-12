<template>
    <div class="layout-select">
        <button class="layout-text" @click="onClickSelect">
          {{selectedName}}
          <i class="fas fa-chevron-up drop-icon" v-if="show"></i>
          <i class="fas fa-chevron-down drop-icon" v-if="!show"></i>
        </button>
        <div class="select-content" style="width:180px;" v-if="show">
          <div :class="{'layout-option':true,'item-selected': selectedName === data }" v-for="data in datas" :key='data' @click.stop.prevent="onSelectData(data)">
            <img src="@/assets/images/shape-copy.svg" class="selected-img" v-if="selectedName === data" />
            <label>{{data}}</label>
          </div>
        </div>
      </div>
</template>
<style lang="scss" src="./predefined-drop-down.scss">