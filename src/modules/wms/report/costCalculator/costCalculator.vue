<template>
  <div class="calculate-wrap">
    <div class="row">
      <div class="col-6" style="margin-top: 10px">
        <div class="tip-word">
          <p>See your pricing with UNIS</p>
        </div>
          <div class="grid-100 tablet-grid-100">

              <ul class="nav-tabs">
                  <li :class="{'active':currentTagName==='item'}" @click="onClickStatuTab('item')"><a>Item</a></li>
                  <li :class="{'active':currentTagName==='weight'}" @click="onClickStatuTab('weight')"><a>Customize Dimension & Weight</a></li>
              </ul>
          </div>
          <div v-if="currentTagName==='item'" class="grid-100 tablet-grid-100 d-flex flex-wrap align-items-center" style="margin-top: 25px;">

              <div style="margin-right: 10px;">
                  <label class="input-label">Item:</label>
              </div>

              <div style="width: 50%">
                  <item-auto-complete :placeholder="'Input to search item'" v-model="searchParams.itemSpecId"
                                      :clearable="true" :customerId="customerId"

                                      :name="'itemSpecId'"

                  >
                  </item-auto-complete>
              </div>
              <div style="width: 150px;margin-left: 20px;">
                  <waitting-btn btn-class="unis-btn unis-btn-primary color-white   h-40-p"  @click="searchItemUnit()" :value="'Calculate'"
                                :is-loading="isSearchItemUnit"> </waitting-btn>
              </div>
              <div class="d-flex align-items-center" style="width: 100%">
                  <div class="fulfillment" v-if="productData" style="width: 100%">
                      <div style="width: 100%">
                          <div class="cost-list d-flex" style="padding: 15px"  >
                              Dimensions : {{productData.width}} x {{productData.length}} x {{productData.height}} in
                          </div>
                          <div class="cost-list d-flex"  style="padding: 15px; margin-top: 10px;" >
                              Item weight: {{productData.weight}} {{productData.weightUnit}}
                          </div>
                      </div>
                  </div>

              </div>
          </div>
          <div v-if="currentTagName==='weight'" class="grid-100 tablet-grid-100 d-flex flex-wrap align-items-center" style="margin-top: 25px;">
              <div class="grid-25 tablet-grid-25">
                  <label class="input-label">Width </label>
                  <div>
                      <input type="text" v-model="searchParams.width" :placeholder="'Enter width'"/>
                  </div>
              </div>
              <div class="grid-25 tablet-grid-25">
                  <label class="input-label">Length </label>
                  <div>
                      <input type="text" v-model="searchParams.length" :placeholder="'Enter length'"/>
                  </div>
              </div>
              <div class="grid-25 tablet-grid-25">
                  <label class="input-label">Height </label>
                  <div>
                      <input type="text" v-model="searchParams.height" :placeholder="'Enter height'"/>
                  </div>
              </div>
              <div class="grid-25 tablet-grid-25">
                  <label class="input-label">Weight </label>
                  <div>
                      <input type="text" v-model="searchParams.weight" :placeholder="'Enter weight'"/>
                  </div>
              </div>
              <div class="d-flex justify-content-end" style="width: 100%; margin-top: 9px;">
                  <div style="padding-right: 9px;">
                      <waitting-btn btn-class="unis-btn mt-3 unis-btn-primary color-white vertical-align d-flex justify-content-end h-40-p"  @click="onClickCalculate()" :value="'Calculate'"
                                    :is-loading="isSearchItemUnit" > </waitting-btn>
                  </div>
              </div>


          </div>

      </div>
      <div class="col-6 result-con-outer">
        <div class="result-con">
          <div class="row">
            <div class="col-5">
              <predefined-customer-select v-model="customerId" @change="changeCustomer">
              </predefined-customer-select>
            </div>
            <div class="col-5">
              <facility-select v-model="selectFacility" :customerId="customerId" :isShowFacilityAll="false"
              @change="onSelectFacilityChange"></facility-select>
            </div>
          </div>

          <div class="fulfillment">
            <div>
              <p>Shipping</p>
              <div class="d-flex">
                <div class="col-6">
                  <label for="">Units per order</label>
                  <el-select v-model="costParmas.ItemQty" :placeholder="''" @change="searchCostDataWhenParamsChange">
                    <el-option
                      v-for="item in orderOptions"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                  <div class="per-select">
                    <label for="">Carrier</label>
                    <el-select v-model="costParmas.CarrierCode" :disabled="true" :placeholder="''">
                      <option value="UPS_Ground"></option>
                    </el-select>
                  </div>
                  <div class="per-select">
                    <label for="">Delivery Service</label>
                    <el-select v-model="costParmas.DeliveryService" :disabled="true" :placeholder="''">
                      <option value="UPS"></option>
                    </el-select>
                  </div>
                </div>
                <div class="cost-list col-6" v-if="costData.ShipCost">
                  <div v-for="(item, index) in costData.ShipCost.ItemLines" :key="index">
                    Zone{{item.Zone}} : {{item.Rate}}
                  </div>
                </div>
              </div>
            </div>

            <div class="receive-pick">
              <p>Fulfillment</p>
              <div class="justify-content-between" v-if="costData.FulFillmentCost">
                <div class="per-card" v-for="(item, index) in costData.FulFillmentCost.ItemLines" :key="index">
                  <p>{{item.Action}} <span>{{item.Description ? '(' + item.Description + ')': ''}}</span></p>
                  <div class="item-info">Rate: {{item.Rate}}</div>  
                </div>
              </div>
            </div>

            <div class="storage-mes">
              <p>Storage <span>{{timeUnit}}</span></p>
              <div class="storage-con">
                <div class="d-flex">
                  <span>Average {{timeUnit}} units stored at UNIS: {{costParmas.StorageQty}}</span>
                </div>
                <div class="d-flex">
                  <span>Location Capacity Type:</span>
                  <el-select v-model="costParmas.CapacityType" :placeholder="''" @change="searchCostDataWhenParamsChange">
                    <el-option
                      v-for="item in capacityType"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </div>
                <div class="slider">
                  <el-slider
                    v-model="rangeValue"
                    @change="changeRange"
                    :step="20"
                    :format-tooltip="formatTooltip"
                    :marks="marks">
                  </el-slider>
                  <p>Calculate Price: ${{resultPrice}}</p>
                  <div style="margin: 10px 0">Details:</div>
                  <div v-if="costData.StorageCost">
                    <div class="per-price" v-for="(item, index) in costData.StorageCost.ItemLines" :key="index">
                      <div class="row">
                        <p class="col-12" style="color: #648bff;">CapacityType: {{item.CapacityType}} {{item.Notes ? (item.Notes): ''}}</p>
                      </div>
                      <div class="row">
                        <p class="col-6">Qty: {{item.Qty}}</p>
                        <p class="col-6">UnitPrice: {{item.UnitPrice}}</p>
                      </div>
                      <div class="row">
                        <p class="col-6">Rate: {{item.Rate}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" src="./costCalculator.scss" />
