<template>
    <div class="small-cover">
        <div class="panel_c_wrap" v-loading="loadingDriver">
            <div class="view-head" style="height: 188px; overflow:auto; margin-bottom: 0; width: 100%; border-radius: 8px 8px 0 0; box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.15);">
                <h2>Drivers
                    <!-- <div>Filter</div> -->
                    <div class="tab-item grid-33" style="line-height: 32px">
                        <span style="color: #333">Total: {{viewList.length}}</span>
                    </div>
                </h2>
                <div class="tab-tits grid-100" style="padding: 0; margin-bottom: 5px">
                    <div class="search-driver grid-50" style="padding: 0 5px">
                        <label for="">Search driver name</label>
                        <input type="text" @input="filterDriver" v-model="driverName">
                    </div>
                    <div class="search-driver grid-50" style="padding: 0 5px">
                        <label for="">Driver company</label>
                        <el-select no-match-text="No Data" v-model="filterCompanyId" @change="filterDriver" clearable>
                            <el-option v-for="(item, index) in driverCompanyList" :key="index" :label="item.company_name" :value="item.company_id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="time-select grid-100" style="padding: 0">
                    <label for="">Search driver off duty</label>
                    <div class="grid-100" style="padding: 0 5px">
                        <el-date-picker
                            v-model="dateValue"
                            type="daterange"
                            format="yyyy-MM-dd"
                            @change="searchDriverOffDuty">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="view-body" style="padding: 10px 0">
                <div class="driver-list">
                    <ul>
                        <li :class="selectIndex == index ? 'select' : ''" v-for="(item, index) in viewList" :key="index" @click="selectDriver(index, item)">
                            <div>
                                <div class="name">{{item.driver_firstname}}, {{item.driver_lastname}}</div>
                                <div class="address-car clearfix">
                                    <div class="grid-50">{{item.terminal_city + ' ' + item.terminal_state}}&nbsp;</div>
                                    <div class="grid-50 driver-type">
                                        <img src="../../../../assets/images/truck.svg" alt="">
                                        <span>{{item.driver_type}}</span>
                                    </div>
                                </div>
                                <div class="p-d clearfix">
                                    <div class="grid-100">P: {{item.driver_phone}}</div>
                                    <!-- <div class="grid-50">DL: {{item.driver_license}}</div> -->
                                </div>
                                <div class="more-detail" v-show="item.showMore">
                                    <div class="address-mes">Location: {{ (item.terminal_street ? item.terminal_street + ',' : '')
                                    + (item.terminal_street2 ? item.terminal_street2 + ',' : '')
                                    + (item.terminal_city ? item.terminal_city + ',' : '')
                                    + (item.terminal_state ? item.terminal_state + ',' : '')
                                    + (item.terminal_country ? item.terminal_country + ' ' : ' ')
                                    + item.terminal_zip
                                    }}</div>
                                </div>
                                <div :class="item.showMore ? 'common-arrow trun-deg' : 'common-arrow'" @click="showDriverDetailOrHide(index, $event)"></div>
                            </div>
                            <drag :transfer-data="item" @dragstart="setDragType('driver')" @dragend="setDragType(null)">
                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="selectDriverInfo(item)"></div>
                            </drag>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="./driver.scss"></style>