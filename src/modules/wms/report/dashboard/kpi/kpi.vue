<template>
  <div class="kpi-wrap grid-100 tablet-grid-100">
    <div class="row">
      <div class="kpi-title">Partners Dashboard</div>
    </div>
    <div class="row d-flex">
      <div class="col-3" v-if="customerIds.length > 1">
          <div>
            <predefined-customer-select v-model="customerId" @change="changeCustomer"> 
            </predefined-customer-select>
          </div>
      </div>
      <div class="col-3">
          <div>
            <facility-select v-model="facilityId" :customerId="customerId"
            @change="onSelectFacilityChange"></facility-select>
          </div>
      </div>
      <div class="col-3"></div>
      <div class="col-3"></div>
    </div>

    <!-- order-snapshot -->
    <div class="order-snapshot grid-100 tablet-grid-100">
      <div class="snapshot-title">Today's Order Snapshot</div>
      <div class="order-con grid-100 tablet-grid-100">
        <p>Small Parcel Orders</p>
        <div class="mb-4 d-flex">
          <div class="col-4">
            <div class="progress">
              <div class="line d-flex">
                <div class="line-fill">
                  <div :style="{width: smallParcelOrder.ordersFulfillmentRate * 100 + '%'}"></div>
                </div>
                <span>{{(smallParcelOrder.ordersFulfillmentRate * 100).toFixed(1)}}%</span>
              </div>
              <p>Orders Fulfillment Rate (Today)</p>
            </div>
          </div>
          <div class="col-2 text-mes">
            <div>{{smallParcelOrder.open}}</div>
            <div>Open Orders</div>
          </div>
          <div class="col-2 text-mes">
            <div>{{smallParcelOrder.picked}}</div>
            <div>Picked</div>
          </div>
          <div class="col-2 text-mes shipped">
            <div>{{smallParcelOrder.shipped}}</div>
            <div>Shipped</div>
          </div>
          <div class="col-2 text-mes queue">
            <div>{{smallParcelOrder.tomorrowQueue}}</div>
            <div>Tomorrow's Queue</div>
          </div>
        </div>

        <p style="padding-top: 22px">Regular Orders</p>
        <div class="mb-4 d-flex">
          <div class="col-4">
            <div class="progress">
              <div class="line d-flex">
                <div class="line-fill">
                  <div :style="{width: regularOrder.ordersFulfillmentRate * 100 + '%'}"></div>
                </div>
                <span>{{(regularOrder.ordersFulfillmentRate * 100).toFixed(1)}}%</span>
              </div>
              <p>Orders Fulfillment Rate (Today)</p>
            </div>
          </div>
          <div class="col-2 text-mes">
            <div>{{regularOrder.open}}</div>
            <div>Open Orders</div>
          </div>
          <div class="col-2 text-mes">
            <div>{{regularOrder.picked}}</div>
            <div>Picked</div>
          </div>
          <div class="col-2 text-mes shipped">
            <div>{{regularOrder.shipped}}</div>
            <div>Shipped</div>
          </div>
          <div class="col-2 text-mes queue">
            <div>{{regularOrder.tomorrowQueue}}</div>
            <div>Tomorrow's Queue</div>
          </div>
        </div>
      </div>
    </div>

    <!-- order-snapshot -->
    <div class="receive-snapshot grid-100 tablet-grid-100" style="margin-top: 20px">
      <div class="snapshot-title">Today's Receiving/OutBound Snapshot</div>
      <div class="row d-flex">
        <div class="table col-6">
          <div>Receiving Performance Metrics:</div>
          <table class="table-client">
            <thead>
              <tr>
                  <th></th>
                  <th>Open</th>
                  <th>Receiving</th>
                  <th>Received</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="tit">
                    Receipt
                </td>
                <td>{{receiptSnapshot.open.receipts}}</td>
                <td>{{receiptSnapshot.receiving.receipts}}</td>
                <td>{{receiptSnapshot.received.receipts}}</td>
              </tr>
              <tr>
                <td class="tit">
                    Line Item
                </td>
                <td>{{receiptSnapshot.open.receiptItemLines}}</td>
                <td>{{receiptSnapshot.receiving.receiptItemLines}}</td>
                <td>{{receiptSnapshot.received.receiptItemLines}}</td>
              </tr>
              <tr>
                <td class="tit">
                    EA QTY Count
                </td>
                <td>{{receiptSnapshot.open.receiptEAQtyCount}}</td>
                <td>{{receiptSnapshot.receiving.receiptEAQtyCount}}</td>
                <td>{{receiptSnapshot.received.receiptEAQtyCount}}</td>
              </tr>
            </tbody>
          </table>


          <table class="table-client" style="margin-top: 20px">
            <thead>
              <tr>
                  <th></th>
                  <th>NO. of Ctnr in Yard</th>
                  <th>NO. of Ctnr Unloaded</th>
                  <th>AVG Days in Yard</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="inYardReceiptSnapshot.today">
                <td class="tit">
                    Today
                </td>
                <td>{{inYardReceiptSnapshot.today.noOfCtnrInYard}}</td>
                <td>{{inYardReceiptSnapshot.today.noOfCtnrUnloaded}}</td>
                <td>{{inYardReceiptSnapshot.today.avgDaysInYard}}</td>
              </tr>
              <tr v-if="inYardReceiptSnapshot.yesterday">
                <td class="tit">
                    Yesterday
                </td>
                <td>{{inYardReceiptSnapshot.yesterday.noOfCtnrInYard}}</td>
                <td>{{inYardReceiptSnapshot.yesterday.noOfCtnrUnloaded}}</td>
                <td>{{inYardReceiptSnapshot.yesterday.avgDaysInYard}}</td>
              </tr>
              <tr v-if="inYardReceiptSnapshot.lastSevenDays">
                <td class="tit">
                    Last 7 Days
                </td>
                <td>{{inYardReceiptSnapshot.lastSevenDays.noOfCtnrInYard}}</td>
                <td>{{inYardReceiptSnapshot.lastSevenDays.noOfCtnrUnloaded}}</td>
                <td>{{inYardReceiptSnapshot.lastSevenDays.avgDaysInYard}}</td>
              </tr>
            </tbody>
          </table>
        </div>


        <div class="table col-6">
          <div>Outbound Performance Metrics:</div>
          <table class="table-client">
            <thead>
              <tr>
                  <th></th>
                  <th>Orders Fulfilled</th>
                  <th>Outbound Revenue (USD$)</th>
                  <th>Fulfilled Ontime</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="outboundPerformanceMetrics.today">
                <td class="tit">
                    Today
                </td>
                <td>{{outboundPerformanceMetrics.today.orderFulfilled}}</td>
                <td>{{outboundPerformanceMetrics.today.outboundRevenue}}</td>
                <td>{{(outboundPerformanceMetrics.today.fulfilledOnTime * 100).toFixed(1) + '%' }}</td>
              </tr>
              <tr v-if="outboundPerformanceMetrics.yesterday">
                <td class="tit">
                    Yesterday
                </td>
                <td>{{outboundPerformanceMetrics.yesterday.orderFulfilled}}</td>
                <td>{{outboundPerformanceMetrics.yesterday.outboundRevenue}}</td>
                <td>{{(outboundPerformanceMetrics.yesterday.fulfilledOnTime  * 100).toFixed(1) + '%' }}</td>
              </tr>
              <tr v-if="outboundPerformanceMetrics.lastSevenDays">
                <td class="tit">
                    Last 7 Days
                </td>
                <td>{{outboundPerformanceMetrics.lastSevenDays.orderFulfilled}}</td>
                <td>{{outboundPerformanceMetrics.lastSevenDays.outboundRevenue}}</td>
                <td>{{(outboundPerformanceMetrics.lastSevenDays.fulfilledOnTime  * 100).toFixed(1) + '%' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped src="./kpi.scss" />
