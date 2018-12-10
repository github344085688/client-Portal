<template>
  <div class="predefined-export">
    <div class="init-line" :class="btnClass">
      <button class="button-export color-white" :disabled="disabled"  @click.stop.prevent="customizeTableShow" style="padding: 0px 5px 0px 10px;">
          {{value}}
        <div class="ball-pulse" v-if="isLoading">
          <div style="width:6px; height:6px;"></div>
          <div style="width:6px; height:6px;"></div>
          <div style="width:6px; height:6px;"></div>
        </div>
        <i class="fas fa-chevron-up dz-icon" v-if="show"></i>
        <i class="fas fa-chevron-down dz-icon" v-if="!show"></i>
      </button>

      <div class="export-detail" v-if="show && exportDates.length>0">
        <div>
          <div class="child-export" v-for="name in exportDates" :key="name" @click.stop.prevent="selectExportName(name)">
            <span>{{name}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./predefined-export-btn.scss">
