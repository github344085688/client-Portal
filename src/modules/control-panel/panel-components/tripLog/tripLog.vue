<template>
    <div class="small-cover" style="padding-top: 15px">
        <div class="panel_c_wrap" style="background: #fff">
            <div class="small-title">
                <h2>Trip Log <span v-if="currentTrip" style="font-size: 16px">({{currentTrip}})</span></h2>
            </div>
            <div class="small-panel-common-table" v-loading="getLogLoading">
                <div class="table-out triplog-table" style="height: 205px">
                    <table>
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Action</th>
                                <th>Type</th>
                                <th>Creator</th>
                                <th>Create Time</th>
                                <th>Driver / Carrier</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in tripLogArr" :key="index">
                                <td>#{{item.order_id}}</td>
                                <td>{{item.log_action}}</td>
                                <td>{{item.log_type}}</td>
                                <td>{{item.creator_firstlast}}</td>
                                <td>{{item.create_date}}</td>
                                <td>{{item.driver_name + ' / ' + item.carrier_override_name}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="./tripLog.scss"></style>