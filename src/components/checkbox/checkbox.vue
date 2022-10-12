<template>
    <div :class="{filled: checked, modify: isModify}">
        <div class='empty' @click="selected">
            <img src="../../assets/images/selected.svg" v-if="checked">
            <span class='checkbox-word' :class="{down: checked}">{{content}}</span>
         </div>
    </div>
    
</template>
<style lang="scss" src="./checkbox.scss"></style>