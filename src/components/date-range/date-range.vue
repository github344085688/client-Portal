<template>
    <div class="relative">
        <div class="date-dashbord buttom" @click="dateRangeShow">
            <div class="date-img">
                <img src="@/assets/images/calendar-white.svg" class="calendar-white" />
            </div>
            <div class="date-font">
                <span class="color-white">{{transforToRangeTxt(dateRange.range)}}</span>
            </div>
        </div>
        <div class="date-selector" v-if="show">
            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-40 tablet-grid-50 container">
                    <label class="input-label">Date Range</label>
                    <div>
                        <element-select :options="dateRanges" v-model="dateRange.range" @remove="removeRange" @selectChange="selectRange" :filterable="true" :clearable="true">
                        </element-select>
                    </div>

                </div>
            </div>
            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-50 tablet-grid-50 container">
                    <label class="input-label">Start</label>
                    <div class="cover-parent">
                        <div class="cover"></div>
                        <input type="text" :value="formatDates(dateRange.timeFrom)" />
                    </div>
    

                </div>
                <div class="grid-50 tablet-grid-50 container" style="padding-right:0px">
                    <label class="input-label">End</label>
                    <div class="cover-parent">
                        <div class="cover"></div>
                        <input type="text" :value="formatDates(dateRange.timeTo)" />
                    </div>
        
                </div>
                <div>
                    <div class="datepicker-trigger" id="datepicker-trigger">
                        <AirbnbStyleDatepicker :inline="datepickerSetUp.inline"  :trigger-element-id="'datepicker-trigger'" :show-action-buttons ="datepickerSetUp.showActionButtons" :show-shortcuts-menu-trigger="datepickerSetUp.showShortcutsMenuTrigger" :start-open="datepickerSetUp.startOpen" :mode="'range'"  :date-one="dateRange.timeFrom" :date-two="dateRange.timeTo" @date-one-selected="dateOneSelect" @date-two-selected="dateTwoSelect" ></AirbnbStyleDatepicker>
                    </div>
                </div>
            </div>
            <!-- <div class="date-range-pick">
                <date-range-picker :startDate="startDate" :endDate="endDate" :ranges="ranges" :autoApply="autoApply" @update="console.log(value)"></date-range-picker>
            </div> -->
            <div>
                <div class="grid-50">
                    &nbsp;
                </div>
                <div class="grid-25">
                    <button class="button-unis bg-white" @click.stop.prevent="cancel"> Cancel</button>
                </div>
                <div class="grid-25">
                    <button class="button-unis color-white" @click.stop.prevent="apply"> Apply</button>
                </div>
            </div>

        </div>
    </div>
</template>
<style lang="scss" src="./date-range.scss">