<template>
    <div class="set-the-address">
        <form v-if="isShow" @submit.stop.prevent="onSetTheAddress('setTheAddress')" data-vv-scope="setTheAddress"
              class="set-the-address">
            <pop-up-windows class="fixed" :tlitle="tlitle" @cancel="emitCancel" :height="700" :width="80">
                <div class="d-flex" style="flex-wrap:wrap">
                    <div class="col-5 p-0 d-flex flex-wrap">
                        <div class="d-flex col-12 p-0 align-items-start">
                            <div class="col-8 pt-3">
                                <div>
                                    <input type="text" placeholder="Type any text to search"
                                           v-model="addressSearch.keyword"
                                           :name="'keyword'"
                                    />
                                </div>
                            </div>
                            <div class="col-4 pt-3">
                                <button class="unis-btn unis-btn-primary"
                                        @click.stop.prevent="onSearchAddress({organizationId:null,keyword:addressSearch.keyword})">
                                    Search <span class="loading" v-if="isSearchAddress"
                                                 style="margin-left: 25px; color: #ffffff"></span>
                                </button>
                            </div>
                        </div>
                        <div class="d-flex col-12 flex-wrap align-items-end">
                            <div  style="max-height: 485px; overflow-y: auto;width: 100%">
                                <div class="d-flex flex-wrap pt-2" style="position: relative; cursor: pointer;    "
                                     v-for="(address,index) in addressResults" :key="index"
                                     @click="onAddressResult(address,index)" :class="{'activity':changeAddressResultIndex === index }" >
                                    <div class="col-12 pl-0 pt-3 pb-1" style="border-bottom: 1px solid #dddddd">
                                        <h5>{{address.name}}</h5>
                                    </div>
                                        <div class="col-6 pt-2 ">
                                            <b>Address1:</b> <span style="text-decoration:underline">{{address.address1}}</span>
                                        </div>
                                        <div class="col-6  pt-2">
                                            <b>Address2:</b> <span style="text-decoration:underline">{{address.address2}}</span>
                                        </div>
                                        <div class="col-6  pt-2">
                                            <b>City:</b> <span style="text-decoration:underline">{{address.city}}</span>
                                        </div>
                                        <div class="col-6  pt-2">
                                            <b>State:</b>  <span style="text-decoration:underline">{{address.state}}</span>
                                        </div>
                                        <div class="col-6  pt-2">
                                            <b>ZipCode:</b> <span style="text-decoration:underline"> {{address.zipCode}}</span>
                                        </div>
                                        <div class="col-6  pt-2">
                                            <b>Store No:</b> <span style="text-decoration:underline">{{address.storeNo}}</span>
                                        </div>
                                        <div class="col-6  pt-2">
                                            <b>Fax:</b> <span style="text-decoration:underline">{{address.fax}}</span>
                                        </div>
                                        <div class="col-6  pt-2">
                                            <b>Phone:</b> <span style="text-decoration:underline">{{address.phone}}</span>
                                        </div>
                                    <div style="position: absolute; top: 49%;width: 20px;right: 2px;" v-if="changeAddressResultIndex === index">
                                        <img src="@/assets/images/shape-copy.svg" />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-7 p-0 d-flex flex-wrap ml-auto" style="align-content: flex-start;">
                        <div class="col-12 p-0 d-flex">
                            <div class="unis-steps current h4">
                                Address Info
                            </div>
                        </div>
                        <div class="col-3  ">
                            <label>Organization</label>
                            <div>
                                <input type="text" placeholder="Disabled"
                                       :value="customerName"
                                       disabled
                                />
                            </div>

                        </div>
                        <div class="col-3" style="padding-top: 8px;">
                            <label>Residential </label>
                            <switch-button v-model="currentAddress.toHome"
                            ></switch-button>
                        </div>
                        <div class="col-3  ">
                            <label class="input-label">Reference No. </label>
                            <div>
                                <input type="text" v-model="currentAddress.referenceNo" placeholder="Reference No."
                                />
                            </div>
                        </div>
                        <div class="col-3 mt-2  ">
                            <label>Name.  <span style="color: #ff6040">*</span></label>
                            <input type="text" :name="'name'"
                                   v-model="currentAddress.name"
                                   v-validate="'required'"
                                   :class="{'error':errors.has('setTheAddress.name')}"
                            />
                        </div>
                        <div class="col-3 mt-2 ">
                            <label>Address1.</label>
                            <input type="text" v-model="currentAddress.address1" :name="'address1'"/>
                        </div>
                        <div class="col-3 mt-2 ">
                            <label>address2.</label>
                            <input type="text" v-model="currentAddress.address2" :name="'address2'"/>
                        </div>
                        <div class="col-3 mt-2 ">
                            <label>City.<span style="color: #ff6040">*</span></label>
                            <input type="text" v-model="currentAddress.city"
                                   :name="'city'"
                                   v-validate="'required'"
                                   :class="{'error':errors.has('setTheAddress.city')}"
                            />
                        </div>
                        <div class="col-3 mt-2 ">
                            <label>State.<span style="color: #ff6040">*</span></label>
                            <input v-model="currentAddress.state"
                                   :name="'state'"
                                   :type="'text'"
                                   v-validate="'required'"
                                   :class="{'error':errors.has('setTheAddress.state')}"
                            />
                        </div>
                        <div class="col-3 mt-2 ">
                            <label>Zip Code<span style="color: #ff6040">*</span></label>
                            <input v-model="currentAddress.zipCode"
                                   :name="'zipCode'"
                                   :type="'text'"
                                   v-validate="'required'"
                                   :class="{'error':errors.has('setTheAddress.zipCode')}"
                            />
                        </div>
                        <div class="col-3 mt-2 ">
                            <label>Country<span style="color: #ff6040">*</span></label>
                            <input v-model="currentAddress.country"
                                   :name="'country'"
                                   :type="'text'"
                                   v-validate="'required'"
                                   :class="{'error':errors.has('setTheAddress.country')}"
                            />
                        </div>
                        <div class="col-3 mt-2 ">
                            <label>Store No.</label>
                            <input v-model="currentAddress.storeNo"
                                   :name="'storeNo'"
                                   :type="'text'"
                            />
                        </div>
                        <div class="col-3 mt-2 ">
                            <label>Shorthand</label>
                            <input v-model="currentAddress.shorthand"
                                   :name="'shorthand'"
                                   :type="'text'"
                            />
                        </div>
                        <div class="col-12 mt-3">
                            <div class="unis-steps current h4 ">
                                Contact Info
                            </div>
                        </div>
                        <div class="col-3 mt-2 ">
                            <label>Contact</label>
                            <input v-model="currentAddress.contact"
                                   :name="'contact'"
                                   :type="'text'"
                            />
                        </div>
                        <div class="col-3  ">
                            <label>Phone</label>
                            <input v-model="currentAddress.phone"
                                   :name="'phone'"
                                   :type="'text'"
                            >
                        </div>
                        <div class="col-3 mt-2 ">
                            <label>Extension</label>
                            <input v-model="currentAddress.extension"
                                   :name="'extension'"
                                   :type="'text'"
                            />
                        </div>
                        <div class="col-3  ">
                            <label>Email</label>
                            <input v-model="currentAddress.email"
                                   :name="'email'"
                                   :type="'text'"
                            />
                        </div>
                        <div class="col-3 mt-2 ">
                            <label>Fax</label>
                            <input v-model="currentAddress.fax"
                                   :name="'fax'"
                                   :type="'text'"
                            />
                        </div>
                    </div>
                </div>
            </pop-up-windows>
        </form>
        <div class="unis-uploader long" style="background: #ffffff;">
            <input type="text" placeholder="Enter address" :class="{'error':isValidate}" disabled v-model="addressMessage" style="margin: 0; background: #ffffff">
            <input type="button" value="Edit" @click.stop.prevent="onEdit()" class="unis-btn unis-btn-primary mt-2 h-32">
        </div>
    </div>
</template>
<style lang="scss" src="./address-input.scss"/>
