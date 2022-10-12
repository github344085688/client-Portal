<template>
  <div class="prompt-option-select">
    <div class="init-line">
      <div class="button" @click.stop.prevent="customizeTableShow">
        {{privateSelectFieldName}}
        <i class="icon el-select__caret el-input__icon el-icon-arrow-up" v-if="show"></i>
        <i class="icon el-select__caret el-input__icon el-icon-arrow-down " v-if="!show"></i>
      </div>
      <div class="table-detail" v-if="show && tableFileds.length>0">
        <div style="margin:5px 0px;">
          <div class="child-field" v-for=" (fields,index) in tableFileds">
            <div class="dispaay-flex boders">
              <div class="select-img">
                <img src="@/assets/images/shape-copy.svg" v-if="fields.checked" />
              </div>
              <span :key="fields.id" @click.stop.prevent="checkedFiled(fields)">{{fields.fieldName}}</span>
            </div>
            <div class="dispaay-flex boders" v-for=" (subset,$index) in fields.subsets">
              <div class="select-img">
                <img src="@/assets/images/shape-copy.svg" v-if="subset.checked" />
              </div>
              <span :title="subset.fieldName" class="padding-left" @click.stop.prevent="checkedFiled(subset)">{{subset.fieldName}}</span>
              <div class="delete-icon" @click.stop.prevent="onDeleteLayout(subset,$index)">
                <img src="@/assets/images/trash-icon.svg" />
              </div>
            </div>
          </div>
          <div class="create-new-layout" @click.stop.prevent="onCreateNewLayout()">
            Create New Layout
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" src="./hierarchy-option-select.scss">