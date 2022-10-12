<template>
  <div class="static-customize-table">
    <div class="init-line">
      <button class="unis-btn unis-btn-primary" @click.stop.prevent="customizeTableShow">Customize
        Table
        <i class="fas fa-chevron-up dz-icon" v-if="show"></i>
        <i class="fas fa-chevron-down dz-icon" v-if="!show"></i>
      </button>

      <div class="table-detail" v-if="show && tableFileds.length>0">
        <div style="margin:5px 0px;">
          <div class="child-field" :class="{'selected':fields.checked}" v-for=" fields in tableFileds" :key="fields.fieldId"
            @click.stop.prevent="checkedFiled(fields)">
            <!-- <input type="checkbox" :id="fields.fieldId" :checked="fields.checked" @click.stop.prevent="checkedFiled(fields)">
                            <label class="checkbox" :for="fields.fieldId">
                                <span>{{fields.fieldName}}</span>
                            </label> -->
            <div class="select-img">
              <img src="@/assets/images/shape-copy.svg" v-if="fields.checked" />
            </div>
            <span>{{fields.fieldName}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./static-customize-table.scss">
