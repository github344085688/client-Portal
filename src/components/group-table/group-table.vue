<template>
  <div class="group-table">  
     <div class="group" v-if="!isCreateNewLayout">
      <label >Layout:</label>
      <hierarchy-option-select  :tableFileds="tableFileds" @setEmitSelectGroup="getEmitSelectGroup"  @setEmitDeleteLayout="getEmitDeleteLayout" @setEmitCreateNewLayout="getEmitCreateNewLayout" :selectFieldName="setSelectFieldName">  
      </hierarchy-option-select>
    </div>     
    <drag-into-groups :value="value"   v-if="isCreateNewLayout"  @setEmitUpDataNewLayout="getEmitUpDataNewLayout"  @setEmitSaveNewLayout="getEmitSaveNewLayout" @setEmitEmptyLayout="getEmitEmptyLayout" @setEmitCancelDropesList="getEmitCancelDropesList"> </drag-into-groups>        
  </div>
</template>
<style lang="scss" src="./group-table.scss">