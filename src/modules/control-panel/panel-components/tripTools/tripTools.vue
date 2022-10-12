<template>
    <div class="trip-tool grid-100">
        <div class="tools-tab">
            <div class="tools-tab-tit clearfix">
                <div :class="[selectTools[0] ? 'grid-33 choose' : 'grid-33']" @click="selectToolsFun(0)">Trip</div>
                <div :class="[selectTools[1] ? 'grid-33 choose' : 'grid-33']" @click="selectToolsFun(1)">Print</div>
                <div :class="[selectTools[2] ? 'grid-33 choose' : 'grid-33']" @click="selectToolsFun(2)">Common Tools</div>
            </div>
            <div class="tools-tab-con">
                <div v-show="selectTools[0]">
                    <span class="tool-item" @click="getTripSummary">Trip Summary</span>
                    <span class="tool-item" @click="getTripManifest">Trip Manifest</span>
                    <span class="tool-item" @click="getTripMarginPdf">Trip Margin</span>
                    <span class="tool-item" @click="getTripMarginExcel">Trip Margin Excel</span>
                    <span class="tool-item" @click="getTripLoadSheetPdf">Load Sheet</span>
                    <span class="tool-item" @click="getTripDailyManifestPdf">Daily Manifest</span>
                </div>
                <div v-show="selectTools[1]">
                    <span class="tool-item" @click="getTripDrPdf">DR</span>
                    <span class="tool-item" @click="getTripDrDeliveryPdf">DR Delivery</span>
                    <span class="tool-item" @click="getTripCarrierBolPdf">Carrier BOL</span>
                </div>
                <div v-show="selectTools[2]">
                    <span class="tool-item" @click="refreshTrip">Refresh</span>
                    <span class="tool-item" v-if="tripDetail.can_do_complete" @click="makeTripComplete">Complete Dispatch</span>
                    <span class="tool-item" v-if="tripDetail.can_do_incomplete" @click="makeTripIncomplete">Incomplete Dispatch</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="./tripTools.scss"></style>