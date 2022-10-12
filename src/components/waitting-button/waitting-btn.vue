<template>
    <div class="">
        <button :type="btnType" :class="btnClass + 'unis-btn unis-btn-primary'" :disabled="disabled || isLoading" @click="clickBtn">
            <i :class="iconClass"></i>
            {{value}}
            <div class="ball-pulse" v-if="isLoading">
                <div style="width:6px; height:6px;"></div>
                <div style="width:6px; height:6px;"></div>
                <div style="width:6px; height:6px;"></div>
            </div>
        </button>
    </div>
</template>
<style lang="scss" src="./waitting-btn.scss">