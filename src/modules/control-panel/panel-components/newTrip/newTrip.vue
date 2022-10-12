<template>
    <div class="advance-search">
        <el-dialog
            :title="isEdit && currentTrip.trip_no ? 'Edit Trip (' + currentTrip.trip_no + ')' : 'New Trip'"
            :visible.sync="showNewTrip"
            v-dialogDrag="showNewTrip"
            @close='closeDialog'
            :top="'14vh'"
            width="45%"
            class="dialog-search trips-dialog"
            :append-to-body="true"
            :center="true"
            :close-on-click-modal="false"
            :modal="false"
            :style="styleCss">
            <div class="advance-box new-trip-box">
                <div class="new-trip-out order-advance">
                    <!-- <h3 class="grid-100">
                        <strong>Dispatch</strong>
                        <div class="close-dialog right" @click="closeNewTrip">╳</div>
                    </h3> -->
                    <div class="grid-100 new-trip-item">
                        <div class="grid-50">
                            <label>Dispatch date *</label>
                            <el-date-picker
                                v-model="newTrip.dateRange"
                                type="date"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </div>
                        <div class="grid-50">
                            <!-- <label>Time</label>
                            <el-time-picker
                                is-range
                                format="HH:mm"
                                value-format = 'HH:mm'
                                v-model="newTrip.timeRange">
                            </el-time-picker> -->
                            <div class="mt-4">
                                <el-checkbox @change="ifEmptyTrip" v-model="isEmptyTrip" :disabled="isEdit && !canChangeTrip">Create an empty trip allow warehouse to add order</el-checkbox>
                            </div>
                        </div>
                        <div class="grid-100 p-0">
                            <div class="grid-50">
                                <label>Priority</label>
                                <el-select no-match-text="No Data" v-model="newTrip.dispatch_priority">
                                    <el-option v-for="(item, index) in ['high', 'medium', 'low']" :key="index" :label="item" :value="item">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="grid-50">
                                <label>Service Level</label>
                                <el-select no-match-text="No Data" v-model="newTrip.dispatch_service_level">
                                    <el-option v-for="(item, index) in ['None', 'Ground', 'BackOfTruckNoLiftGate', 'CurbsideLiftGate', 'Threshold', 'RoomOfChoice', 'WhiteGlovePackagingRemoval', 'WhiteGloveLightAssemly']" :key="index" :label="item" :value="item">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="grid-50">
                            <label>Choose origin terminal *</label>
                            <el-select no-match-text="No Data" v-model="newTrip.dispatch_origin_terminal_id">
                                <el-option v-for="(item, index) in termialLocations" :key="index" :label="item.location_code + ' ' + item.location_state" :value="item.location_id">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="grid-50">
                            <label>Choose End terminal {{isEmptyTrip ? '*' : ''}}</label>
                            <el-select no-match-text="No Data" v-model="newTrip.dispatch_destination_terminal_id">
                                <el-option v-for="(item, index) in termialLocations" :key="index" :label="item.location_code + ' ' + item.location_state" :value="item.location_id">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="grid-50" v-if="!newTrip.dispatch_driver_id || linkDriverIds">
                            <label>Choose carrier</label>
                            <tms-carrier-auto-complete v-model="newTrip.dispatch_carrier_id" @change="selectCarrier" :clearable="true" :placeholder="'Input to search carrier'">
                            </tms-carrier-auto-complete>
                        </div>
                        <div class="grid-50">
                            <label>Choose Type</label>
                            <el-select no-match-text="No Data" v-model="newTrip.dispatch_type">
                                <el-option v-for="(item, index) in tripType" :key="index" :label="item.name" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="grid-90" v-if="!newTrip.dispatch_carrier_id || linkDriverIds">
                            <label>Choose driver</label>
                            <drop :class="[dropType == 'driver' ? 'drag-area allow-drop' : 'drag-area']" @dragover="handleDragover" @drop="handleDrop">
                                <span v-show="!newTrip.dispatch_driver_id">Drag and drop driver from menu</span>
                                <div v-show="newTrip.dispatch_driver_id">{{newTrip.selectDriver}} <span @click="clean('driver')">×</span> </div>
                            </drop>
                        </div>
                        <div class="grid-100" style="padding: 0; margin: 0">
                            <h3>Equipment</h3>
                        </div>
                        <div class="grid-90">
                            <label>Choose Tractor {{isEmptyTrip ? '' : '*'}}</label>
                            <drop :class="[dropType == 'truck' || dropType == 'Straight Truck' ? 'drag-area allow-drop' : 'drag-area']" @dragover="handleDragover" @drop="handleDrop">
                                <span v-show="!newTrip.dispatch_tractor_no">Drag and drop equipment from menu</span>
                                <div v-show="newTrip.dispatch_tractor_no">{{newTrip.dispatch_tractor_no}} <span @click="clean('truck')">×</span> </div>
                            </drop>
                        </div>
                        <!-- <div class="grid-90">
                            <el-checkbox border v-model="newTrip.dispatch_inspection">Truck Inspection</el-checkbox>
                        </div> -->
                        <div class="grid-100" style="padding: 0; margin: 0">
                            <h3>Tasks</h3>
                        </div>
                        <div class="grid-100">
                            <div class="task-create" v-for="(item, index) in newTrip.dispatch_tasks" :key="index" style="margin-bottom: 18px; border: 1px solid #488492; padding: 20px 20px 20px; border-radius: 4px" v-show="item.type != 'truck inspection'">
                                <div v-if="index > 0 || isEdit" class="close-task" @click="removeTask(index)">╳</div>

                                <div class="grid-100" style="padding: 0">
                                    <label v-if="isEmptyTrip ? true : (isStraightTruck ? false : true )">Choose Trailer *</label>
                                    <drop v-if="isEmptyTrip ? true : (isStraightTruck ? false : true )" v-loading="item.validateTrailerLoading" :class="[dropType == 'trailer' || dropType == 'chassis' ? 'drag-area allow-drop' : 'drag-area']" style="margin: 10px 0" @dragover="handleDragover(index)" @drop="handleDrop">
                                        <span v-show="!item.dispatch_task_trailer_vehicle_name">Search and select or drag and drop equipment from menu</span>
                                        <div v-show="item.dispatch_task_trailer_vehicle_id">{{item.dispatch_task_trailer_vehicle_name}} <span @click="clean('trailer', item)">×</span> </div>
                                        <tms-trailer-auto-complete class="mt-2" v-model="item.dispatch_task_trailer_vehicle_id" :search-text="item.dispatch_task_trailer_vehicle_name" @change="selectTrailer($event, index)" :clearable="true" :placeholder="'Input to search trailer'">
                                        </tms-trailer-auto-complete>
                                    </drop>
                                    <div v-show="!isEmptyTrip">
                                        <label>Choose Orders</label>
                                        <drop @click="taskIndex = index" v-loading="item.validateOrderLoading" v-if="item.orders != undefined" :class="[(dropType == 'OrderDelivery' || dropType == 'OrderLineHaul' || dropType == 'OrderPickup') ? 'drag-area allow-drop' : 'drag-area']" @dragover="handleDragover(index)" @drop="handleDrop">
                                            <span v-show="item.orders.length == 0">Drag and drop or fill orders from menu </span>
                                            <div class="grid-100">
                                                <div class="grid-30">
                                                    <el-select class="grid-50" no-match-text="No Data" v-model="inputType">
                                                        <el-option v-for="(type, typeIndex) in ['Pro', 'PU']" :key="typeIndex" :label="type" :value="type">
                                                        </el-option>
                                                    </el-select>
                                                </div>
                                                <div class="grid-70">
                                                    <tags-input :placeholder="`Enter order ${inputType}`" v-model="item.tagsOrders" @addTags="addOrderTags(item.tagsOrders, index)" :fill="`${inputType}: `"  @removeTags="removeOrderTags"></tags-input>
                                                </div>
                                            </div>
                                            <div :class="'bgc-' + perItem.type" v-for="(perItem, itemIndex) in item.orders" :key="itemIndex">{{perItem.lh_id ? perItem.lh_id : (perItem.order_pro ? `Pro: ${perItem.order_pro}` : `PU: ${perItem.pu_id}`)}} <span @click="clean('order', item, itemIndex)">×</span> </div>
                                        </drop>
                                    </div>
                                </div>
                                <div class="grid-100 order-types"  v-show="!isEmptyTrip">
                                    <div>
                                        <label for="">Pick Up:</label>
                                        <span class="bgc-Pickup" v-for="(orderItem, orderIndex) in item.orders" :key="orderIndex" v-show="orderItem.type == 'Pickup'">{{orderItem.order_pro ? `Pro: ${orderItem.order_pro}` : `PU: ${orderItem.pu_id}`}}
                                        <i @click="clean('order', item, orderIndex)">×</i></span>
                                    </div>
                                    <div>
                                        <label for="">Delivery:</label>
                                        <span class="bgc-Delivery" v-for="(orderItem, orderIndex) in item.orders" :key="orderIndex" v-show="orderItem.type == 'Delivery'">{{orderItem.order_pro ? `Pro: ${orderItem.order_pro}` : `PU: ${orderItem.pu_id}`}} <i @click="clean('order', item, orderIndex)">×</i></span>
                                    </div>
                                    <div>
                                        <label for="">LineHaul:</label>
                                        <span class="bgc-LineHaul" v-for="(orderItem, orderIndex) in item.orders" :key="orderIndex" v-show="orderItem.type == 'LineHaul'">{{orderItem.lh_id}} <i @click="clean('order', item, orderIndex)">×</i></span>
                                    </div>
                                </div>
                            </div>
                        </div>




                        <!-- Edit -->
                        <!-- <div class="grid-100" v-else>
                            <div class="task-create" v-for="(item, index) in newTrip.dispatch_tasks" :key="index" style="margin-bottom: 18px; border: 1px solid #488492; padding: 20px 20px 20px; border-radius: 4px">
                                <div style="font-size: 18px; font-weight: bold">Task {{index+1}}</div>
                                <div v-if="index > 0" class="close-task" @click="removeTask(index)">╳</div>

                                <div class="grid-100" style="padding: 0">
                                    <label>Choose Trailer *</label>
                                    <drop :class="[dropType == 'Trailer' ? 'drag-area allow-drop' : 'drag-area']" style="margin: 10px 0" @dragover="handleDragover(index)" @drop="handleDrop">
                                        <span v-show="!item.dispatch_task_trailer_vehicle_name">Drag and drop equipment from menu</span>
                                        <div v-show="item.dispatch_task_trailer_vehicle_id">{{item.dispatch_task_trailer_vehicle_name}} <span @click="clean('trailer', item)">×</span> </div>
                                    </drop>
                                    <label v-if="item.orders != undefined">Choose Orders</label>
                                    <drop v-loading="validateOrderLoading" v-if="item.orders != undefined" :class="[(dropType == 'OrderDelivery' || dropType == 'OrderLineHaul' || dropType == 'OrderPickup') ? 'drag-area allow-drop' : 'drag-area']" @dragover="handleDragover(index)" @drop="handleDrop">
                                        <span v-show="item.orders.length == 0">Drag and drop orders from menu </span>
                                        <div :class="'bgc-' + perItem.type" v-for="(perItem, itemIndex) in item.orders" :key="itemIndex">{{perItem.lh_id ? perItem.lh_id : perItem.order_id}} <span @click="clean('order', item, itemIndex)">×</span> </div>
                                    </drop>
                                    <div class="grid-100 order-types" v-if="item.orders != undefined">
                                        <div>
                                            <label for="">Pick Up:</label>
                                            <span class="bgc-Pickup" v-for="(orderItem, orderIndex) in item.orders" :key="orderIndex" v-show="orderItem.type == 'Pickup'">{{orderItem.order_id}} <i @click="clean('order', item, orderIndex)">×</i></span>
                                        </div>
                                        <div>
                                            <label for="">Delivery:</label>
                                                <span class="bgc-Delivery" v-for="(orderItem, orderIndex) in item.orders" :key="orderIndex" v-show="orderItem.type == 'Delivery'">{{orderItem.order_id}} <i @click="clean('order', item, orderIndex)">×</i></span>
                                        </div>
                                        <div>
                                            <label for="">LineHaul:</label>
                                            <span style="" v-for="(orderItem, orderIndex) in item.orders" :key="orderIndex" v-show="orderItem.type == 'LineHaul'">{{orderItem.lh_id}} <i @click="clean('order', item, orderIndex)">×</i></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="stops-con" v-for="(stop, stopIndex) in item.stops" :key="stopIndex">
                                    <div class="per-stop-box" style="margin-bottom: 15px; border: 1px solid #ccc; padding: 15px 10px;">
                                        <div>Stop: {{stop.stop_sequence}} / Type: {{stop.stage}}</div>
                                        <div class="order-control" v-if="stop.stage != 'truck inspection'">
                                            <div style="margin-top: 5px">Choose {{stop.stage}} orders</div>
                                            <drop v-loading="validateOrderLoading" :class="[(dropType.toLowerCase() == 'order' + stop.stage) ? 'drag-area allow-drop' : 'drag-area']" @dragover="handleDragover(index, stopIndex)" @drop="handleDrop">
                                                <span v-show="stop.lines.length == 0">Drag and drop orders from menu </span>
                                                <div :class="'bgc-stage-' + perItem.task_group_stage + ' bgc-' + perItem.type" v-for="(perItem, itemIndex) in stop.lines" :key="itemIndex">{{perItem.lh_id ? perItem.lh_id : (perItem.order_id ? perItem.order_id : '')}} <span @click="clean('order', stop, itemIndex)">×</span> </div>
                                            </drop>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div> -->
                        <div class="grid-40">
                            <button class="unis-btn unis-btn-primary color-white" @click="createNewTask">Add New Task</button>
                        </div>
                    </div>

                    <div class="payment">
                        <div class="grid-100 pr-0">
                            <div class="grid-30 right pr-0">
                                <waitting-btn btn-class="unis-btn unis-btn-primary color-white vertical-align h-40-p"  @click="createOrEditTrip" :value="isEdit ? 'Save Trip' : 'Create New Trip'"
                                :is-loading="newTripLoading"> </waitting-btn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<style lang="scss" src="./newTrip.scss"></style>