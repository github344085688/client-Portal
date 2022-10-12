<template>
    <div class="my-shipment">
        <div class="component-title bold shipment-title">My Shipment</div>
        <div class="shipment-top" :style="{height: height +'px'}">
            <div>
                <a class="edit" @click="goEdit"></a>
            </div>
            
            <div class="address">
                <p>PICKUP & DELIVERY</p>
                <label class="up"></label><p>{{pickupCity}}, {{pickupState}} {{pickupZipCode}}</p>
                <label class="down"></label><p>{{deliveryCity}}, {{deliveryState}} {{deliveryZipCode}}</p>
            </div>
            <div class="date">
                <p>PICKUP DATE</p>
                <label class="box"></label><p>Mon, Oct 1</p>
            </div>
            <div class="description" v-if="num<=1">
                <p style="font-family: AvenirNext-Demibold;">DESCRIPTION</p>
                <p>{{pallet}} pallets</p>
                <p>{{dimension}}</p>
            </div>
            <div class="description-2" v-if="num<=1">
                <p></p>
                <p><em>Class</em> {{classNum}}</p>
                <p>Total Weight: {{totalWeight}} lbs</p>
            </div>
            <div class="multi-manifest" v-if="num>1">
                <p style="font-family: AvenirNext-Demibold;">DESCRIPTION</p>
                <div>
                    <td>
                        <tt  v-for="(pal, key) in pallets" :key="key+'pallet'">{{pal}} pallets</tt>
                    </td>
                    <td class='td-second'>
                        <tt  v-for="(dim, key) in dimensions" :key="key+'dimension'">{{dim}}</tt>
                    </td>
                    <td>
                        <tt  v-for="(cla, key) in classes" :key="key+'class'">Class {{cla}}</tt>
                    </td>
                </div>
                <p>Total Weight: {{totalWeight}} lbs</p>
            </div>
        </div> 
        <div>
            <div class="component-title shipment-title carrier">Select a Carrier</div>
            <div class="transit-days">
                <div>4 Days <label style="color:#AAABAC;">(or less)</label></div>
                <div>
                    <p>Filter Transit Days</p>
                    <p class="progress-bar"></p>
                    <p></p>
                </div>
                <div>As low as $175</div>
            </div>
        </div>
        <div class="shipment-middle">
            <ul class="condition">
                <li>Sort by:</li>
                <li>
                    <el-select  no-match-text="No Data" placeholder="Best Match" v-model="sortText" @change="onSortChange">
                        <el-option v-for="sort in sorts" :key="sort" :label="sort" :value="sort"></el-option>
                    </el-select>
                </li>
                <li><checkbox :content="'Add Insurance'"></checkbox></li>
            </ul>
            <div class="quote-list">
                <div class="title">ALL LTL QUOTES (8)</div>
                <ul class="list">
                    <li class="fedex"></li>
                    <li>
                        <p>FedEx Freight<b>®</b> Economy</p>
                        <p style="font-family:AvenirNext-Regular">STANDARD</p>
                    </li>
                    <li class="third"></li>
                    <li>
                        <p>Est. Transit</p>
                        <p>4 days</p>
                        <p>after pick-up</p>
                    </li>
                    <li><em>$175</em><small>.67</small></li>
                    <li><button>SELECT</button></li>
                </ul>
            </div>
        </div>
        <div class="line"></div>
        <div class="shipment-bottom" style="margin-bottom:50px;">
            <div class="quote-list">
                <ul class="list">
                    <li class="fedex"></li>
                    <li>
                        <p>FedEx Freight<b>®</b> Economy</p>
                        <p style="font-family:AvenirNext-Regular">STANDARD</p>
                    </li>
                    <li></li>
                    <li>
                        <p>Est. Transit</p>
                        <p>4 days</p>
                        <p>after pick-up</p>
                    </li>
                    <li><em>$175</em><small>.67</small></li>
                    <li><button>SELECT</button></li>
                </ul>
            </div>
        </div>
    </div>  
</template>

<style lang="scss" src="./my-shipment.scss"/>