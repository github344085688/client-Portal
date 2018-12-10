<template>
    <div class="inline-block">
        <button :type="btnType" :class="btnClass" :disabled="disabled" @click="clickBtn">
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