<template>
<div class="scroll-pager" >
    <div class="loading-text">
        <div class="text-center" v-show="!loading && !(pager.activedPage == pager.totalPage)"><span @click="loadMore">Load More...</span> </div>
    </div>

    <div class="line-scale" v-show="loading">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>

</div>

</template>
<style lang="scss" src="./scroll-pager.scss">