<template>
    <div class="advance-detail">
        <el-dialog
            :title="detailName"
            :visible.sync="showAdvanceDetail"
            width="50%"
            :custom-class="'right-dialog'"
            class="dialog-search"
            :append-to-body="true"
            :center="true"
            :close-on-click-modal="false"
            :modal="false">
            <div class="advance-detail-box clearfix">
                <div class="order-advance" v-if="type == 'Order'">
                    <div class="grid-50">
                        <div class="grid-100 detail-base-info">
                            <div class="grid-33">
                                <div class="title">PU#</div>
                                <p>{{orderDetail.pu_id}}</p>
                            </div>
                        </div>
                        <div class="grid-100 detail-base-info">
                            <div class="grid-33">
                                <div class="title">ID#</div>
                                <p>{{orderDetail.order_id}}</p>
                            </div>
                            <div class="grid-33">
                                <div class="title">Total Mileage#</div>
                                <p>{{orderDetail.total_mileage}}</p>
                            </div>
                            <div class="grid-33">
                                <div class="title">Priority#</div>
                                <p>{{orderDetail.priority}}</p>
                            </div>
                        </div>
                        <div class="grid-100 detail-base-info">
                            <div class="grid-33">
                                <div class="title">Weight</div>
                                <p>{{orderDetail.total_weights}}</p>
                            </div>
                            <div class="grid-33">
                                <div class="title">Capacity</div>
                                <p>{{orderDetail.total_pallets}}</p>
                            </div>
                            <div class="grid-33">
                                <div class="title">Equipment</div>
                                <p>{{orderDetail.equiment_name}}</p>
                            </div>
                        </div>

                        <div class="grid-100 per-card-detail">
                            <div>Shipper</div>
                            <div class="per-card-detail-box">
                                <div class="grid-100 card-detail-bold">
                                    <p>{{orderDetail.shipper_name}}</p>
                                </div>
                                <div class="grid-100">
                                    <div class="grid-33">
                                        <div class="title">ID</div>
                                        <p>{{orderDetail.shipper_id}}</p>
                                    </div>
                                    <div class="grid-33">
                                        <div class="title">Code</div>
                                        <p>{{orderDetail.shipper_code}}</p>
                                    </div>
                                    <div class="grid-33">
                                        <div class="title">Phone</div>
                                        <p>{{orderDetail.shipper_phone}}</p>
                                    </div>
                                </div>
                                <div class="grid-100">
                                    <div class="title grid-100">Address:</div>
                                    <p class="grid-100">{{(orderDetail.shipper_street ? orderDetail.shipper_street + ',' : '')
                                        + (orderDetail.shipper_street2 ? orderDetail.shipper_street2 + ',' : '')
                                        + (orderDetail.shipper_city ? orderDetail.shipper_city + ',' : '')
                                        + (orderDetail.shipper_state ? orderDetail.shipper_state + ',' : '')
                                        + (orderDetail.shipper_country ? orderDetail.shipper_country + ' ' : ' ')
                                        + orderDetail.shipper_zip}}</p>
                                </div>
                                <div class="grid-100">
                                    <div class="title grid-100">Scheduled P/U Date:</div>
                                    <p class="grid-100">{{orderDetail.order_pickup_date + ' ' + orderDetail.order_pickup_time_from + '-' + orderDetail.order_pickup_time_to}}</p>
                                </div>
                            </div>
                        </div>
                        <div class="grid-100 per-card-detail">
                            <div>Consignee</div>
                            <div class="per-card-detail-box">
                                <div class="grid-100 card-detail-bold">
                                    <p>{{orderDetail.consignee_name}}</p>
                                </div>
                                <div class="grid-100">
                                    <div class="grid-33">
                                        <div class="title">ID</div>
                                        <p>{{orderDetail.consignee_id}}</p>
                                    </div>
                                    <div class="grid-33">
                                        <div class="title">Code</div>
                                        <p>{{orderDetail.consignee_code}}</p>
                                    </div>
                                    <div class="grid-33">
                                        <div class="title">Phone</div>
                                        <p>{{orderDetail.consignee_phone}}</p>
                                    </div>
                                </div>
                                <div class="grid-100">
                                    <div class="title grid-100">Address:</div>
                                    <p class="grid-100">{{(orderDetail.consignee_street ? orderDetail.consignee_street + ',' : '')
                                        + (orderDetail.consignee_street2 ? orderDetail.consignee_street2 + ',' : '')
                                        + (orderDetail.consignee_city ? orderDetail.consignee_city + ',' : '')
                                        + (orderDetail.consignee_state ? orderDetail.consignee_state + ',' : '')
                                        + (orderDetail.consignee_country ? orderDetail.consignee_country + ' ' : ' ')
                                        + orderDetail.consignee_zip}}</p>
                                </div>
                                <div class="grid-100">
                                    <div class="title grid-100">Scheduled Delivery Date:</div>
                                    <p class="grid-100">{{orderDetail.appointment_delivery_date + ' ' + orderDetail.appointment_delivery_time_from + '-' + orderDetail.appointment_delivery_time_to}}</p>
                                </div>
                            </div>
                        </div>
                        <div class="grid-100 per-card-detail">
                            <div>Bill to</div>
                            <div class="per-card-detail-box">
                                <div class="grid-100 card-detail-bold">
                                    <p>{{orderDetail.billto_name}}</p>
                                </div>
                                <div class="grid-100">
                                    <div class="grid-33">
                                        <div class="title">ID</div>
                                        <p>{{orderDetail.billto_id}}</p>
                                    </div>
                                    <div class="grid-33">
                                        <div class="title">Code</div>
                                        <p>{{orderDetail.billto_code}}</p>
                                    </div>
                                    <div class="grid-33">
                                        <div class="title">Phone</div>
                                        <p>{{orderDetail.billto_phone}}</p>
                                    </div>
                                </div>
                                <div class="grid-100">
                                    <div class="title grid-100">Address:</div>
                                    <p class="grid-100">{{(orderDetail.billto_street ? orderDetail.billto_street + ',' : '')
                                        + (orderDetail.billto_street2 ? orderDetail.billto_street2 + ',' : '')
                                        + (orderDetail.billto_city ? orderDetail.billto_city + ',' : '')
                                        + (orderDetail.billto_state ? orderDetail.billto_state + ',' : '')
                                        + (orderDetail.billto_country ? orderDetail.billto_country + ' ' : ' ')
                                        + orderDetail.billto_zip}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid-50">
                        <div class="grid-100 per-card-detail">
                            <div>Manifest</div>
                            <div class="per-card-detail-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Content</th>
                                            <th>Capacity</th>
                                            <th>Piece</th>
                                            <th>Weight</th>
                                            <th>Class</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in orderDetail.manifests" :key="index">
                                            <td>{{item.content}}</td>
                                            <td>{{item.pallet}}</td>
                                            <td>{{item.piece}}</td>
                                            <td>{{item.weight}}</td>
                                            <td>{{item.class}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="grid-100 per-card-detail">
                            <div>Carrier</div>
                            <div class="per-card-detail-box" v-for="(carrier, index) in orderDetail.carriers" :key="index">
                                <div class="grid-100 card-detail-bold">
                                    <p>{{carrier.carrier_name}}</p>
                                </div>
                                <div class="grid-100">
                                    <div class="grid-33">
                                        <div class="title">PRO#</div>
                                        <p>{{carrier.carrier_pro}}</p>
                                    </div>
                                    <div class="grid-33">
                                        <div class="title">Type</div>
                                        <p>{{carrier.ap_type}}</p>
                                    </div>
                                    <div class="grid-33">
                                        <div class="title">Amount</div>
                                        <p>{{carrier.ap_amount}}</p>
                                    </div>
                                </div>
                                <div class="grid-100">
                                    <div class="grid-33">
                                        <div class="title">Order</div>
                                        <p>#{{carrier.order_id}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="tools grid-100">
                            <div class="tools-title">Tools</div>
                            <div class="tools-tab">
                                <div class="tools-tab-tit clearfix">
                                    <div :class="[selectTools[0] ? 'grid-33 choose' : 'grid-33']" @click="selectToolsFun(0)">Trip</div>
                                    <div :class="[selectTools[1] ? 'grid-33 choose' : 'grid-33']" @click="selectToolsFun(1)">Print</div>
                                    <div :class="[selectTools[2] ? 'grid-33 choose' : 'grid-33']" @click="selectToolsFun(2)">Common Tools</div>
                                </div>
                                <div class="tools-tab-con">
                                    <div v-show="selectTools[0]">
                                        <span class="tool-item">Trip Summary</span>
                                        <span class="tool-item">Trip Manifest</span>
                                        <span class="tool-item">Trip Margin</span>
                                        <span class="tool-item">Load Sheet</span>
                                    </div>
                                    <div v-show="selectTools[1]">
                                        <span class="tool-item">Trip Summary</span>
                                        <span class="tool-item">Trip Margin</span>
                                        <span class="tool-item">Trip Manifest</span>
                                        <span class="tool-item">Load Sheet</span>
                                    </div>
                                    <div v-show="selectTools[2]">
                                        <span class="tool-item">Trip Summary</span>
                                        <span class="tool-item">Trip Manifest</span>
                                    </div>
                                </div>
                            </div>
                        </div> -->
                        <div class="grid-100 per-card-detail">
                            <div style="margin-bottom: 10px">Note:</div>
                            <div class="detail-note">
                                <!-- <textarea placeholder="Helper text" name="" id="" cols="30" rows="10"></textarea> -->
                                <p>Shipper: {{orderDetail.shipper_note}}</p>
                                <p>Consignee: {{orderDetail.shipper_note}}</p>
                                <p>Driver: {{orderDetail.driver_note}}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="trip-advance" v-if="type == 'Trip'" v-loading="loadingTrip">
                    <div class="grid-50">
                        <div class="grid-100 detail-base-info">
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
                        <div class="grid-100 detail-base-info">
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
                        <div class="grid-100 detail-base-info">
                            <div class="grid-100" v-if="tripDetail.original_terminal != undefined">
                                <div class="title">Origin Terminal</div>
                                <p>{{tripDetail.original_terminal.location_code}} / {{(tripDetail.original_terminal.location_street ? tripDetail.original_terminal.location_street + ',' : '')
                                + (tripDetail.original_terminal.location_city ? tripDetail.original_terminal.location_city + ',' : '')
                                + (tripDetail.original_terminal.location_state ? tripDetail.original_terminal.location_state + ',' : '')
                                + tripDetail.destination_terminal.location_zip}}</p>
                            </div>
                        </div>
                        <div class="grid-100 detail-base-info">
                            <div class="grid-100" v-if="tripDetail.destination_terminal != undefined">
                                <div class="title">End Terminal</div>
                                <p>{{tripDetail.destination_terminal.location_code}} / {{(tripDetail.destination_terminal.location_street ? tripDetail.destination_terminal.location_street + ',' : '')
                                + (tripDetail.destination_terminal.location_city ? tripDetail.destination_terminal.location_city + ',' : '')
                                + (tripDetail.destination_terminal.location_state ? tripDetail.destination_terminal.location_state + ',' : '')
                                + tripDetail.destination_terminal.location_zip}}</p>
                            </div>
                        </div>

                        <div class="grid-100" style="margin-top: 10px; padding: 0">
                            <label for="">Date:</label>
                            <p>{{tripDetail.trip_start_date + ' ' + tripDetail.trip_start_time_from  + ' > ' + tripDetail.trip_end_date + ' ' + tripDetail.trip_start_time_to}}</p>
                        </div>
                        
                        <div class="grid-100" style="padding: 0; margin-bottom: 15px">
                            <button class="unis-btn unis-btn-primary grid-50 right"  @click="editTripTask()">Edit Trip</button>
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
                                            <div class="grid-20">
                                                <span>Status</span>
                                                <strong>{{stop.status}}</strong>
                                            </div>
                                            <div class="grid-40" v-if="stop.stage_text != 'linehaul'">
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
                                            <div class="grid-40" v-else>
                                                <span>LineHaul</span>
                                                <div class="trip-linehaul per-stop-order"  v-for="(line, lineIndex) in stop.lines" :key="lineIndex" @click="showLineHaulOrders(line)" >#{{line.lh_id}}
                                                    <span v-for="(order, orderIndex) in line.orders" :key="orderIndex">
                                                    </span>
                                                    <div class="linehual-con" v-show="line.showLineHaulOrders">
                                                        <div class="grid-100">
                                                            <div class="close-dialog" @click="hideLineHaulOrders(line, $event)">╳</div>
                                                            <div class="dialog-title">LineHaul #{{line.lh_id}}</div>
                                                        </div>
                                                        <div class="grid-100" style="margin-top: 10px">Orders</div>
                                                        <div class="grid-100 line-orders-list">
                                                            <span :class="(order.current_stage == 2 || order.current_stage == 3 || order.current_stage == 5) ? 'order-complete' : '' " v-for="(order, orderIndex) in line.orders" :key="orderIndex">{{order.order_pro ? ('Pro: ' + order.order_pro) : ('PU: ' + order.pu_id ? order.pu_id : '')}}
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
                            <div class="grid-45">
                                <button class="unis-btn unis-btn-primary color-white" @click="mergeTripDialog">Merge Trip</button>
                            </div>
                            <div class="grid-45 right">
                                <button class="unis-btn unis-btn-primary color-white" @click="transferTripDialog">Transfer Trip</button>
                            </div>
                        </div>

                        <div class="trip-control-box grid-50" v-show="showMerge">
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

                        <div class="trip-control-box grid-50" v-show="showTransfer">
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
                    <div class="grid-50">
                        <div class="grid-100 per-card-detail">
                            <div>Trip History</div>
                            <div class="per-card-detail-table">
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
                                        <tr v-for="(item, index) in tripDetail.logs" :key="index">
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
                        <div class="tools grid-100">
                            <div class="tools-title">Tools</div>
                            <trip-tools :tripDetail="tripDetail" @refreshTrip="refreshTrip"></trip-tools>
                        </div>
                        <div class="grid-100 per-card-detail">
                            <div style="margin-bottom: 10px">Note:</div>
                            <div class="detail-note">
                                {{tripDetail.note}}
                            </div>
                        </div>
                        <file-control :tripDetail="tripDetail"></file-control>
                    </div>
                </div>
                <div v-if="type == 'Trip'" class="view-panel-btn grid-100" style="margin: 20px 10px 0 0px">
                    <waitting-btn btn-class="unis-btn unis-btn-primary color-white right h-40-p"
                    @click="saveTrip" :value="'Save Change'"
                    :is-loading="saveTripLoading"> </waitting-btn>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<style lang="scss" src="./advanceDetail.scss"></style>