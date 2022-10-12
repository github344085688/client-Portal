<template>
  <transition>
    <div class="pop-up-windows">
      <div class="pop-up-pos-re">
        <div class="pop-up-content-box p-0 m-0 animated fadeIn" :style="{'height':height +'px','width':width +'%' }">
          <div class="content-box d-flex flex-wrap justify-content-between">
            <div class="col-12 p-0 flex-grow1">
              <div class="card">
                <div class="card-header">
                  {{tlitle}}
                </div>
                <div class="card-body" :style="{'height':(height - 120) +'px'}">
                  <slot></slot>
                </div>
              </div>
            </div>
            <div class="d-flex align-items-center flex-grow0" style="padding-right: 15px; margin-top: 5px;">
              <div class="ml-auto d-flex align-items-center">
                <div class="col-6" style="margin-right: 15px;">
                  <button type="button"  class="unis-btn unis-btn-tertiary" @click.stop.prevent="cancel">Cancel</button>
                </div>
                <div class="col-6" v-if="isSubmit">
                    <button type="submit" class="unis-btn unis-btn-primary unis-sm unis-btn unis-btn-primary color-white">Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" src="./pop-up-windows.scss"/>
