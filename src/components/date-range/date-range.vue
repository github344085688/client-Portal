<template>
    <div class="relative">
        <div class="date-dashbord buttom h-32-p " @click="dateRangeShow">
            <div class="d-flex align-items-center pl-2 pr-2" style=" height: 100%">
                <img src="@/assets/images/calendar-white.svg" class="calendar-white mr-2"/>
                <span class="color-white">{{transforToRangeTxt(dateRange.range)}}</span>
            </div>
        </div>
        <div class="date-selector" v-if="show">
            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-40 tablet-grid-50 container">
                    <label class="input-label">Date Range</label>
                    <div>
                        <element-select :class="'unis-date'" :options="dateRanges" v-model="dateRange.range" @remove="removeRange" @selectChange="selectRange" :filterable="true" :clearable="true">
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
                    <div class="datepicker-trigger" id="datepicker-trigger" v-if = "modeType!='MTD'">
                        <AirbnbStyleDatepicker :inline="datepickerSetUp.inline"  :trigger-element-id="'datepicker-trigger'" :min-date="minDate" :end-date="endDate" :show-action-buttons ="datepickerSetUp.showActionButtons" :show-shortcuts-menu-trigger="datepickerSetUp.showShortcutsMenuTrigger" :start-open="datepickerSetUp.startOpen" :mode="'range'"  :date-one="dateRange.timeFrom" :date-two="dateRange.timeTo" @date-one-selected="dateOneSelect" @date-two-selected="dateTwoSelect" ></AirbnbStyleDatepicker>
                    </div>
                    <div class="datepicker-trigger" id="datepicker-trigger" v-if = "modeType === 'MTD'">
                        <AirbnbStyleDatepicker :inline="datepickerSetUp.inline"  :trigger-element-id="'datepicker-trigger'" :show-action-buttons ="datepickerSetUp.showActionButtons" :show-shortcuts-menu-trigger="datepickerSetUp.showShortcutsMenuTrigger" :start-open="datepickerSetUp.startOpen" :mode="'single'"  :date-one="dateRange.timeTo"  @date-one-selected="dateOneSelect" ></AirbnbStyleDatepicker>
                    </div>
                </div>
            </div>
 
            <div>
                <div class="grid-50">
                    &nbsp;
                </div>
                <div class="grid-25">
                    <button class="unis-btn unis-btn-secondary" @click.stop.prevent="cancel"> Cancel</button>
                </div>
                <div class="grid-25">
                    <button class="unis-btn unis-btn-primary" @click.stop.prevent="apply"> Apply</button>
                </div>
            </div>

        </div>
    </div>
</template>
<style lang="scss" modules src="./date-range.scss">