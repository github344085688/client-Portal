<template>

    <modal :name="modalName" :adaptive="true" :pivot-x="xPosition" :pivot-y="yPosition" :width="width" :height="height" :max-width="maxWidth" :max-height="maxHeight" :clickToClose="clickToClose">    
      <h1 class="h1-model-class">{{title}}<template v-if = "showXBtn"><button class="ui-button close-modal-x" @click="closeModal"></button></template></h1>
      <p class="p-model-class">{{message}}</p>
      <div class="slot_section">
          <slot></slot>
      </div>
   
      <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
        <div class="ui-dialog-buttonset">
            <button type="button" class="btn ui-button btn-default" :style="btnStyle" @click="btnAction">{{btnText}}</button>
        </div>
      </div>
    </modal>

</template>
<style lang="scss" src="./one-button-modal.scss" scoped></style>
