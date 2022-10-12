<template>
    <div class="single-date-range">
      <label class="input-label">{{label}}</label>
      <div class="datepicker-single-trigger">
        <input
          type="text"
          :id="'datepicker-input-single-trigger'+ label.replace(/\s*/g,'')"
          :value="formatDates(dateOne)"
          placeholder="Select dates"
          readonly="true"
        >
        <AirbnbStyleDatepicker
          :trigger-element-id="'datepicker-input-single-trigger'+ label.replace(/\s*/g,'')"
          :mode="'single'"
          :date-one="dateOne"
          :months-to-show="1"
          :show-action-buttons ="false"
          :show-shortcuts-menu-trigger="false"
          @date-one-selected="dateOneSelect"
        />
        <img src="@/assets/images/calendar-grey.svg" class="calendar-white" />
        <span class="el-icon-close clearDatepicker" v-show="dateOne" @click.stop.prevent="clearDatepicker"></span>
      </div>
    </div>
</template>
<style lang="scss" src="./single-date-range.scss">
