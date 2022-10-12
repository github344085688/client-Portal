<template>
    <div class='shipping clearfix'>
        <div class='order-number'><label>{{index+1}}</label></div>
        <div class='start-input'>
            <div class="grid-20 tablet-grid-25 first grid-16">
                <label class="input-label">Item Description/Commodity</label>
                <div>
                    <input type="text"  style="height:30px !important" :name="'itemDescription'+index" v-model="pallet.description" :disabled="lock" />
                </div> 
            </div>
            <div class="tablet-row-5">
                <button v-if="!calculating" class="trash" @click="deleteLine"></button>
            </div>
        </div>
        <div class='middle-input'>
                <div class="grid-20 tablet-grid-25 container grid-16">
            <label class="input-label">Packaging</label><label class='require'>*</label>
            <div>
                <el-select no-match-text="No Data" v-model="pallet.palletType" :disabled="lock">
                    <el-option v-for="(pack, key) in packaging" :key="key+'pack'" :label="pack.title" :value="pack.type">
                    </el-option>
                </el-select>
            </div>
            </div>
            <div class="grid-15 tablet-grid-25 container middle">
                <label class="input-label">Quantity</label><label class='require'>*</label>
                <div>
                    <input type="text" :name="'quantity'+index" v-model="pallet.quantity" v-validate="'required|decimal|min_value:0'" :class="{'input': true, 'is-danger': errors.has('quantity' + index) && validationStarted}" v-on:keyup="publicValidate(pallet.quantity, 'quantity' + index)" :disabled="lock" />
                    <span v-if="errors.has('quantity' + index) && validationStarted" class="help is-danger">{{ publicValidate(pallet.quantity, 'quantity' + index) }}</span>                    
                </div>
            </div>
            <div class="grid-15 tablet-grid-25 container middle">
                <label class="input-label">Total Weight</label><label class='require'>*</label>
                <div>
                    <input type="text" :name="'totalWeight'+index"  v-model="pallet.totalWeight" v-validate="'required|decimal|min_value:0'" :class="{'input': true, 'is-danger': ((errors.has('totalWeight' + index)) && validationStarted)}" v-on:keyup="publicValidate(pallet.totalWeight, 'totalWeight' + index)" :disabled="lock" />
                    <span v-if="errors.has('totalWeight'+index) && validationStarted" class='help is-danger'>{{ publicValidate(pallet.totalWeight, 'totalWeight'+index) }}</span>
                </div>
            </div>
            <div class="grid-5 tablet-grid-25 container">
                <label class="input-label">lbs/kg</label>
                <div>
                    <el-select no-match-text="No Data"  placeholder="lbs" v-model="pallet.weightUnit" @change="onWeightUnitChange" :disabled="lock">
                        <el-option v-for="weightUnit in weightUnits" :key="weightUnit" :label="weightUnit" :value="weightUnit">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="grid-5 tablet-grid-25 container lengthValue">
                <label class="input-label length-label">Length </label>
                <div>  
                    <input type="text" :name="'length'+index" v-model="pallet.length" v-validate="'required|decimal|between:0,96'" :disabled="!editable || lock" />
                    <span v-if="errors.has('length' + index) && validationStarted" class="help is-danger">{{ publicValidate(pallet.length, 'length'+index) }}</span>
                </div>
            </div>
            <span class="tooltip-light tooltip" v-tooltip.top="tips.lengthTip" style="position:relative;left:-32.4%;top: -14px;width:18px;"></span>
             <div class="grid-5 tablet-grid-25 container">
                <label class="input-label">Width</label>
                <div>
                    <input type="text" :name="'width'+index" v-model="pallet.width" v-validate="'required|decimal|between:0,96'" :disabled="!editable || lock" />
                    <span v-if="errors.has('width' + index) && validationStarted" class="help is-danger">{{ publicValidate(pallet.width, 'width'+index) }}</span>
                </div>
            </div>
            <div class="grid-5 tablet-grid-25 container">
                <label class="input-label">Height</label>
                <div>
                    <input type="text" :name="'height'+index" v-model="pallet.height" v-validate="'required|decimal|between:0,96'" :disabled="lock" />
                    <span v-if="errors.has('height' + index) && validationStarted" class="help is-danger">{{ publicValidate(pallet.height, 'height'+index) }}</span>
                </div>
            </div>
            <div class="grid-5 tablet-grid-25 container last-one">
                <label class="input-label">in/cm</label>
                <div>
                    <el-select no-match-text="No Data" placeholder="in" v-model="pallet.heightUnit" @change="onHeightUnitChange" :disabled="!editable || lock">
                        <el-option  v-for="heightUnit in heightUnits" :key="heightUnit" :label="heightUnit" :value="heightUnit">
                        </el-option>     
                    </el-select>
                </div>
            </div>
        </div>
        <div class='end-input'>
            <div class="grid-15 tablet-grid-25 container">
                <label class="input-label">NMFC Item #</label>
                <span class="tooltip-light"  v-tooltip.top="tips.nmfcTip"></span>
                <div>
                     <input type="text" :name="'nmfcItem'+index" v-model="pallet.nmfcItem" v-validate="'decimal'" :disabled="lock" />
                    <span style="width:140px;" v-if="errors.has('nmfcItem' + index) && validationStarted" class="help is-danger">{{ publicValidate(pallet.nmfcItem, 'nmfcItem'+index) }}</span>
                </div>
            </div>
            <div class="grid-15 tablet-grid-25 container">
                <label class="input-label">Freight Class</label>
                <span class="tooltip-light" v-tooltip.top="tips.freightTip"></span>
                <div>
                    <el-select no-match-text="No Data" v-model="pallet.palletClass" @change="onSelectClassChange" :disabled="lock">
                        <el-option v-for="palletClass in freightClass" :key="palletClass+'class'" :label="palletClass" :value="palletClass">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class='option'>
                <checkbox  @changeSelect="changes" :styleDown="true" :id="1" :resets="resets" :isSelect="pallet.isStackable" :calculating="calculating"></checkbox>
                <div class="check-box">
                      <span class="tooltip-light" style="margin-top:-2px;"></span>
                </div>
                <checkbox :content="'Hazardous'" @changeSelect="changes" :styleDown="true" :id="2" :resets="resets" :isSelect="pallet.isHazardous" :calculating="calculating"></checkbox>
                 <div class="check-box">
                      <span class="tooltip-light" style="margin-top:-3px;"></span>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="./shipping-detail.scss">
