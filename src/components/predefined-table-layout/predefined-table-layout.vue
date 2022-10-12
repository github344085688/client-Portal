<template>
  <div>
    <div class="predifined-layout" v-if="!isCreateLayout">
      <div class="group-view">
        <label>Layout :</label>
        <div class="layout-select">
          <button class="layout-text" @click="onClickLayoutSelect">
            {{selectedLayoutName}}
            <i class="fas fa-chevron-up drop-icon" v-if="show"></i>
            <i class="fas fa-chevron-down drop-icon" v-if="!show"></i>
          </button>
          <div class="select-content" v-if="show">
            <div :class="{'layout-option':true,'item-selected':layout.selected}" v-for="(layout,index) in groupViewLayouts"
              :key='layout.id' @click.stop.prevent="onSelectLayout(layout)">
              <img src="@/assets/images/shape-copy.svg" class="selected-img" v-if="layout.selected" />
              <label>{{layout.name}}</label>
              <img class="deleteImg" src="@/assets/images/trash-icon.svg" @click.stop.prevent="onClickDeleteLayout(layout,index)" />
            </div>
            <div class="layout-option" @click.stop.prevent="onClickDefaultLayout()">default layout</div>
            <div class="line"></div>
            <div class="layout-option" @click.stop.prevent="onClickIsCreateNewLayout">Create New Layout</div>
          </div>
        </div>

        <el-tooltip class="item" effect="dark" content="The Max No. to display of the current setting is limited to 1000 lines, Please download the file for further analyst." placement="right">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
        <!-- <b>The Max No. to display of the current setting is limited to 1000 lines, Please download the file for further analyst.</b> -->
      </div>
      <div class="layout-model right" v-if="isShowModes">
          <label>View Mode :</label>
          <div class="layout-select">
              <button class="layout-text" @click="onClickViewModeSelect">
                {{selectedViewModeName}}
                <i class="fas fa-chevron-up drop-icon" v-if="showMode"></i>
                <i class="fas fa-chevron-down drop-icon" v-if="!showMode"></i>
              </button>
              <div class="select-content" style="width:180px;" v-if="showMode">
                <div :class="{'layout-option':true,'item-selected': selectedViewModeName === viewMode }" v-for="viewMode in viewModes" :key='viewMode' @click.stop.prevent="onSelecViewMode(viewMode)">
                  <img src="@/assets/images/shape-copy.svg" class="selected-img" v-if="selectedViewModeName === viewMode" />
                  <label>{{viewMode}}</label>
                </div>
              </div>
            </div>
      </div>
    </div>
    <div class="insert-table-header" v-if="isCreateLayout">

      <div class="drag-into-groups" @drop="onDrop($event)" @dragover="onAllowDrop($event)">
        <div class="button-box">
          <div style="padding-left:25px; color: #979797;" v-if="groupViewCustomization.groupColumns.length < 1"> Drag a
            column header and drop it
            here to group by that column </div>
          <div class="button" v-for="dropItem in groupViewCustomization.sortFields">
            <div class="sort-box">
              <div style="height:20px;">
                <img src="../../assets/images/arrow-up.svg" v-show="dropItem.sort" style="height:20px;" :class="dropItem.sort === 'asc' ? '' :'rotate' " @click.stop.prevent="onSortField(dropItem)">
              </div>
              <div class="text" @click.stop.prevent="onSortField(dropItem)">{{dropItem.name}}</div>
              <img src="../../assets/images/closed-icon.svg" alt="" style="height:15px;" @click.stop.prevent="onRemoveFieldName(dropItem)">
            </div>
          </div>
        </div>
        <div class="operation">
          <div class="cancel" @click.stop.prevent="onCancelLayout">
            Cancel
          </div>
          <div class="save" @click.stop.prevent="onPopUpDialog" v-if="groupViewCustomization.groupColumns.length > 0">
            Save Layout As
          </div>
        </div>
        <predefined-dialogs :setStyle="{'width':'30%','height':'180px'}" :title="'Save Layout As'" v-if="isPopDialog">
          <div slot="content">
            <div class="layoutList">
              <input class="layoutName" v-model="groupViewCustomization.name" placeholder="Input layout name" :class="{'layoutNameError':!groupViewCustomization.name}">
            </div>
          </div>
          <div slot="bottom">
            <div class="layoutBottom">
              <div style="width:70%">
                <waitting-btn btn-class="unis-btn unis-btn-primary cancel_botton h-40-p" @click="onPopUpCancel" :value="'Cancel'">
                </waitting-btn>
              </div>
              <div>
                <waitting-btn btn-class="unis-btn unis-btn-primary save_botton h-40" @click="onSaveLayout" :value="'SAVE'" :is-loading="loading">
                </waitting-btn>

              </div>
            </div>
          </div>
        </predefined-dialogs>
      </div>


    </div>
  </div>
</template>
<style lang="scss" src="./predefined-table-layout.scss"></style>
