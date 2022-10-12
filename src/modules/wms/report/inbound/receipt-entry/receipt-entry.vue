<template>
    <div class="inbound-receipt-entry">
        <form @submit.stop.prevent="onSubmit('form-1')" data-vv-scope="form-1">
      <div class="grid-100 tablet-grid-100 ">

                <div class="grid-100 tablet-grid-100 container">
                    <span class="component-title bold">Inbound Receipt Entry </span>
                </div>

                <div class="d-flex mt-5 mb-3">
                    <div class="unis-steps current ">
                        <span>1</span>Receipt Info
                    </div>
                </div>

                <div class="grid-100 tablet-grid-100 container">
                    <div class="grid-20 tablet-grid-25">
                        <predefined-customer-select v-model="customerId"  :isDisabled="reportId ? true : false"
                                                    @change="onSelectCustomer"></predefined-customer-select>
                    </div>
                    <div class="grid-20 tablet-grid-25 ">
                        <facility-select v-model="addReceipt.facilityId" :customerId="addReceipt.customerId" :isDisabled="reportId ? true : false"
                                         @change="onSelectFacility" :isShowFacilityAll="false"></facility-select>
                    </div>

                    <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label">Title <span style="color: #ff6040">*</span> </label>
                        <div :class="{'error':errors.has('form-1.titleId')}">
                            <organization-auto-complete v-model="addReceipt.titleId"
                                                        :customerId="addReceipt.customerId" :tag="'Title'"
                                                        :name="'titleId'"
                                                        v-validate="'required'"
                                                        :placeholder="'Input to search title'"
                            >
                            </organization-auto-complete>
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label">Purchase Order No. <span style="color: #ff6040">*</span>  </label>
                        <div :class="{'error':errors.has('form-1.PurchaseOrderNo')}">
                            <input type="text" v-model="addReceipt.poNo"
                                   placeholder="Enter purchase order no"
                                   name="PurchaseOrderNo"
                                   v-validate="'required'"
                            />
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label">Reference </label>
                        <div>
                            <input type="text" v-model="addReceipt.referenceNo" placeholder="Enter reference"/>
                        </div>
                    </div>

                </div>

               <div class="grid-100 tablet-grid-100 container mt-4 mb-5">
                   <div class=" d-flex grid-20 tablet-grid-25"  >
                        <label>Transload </label>
                        <switch-button v-model="addReceipt.isTransload"></switch-button>
                    </div>
                   <div class=" d-flex grid-20 tablet-grid-25 "  >
                        <label>Rush </label>
                        <switch-button v-model="addReceipt.isRush"></switch-button>
                    </div>
                </div>

                <div class="d-flex mt-5 mb-3">
                    <div class="unis-steps current ">
                        <span>2</span>Freight Term
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 container">
                    <div class="grid-20 tablet-grid-25">
                        <label class="input-label">Carrier</label>
                        <div>
                            <organization-auto-complete v-model="addReceipt.carrierId"  :placeholder="'Input to search carrier'"
                                                        :customerId="addReceipt.customerId" :tag="'Carrier'">
                            </organization-auto-complete>
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25">
                        <label class="input-label"> Receipt Type</label>
                        <div>
                            <el-select no-match-text="No Data" v-model="addReceipt.receiptType" placeholder="Select">
                                <el-option v-for="type in receiptTypes" :key="type" :label="type" :value="type">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25">
                        <label class="input-label"> Receive Type</label>
                        <div>
                            <el-select type="danger" no-match-text="No Data" v-model="addReceipt.receiveType"
                                       placeholder="Select">
                                <el-option v-for="receive in receiveType" :key="receive" :label="receive"
                                           :value="receive">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label">Seal </label>
                        <div>
                            <input type="text" v-model="addReceipt.sealNo" placeholder="Enter seal no"/>
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label">Container No <span style="color: #ff6040">*</span> </label>
                        <div :class="{'error':errors.has('form-1.containerNo')}">
                            <input type="text" v-model="addReceipt.containerNo" placeholder="Enter container no"
                                   :name="'containerNo'"
                                   v-validate="'required'"
                            />
                        </div>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 container">
                    <div class="grid-20 tablet-grid-25">
                        <label class="input-label">Container Size </label>
                        <div>
                            <el-select no-match-text="No Data" v-model="addReceipt.containerSize" placeholder="Select">
                                <el-option v-for="data in containerSizeData" :key="data" :label="data" :value="data">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25">
                        <label class="input-label">Trailer No </label>
                        <div>
                            <input type="text"  placeholder="Enter trailer no" v-model="addReceipt.trailerNo" />
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25">
                        <label class="input-label">Trailer Size </label>
                        <div>
                            <el-select no-match-text="No Data" v-model="addReceipt.trailerSize" placeholder="Select">
                                <el-option v-for="data in trailerSize" :key="data" :label="data" :value="data">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label">Goods Type </label>
                        <div>
                            <el-select :disabled="disabledGoodsType" no-match-text="No Data" v-model="addReceipt.goodsType" placeholder="Select" >
                                <el-option v-for="type in isShowGoodsTypes?['GOOD',  'DAMAGE',  'Rework Needed', 'CONTAIN DAMAGE','ON HOLD',  'QC', 'FDA']:[]" :key="type" :label="type" :value="type">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25">
                        <label class="input-label">Bol </label>
                        <div>
                            <input type="text" v-model="addReceipt.bolNo" placeholder="Enter bol"/>
                        </div>
                    </div>

                </div>
          <div class="grid-100 tablet-grid-100 container">
              <div class="grid-100 tablet-grid-100">
                  <label class="input-label">Note </label>
                  <div>
                      <input type="text" v-model="addReceipt.note" :placeholder="'Enter note'"/>
                  </div>
              </div>
          </div>

              <div class="d-flex mt-5 ">
                    <div class="unis-steps current ">
                        <span>3</span>Item List
                    </div>
                </div>
          <div class="mt-5 mb-5" style="position: relative">
             <div class="col-12 d-flex mb-4">
                 <waitting-btn :btn-type="'button'" btn-class="h-32"
                    style="margin-left: auto"
                    @click="addItemList()" :value="'Add Item Line'"
                 ></waitting-btn>
             </div>
             <table class="unis-leads-table">
                  <thead>
                  <tr>
                      <th class="neutrals" style="width: 25px">#</th>
                      <th class="">Item</th>
                      <th class="">UOM</th>
                      <th class="">Qty</th>
                      <th class="">Lot #</th>
                      <th class="">Pallet Qty</th>
                      <th class="">Supplier</th>
                      <th class="">Goods Type</th>
                      <th class="">Expiration Date</th>
                      <th class="">Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for=" (item, index) in itemLists" :key="index">
                      <td class="neutrals" style="text-align: center">{{index + 1}} </td>
                      <td>
                          <item-display  v-if="!item.filterItem" :item="item" ></item-display>
                          <item-display  v-if="item.filterItem" :item="item.filterItem" ></item-display>
                      </td>
                      <td><span >{{(item.unit && item.unit.name) ? item.unit.name:item.unitName}}</span></td>
                      <td>{{item.qty}}</td>
                      <td>{{item.lotNo}}</td>
                      <td>{{item.palletQty}}</td>
                      <td>{{item.supplierName}}</td>
                      <td>{{item.goodsType}}</td>
                      <td><span v-if="item.expirationDate">{{item.expirationDate|amDateFormat}}</span></td>
                      <td class="action-td"
                          @click.stop.prevent=controlActionShow(index)>
                          <h3 class="">...</h3>
                          <button class="nav-box" v-if="showItemListIndex===index">
                              <div @click.stop.prevent="duplicateItemList(item)">Duplicate</div>
                              <div @click.stop.prevent="editItemList(item,index)">Edit</div>
                              <div @click.stop.prevent="removeItemList(item,index)">Remove</div>
                          </button>
                      </td>
                  </tr>

                  </tbody>
              </table>
          </div>

         <div class="col-12 d-flex" style="margin-bottom: 50px;">
             <waitting-btn :btn-type="'submit'" btn-classe="h-40-p"
                           style="margin-left: auto;width: 170px"
                           :is-loading="isSubmit" :disabled="!addReceipt.customerId" :value="submitName"
             ></waitting-btn>
         </div>

            </div>
        </form>
        <form @submit.stop.prevent="onSubmitItem('addItem')" data-vv-scope="addItem">
            <pop-up-windows v-show="isAddItemPopup" :isSubmit="true" :tlitle="popupTlitle" @cancel="emitCancel">
                <div class="grid-100 tablet-grid-100 container">
                    <div class="grid-33 tablet-grid-25">
                        <label class="input-label">Item  <span style="color: #ff6040">*</span></label>
                        <div :class="{'error':errors.has('addItem.itemSpecId')}">
                            <item-auto-complete :placeholder="'Input to search item'" v-model="addItem.itemSpecId"
                                                :customerId="addReceipt.customerId"
                                                @change="onSelectItem"
                                                :name="'itemSpecId'"
                                                v-validate="'required'"

                            >
                            </item-auto-complete>
                        </div>
                    </div>
                    <div class="grid-33 tablet-grid-25">
                        <label class="input-label">Supplier</label>
                        <div >
                            <organization-auto-complete v-model="addItem.supplierId" :customerId="addReceipt.customerId"
                                                        @change="onSelectSupplier"
                                                        :clearable="true" :tag="'Supplier'" :placeholder="'Input to search supplier'">
                            </organization-auto-complete>
                        </div>
                    </div>
                    <div class="grid-33 tablet-grid-25">
                        <label class="input-label">UOM  <span style="color: #ff6040">*</span></label>
                        <div :class="{'error':errors.has('addItem.unitId')}">
                            <el-select @change="selectChangedUom" no-match-text="No Data" no-data-text="No Data"
                                       v-model="addItem.unitId" placeholder="Select" :name="'unitId'"
                                       v-validate="'required'">
                                <el-option v-for="Uom in selectItemListUoms" :key="Uom.id" :label="Uom.name"
                                           :value="Uom.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>


                </div>
                <div class="grid-100 tablet-grid-100 container">
                    <div class="grid-33 tablet-grid-25">
                        <label class="input-label">Qty  <span style="color: #ff6040">*</span></label>
                        <div>
                            <input type="text" :class="{'error':errors.has('addItem.qty')}" :name="'qty'"
                                   v-validate="'required'" v-model="addItem.qty" placeholder="Enter qty"/>
                        </div>
                    </div>
                    <div class="grid-33 tablet-grid-25">
                        <label class="input-label">lotNo </label>
                        <div>
                            <input type="text" v-model="addItem.lotNo" placeholder="Enter lot no"/>
                        </div>
                    </div>
                    <div class="grid-33 tablet-grid-25">
                        <label class="input-label">palletQty</label>
                        <div>
                            <input type="text" v-model="addItem.palletQty" placeholder="Enter pallet qty "/>
                        </div>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 container">
                    <div class="grid-33 tablet-grid-25">
                        <label class="input-label">Expiration Date </label>
                        <div>
                            <date-picker v-model="addItem.expirationDate"
                                         :placeholder="'Select date'"
                                         :name="'expirationDate'"
                                         :format="'MM/DD/YYYY'"
                                         :value-type="'YYYY-MM-DDT00:00:00'"
                                         :type="'date'"
                            >
                            </date-picker>
                        </div>
                    </div>
                    <div class="grid-33 tablet-grid-25 ">
                        <label class="input-label">Goods Type </label>
                        <div>
                            <el-select  v-model="addItem.goodsType" >
                                <el-option v-for="goodsType in ['GOOD',  'DAMAGE',  'Rework Needed', 'CONTAIN DAMAGE','ON HOLD',  'QC', 'FDA']" :key="goodsType" :label="goodsType" :value="goodsType">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="grid-33 tablet-grid-25">
                        <label>Note </label>
                        <div>
                            <input type="text" v-model="addItem.Notes" placeholder="Enter note "/>
                        </div>
                    </div>
                </div>
            </pop-up-windows>

        </form>

        <div class="d-flex flex-wrap" v-if="reportId" style="margin-bottom: 50px">
            <div class="d-flex col-12  mt-5">
                <div class="unis-steps current ">
                    <span>4</span> Dynamic Fields
                </div>
            </div>
            <div class="d-flex col-12 justify-content-end">
                <div class="col-1 " style="text-align: right; cursor: pointer" >
                    <span class="unis-arrow unis-icon"
                          :class="{'up':showDynamicFields}"
                          style="font-size: 18px;" @click="onDynamicFields"></span>
                </div>
            </div>

            <div class="d-flex col-12 p-0 flex-wrap mb-4" v-if="showDynamicFields">
                <div class="d-flex col-12 pl-0 pr-0 pt-2">
                    <div class="d-flex col-12 flex-wrap">
                        <div class="col-10">
                            <b style="font-size: 18px;">Receipt Dynamic Fields:</b>
                        </div>
                        <div class="col-12 p-2 d-flex flex-wrap">
                            <div class="col-6 mt-2" v-for="(field, key) in dynamicFields">
                                <b>{{field}}
                                    <div class="col p-0" v-if="key.indexOf('DateProperty') < 0 ">
                                        <input type="text" v-model="structureUpdataDynamicFields[key]">
                                    </div>
                                    <div  class="col p-0" v-if="key.indexOf('DateProperty') > -1 ">
                                        <date-picker v-model="structureUpdataDynamicFields[key]" style="width: 100%"
                                                     :placeholder="'Select date'"
                                                     :name="'DateProperty'"
                                                     :format="'MM/DD/YYYY HH:mm:ss'"
                                                     value-type="YYYY-MM-DDTHH:mm:ss"
                                                     :type="'datetime'"
                                        ></date-picker>
                                    </div>
                                </b>
                            </div>
                        </div>
                        <div class="col-12  p-3" style="text-align: right">
                            <waitting-btn :btn-type="'button'" btn-class="unis-btn unis-btn-primary  color-white vertical-align h-40-p"
                                          style="margin-left: auto" :value="'Update'"
                                          :is-loading="isLoadingUpdateStructureDynamicFields"
                                          @click="updateStructureDynamicFields()">
                            </waitting-btn>
                        </div>

                        <div class="col-12 p-0 card" v-for="(itemLine,index) in itemLists">
                            <div class="d-flex flex-wrap card-header" style="padding-top: 9px; cursor: pointer"
                                 @click.stop.prevent="onShowDynamicFields(index, itemLine, receiptItemLineDynamicFields)">
                                <div class="col-12 d-flex" style="justify-content: space-between">
                                    <b style="font-size: 18px;">{{itemLine.itemSpecName}}<span
                                            v-if="itemLine.itemSpecDesc">({{itemLine.itemSpecDesc}})</span></b>
                                    <span class="unis-arrow unis-icon"
                                          :class="{'up':isshowItemListDynamicFieldIndex == index}"
                                          style="font-size: 18px;"></span>
                                </div>
                            </div>
                            <div class="d-flex flex-wrap card-body" v-if="isshowItemListDynamicFieldIndex == index">

                                <span class="col-12 card-title"><b style="font-size: 18px;">Dynamic Fields:</b></span>
                              <div class="col-12 d-flex flex-wrap">
                                    <div class="col-6" v-for="(fieldName, key ) in receiptItemLineDynamicFields"
                                         style="word-wrap: break-word ;padding: 10px">
                                        <b>{{fieldName}}
                                            <div class="col p-0" v-if="key.indexOf('DateProperty') < 0 ">
                                                <input type="text" v-model="updataItemListDynamicFields[key]">
                                            </div>
                                            <div  class="col p-0" v-if="key.indexOf('DateProperty') > -1 ">
                                                <date-picker v-model="updataItemListDynamicFields[key]" style="width: 100%"
                                                             :placeholder="'Select date'"
                                                             :name="'DateProperty'"
                                                             :format="'MM/DD/YYYY HH:mm:ss'"
                                                             value-type="YYYY-MM-DDTHH:mm:ss"
                                                             :type="'datetime'"
                                                ></date-picker>
                                            </div>
                                        </b>
                                    </div>
                                </div>
                                <span class="col-12 card-title" style="margin-top: 24px;"><b style="font-size: 18px;">Combine Receipt Item Lines:</b></span>
                               <div class="d-flex col-12 flex-wrap "
                                     v-for="originalItemLine in itemLine.combineReceiptItemLines"
                                     style=" margin-bottom: 20px; padding-left: 0px;">
                                    <div class="col-12 d-flex">
                                         <span class="col-3" style="word-wrap: break-word ;padding: 10px">
                                    <b>PO Line No.&nbsp;&nbsp;: </b>{{originalItemLine.poLineNo}}
                                   </span>
                                        <span class="col-3" style="word-wrap: break-word ;padding: 10px">
                                    <b>PO Item&nbsp;&nbsp;: </b>{{originalItemLine.poItem}}
                                   </span>
                                        <span class="col-3" style="word-wrap: break-word ;padding: 10px">
                                    <b>Qty&nbsp;&nbsp;: </b>{{originalItemLine.qty}}
                                   </span>
                                        <span class="col-3" style="word-wrap: break-word ;padding: 10px">
                                    <b>PO No.&nbsp;&nbsp;: </b>{{originalItemLine.poNo}}
                                   </span>
                                    </div>
                                    <div class="d-flex col-12 flex-wrap">
                                        <div class="col-6" v-for="(fieldName, key) in ItemLineDynamicFields">
                                            <div class="d-flex justify-content-content">{{fieldName}}:
                                                <div class="col" v-if="key.indexOf('DateProperty') < 0 ">
                                                    <input type="text" v-model="originalItemLine.dynamicFields[key]">
                                                </div>
                                                <div  class="col" v-if="key.indexOf('DateProperty') > -1 ">
                                                    <date-picker v-model="originalItemLine.dynamicFields[key]"
                                                                 :placeholder="'Select date'"
                                                                 :name="'DateProperty'"
                                                                 :format="'MM/DD/YYYY HH:mm:ss'"
                                                                 value-type="YYYY-MM-DDTHH:mm:ss"
                                                                 :type="'datetime'"
                                                    ></date-picker>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 d-flex" style="padding-left: 0px;">
                                    <div class="col-10">
                                        &nbsp;
                                    </div>
                                    <div class="col-2" style="text-align: right">
                                        <waitting-btn :btn-type="'button'" btn-class="unis-btn unis-btn-primary  color-white h-40-p"
                                                      :value="'Update'" :is-loading="isupdateItemLineDynamicFields"
                                                      @click="updateItemLineDynamicFields(itemLine)">
                                        </waitting-btn>
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
<style lang="scss" src="./receipt-entry.scss"/>
