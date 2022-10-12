<template>
    <div class="small-cover" style="padding-top: 15px">
        <div class="panel_c_wrap" style="background: #fff">
            <div class="small-title">
                <h2>Order History <span v-if="currentOrder" style="font-size: 16px">{{`(${currentOrder})`}}</span></h2>
            </div>
            <div class="small-panel-common-table" v-loading="loadingHistory">
                <div class="table-out order-table" style="height: 205px">
                    <table>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Event</th>
                                <th>Location</th>
                                <th>Driver/Carrier</th>
                                <th>Trip</th>
                                <th>LineHaul</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in orderHistoryArr" :key="index">
                                <td>{{item.create_date}}</td>
                                <td>{{item.event}}</td>
                                <td>{{item.log_location}}</td>
                                <td>{{item.driver_name}} / {{item.carrier_name}}</td>
                                <td>{{item.trip_no}}</td>
                                <td>{{item.lh_id}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="./orderHistory.scss"></style>