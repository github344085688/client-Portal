<template>
  <div class="input tags-wrap">
    <div>
        <div class="tags" transition="tags" v-for="(tag,index) in value">
            <span class="content">{{tag}}</span><span class="del" @click="delTip(index)">&times;</span>
          </div>
          <textarea style="min-height: 40px !important;height: 40px !important;margin: 0px !important;line-height: 40px !important;width: 100% !important;" class="tags-input" type="text" 
          :placeholder="placeholder"
           v-model="text" @blur ="add(text)" @keyup.enter="add(text)" @keyup.17="split(text)" @keydown.delete="del(value.length - 1, text)"></textarea>
    </div>
    <textarea style="display:none;min-height: 40px !important;height: 40px !important;margin: 0px !important;line-height: 40px !important;" v-model="value"> </textarea>
  </div>
</template>
<style lang="scss" src="./tags-input.scss">
