<template>
  <div class="table-field grid-100">
    <div class="init-line">
      <button class="unis-btn-primary color-white" @click.stop.prevent="customizeTableShow" >Customize
        Table
        <i class="fas fa-chevron-up dz-icon" v-if="show"></i>
        <i class="fas fa-chevron-down dz-icon" v-if="!show"></i>
      </button>

      <div class="table-detail grid-100" v-show="show">

        <div :class="{'grid-70':customizitionTableView.idLevelFieldMappings && customizitionTableView.idLevelFieldMappings.length>0,'table-all':true} ">

          <div class="grid-100 padding-0 general">
            <div class="grid-100"><b>General</b></div>
            <div class="child-field" v-for=" general in customizitionTableView.generalLevelFieldMappings" :key="general.id">
              <div class="field-option grid-25" @click.stop.prevent="checkedField(general)" v-if="!isDynTxtProperty(general.customerField)">
                <div class="select-img">
                  <img src="@/assets/images/shape-copy.svg" v-if="general.isDefaultField" />
                </div>
                <span>{{general.customerField}}</span>
              </div>
              <div class="field-option grid-25"  @click.stop.prevent="checkedField(generalDyn)" v-for=" generalDyn in customizitionTableView.generalDynFields"
                v-if="isDynTxtProperty(general.customerField)">
                <div class="select-img">
                  <img src="@/assets/images/shape-copy.svg" v-if="generalDyn.isDefaultField" />
                </div>
                <span>{{generalDyn.dynAlisas}}</span>
              </div>
            </div>
          </div>

          <div class="grid-100 padding-0 top" v-if='customizitionTableView.detailLevelFieldMappings && customizitionTableView.detailLevelFieldMappings.length>0'>
            <div class="grid-100 detail"><b>Detail</b></div>
            <div class="child-field" v-for=" detail in customizitionTableView.detailLevelFieldMappings" :key="detail.id">
              <div class="field-option grid-25" @click.stop.prevent="checkedField(detail)" v-if="!isItemLineDynTxtProperty(detail.customerField)">
                <div class="select-img">
                  <img src="@/assets/images/shape-copy.svg" v-if="detail.isDefaultField" />
                </div>
                <span>{{detail.customerField}}</span>
              </div>
              <div class="field-option grid-25" @click.stop.prevent="checkedField(detailDyn)" v-for=" detailDyn in customizitionTableView.detailDynFields"
                v-if="isItemLineDynTxtProperty(detail.customerField)">
                <div class="select-img">
                  <img src="@/assets/images/shape-copy.svg" v-if="detailDyn.isDefaultField" />
                </div>
                <span>{{detailDyn.dynAlisas}}</span>
              </div>
            </div>
          </div>

        </div>
        
      
        <div class="grid-15 padding-0" v-if="customizitionTableView.idLevelFieldMappings && customizitionTableView.idLevelFieldMappings.length>0">
          <div class="linellae" ></div>
          <div class="grid-100"><b>ID</b></div>
          <div class="child-field" v-for=" idLevel in customizitionTableView.idLevelFieldMappings" :key="idLevel.id"
            @click.stop.prevent="checkedField(idLevel)">
            <div class="field-option grid-100">
              <div class="select-img">
                <img src="@/assets/images/shape-copy.svg" v-if="idLevel.isDefaultField" />
              </div>
              <span>{{idLevel.customerField}}</span>
            </div>

          </div>
        </div>

        <div class="grid-15 padding-0" v-if="customizitionTableView.cartonLevelFieldMappings && customizitionTableView.cartonLevelFieldMappings.length>0">
          <div class="linellae" ></div>
          <div class="grid-100"><b>Carton</b></div>
          <div class="child-field" v-for=" cartonLevel in customizitionTableView.cartonLevelFieldMappings" :key="cartonLevel.id"
            @click.stop.prevent="checkedField(cartonLevel)">
            <div class="field-option grid-100">
              <div class="select-img">
                <img src="@/assets/images/shape-copy.svg" v-if="cartonLevel.isDefaultField" />
              </div>
              <span>{{cartonLevel.customerField}}</span>
            </div>

          </div>
        </div>


      </div>
    </div>
  </div>
</template>
<style lang="scss" src="./customize-table.scss">
