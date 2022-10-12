<template>
  <div class="inventory-aging">
    <div class="grid-100 tablet-grid-100 container">
      <span class="component-title bold" style="padding-left: 10px;"> Order Batch Update</span>
    </div>
    <div class="grid-100 tablet-grid-100 ">
      <div class="grid-100 tablet-grid-100 container" style="margin-bottom:20px">
        <span>Order Id:</span>
        <span style="margin: 8px 0 0 10px ; background: #eaeaea" v-for="order in updataOrders" :key="order.id">{{order.orderId}}</span>
      </div>
      <div class="grid-100 tablet-grid-100 container" style="margin-bottom:0">
        <div class="grid-20">
          <label class="input-label">Carrier</label>
          <div>
            <organization-auto-complete v-model="update.carrierId" @change="onselectCarrierChange"
                                        :customerId="customerId" tag="Carrier" >
            </organization-auto-complete>
          </div>
        </div>
        <div class="grid-20">
          <label class="input-label"> Delivery Service</label>
          <div>
            <el-select clearable no-match-text="No Data" no-data-text="No Data" v-model="update.deliveryService" placeholder="Select">
              <el-option v-for="type in carrierServiceTypes" :key="type" :label="type" :value="type">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="grid-20">
          <label class="input-label"> Ship method</label>
          <div>
            <el-select clearable no-match-text="No Data"  no-data-text="No Data" v-model="update.shipMethod" placeholder="Select">
              <el-option v-for="method in carrierShipMethods" :key="method" :label="method" :value="method">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="grid-20">
          <label class="input-label"> Freight Term</label>
          <div>
            <el-select clearable no-match-text="No Data"   no-data-text="No Data"  v-model="update.freightTerm" placeholder="Select">
              <el-option v-for="term in ['Collect', 'Prepaid', 'Third Party']" :key="term" :label="term" :value="term">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="grid-20">
          <label> Schedule Date</label>
          <date-picker v-model="update.scheduleDate"
                       placeholder="Select date"
                       type="date"
                       format="YYYY-MM-DD"
                       value-type="YYYY-MM-DDT00:00:00"
          ></date-picker>
        </div>
      </div>
      <div class="grid-100 tablet-grid-100 container margin-top-15" >
        <div class="grid-20">
          <label> Ship Not Before</label>
          <date-picker v-model="update.shipNotBefore"
                       placeholder="Select date"
                       :name="'shipNotBefore'"
                       :format="'YYYY-MM-DD HH:mm'"
                       value-type="YYYY-MM-DDTHH:mm:00.000"
                       :type="'datetime'"
          >
          </date-picker>
        </div>
          <div class="grid-20">
              <label>Ship Not Later</label>
              <date-picker v-model="update.shipNoLater"
                           placeholder="Select date"
                           :name="'shipNoLater'"
                           :format="'YYYY-MM-DD HH:mm'"
                           value-type="YYYY-MM-DDTHH:mm:00.000"
                           :type="'datetime'"
              >
              </date-picker>
          </div>
        <div class="grid-20">
        <label>Requested Delivery Date</label>
          <date-picker v-model="update.mabd"
                       placeholder="Select date"
                       :name="'mabd'"
                       :format="'YYYY-MM-DD'"
                       value-type="YYYY-MM-DDT00:00:00"
                       :type="'date'"
          >
          </date-picker>
        </div>

        <div class="grid-20">
        <label>Appointment Time</label>
          <date-picker v-model="update.appointmentTime"
                       placeholder="Select date"
                       :name="'appointmentTime'"
                       :format="'YYYY-MM-DD HH:mm'"
                       value-type="YYYY-MM-DDTHH:mm:00.000"
                       :type="'datetime'"
          >
          </date-picker>
        </div>
        <div class="grid-20">
          <label>Shipping Account No</label>
          <input type="text" name="shippingAccountNo" v-model="update.shippingAccountNo" />
        </div>
      </div>
   </div>


      <div class="d-flex justify-content-end">
          <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" style="width: 150px; margin-right: 20px" class="mr-4" @click="CancelUpdateOrders" :value="'Cancel'"> </waitting-btn>

          <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" style="width: 150px;"  @click="updateOrders" :value="'Update'"
            :is-loading="loading" :disabled="loading"> </waitting-btn>

      </div>
    </div>
</template>
<style lang="scss" src="./order-update-view.scss" />
