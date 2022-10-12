<template>

    <modal :name="modalName" :adaptive="true" :pivot-x="xPosition" :pivot-y="yPosition" :width="width" :height="height" :max-width="maxWidth" :max-height="maxHeight" :clickToClose="true">    
      <h1 class="h1-model-class">{{title}}</h1>
      <p class="p-model-class">{{message}}</p>
      <div class="slot_section">
          <slot></slot>
      </div>
   
      <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix" v-if="!noButtons">
        <div class="ui-dialog-buttonset">
            <button type="button" class="ui-button ui-corner-all ui-widget delete" :style="rightBtnStyle" @click="rightBtnAction">{{rightBtnText}}</button>
            <button type="button" class="btn ui-button btn-default" :style="leftBtnStyle" @click="leftBtnAction">{{leftBtnText}}</button>
        </div>
      </div>
    </modal>

</template>
<style lang="scss" src="./modal.scss" scoped></style>
