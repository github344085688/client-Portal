<template>
    <div>
    <button :class="btnClass + 'unis-btn unis-dropdown unis-btn-option unis-btn-option-outline'" >{{value}}<div class="ball-pulse">
    </div>
        <ul v-loading="isLoading">
            <li v-for="name in exportDates" :key="name" @click.stop.prevent="selectExportName(name)">{{name}}</li>
        </ul>
    </button>
    </div>
</template>

<style lang="scss" src="./predefined-export-btn.scss">
