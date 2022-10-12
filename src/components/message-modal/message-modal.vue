<template>
    <modal :name="modalName"  :adaptive="true" :reset="reset" :waitMillsSecondsToClose="waitMillsSecondsToClose" :pivot-y="yPosition" :width="width" :height="height" :max-width="maxWidth" :max-height="maxHeight" @closed="closeAction" @opened="closeModelAfterSecond" :clickToClose="clickToClose">
      <h1 class="h1-model-class" :style="{color:titleColor}">{{title}}</h1>
      <p class="p-model-class">{{message}}</p>
      <slot></slot>
      <div v-if = "showCloseBtn" class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
        <div class="ui-dialog-buttonset">
          <button type="button" class="btn ui-button btn-default"  @click="closeModel">{{btnText}}</button>
        </div>
      </div>
    </modal>
</template>
<style lang="scss" src="./message-modal.scss" scoped></style>
