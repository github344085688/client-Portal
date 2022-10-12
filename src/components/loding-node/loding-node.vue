<template>
    <div class="ball-pulse" v-if="isLoading">
        <div style="width:6px; height:6px;"></div>
        <div style="width:6px; height:6px;"></div>
        <div style="width:6px; height:6px;"></div>
    </div>
</template>
<style lang="scss" src="./loding-node.scss">