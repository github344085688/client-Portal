<template>
    <div class="driver-cover small-cover" style="height: 100%; padding-left: 15px; padding-top: 15px;position: relative;">
        <div class="driver-name">{{driverName}}</div>
        <div class="panel_c_wrap" style="height: 100%; background: #fff; box-shadow: none;">
            <ele-calendar 
                :lang="'en'"
                :render-content="renderContent"
                :data="driverDateList"
                :prop="prop"
                @select="daySelect"
            >
            </ele-calendar>
        </div>
    </div>
</template>
<style lang="scss" src="./driverCalendar.scss"></style>