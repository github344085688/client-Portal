<template>
    <div class="detail-dialog" v-show="showTripDetail" v-loading="loadingTrip">
        <div class="close-dialog" @click="closeDialog">╳</div>
        <div class="dialog-title">Trip Detail ({{tripDetail.trip_no}})</div>
        <div class="dialog-detail">
            <div class="grid-100 tablet-grid-100 item-row">
                <div class="grid-25">
                    <div class="title">Trip Status</div>
                    <p>{{tripDetail.trip_status_category}}</p>
                </div>
                <div class="grid-25">
                    <div class="title">Carrier</div>
                    <p>{{tripDetail.carrier_name}}</p>
                </div>
                <div class="grid-25">
                    <div class="title">Priority</div>
                    <p>{{tripDetail.priority}}</p>
                </div>
                <div class="grid-25">
                    <div class="title">Service Level</div>
                    <p>{{tripDetail.service_level}}</p>
                </div>
            </div>
            <div class="grid-100 tablet-grid-100 item-row">
                <div class="grid-25">
                    <div class="title">Driver</div>
                    <p>{{tripDetail.driver_firstname + ' ' + tripDetail.driver_lastname}}</p>
                </div>
                <div class="grid-25">
                    <div class="title">Total Mileage</div>
                    <p>{{tripDetail.total_mileage}} miles</p>
                </div>
                <div class="grid-25">
                    <div class="title">Dispatcher</div>
                    <p>{{tripDetail.dispatcher}}</p>
                </div>
                <div class="grid-25">
                    <div class="title">Type</div>
                    <p>{{tripDetail.trip_type}}</p>
                </div>
            </div>
            <div class="grid-100 tablet-grid-100 item-row">
                <div class="grid-100" v-if="tripDetail.original_terminal != undefined">
                    <div class="title">Origin Terminal</div>
                    <p>{{tripDetail.original_terminal.location_code}} / {{(tripDetail.original_terminal.location_street ? tripDetail.original_terminal.location_street + ',' : '')
                    + (tripDetail.original_terminal.location_city ? tripDetail.original_terminal.location_city + ',' : '')
                    + (tripDetail.original_terminal.location_state ? tripDetail.original_terminal.location_state + ',' : '')
                    + tripDetail.destination_terminal.location_zip}}</p>
                </div>
            </div>
            <div class="grid-100 tablet-grid-100 item-row">
                <div class="grid-100" v-if="tripDetail.destination_terminal != undefined">
                    <div class="title">End Terminal</div>
                    <p>{{tripDetail.destination_terminal.location_code}} / {{(tripDetail.destination_terminal.location_street ? tripDetail.destination_terminal.location_street + ',' : '')
                    + (tripDetail.destination_terminal.location_city ? tripDetail.destination_terminal.location_city + ',' : '')
                    + (tripDetail.destination_terminal.location_state ? tripDetail.destination_terminal.location_state + ',' : '')
                    + tripDetail.destination_terminal.location_zip}}</p>
                </div>
            </div>
            <div class="grid-100 tablet-grid-100 tripDetail-row" style="padding: 0 0 0 15px">
                <div class="grid-100" style="padding: 0 0 0 5px; margin-bottom: 10px">
                    <div class="title">Date</div>
                    <p>{{tripDetail.trip_start_date + ' ' + tripDetail.trip_start_time_from  + ' > ' + tripDetail.trip_end_date + ' ' + tripDetail.trip_start_time_to}}</p>
                </div>
            </div>
            <div class="grid-100" style="padding: 0; margin-bottom: 15px">
                <button class="unis-btn unis-btn-primary grid-50 right" @click="editTripTask()">Edit Trip</button>
            </div>
            <div class="task-con">
                <h4 style="margin-bottom: 10px">Equipment Groups</h4>
                <!-- <div class="per-task">
                    <p>Truck Inspection: {{tripDetail.truck_inspection ? 'Yes' : 'No'}}</p>
                </div> -->
                <p class="stop-tips">Tips: Drag stop to change sequence, then click save change to save</p>
                <div class="per-task" v-for="(task, index) in tripDetail.tasks" :key="index">
                    <p>Task{{index+1}}: Trailer #{{task.trailer_id}} / Tractor #{{task.vehicle_name}}</p>
                    <draggable group="stop" :value="task.stops" @end="handleStopChange($event, index)" :data-index="index">
                        <div :class="stop.slect ? 'task-detail move-stop' : 'task-detail'" v-for="(stop, stopIndex) in task.stops" :key="stopIndex" @mousemove="stop.slect = true" @mouseleave="stop.slect = false">
                            <h4>Stop{{stop.stop_sequence}}
                                <span class="right" style="padding-right: 10px">{{stop.stage_text}}</span>
                            </h4>
                            <div class="per-row clearfix" v-if="stop.stage != 'truck inspection'">
                                <div class="grid-25">
                                    <span>Status</span>
                                    <strong>{{stop.status}}</strong>
                                </div>
                                <div class="grid-35" v-if="stop.stage_text != 'linehaul'">
                                    <span>Orders</span>
                                    <div v-for="(line, lineIndex) in stop.lines" :key="lineIndex">
                                        <div v-for="(order, orderIndex) in line.orders" :key="orderIndex">
                                            <div class="per-stop-order">
                                                <span :class="(order.current_stage == 2 || order.current_stage == 3 || order.current_stage == 5) ? 'order-complete' : '' ">{{order.order_pro ? ('Pro: ' + order.order_pro) : ('PU: ' + order.pu_id ? order.pu_id : '')}}</span>
                                                <em v-if="stop.void == 1">cancelled on the trip</em>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="grid-35" v-else>
                                    <span>LineHaul</span>
                                    <div class="trip-linehaul per-stop-order"  v-for="(line, lineIndex) in stop.lines" :key="lineIndex" @click="showLineHaulOrders(line)" >#{{line.lh_id}}
                                        <div class="linehual-con" v-show="line.showLineHaulOrders">
                                            <div class="grid-100">
                                                <div class="close-dialog" @click="hideLineHaulOrders(line, $event)">╳</div>
                                                <div class="dialog-title">LineHaul #{{line.lh_id}}</div>
                                            </div>
                                            <div class="grid-100" style="margin-top: 10px">Orders</div>
                                            <div class="grid-100 line-orders-list">
                                                <span :class="order.current_stage == 2 || order.current_stage == 3 || order.current_stage == 5 ? 'order-complete' : ''" v-for="(order, orderIndex) in line.orders" :key="orderIndex">{{order.order_pro ? ('Pro: ' + order.order_pro) : ('PU: ' + order.pu_id ? order.pu_id : '')}}
                                                    <em v-if="stop.void == 1">cancelled on the trip</em>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="grid-20">
                                    <span>Pallets</span>
                                    <strong>{{stop.pallets}}</strong>
                                </div>
                                <div class="grid-20">
                                    <span>Weight</span>
                                    <strong>{{stop.weights}}</strong>
                                </div>
                                <div class="grid-100">
                                    <span>Location</span>
                                    <strong>{{stop.stop_location.location_address}}</strong>
                                </div>
                            </div>
                            <div class="per-row" v-else>
                                <h4>Truck Inspection</h4>
                            </div>
                        </div>
                    </draggable>
                </div>
            </div>

            <div class="trip-control clearfix">
                <div class="grid-40">
                    <button class="unis-btn unis-btn-primary color-white" @click="mergeTripDialog">Merge Trip</button>
                </div>
                <div class="grid-40 right">
                    <button class="unis-btn unis-btn-primary color-white" @click="transferTripDialog">Transfer Trip</button>
                </div>
            </div>

            <div class="tools grid-100">
                <h4>Tools</h4>
                <trip-tools :tripDetail="tripDetail" @refreshTrip="refreshTrip"></trip-tools>
            </div>
        </div>
        <!-- <div class="dialog-detail" style="height: 500px; text-align: center" v-else></div> -->
        <div class="right advance-detail"  @click="advanceDetail(tripDetail)">Advance Details</div>
        <div class="grid-100" style="padding: 0;margin-top: 20px">
            <waitting-btn btn-class="unis-btn unis-btn-primary color-white right h-40-p"
                @click="saveTrip" :value="'Save Change'"
                :is-loading="saveTripLoading"> </waitting-btn>
        </div>
        <advance-detail v-if="showAdvanceDetails"
            :detail="currentTrip"
            :type="'Trip'"
            :show="showAdvanceDetails"
            @setShowOrHide="setShowOrHideFun"
        >
        </advance-detail>

        <div class="trip-control-box" v-show="showMerge">
            <div class="grid-100">
                <div class="close-dialog" @click="closeMerge">╳</div>
                <div class="dialog-title">Merge Trip</div>
            </div>
            <div class="grid-100 trip-control-con">
                <p>Trip #{{tripDetail.trip_no}}</p>
                <p><strong>Merge With</strong></p>
                <input type="number" placeholder="Fill in trip id" v-model="mergeTripNo">

                <div class="grid-60" style="padding: 0;margin-top: 20px">
                    <waitting-btn btn-class="unis-btn unis-btn-primary color-white right h-40-p"
                        @click="saveMerge" :value="'Save'"
                        :is-loading="mergeOrTransferTrip"> </waitting-btn>
                </div>
            </div>
        </div>

        <div class="trip-control-box" v-show="showTransfer">
            <div class="grid-100">
                <div class="close-dialog" @click="closeTansfer">╳</div>
                <div class="dialog-title">Transfer Trip</div>
            </div>
            <div class="grid-100 trip-control-con">
                <p>Trip #1235445</p>
                <el-select no-match-text="Trip" multiple v-model="transferTripData.transferTask" style="margin-bottom: 10px">
                    <el-option v-for="item in tripDetail.tasks" :key="item.task_sequence" :label="'Task' + item.task_sequence" :value="item.task_id || item.task_sequence">
                    </el-option>
                </el-select>
                <p><strong>Transfer to</strong></p>
                <input type="number" placeholder="Fill in trip id" v-model=" transferTripData.transferTo">

                <div class="grid-60" style="padding: 0;margin-top: 20px">
                    <waitting-btn btn-class="unis-btn unis-btn-primary color-white right h-40-p"
                        @click="saveTransfer" :value="'Save'"
                        :is-loading="mergeOrTransferTrip"> </waitting-btn>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="./tripDetail.scss"></style>