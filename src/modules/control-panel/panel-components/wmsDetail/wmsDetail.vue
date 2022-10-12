<template>
    <div class="detail-dialog" v-show="showWMSDetail" v-loading="loadingWMS">
        <div class="close-dialog" @click="closeDialog">╳</div>
        <div class="dialog-title">WMS Detail ({{wmsDetail.id}})</div>
        <div class="dialog-detail wms-dialog-detail">
            <div class="wms-detail-con" v-if="detailType == 'RN'">
                <div class="grid-100 tablet-grid-100 item-row">
                    <div class="grid-25">
                        <span>Status</span>
                        <div>{{wmsDetail.status}}</div>
                    </div>
                    <div class="grid-25">
                        <span>Customer</span>
                        <div>{{wmsDetail.customerName}}</div>
                    </div>
                    <div class="grid-25">
                        <span>Carrier</span>
                        <div>{{wmsDetail.carrierName}}</div>
                    </div>
                    <div class="grid-25">
                        <span>Good Type</span>
                        <div>{{wmsDetail.goodsType}}</div>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 item-row">
                    <div class="grid-33">
                        <span>Create By</span>
                        <div>{{wmsDetail.createdBy}}</div>
                    </div>
                    <div class="grid-33">
                        <span>Shipping Method</span>
                        <div>{{wmsDetail.shippingMethod}}</div>
                    </div>
                    <div class="grid-33">
                        <span>Receive Type</span>
                        <div>{{wmsDetail.receiveType}}</div>
                    </div>
                </div>
                 <div class="grid-100 tablet-grid-100 item-row">
                    <div class="grid-33">
                        <span>TransLoad</span>
                        <div>{{wmsDetail.isTransload ? 'Yes' : 'No'}}</div>
                    </div>
                    <div class="grid-33">
                        <span>Require Collect Carton ID</span>
                        <div>{{wmsDetail.requireCollectCartonId ? 'Yes' : 'No'}}</div>
                    </div>
                    <div class="grid-33">
                        <span>Updated By</span>
                        <div>{{wmsDetail.updatedBy}}</div>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 item-row">
                    <div class="grid-50">
                        <span>Create Time</span>
                        <div>{{wmsDetail.createdWhen}}</div>
                    </div>
                    <div class="grid-50">
                        <span>InYard Time</span>
                        <div>{{wmsDetail.inYardTime}}</div>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 item-row">
                    <div class="grid-50">
                        <span>Receive Time</span>
                        <div>{{wmsDetail.receivedTime}}</div>
                    </div>
                    <div class="grid-50">
                        <span>Devanned Time</span>
                        <div>{{wmsDetail.devannedTime}}</div>
                    </div>
                </div>
            </div>

            <div class="wms-detail-con" v-if="detailType == 'DN'">
                <div class="grid-100 tablet-grid-100 item-row">
                    <div class="grid-25">
                        <span>Status</span>
                        <div>{{wmsDetail.status}}</div>
                    </div>
                    <div class="grid-25">
                        <span>Customer</span>
                        <div>{{wmsDetail.customerName}}</div>
                    </div>
                    <div class="grid-25">
                        <span>Carrier</span>
                        <div>{{wmsDetail.carrierName}}</div>
                    </div>
                    <div class="grid-25">
                        <span>Retailer</span>
                        <div>{{wmsDetail.shipToAddress.organizationName}}</div>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 item-row">
                    <div class="grid-25">
                        <span>Order Type</span>
                        <div>{{wmsDetail.orderType}}</div>
                    </div>
                    <div class="grid-25">
                        <span>Shipping Method</span>
                        <div>{{wmsDetail.shipMethod}}</div>
                    </div>
                    <div class="grid-25">
                        <span>Delivery Service</span>
                        <div>{{wmsDetail.deliveryService}}</div>
                    </div>
                    <div class="grid-25">
                        <span>Freight Term</span>
                        <div>{{wmsDetail.freightTerm}}</div>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 item-row">
                    <div class="grid-25">
                        <span>Reference</span>
                        <div>{{wmsDetail.referenceNo}}</div>
                    </div>
                    <div class="grid-25">
                        <span>Shipment Tracking Type</span>
                        <div>{{wmsDetail.shipmentTrackingType}}</div>
                    </div>
                    <div class="grid-25">
                        <span>Pro</span>
                        <div>{{wmsDetail.proNo}}</div>
                    </div>
                    <div class="grid-25">
                        <span>Source</span>
                        <div>{{wmsDetail.source}}</div>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 item-row">
                    <div class="grid-50">
                        <span>Create Time</span>
                        <div>{{wmsDetail.createdWhen}}</div>
                    </div>
                    <div class="grid-50">
                        <span>Update Time</span>
                        <div>{{wmsDetail.updatedWhen}}</div>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 item-row">
                    <div class="grid-25">
                        <span>Is Single QTY</span>
                        <div>{{wmsDetail.isSingleQTY}}</div>
                    </div>
                    <div class="grid-25">
                        <span>Rush Order</span>
                        <div>{{wmsDetail.isRush}}</div>
                    </div>
                    <div class="grid-25">
                        <span>Is Transload</span>
                        <div>{{wmsDetail.isTransload}}</div>
                    </div>
                    <div class="grid-25">
                        <span>Is International</span>
                        <div>{{wmsDetail.isInternational}}</div>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 item-row">
                    <div class="grid-100">
                        <span>Ship To:</span>
                        <div>{{(wmsDetail.shipToAddress.address1 ? wmsDetail.shipToAddress.address1 + ',' : '')
                            + (wmsDetail.shipToAddress.city ? wmsDetail.shipToAddress.city + ',' : '')
                            + (wmsDetail.shipToAddress.state ? wmsDetail.shipToAddress.state + ',' : '')
                            + (wmsDetail.shipToAddress.country ? wmsDetail.shipToAddress.country + ' ' : ' ')
                            + wmsDetail.shipToAddress.zipCode}}</div>
                    </div>
                </div>
            </div>

            <div class="wms-e-lne" v-if="detailType == 'ET'">
                <div class="time-line">
                    <div class="time-line-point"></div>
                    <h4>GATE CHECK IN</h4>
                    <p>{{wmsDetail.checkInData != undefined ? wmsDetail.checkInData.checkInStartTime: ''}}</p>
                    <p>Driver: {{wmsDetail.checkInData != undefined ? wmsDetail.checkInData.driverName: ''}}</p>
                    <p>Driver License: {{wmsDetail.checkInData != undefined ? wmsDetail.checkInData.driverLicense: ''}}</p>
                    <p>Carrier: {{wmsDetail.checkInData != undefined ? wmsDetail.checkInData.carrierName: ''}}</p>
                    <p>MC/DOT: {{wmsDetail.checkInData != undefined ? wmsDetail.checkInData.mcDot: ''}}</p>
                    <p>Type:  {{wmsDetail.checkInData != undefined ? wmsDetail.checkInData.equipmentType: ''}}</p>
                    <p>Tractor:  {{wmsDetail.checkInData != undefined ? wmsDetail.checkInData.tractor: ''}}</p>
                    <p>Container:  
                        <span v-for="(item, index) in wmsDetail.checkInData != undefined 
                        ? wmsDetail.checkInData.containerNOs : []" :key="index">{{item}}</span>
                    </p>
                </div>
                <div class="time-line">
                    <div class="time-line-point"></div>
                    <h4>WINDOW CHECK IN</h4>
                    <p class="gray-color" v-for="(line, lineIndex) in wmsDetail.timeline['Window Checkin']" :key="'line' + lineIndex">{{line.createdWhen}} ({{line.createdBy}})</p>
                    <div style="border-bottom: 1px solid #ccc; margin: 10px 0 5px 0">{{wmsDetail.isOut ? 'Outbound' : 'Inbound'}}</div>
                    <p v-for="(receipt, receiptIndex) in wmsDetail.receipts" :key="receiptIndex">
                        <span>{{receipt.customerName}}:</span>
                        <span>{{receipt.id}}</span>
                    </p>
                </div>
                <div class="time-line" v-for="(item, index) in wmsDetail.receiveTasks" :key="index">
                    <div class="time-line-point"></div>
                    <h4>RECEIVE {{item.id}}</h4>
                    <p class="gray-color">Assign: 
                        <span v-if="item.assignee">{{item.assignee.firstName + ' ' + item.assignee.lastName}}</span>
                    </p>
                    <p class="gray-color">Dock: 
                        <span v-if="item.dock">{{item.dock.name}}</span>
                    </p>
                    <p class="gray-color">Dock Check In: 
                        <span v-for="(dockCheckIn, dockCheckInIndex) in wmsDetail.timeline['Dock Checkin']" :key="dockCheckInIndex">{{dockCheckIn.createdWhen}} / ({{dockCheckIn.createdBy}})</span>
                    </p>
                    <p class="gray-color">Dock Checkout: 
                        <span v-for="(dockCheckOut, dockCheckOutIndex) in wmsDetail.timeline['Dock Checkout']" :key="dockCheckOutIndex">{{dockCheckOut.createdWhen}} / ({{dockCheckOut.createdBy}})</span>
                    </p>
                    <div class="per-task" v-for="(task, taskIndex) in wmsDetail.receiveTasks" :key="taskIndex" style="margin: 15px 0">
                        <strong>{{task.id}}</strong>
                        <div v-for="(step, stepIndex) in task.steps" :key="stepIndex" style="margin: 0 0 10px 0">
                            <strong>{{step.name}} ({{step.status}})</strong>
                            <p class="gray-color">Assignee: 
                                <span v-for="(stepAssign, stepAssignIndex) in step.assignees" :key="stepAssignIndex">{{stepAssign.firstName + ' ' + stepAssign.lastName}}</span>
                            </p>
                            <p class="gray-color">Start: {{step.startTime}}</p>
                            <p class="gray-color">End: {{step.endTime}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="./wmsDetail.scss"></style>