<template>
    <div class="inbound-order-entry">
        <form @submit.stop.prevent="onSubmit('form-1')" data-vv-scope="form-1">
            <div class="grid-100 tablet-grid-100 ">
                <div class="grid-100 tablet-grid-100 container">
                    <span class="component-title bold">Outbound Order Entry </span>
                </div>
                <div class="d-flex mt-5">
                    <div class="unis-steps current ">
                        <span>1</span>Order Info
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 container mt-5">
                    <div class="grid-20 tablet-grid-25">
                        <predefined-customer-select v-model="customerId" :isDisabled="orderId ? true : false "

                                                    @change="onSelectCustomer"></predefined-customer-select>
                    </div>
                    <div class="grid-20 tablet-grid-25 ">
                        <facility-select v-model="facility" :customerId="addOrder.customerId" :isDisabled="orderId ? true : false "
                                         @change="onSelectFacility"  @facilityChangeCauseByCustomerChange="onFacilityChangeCauseByCustomerChange" :isShowFacilityAll="false"></facility-select>
                    </div>

                    <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label"> Order Type</label>
                        <div>
                            <el-select no-match-text="No Data" no-data-text="No Data" v-model="addOrder.orderType" placeholder="Select">
                                <el-option v-for="type in orderTypes" :key="type" :label="type" :value="type">
                                </el-option>
                            </el-select>
                        </div>
                    </div>

                    <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label">Retailer </label>
                        <div>
                            <div>
                                <organization-auto-complete v-model="addOrder.retailerId"
                                                            :customerId="addOrder.customerId"
                                                            :tag="'Retailer'"
                                                            :placeholder="'Input to search retailer'"
                                >
                                </organization-auto-complete>
                            </div>
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label">Purchase Order No. </label>
                        <div>
                            <input type="text" placeholder="Enter purchase order no"
                                   v-model="addOrder.poNo"
                                   :name="'purchaseOrderNo'"/>
                        </div>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 container mt-4">

                    <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label">Reference<span style="color: #ff6040">*</span> </label>
                        <div :class="{'error':errors.has('form-1.referenceNo')}">
                            <input type="text" :placeholder="'Enter reference'"
                                   v-model="addOrder.referenceNo"
                                   :name="'referenceNo'"
                                   v-validate="'required'"
                            />
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label">Customer Sales Order No.</label>
                        <div >
                            <tags-input v-model="addOrder.soNos" :placeholder="'Enter customer sales order'"></tags-input>
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label">Label Code</label>
                        <div>
                            <input type="text" placeholder=" "
                                   v-model="addOrder.labelCode"
                                   :name="'labelCode'"/>
                        </div>
                    </div>
                    <div class=" d-flex grid-20 tablet-grid-25 mt-4 "  >
                        <label>Rush </label>
                        <switch-button v-model="addOrder.isRush"></switch-button>
                    </div>
                </div>

                <div class="grid-100 tablet-grid-100 container ">
                    <div class="grid-50 tablet-grid-25 ">
                        <label  class="input-label">Ship From  </label>
                        <div class="unis-uploader long">
                            <input type="text" style="background: #ffffff; margin: 0;" placeholder="Enter ship from address"
                                   disabled v-model="shipFromMessage">
                            <input type="button" value="Edit" @click.stop.prevent="onEditShipFrom()" class="unis-btn unis-btn-primary mt-2 h-32">
                        </div>
                    </div>
                    <div class="grid-50 tablet-grid-25 ">
                        <label  class="input-label">Ship To</label>
                        <address-input
                                :tlitle="'Ship To Address'"
                                v-model="addOrder.shipToAddress"
                                :name="'shipToAddress'"
                                v-validate.persist="'required'"
                                :customerId = "addOrder.customerId"
                                :isValidate="errors.has('form-1.shipToAddress')"
                                @selectAddress="onsSlectAddress"
                        ></address-input>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 container pl-0" style="padding-left: 0!important; padding-right: 0!important;">
                    <div class="grid-50 pl-0 " style="padding-right: 0!important;">
                        <div class="grid-100 p-0 ">
                            <div class="d-flex align-items-end p-0">
                                <label  class="input-label">Freight Bill to</label>
                                <div class="ml-auto d-flex align-items-center">
                                <input type="checkbox" class="unis-checkbox" id="sameasshiptoBillTo"   v-model="isSameasshiptoBillTo">
                                <label for="sameasshiptoBillTo" @click="sameasshiptoBillTo">
                                    <span class="ml-2"></span><span class="ml-4">Same As Ship To Address</span>
                                </label>
                            </div> </div>
                            <address-input :tlitle="'Bill To Address'" class="mt-2" :customerId="addOrder.customerId"
                                           v-model="addOrder.billToAddress"
                                           @selectAddress="isSameasshiptoBillTo = false"
                            ></address-input>
                        </div>

                    </div>
                    <div class="grid-50 " style="padding-left: 0!important;">
                        <div class="grid-100 p-0 ">
                            <div class="d-flex align-items-center "><label  class="input-label">Sold To</label>
                                <div class="ml-auto d-flex align-items-center">
                                <input type="checkbox" class="unis-checkbox" id="sameasshiptoSoldTo"  v-model="isSameasshiptoSoldTo" >
                                <label for="sameasshiptoSoldTo"  @click="sameasshiptoSoldTo">
                                    <span class="ml-2"></span><span class="ml-4">Same As Ship To Address</span>
                                </label>
                            </div></div>
                            <address-input :tlitle="'Sold To Address'" class="mt-2" :customerId="addOrder.customerId"
                                           v-model="addOrder.soldToAddress"
                                           @selectAddress="isSameasshiptoSoldTo = false"
                            ></address-input>
                        </div>

                    </div>
                </div>
                <div class="d-flex mt-5 mb-5">
                    <div class="unis-steps current ">
                        <span>2</span>Freight Term
                    </div>
                </div>

                <div class="grid-100 tablet-grid-100 container mt-5">
                    <div class="grid-20 tablet-grid-25">
                        <label class="input-label">Carrier</label>
                        <div>
                            <organization-auto-complete  v-model="addOrder.carrierId"
                                                         @change="onSelectCarrier"
                                                        :customerId="addOrder.customerId" :tag="'Carrier'"
                                                         :placeholder="'Input to search carrier'">
                            </organization-auto-complete>
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25">
                        <label class="input-label"> Ship method</label>
                        <div>
                            <el-select   v-model="addOrder.shipMethod"  placeholder="Select">
                                <el-option v-for="method in carrierShipMethods" :key="method" :label="method"
                                           :value="method">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25">
                        <label class="input-label">Delivery Service</label>
                        <div>
                            <el-select  no-match-text="No Data" no-data-text="No Data" v-model="addOrder.deliveryService"
                                       placeholder="Select">
                                <el-option v-for="receive in carrierServiceTypes" :key="receive" :label="receive"
                                           :value="receive">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label">Freight Term </label>
                        <div>
                            <el-select  no-match-text="No Data" no-data-text="No Data" v-model="addOrder.freightTerm"
                                        @change="onSelectFreightTerm()"
                                        placeholder="Select">
                                <el-option v-for="term in ['Collect', 'Prepaid', 'Third Party']" :key="term" :label="term"
                                           :value="term">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="grid-20 tablet-grid-25 ">
                        <label class="input-label">Shipping Account No <span style="color: #ff6040" v-if="addOrder.freightTerm==='Third Party'">*</span>  </label>
                        <div :class="{'error':errors.has('form-1.shippingAccountNo')}">
                            <input type="text" placeholder="Enter shipping account no"
                                   v-model="addOrder.shippingAccountNo"
                                   :name="'shippingAccountNo'"
                                   :disabled="addOrder.freightTerm==='Collect'"
                                   v-validate="addOrder.freightTerm==='Third Party'?'required':''"
                            />
                        </div>
                    </div>
                </div>
                <div class="d-flex mt-5 mb-3">
                    <div class="unis-steps current ">
                        <span>3</span>Dates
                    </div>
                </div>

                <div class="grid-100 tablet-grid-100 container">
                    <div class="grid-20 tablet-grid-25 pl-0 mt-4">
                        <label class="input-label">Ship Not Before</label>
                        <date-picker v-model="addOrder.shipNotBefore"
                                     :placeholder="'Select date'"
                                     :name="'shipNotBefore'"
                                     :format="'MM/DD/YYYY HH:mm:ss'"
                                     :value-type="'YYYY-MM-DDTHH:mm:ss'"
                                     :partition="'T'"
                                     :type="'datetime'"
                        >
                        </date-picker>
                    </div>
                    <div class="grid-20 tablet-grid-25 pl-0 mt-4">
                        <label class="input-label">Ship Not Later</label>
                        <date-picker v-model="addOrder.shipNoLater"
                                     :placeholder="'Select date'"
                                     :name="'shipNoLater'"
                                     :format="'MM/DD/YYYY HH:mm:ss'"
                                     :value-type="'YYYY-MM-DDTHH:mm:ss'"
                                     :partition="'T'"
                                     :type="'datetime'"
                        >
                        </date-picker>
                    </div>
                    <div class="grid-20 tablet-grid-25 pl-0 mt-4">
                        <label class="input-label">Schedule Date</label>
                        <date-picker v-model="addOrder.scheduleDate"
                                     :placeholder="'Select date'"
                                     :name="'scheduleDate'"
                                     :format="'MM/DD/YYYY HH:mm:ss'"
                                     :value-type="'YYYY-MM-DDTHH:mm:ss'"
                                     :partition="'T'"
                                     :type="'datetime'"
                        >
                        </date-picker>
                    </div>
                    <div class="grid-20 tablet-grid-25 pl-0 mt-4">
                        <label class="input-label">Requested Delivery Date</label>
                        <date-picker v-model="addOrder.mabd"
                                     :placeholder="'Select date'"
                                     :name="'mabd'"
                                     :format="'MM/DD/YYYY HH:mm:ss'"
                                     :value-type="'YYYY-MM-DDTHH:mm:ss'"
                                     :partition="'T'"
                                     :type="'datetime'"
                        >
                        </date-picker>
                    </div>
                    <div class="grid-20 tablet-grid-25 pl-0 mt-4">
                        <label class="input-label">Appointment Time</label>
                        <date-picker v-model="addOrder.appointmentTime"
                                     :placeholder="'Select date'"
                                     :name="'appointmentTime'"
                                     :format="'MM/DD/YYYY HH:mm:ss'"
                                     :value-type="'YYYY-MM-DDTHH:mm:ss'"
                                     :partition="'T'"
                                     :type="'datetime'"
                        >
                        </date-picker>
                    </div>

                </div>

                <div class="d-flex mt-3 mb-3">
                    <div class="unis-steps current ">
                        <span>4</span>Item List
                    </div>
                </div>
                <div class="mt-5 mb-5" style="position: relative">
                    <div class="col-12 d-flex">
                        <waitting-btn :btn-type="'button'" btn-class="unis-btn unis-btn-primary mb-4 color-white vertical-align h-40-p"
                                      style="margin-left: auto"
                                      @click="addItemList()" :value="'Add Item Line'"
                        ></waitting-btn>
                    </div>

                    <table class="unis-leads-table">
                        <thead>
                        <tr>
                            <th class="neutrals" style="width: 25px">#</th>
                            <th class="">Item</th>
                            <th class="">Title</th>
                            <th class="">UOM</th>
                            <th class="">Qty</th>
                            <th class="">Lot #</th>
                            <th class="">Pallet Qty</th>
                            <th class="">Supplier</th>
                            <th class="">Unit Price</th>
                            <th class="">Unit Price Currency</th>
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
                            <td>{{item.titleName}}</td>
                            <td><span >{{(item.unit && item.unit.name) ? item.unit.name:item.unitName}}</span></td>
                            <td>{{item.qty}}</td>
                            <td>{{item.lotNo}}</td>
                            <td>{{item.palletQty}}</td>
                            <td>{{item.supplierName}}</td>
                            <td>{{item.unitPrice}}</td>
                            <td>{{item.unitPriceCurrency}}</td>
                            <td class="action-td"
                                @click.stop.prevent=controlActionShow(index)>
                                <h3 class="">...</h3>
                                <button class="nav-box" v-show="showItemListIndex===index" style="overflow: inherit">
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
                    <waitting-btn :btn-type="'submit'" btn-class="unis-btn unis-btn-primary color-white vertical-align h-40-p"
                                  style="margin-left: auto;"
                                  :is-loading="isSubmit" :disabled="!addOrder.customerId" :value="submitName"
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
                                                :customerId="addOrder.customerId"
                                                @change="onSelectItem"
                                                :name="'itemSpecId'"
                                                v-validate="'required'"

                            >
                            </item-auto-complete>
                        </div>
                    </div>
                    <div class="grid-33 tablet-grid-25 ">
                        <label class="input-label">Title</label>
                        <div :class="{'error':errors.has('addItem.titleId')}">
                            <organization-auto-complete v-model="addItem.titleId"
                                                        :customerId="addOrder.customerId" :tag="'Title'"
                                                        :name="'titleId'"
                                                        :placeholder="'Input to search title'"
                                                        @change="onSelectTitle"
                                                        v-validate="'required'"
                            >
                            </organization-auto-complete>
                        </div>
                    </div>
                    <div class="grid-33 tablet-grid-25">
                        <label class="input-label">Supplier</label>
                        <div>
                            <organization-auto-complete v-model="addItem.supplierId" :customerId="addOrder.customerId"
                                                        :clearable="true" :tag="'Supplier'"
                                                        @change="onSelectSupplier"
                                                        :placeholder="'Input to search supplier'">
                            </organization-auto-complete>
                        </div>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 container">
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
                    <div class="grid-33 tablet-grid-25">
                        <label class="input-label">Qty <span style="color: #ff6040">*</span></label>
                        <div>
                            <input type="number" min="0" :class="{'error':errors.has('addItem.qty')}" :name="'qty'"
                                   v-validate="'required'" v-model="addItem.qty" placeholder="Enter qty"/>
                        </div>
                    </div>
                    <div class="grid-33 tablet-grid-25">
                        <label class="input-label">Unit Price </label>
                        <div>
                            <input type="number" min="0" :name="'unitPrice'"
                                   v-model="addItem.unitPrice" placeholder="Enter Unit Price"/>
                        </div>
                    </div>

                </div>
                <div class="grid-100 tablet-grid-100 container">
                    <div class="grid-33 tablet-grid-25">
                        <label class="input-label">Unit Price Currency</label>
                        <div>
                             <input type="text"  :name="'unitPriceCurrency'"
                                   v-model="addItem.unitPriceCurrency" placeholder="Enter Unit Price Currency"/>
                        </div>
                    </div>
                    <div class="grid-33 tablet-grid-25">
                        <label class="input-label">lotNo </label>
                        <div>
                            <input type="text" v-model="addItem.lotNo" placeholder="Enter lot no"/>
                        </div>
                    </div>
                    <div class="grid-33 tablet-grid-25">
                        <label class="input-label">palletQty </label>
                        <div>
                            <input type="text" v-model="addItem.palletQty" placeholder="Enter pallet qty "/>
                        </div>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 container">
                       <div class="grid-66 tablet-grid-25">
                         <label>Notes  </label>
                        <div>
                            <input type="text" v-model="addItem.note" placeholder="Enter note "/>
                        </div>
                    </div>
                    <div class="grid-33 tablet-grid-25">
                        <label class="input-label">Buyer Item ID </label>
                        <div>
                            <input type="text" v-model="addItem.buyerItemId" placeholder=" "/>
                        </div>
                    </div>
                 </div>
            </pop-up-windows>

        </form>
        <form @submit.stop.prevent="onemitShipFromCancel()" v-if="isEditShipFrom">
            <pop-up-windows class="fixed" :tlitle="'Ship From'" @cancel="emitShipFromCancel" :height="750" :width="90">
                <div class="d-flex flex-wrap">
                    <div class="col-3 mt-4">
                        <label>Organization</label>
                        <div>
                            <input type="text" placeholder="Disabled"
                                   :value="getAddressCustomer()"
                                   disabled
                            />
                        </div>
                    </div>
                    <div class="col-3  mt-4">
                        <label> &nbsp;</label>
                        <div >
                            <input type="text" placeholder="Type any text to search"
                                   v-model="addressSearch.keyword"
                                   :name="'keyword'"
                            />
                        </div>
                    </div>
                    <div class="col-3  mt-4 pt-4">
                        <button class="unis-btn unis-btn-primary"
                                @click.stop.prevent="searchAddress({organizationId:addOrder.customerId,keyword:addressSearch.keyword})">
                            Search <span class="loading"  v-if="isSearchAddress" style="margin-left: 25px; color: #ffffff"></span>
                        </button>
                    </div>
                </div>
                <div class="d-flex flex-wrap">
                    <div class="col-12 section white primary-bg-50  mt-4"> Address Result</div>
                    <table class="table unis-table  table-striped">
                        <thead>
                        <tr style="border-bottom: 1px solid #ddd !important;">
                            <th scope="col">Select</th>
                            <th scope="col">Organization</th>
                            <th scope="col">Name</th>
                            <th scope="col">StoreNo</th>
                            <th scope="col">State</th>
                            <th scope="col">City</th>
                            <th scope="col">Zipcode</th>
                            <th scope="col">Fax</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Address</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(address,index) in addressResults " :key="index"
                            @click.stop.prevent="onAddressResult(address,index)">
                            <td>
                                <label class="unis-radio">
                                    <input type="radio" name="address" :checked="index===indexCheckedAddress">
                                    <span class="unis-radio-style"></span>
                                </label>
                            </td>
                            <td>{{address.organizationName}}</td>
                            <td>{{address.name}}</td>
                            <td>{{address.storeNo}}</td>
                            <td>{{address.state}}</td>
                            <td>{{address.city}}</td>
                            <td>{{address.zipCode}}</td>
                            <td>{{address.fax}}</td>
                            <td>{{address.phone}}</td>
                            <td>{{address.address}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </pop-up-windows>
        </form>
        <div class="d-flex flex-wrap" style="margin-bottom: 50px;" v-if="orderId">
            <div class="d-flex col-12  mt-5">
                <div class="unis-steps current ">
                    <span>5</span> Dynamic Fields
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
                            <b style="font-size: 18px;">Order Dynamic Fields:</b>
                        </div>
                        <div class="col-12 p-2 d-flex flex-wrap">
                            <div class="col-6 mt-2" v-for="(field, key) in dynamicFields">
                                <b>{{field}}
                                    <div class="col p-0" v-if="key.indexOf('DateProperty') < 0 ">
                                        <input type="text" v-model="structureUpdataDynamicFields[key]">
                                    </div>
                                    <div  class="col p-0" v-if="key.indexOf('DateProperty') > -1 ">
                                        <date-picker v-model="structureUpdataDynamicFields[key]" style="width: 100%"
                                                     :placeholder="'Search date'"
                                                     :name="'DateProperty'"
                                                     :format="'MM/DD/YYYY HH:mm:ss'"
                                                     value-type="YYYY-MM-DDTHH:mm:ss"
                                                     :type="'datetime'"
                                        ></date-picker>
                                    </div>
                                </b>
                           </div>
                        </div>
                        <div class="col-12 p-3" style="text-align: right">
                            <waitting-btn :btn-type="'button'" btn-class="unis-btn unis-btn-primary h-40-p  color-white vertical-align"
                                          style="margin-left: auto" :value="'Update Dynamic Fields'"
                                          :is-loading="isLoadingUpdateStructureDynamicFields"
                                          @click="updateStructureDynamicFields()">
                            </waitting-btn>
                        </div>

                       <div class="col-12 p-0 card" v-for="(itemLine,index) in itemLists">
                            <div class="d-flex flex-wrap card-header" style="padding-top: 9px; cursor: pointer"
                                 @click.stop.prevent="onShowDynamicFields(index, itemLine,orderItemLineDynamicFields)">
                                <div class="col-12 d-flex" style="justify-content: space-between">
                                    <b style="font-size: 18px;">{{itemLine.itemSpecName}}<span
                                            v-if="itemLine.itemSpecDesc">({{itemLine.itemSpecDesc}})</span></b>
                                    <span class="unis-arrow unis-icon"
                                          :class="{'up':isshowItemListDynamicFieldIndex == index}"
                                          style="font-size: 18px;"></span>
                                </div>
                            </div>
                            <div class="d-flex flex-wrap card-body" v-if="isshowItemListDynamicFieldIndex == index">
                                <div class="col-12 card-title">
                                    <b style="font-size: 18px;">Dynamic Fields:</b>
                                </div>
                                <div class="col-12 d-flex flex-wrap">
                                    <div class="col-6" v-for="(fieldName, key ) in orderItemLineDynamicFields"
                                         style="word-wrap: break-word ;padding: 10px">
                                        <b>{{fieldName}}
                                            <div class="col p-0" v-if="key.indexOf('DateProperty') < 0 ">
                                                <input type="text" v-model="updataItemListDynamicFields[key]">
                                            </div>
                                            <div  class="col p-0" v-if="key.indexOf('DateProperty') > -1 ">
                                                <date-picker v-model="updataItemListDynamicFields[key]" style="width: 100%"
                                                             :placeholder="'Search date'"
                                                             :name="'DateProperty'"
                                                             :format="'MM/DD/YYYY HH:mm:ss'"
                                                             value-type="YYYY-MM-DDTHH:mm:ss"
                                                             :type="'datetime'"
                                                ></date-picker>
                                            </div>
                                        </b>
                                    </div>
                                </div>

                                <div class="col-12 card-title" style="margin-top: 24px;">
                                    <b style="font-size: 18px;">Original ItemLine From EDIs:</b>
                                </div>

                                <div class="d-flex col-12 flex-wrap "
                                     v-for="originalItemLine in itemLine.originalItemLineFromEDIs"
                                     style="margin-top: 24px; margin-bottom: 20px; padding-left: 0px;">
                                    <div class="d-flex">
                                        <div class="col-3" style="word-wrap: break-word ;padding: 10px">
                                            <b>Line No.&nbsp;&nbsp;: </b>{{originalItemLine.lineNo}}
                                        </div>
                                        <div class="col-3" style="word-wrap: break-word ;padding: 10px">
                                            <b>Original Item Product Number&nbsp;&nbsp;: </b>{{originalItemLine.originalItemProductNumber}}
                                        </div>
                                        <div class="col-3" style="word-wrap: break-word ;padding: 10px">
                                            <b>Qty&nbsp;&nbsp;: </b>{{originalItemLine.qty}}
                                        </div>
                                        <div class="col-3" style="word-wrap: break-word ;padding: 10px">
                                            <b>Require Return Label&nbsp;&nbsp;: </b>
                                            <switch-button v-model="originalItemLine.requireReturnLabel"
                                                           :disabled="addReceipt.istransload"
                                            ></switch-button>
                                        </div>
                                    </div>


                                    <div class="col-12" style="word-wrap: break-word ;padding: 10px">
                                        <b>ReturnTracking No.&nbsp;&nbsp;: </b>{{originalItemLine.returnTrackingNo}}
                                    </div>
                                    <div class="col-12 d-flex flex-wrap">
                                        <div class="col-md-6" v-for="(key,fieldName) in originalItemLineDynamicFields"
                                             style="word-wrap: break-word ;padding: 10px">
                                            <div class="d-flex justify-content-content">{{fieldName}}:
                                                <div class="col" v-if="key.indexOf('DateProperty') < 0 ">
                                                    <input type="text" v-model="originalItemLine.dynamicFields[key]">
                                                </div>
                                                <div  class="col" v-if="key.indexOf('DateProperty') > -1 ">
                                                    <date-picker v-model="originalItemLine.dynamicFields[key]"
                                                                 :placeholder="'Search date'"
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
<style lang="scss" src="./order-entry.scss"/>
