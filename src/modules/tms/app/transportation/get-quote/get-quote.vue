<template>
    <div class="invenroty-aging get-quote">
        <checkbox-modal  :modalName="PICK_MODAL" :choseAccAry="chose_pick_ary" :accAry="pickupAcc" @cancelOptional="closeAcc('pick')" @saveAcc="saveAcc" @updateAcc="updateAcc" :title="'Accessorials'"></checkbox-modal>
        <checkbox-modal  :modalName="DELIVERY_MODAL" :choseAccAry="chose_delivery_ary" :accAry="deliveryAcc" @cancelOptional="closeAcc('delivery')" @saveAcc="saveAcc" @updateAcc="updateAcc" :title="'Accessorials'"></checkbox-modal>
        <div class="grid-100 tablet-grid-100"  v-loading="loading"  :class="{'pop-modal':isShowModal}">
            <div class="grid-100 tablet-grid-100 container title">
                <span class="component-title bold">Get a Quote</span>
            </div>
            <div class='account' v-if="!isLogin">
                <div class="grid-100 tablet-grid-100 container avenirNext-Medium">
                     <step-counter></step-counter>
                     <span class="component-title account-information">Account Information</span>
                </div>
                <div class="grid-20 tablet-grid-25 container first">
                    <label class="input-label">Account Number</label>
                    <div>
                        <input type="text" name="accountNumber" v-model="accountNumber" style="width:160px;"  v-validate="'numeric'" :disabled="quoteData.hasQuote || calculating" />
                        <span v-if="errors.has('accountNumber') && validationStarted" class='help is-danger'>{{publicValidate(accountNumber, 'accountNumber')}}</span>
                    </div>
                </div>
                 <div class="grid-27 tablet-grid-25 container">
                    <label class="input-label">Company Name</label><label class='require'>*</label>
                    <div>
                        <input type="text" style="width:333px;" v-validate="'required|alpha_spaces'" name="companyName" v-model="companyName" :disabled="quoteData.hasQuote || calculating" />
                        <span v-if="errors.has('companyName') && validationStarted" class="help is-danger">{{publicValidate(companyName, 'companyName')}}</span>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">First Name</label><label class='require'>*</label>
                    <div>
                        <input style="width:160px;" type="text" name="firstName" v-validate="'required|alpha_spaces'" v-model="firstName" :disabled="quoteData.hasQuote || calculating" />
                        <span v-if="errors.has('firstName') && validationStarted" class='help is-danger'>{{publicValidate(firstName, 'firstName')}}</span>
                    </div>
                </div>
                <div class="grid-20 tablet-grid-25 container last-name">
                    <label class="input-label">Last Name</label><label class='require'>*</label>
                    <div>
                        <input style="width:160px;margin-left:-7%;" type="text" name="lastName" v-validate="'required|alpha_spaces'" v-model="lastName" :disabled="quoteData.hasQuote || calculating" />
                        <span v-if="errors.has('lastName') && validationStarted" class="help is-danger">{{publicValidate(lastName, 'lastName')}}</span>
                    </div>
                </div>
                 <div class="grid-27 tablet-grid-25 container">
                    <label class="input-label email">Email<span class='require'>*</span></label>
                    <div>
                        <input style="width:333px;" type="email" name="email" v-validate="'required|email'" v-model="email" :disabled="quoteData.hasQuote || calculating" />
                        <span v-if="errors.has('email') && validationStarted" class='help is-danger'>{{publicValidate(email, 'email')}}</span>
                    </div>
                </div>
                 <div class="grid-20 tablet-grid-25 container">
                    <label class="input-label">Phone</label><label class='require'>*</label>
                    <div>
                        <input style="width:160px;" type="text" name="phone" v-validate="'required|numeric'" v-model="phone" :disabled="quoteData.hasQuote || calculating" />
                        <span v-if="errors.has('phone') && validationStarted" class='help is-danger'>{{publicValidate(phone, 'phone')}}</span>
                    </div>
                </div>
                 <div class="grid-20 tablet-grid-25 container fax">
                    <label class="input-label">Fax</label>
                    <div>
                        <input style="width:160px;margin-left:-7%;" type="text" v-validate="'numeric'" name="fax" v-model="fax" :disabled="quoteData.hasQuote || calculating" />
                        <span v-if="errors.has('fax') && validationStarted" class='help is-danger'>{{publicValidate(fax, 'fax')}}</span>
                    </div>
                </div>       
            </div>
            <div class="top">
                <div class='address-information'>
                    <div class="grid-100 tablet-grid-100 container avenirNext-Medium">
                        <step-counter  :ovalNum="isLogin?'1':'2'"></step-counter>
                        <span class="component-title">Where are we picking up?</span>
                        <span class="tooltip-light" style="position:relative;left:-43.5%;margin-top:64px;"></span>
                    </div>
                    <div class="grid-35 tablet-grid-25 container first">
                        <label class="input-label">Location Type</label><label class='require'>*</label>
                        <div class="type">
                            <el-select no-match-text="No Data" placeholder="business" v-model="pickUpValue" @change="onTypeChange('pick', pickUpValue)" :disabled="quoteData.hasQuote || calculating">
                                <el-option v-for="type in locationType" :key="type.location_type_code" :label="type.location_type_description" :value="type.location_type_code">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="grid-25 tablet-grid-25 container">
                        <label class="input-label">Zipcode</label><label class='require' @click="pickupZipAutoComplete">*</label>
                        <div>
                            <input type="text" name='pickUpZipcode' maxlength="10" placeholder="90000" v-validate="'required|max:10|regex:^([0-9]{5}(\-[0-9]{4})?)$'" id="input_zip_code_pickup" v-model="quoteData.pickup.zipCode" :class="{'input': true, 'is-danger': errors.has('pickUpZipcode') && validationStarted}" :disabled="quoteData.hasQuote || calculating" />
                            <span v-if="errors.has('pickUpZipcode') && validationStarted" class='help is-danger'>{{publicValidate(quoteData.pickup.zipCode, 'pickUpZipcode')}}</span>
                        </div>
                    </div>
                    <div class="grid-35 tablet-grid-25 container">
                        <label class="input-label">City</label>
                        <div>
                            <input type="text" value="Autopop City" v-model="quoteData.pickup.city" name="pickupCity" v-validate="'alpha_spaces'" :class="{'input': true, 'is-danger': errors.has('pickupCity') && validationStarted}" :disabled="quoteData.hasQuote || calculating" />
                            <span v-if="errors.has('pickupCity') && validationStarted" class='help is-danger'>{{publicValidate(quoteData.pickup.city, 'pickupCity')}}</span>
                        </div>
                    </div>
                    <div class="grid-15 tablet-grid-25 container">
                        <label class="input-label">State</label>
                        <div>
                            <el-select placeholder="" v-model="quoteData.pickup.state"  no-match-text="No Data"  v-validate="'required|alpha_spaces'" :class="{'input': true, 'is-danger': errors.has('pickupState') && validationStarted}" :disabled="quoteData.hasQuote || calculating">
                                <el-option v-for="state in STATE_ARY" :key="state.code" :label="state.code" :value="state.desc">
                                </el-option>
                            </el-select>
                            <span style="display: inline-block;width: 94px;" v-if="errors.has('pickupState') && validationStarted" class='help is-danger'>{{publicValidate(quoteData.pickup.state, 'pickupState')}}</span>
                        </div>
                    </div>
                    <div class="grid-100 tablet-grid-100 container avenirNext-Left">
                        <span class="addtional">Additional Information</span>
                    </div>
                    <div class="grid-100 tablet-grid-100 container">
                        <span class='link'><a @click="showAcc('pick')">Accessorials</a></span>
                    </div>
                </div>
                <div class='address-information deliver'>
                    <div class="grid-100 tablet-grid-100 container avenirNext-Medium">
                        <step-counter  :ovalNum="isLogin?'2':'3'"></step-counter>
                        <span class="component-title">Where are we delivering?</span>
                    </div>
                    <div class="grid-35 tablet-grid-25 container first">
                        <label class="input-label">Location Type</label><label class='require'>*</label>
                        <div class="type">
                            <el-select no-match-text="No Data" :placeholder="'business'" @change="onTypeChange('delivery', deliveryValue)" v-model="deliveryValue" :disabled="quoteData.hasQuote || calculating">
                                <el-option v-for="type in locationType" :key="type.location_type_code" :label="type.location_type_description" :value="type.location_type_code">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="grid-25 tablet-grid-25 container">
                        <label class="input-label">Zipcode</label><label class='require'>*</label>
                        <div>
                            <input type="text" name='deliveryZipcode' maxlength="10" placeholder="90000" v-validate="'required|regex:^([0-9]{5}(\-[0-9]{4})?)$'" id="input_zip_code_delivery" v-model="quoteData.delivery.zipCode" :class="{'input': true, 'is-danger': errors.has('deliveryZipcode') && validationStarted}" :disabled="quoteData.hasQuote || calculating" />
                            <span v-if="errors.has('deliveryZipcode') && validationStarted" class='help is-danger'>{{publicValidate(quoteData.delivery.zipCode, 'deliveryZipcode')}}</span>
                        </div>
                    </div>
                    <div class="grid-35 tablet-grid-25 container">
                        <label class="input-label">City</label>
                        <div>
                            <input type="text" value="Autopop City" v-model="quoteData.delivery.city" name="deliveryCity" v-validate="'alpha_spaces'" :class="{'input': true, 'is-danger': errors.has('deliveryCity') && validationStarted}" :disabled="quoteData.hasQuote || calculating" />
                            <span v-if="errors.has('deliveryCity') && validationStarted" class='help is-danger'>{{publicValidate(quoteData.delivery.city, 'deliveryCity')}}</span>
                        </div>
                    </div>
                    <div class="grid-15 tablet-grid-25 container">
                        <label class="input-label">State</label>
                        <div>
                             <el-select placeholder="" v-model="quoteData.delivery.state"  no-match-text="No Data"  v-validate="'required|alpha_spaces'" :class="{'input': true, 'is-danger': errors.has('pickupState') && validationStarted}" :disabled="quoteData.hasQuote || calculating">
                                <el-option v-for="state in STATE_ARY" :key="state.code" :label="state.code" :value="state.desc">
                                </el-option>
                            </el-select>
                            <span style="display: inline-bolck;width:94px;" v-if="errors.has('deliveryState') && validationStarted" class='help is-danger'>{{publicValidate(quoteData.delivery.state, 'deliveryState')}}</span>
                        </div>
                    </div>
                    <div class="grid-100 tablet-grid-100 container avenirNext-Left">
                        <span class="addtional">Additional Information</span>
                    </div>
                    <div class="grid-100 tablet-grid-100 container">
                        <span class='link'><a @click="showAcc('delivery')">Accessorials</a></span>
                    </div>
                </div>
            </div>
            <div class="grid-100 tablet-grid-100 container avenirNext-Medium ship" :class="{manifest: !isLogin}">
                <step-counter  :ovalNum="isLogin?'3':'4'"></step-counter>
                <span class="component-title">What are we shipping?</span>
            </div>
            <shipping-detail v-for="(item, key) in pallets" :key="key+'detail'" :pallet="item" :index="key" :pallets="pallets" :calculating="calculating" :validationStarted="validationStarted" :lock="calculating" @trans="setPallet" :resets="resets"></shipping-detail>
            <div class="grid-100 tablet-grid-100 container add-div">
                <div class="grid-15 tablet-grid-30">
                    <button v-if="!calculating" type="button" class="unis-btn unis-btn-primary" @click="addLine">ADD LINE</button>
                </div>
            </div>
        </div>
        <div class='tip' :class="{'pop-modal': isShowModal}">* Class will be determined based on what you enter for ‘Total Weight’ and shipment dimensions. A Freight Class will be automatically calculated if ‘Class’ is left blank</div>
        <!-- <button-set rightBtnText="GET QUOTE" leftBtnText="RESET" @leftBtnAction="reset" @rightBtnAction="submit" v-if="!calculating"></button-set> -->
        <div class="d-flex justify-content-center mt-4 mb-4">
            <button type="button" class="unis-btn unis-btn-secondary grid-20 mr-4" @click="reset">RESET</button>
            <button type="button" class="unis-btn unis-btn-primary grid-20" @click="submit">GET QUOTE</button>
        </div>
        <transition name="list">
			<div class="grid-100 tablet-grid-100 container" v-if="calculating">
				<div class="grid-20 tablet-grid-50 toast-message" style="margin-top:55px;margin-bottom:130px;">
					<p>Hang tight! We are calculating the cost...</p>
				</div>
			</div>
		</transition>

        <DefaultModal :modalName="PALLET_OVERVALUE_MODAL" :title="'Warning'" :rightBtnText="'Finished'" :leftBtnText="'Nevermind'" @rightBtnAction="palletOverValueModalRightBtnAction" :rightBtnStyle="editQuoteModalRightBtnStyle" :leftBtnStyle="palletOverValueModalRightBtnStyle">
			<slot>
				<p>Due to one of the following scenarios, we are not able to retrieve a quote at this time:</p>
				<p style="margin-left: 7.9em;">Overweight shipment</p>
				<p style="margin-left: 7.9em;">Oversized pallets</p>
				<p style="margin-left: 7.9em;">Outside shipping zone</p>
				<span>Please email us at <u>ship@unisco.com</u> with your order details to get a quote.</span>
			</slot>
		</DefaultModal>

        <OneButtonModal :modalName="ERROR_MODAL" :title="ERROR_MODAL_TITLE" @btnAction="closeErrorModal">
			<slot>
				<p>Sorry, we could not retrieve a quote based on the information you</p>
				<p>entered. Please check that what you entered is correct. If the issue persists,</p>
				<p>please email us with your order details at
					<a href="mailto:ship@unisco.com">ship@unisco.com</a>
				</p>
			</slot>
		</OneButtonModal>

        <OneButtonModal :modalName="NO_DATA_MODAL" :title="NO_DATA_TITLE" :message="NO_DATA_MODAL_MESSAEG" @btnAction="closeNoDataModal">
		</OneButtonModal>
    </div>
</template>
<style lang="scss" src="./get-quote.scss" />