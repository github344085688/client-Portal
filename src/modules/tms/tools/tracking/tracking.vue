<template>
    <div class="tools-tracking tms">

        <div class="grid-100 tablet-grid-100">

            <div class="grid-100 tablet-grid-100 container">
                <span class="component-title bold">Track Shipments </span>
            </div>
            <div class="margin-left grid-60 tablet-grid-60 container margin-top-50 ">

                <label class="input-label">Reference # or Tracking #</label>
                <input type="text" placeholder=""
                       :class="{'input-search': true, 'track-search': true, 'input-client-error': data_no_found && !is_init}" v-model="searchParams.pro"
                      >

                <span v-if="data_no_found && !is_init" class="error-message"><p>Could not find a shipment with Reference # or Tracking #</p></span>

            </div>

            <div class="grid-15 tablet-grid-15 container margin-top-50">
                <button @click="searchOrderHistoryByPro" :disabled="loading">Track</button>
            </div>

            <div class="grid-100 tablet-grid-100 container" v-loading="loading">
                <template v-if="!data_no_found && !is_init" >

                    <TrackProcessBar :stage="data.stage" :originDate="data.p_date" :originLocation="data.shipper_address" :destinationDate="data.d_date" :destinationLocation="data.consignee_address"></TrackProcessBar>

                    <div class="grid-100 tablet-grid-100 container title" v-if = "hasData()" >
                        <table class="table-tracking">
                            <thead>
                            <tr>
                                <th class="th">Date</th>
                                <th class="th">Status</th>
                                <th class="th">Location</th>
                            </tr>
                            </thead>
                            <tbody>
                            <template v-for="(items,date) in data.history">
                                <tr>
                                    <td colspan="3" class="date text-bold">{{date}}</td>
                                </tr>
                                <template v-for="detail in items">
                                    <tr>
                                        <td>{{detail.c_time}}</td>
                                        <td>{{detail.tms_order_log_text}}</td>
                                        <td>{{detail.tms_order_log_location}}</td>
                                    </tr>
                                </template>
                            </template>
                            </tbody>
                        </table>
                    </div>
                </template>

            </div>
        </div>
    </div>

</template>
<style lang="scss" src="./tracking.scss" />