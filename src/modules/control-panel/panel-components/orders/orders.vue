<template>
    <div class="panel_c_wrap">
        <div class="view-head">
            <h2>
                Orders
                <span>{{totalCompleted}} Completed</span>
                <strong>{{totalCanceled}} Cancelled</strong>
            </h2>
            <div class="head-mes">
                <div class="grid-100 tablet-grid-100">
                    <div class="grid-33" v-for="(item, index) in headDataArr" :key="index">
                        <div class="head-mes-num">
                            <strong :class="isViewNormal ? 'bold-num view-status-size' : 'bold-num'" @click="viewIssueOrNormal(index, 'normal')">{{item.normal.total}}</strong>
                            <span>●</span>
                            <span :class="isViewNormal ? '' : 'view-status-size'" @click="viewIssueOrNormal(index, 'issue')">{{item.issue.total}}</span>
                        </div>
                        <div :class="'head-mes-type color-bt-' + item.name">{{item.name}}</div>
                        <div class="head-mes-pdw">   
                            <p>
                                <span v-for="(dataItem, dataIndex) in isViewNormal ? item.normal : item.issue" :key="dataIndex" v-show="dataIndex != 'total'" @click="filterType(index, item.name, dataIndex)" :class="item.filter == (item.name + '-' + dataIndex) ? '--filter': ''">
                                    {{dataIndex}}({{dataItem}})
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="view-body">
            <div class="body-control" style="padding-left: 5px">
                <div class="body-top">
                    <div class="grid-35">
                        <el-select no-match-text="No Data" v-model="selectViewType" @change="selectView(selectViewType)">
                            <el-option v-for="(item, index) in viewType" :key="index" :label="item" :value="item">
                        </el-option>
                        </el-select>
                    </div>
                    <div class="grid-10">&nbsp;</div>
                    <div class="grid-25" style="margin-top: 10px">
                        <el-checkbox v-show="orderChecked" v-model="orderChecked" @change="cancelOrderChecked">Unselect</el-checkbox>
                    </div>
                    <div class="grid-30">
                        <advance-search :class="isDefaultAdvanceSearch ? '' : 'searched'"
                            :panel="searchPanelName"
                            @click.native="searchPanelName = 'Order'"
                            @closeAdvanceSearch="closeAdvance"
                        >
                        </advance-search>
                    </div>
                </div>
            </div>
            <div class="view-container" v-loading="loadingOrder" element-loading-text="loading data">

                <div class="card-view-container" v-show="selectViewType == 'Map View'">
                    <div class="body-mes">

                        <div class="grid-100 tablet-grid-100" style="padding-left: 5px">
                            <div class="card-view" style="padding-top: 0">
                                <div style="width: 100%;">
                                    <div class="grid-100" style="padding-top: 8px; padding-bottom: 8px">
                                        <div class="d-flex align-items-center">
                                            <span>Terminal : </span>
                                            <div class="col-8">
                                                <el-select no-match-text="Select Origin terminal" filterable placeholder="Select Origin terminal" v-model="map_terminal"  :value-key="'location_code'"  @change="getGisTractorsOrTrailers()">
                                                    <el-option v-for="(item, index) in terminalList" :key="index" :label="item.location_code+ ' ' + item.location_state" :value="item.location_code">
                                                    </el-option>
                                                </el-select>
                                            </div>
                                        </div>
                                    </div>
                                    <google-map :centerLocation="gisCenterForTerminal" :height="'510px'"
                                                 :locations="setmarkers"></google-map>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div class="card-view-container" v-show="selectViewType == 'Card View'">
                    <div class="body-mes">
                        <div class="grid-100 tablet-grid-100" style="padding-left: 5px">
                            <div class="card-view" v-loading="">
                                <div class="top-title">
                                    <div :class="'grid-' + item.size" v-for="(item, index) in dataList" :key="index">
                                        {{item[index]}}
                                        <div class="item-control">
                                            <strong v-show="!item.isHide">{{item.type}}</strong>
                                            <span>
                                                <el-dropdown>
                                                    <span class="el-dropdown-link">···</span>
                                                    <el-dropdown-menu slot="dropdown">
                                                        <el-dropdown-item @click.native="hideOrExpand(index)">{{item.isHide ? 'Expand' : 'Hide'}}</el-dropdown-item>
                                                        <el-dropdown-item :class="item.sort == '1' ? 'set-bg-color' : ''" @click.native="sortAscending(item)">Sort by date ascending</el-dropdown-item>
                                                        <el-dropdown-item :class="item.sort == '2' ? 'set-bg-color' : ''" @click.native="sortDecending(item)">Sort by date decending </el-dropdown-item>
                                                    </el-dropdown-menu>
                                                </el-dropdown>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-con-box d-flex">
                                    <div :class="'grid-' + item.size" v-for="(item, index) in dataList" :key="index">
                                        <div class="item-list" v-show="!item.isHide">
                                            <drag :transfer-data="dropOrderArr.length > 0 && data.checked ? dropOrderArr : data"
                                            
                                            @dragstart="setDragType('Order' + (data.canDoDelivery ? 'Delivery' : '') + (data.canDoLineHaul ? 'LineHaul' : '') + (data.canDoPickup ? 'Pickup' : '' ))" 
                                            
                                            @dragend="setDragType(null)"

                                            :draggable="judgeCanDrag(data)"

                                            :class="'item-card-view color-'+ item.type + (onEditTrip ? (judgeCanDrag(data) ? '' : ' notDrag') : '' + (data.selected ? ' item-select' : '') + (associatedOrderNo == data.order_id ? ' associated' : ''))" 

                                            v-for="(data, dataIndex) in item.secData" :key="dataIndex"

                                            v-show="headDataArr[index].filter ? headDataArr[index].filter == data.order_stage + '-' + data.stage_category : true"
                                            >
                                                <div class="card-tag">{{data.stage_category}}</div>
                                                <strong style="display: block" v-if="data.order_pro">Pro：{{data.order_pro}}</strong>
                                                <strong style="display: block" v-else>PU：{{data.pu_id}}</strong>
                                                <!-- <strong>ID：{{data.order_id}}</strong> -->
                                                <p>{{data.total_weights}}lb/{{data.total_pallets}}PL/{{data.total_mileage}}mil</p>
                                                <p>P: {{data.shipper_city + ' ' + data.shipper_state}}
                                                </p>
                                                <p>D: {{data.consignee_city + ' ' + data.consignee_state}}
                                                </p>
                                                <p>Date: {{data.stage_category == 'P' ? data.delivery_mabd_from : data.delivery_mabd_to}}</p>
                                                <!-- <div class="card-arrow"></div> -->
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(data)" @dblclick="dbClickForDetail(data)" @click="showOrderHistory(data)">
                                                </div>
                                                <el-checkbox v-if="judgeCanDrag(data) && onEditTrip" class="order-checkbox" v-model="data.checked" @change="changeOrderSelect(data)"></el-checkbox>
                                            </drag>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="list-view-container" v-show="selectViewType == 'List View'">
                    <div class="list-table list-view body-mes">
                        <div class="table-out">
                            <table>
                                <thead>
                                    <tr>
                                        <th v-for="(item, index) in listViewDataTitle" :key="index" :class="[!item.isHide ? '' : 'hide-th']">
                                            <strong>{{ !item.isHide ? item.name : ''}}</strong>
                                            <span>
                                                <el-dropdown>
                                                    <span class="el-dropdown-link">···</span>
                                                    <el-dropdown-menu slot="dropdown">
                                                        <el-dropdown-item @click.native="hideOrExpandList(index)">{{item.isHide ? 'Expand' : 'Hide'}}</el-dropdown-item>
                                                        <el-dropdown-item :class="sort == '1' ? 'set-bg-color' : ''" @click.native="sortAscending()">Sort by date ascending</el-dropdown-item>
                                                        <el-dropdown-item :class="sort == '2' ? 'set-bg-color' : ''" @click.native="sortDecending()">Sort by date decending </el-dropdown-item>
                                                    </el-dropdown-menu>
                                                </el-dropdown>
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- <tr v-for="(item, index) in allDataArr" :key="index" :class="[index % 2 == 0 ? 'tr-green' : '']"> -->
                                    <tr v-for="(item, index) in viewArr" :key="index" :class="'colorL-'+ item.order_stage + ' ' + (onEditTrip ? (judgeCanDrag(item) ? '' : ' notDrag') : '') + (item.selected ? ' item-select' : '') + (associatedOrderNo == item.order_id ? ' associated' : '')" @dblclick="dbClickForDetail(item)">
                                        <td>
                                            <strong>
                                                <drag :transfer-data="dropOrderArr.length > 0 && item.checked ? dropOrderArr : item" 
                                                :draggable="judgeCanDrag(item)"
                                                @dragstart="setDragType('Order' + (item.canDoDelivery ? 'Delivery' : '') + (item.canDoLineHaul ? 'LineHaul' : '') + (item.canDoPickup ? 'Pickup' : '' ))" @dragend="setDragType(null)" style="padding-right: 12px">
                                                    {{ !listViewDataTitle[0].isHide ? item.order_pro + ' ' + (item.stage_category) : ''}} <br>{{ !listViewDataTitle[0].isHide ? item.driver_lastname : ''}}
                                                {{item.isNormal}}
                                                    <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                                    <el-checkbox v-if="judgeCanDrag(item) && onEditTrip" class="order-checkbox" v-model="item.checked" @change="changeOrderSelect(item)"></el-checkbox>
                                                </drag>
                                            </strong>
                                        </td>
                                        <td>
                                            <strong style="font-weight: bold">
                                                <drag :transfer-data="dropOrderArr.length > 0 && item.checked ? dropOrderArr : item" 
                                                :draggable="judgeCanDrag(item)"
                                                @dragstart="setDragType('Order' + (item.canDoDelivery ? 'Delivery' : '') + (item.canDoLineHaul ? 'LineHaul' : '') + (item.canDoPickup ? 'Pickup' : '' ))" @dragend="setDragType(null)">{{ !listViewDataTitle[1].isHide ? item.pu_id : ''}}
                                                    <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                                </drag>
                                            </strong>
                                        </td>
                                        <td>
                                            <span>
                                                {{ !listViewDataTitle[2].isHide ? item.shipper_name : ''}}
                                                <span>{{ !listViewDataTitle[2].isHide ? item.consignee_name : ''}}</span>
                                                <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                            </span>
                                        </td>
                                        <td>
                                            <span>{{ !listViewDataTitle[3].isHide ? 'F: ' + (item.shipper_street ? item.shipper_street + ',' : '')
                                            + (item.shipper_street2 ? item.shipper_street2 + ',' : '')
                                            + (item.shipper_city ? item.shipper_city + ',' : '')
                                            + (item.shipper_state ? item.shipper_state + ',' : '')
                                            + (item.shipper_country ? item.shipper_country + ' ' : ' ')
                                            + item.shipper_zip : ''}}</span>
                                            <span>{{ !listViewDataTitle[3].isHide ? 'T: ' + (item.consignee_street ? item.consignee_street + ',' : '')
                                            + (item.consignee_street2 ? item.consignee_street2 + ',' : '')
                                            + (item.consignee_city ? item.consignee_city + ',' : '')
                                            + (item.consignee_state ? item.consignee_state + ',' : '')
                                            + (item.consignee_country ? item.consignee_country + ' ' : ' ')
                                            + item.consignee_zip :''}}</span>
                                            <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                        </td>
                                        <td>
                                            <span>{{ !listViewDataTitle[4].isHide ? item.total_weights + '/' : ''}}{{ !listViewDataTitle[3].isHide ? item.total_pallets + '/' : ''}}</span>
                                            <span>{{ !listViewDataTitle[4].isHide ? item.total_mileage : ''}}</span>
                                            <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                        </td>
                                        <td>
                                            <span>{{ !listViewDataTitle[5].isHide ? (item.stage_category == 'P' ? item.delivery_mabd_from : item.delivery_mabd_to) : ''}}</span>
                                            <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                        </td>
                                        <td>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="table-view-container" v-show="selectViewType == 'Table View'">
                    <div class="list-table table-view body-mes">
                        <div class="table-out">
                            <table>
                                <thead>
                                    <tr>
                                        <th v-for="(item, index) in tableViewDataTitle" :key="index" :class="[!item.isHide ? '' : 'hide-th']">
                                            <strong>{{ !item.isHide ? item.name : ''}}</strong>
                                            <span>
                                                <el-dropdown>
                                                    <span class="el-dropdown-link">···</span>
                                                    <el-dropdown-menu slot="dropdown">
                                                        <el-dropdown-item @click.native="hideOrExpandList(index)">{{item.isHide ? 'Expand' : 'Hide'}}</el-dropdown-item>
                                                        <el-dropdown-item :class="sort == '1' ? 'set-bg-color' : ''" @click.native="sortAscending()">Sort by date ascending</el-dropdown-item>
                                                        <el-dropdown-item :class="sort == '2' ? 'set-bg-color' : ''" @click.native="sortDecending()">Sort by date decending </el-dropdown-item>
                                                    </el-dropdown-menu>
                                                </el-dropdown>
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="order-table-view">
                                    <tr v-for="(item, index) in viewArr" :key="index" :class="'colorL-'+ item.order_stage  + ' ' + (onEditTrip ? (judgeCanDrag(item) ? '' : ' notDrag') : '') + (item.selected ? ' item-select' : '') + (associatedOrderNo == item.order_id ? ' associated' : '')" @dblclick="dbClickForDetail(item)">
                                        <td>
                                            <drag :transfer-data="dropOrderArr.length > 0 && item.checked ? dropOrderArr : item" 
                                            @dragstart="setDragType('Order' + (item.canDoDelivery ? 'Delivery' : '') + (item.canDoLineHaul ? 'LineHaul' : '') + (item.canDoPickup ? 'Pickup' : '' ))" @dragend="setDragType(null)" :draggable="judgeCanDrag(item)">
                                                <strong>{{!tableViewDataTitle[0].isHide ? item.order_pro + ' ' + (item.stage_category) : ''}}
                                                </strong>
                                                <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                                <el-checkbox v-if="judgeCanDrag(item) && onEditTrip" class="order-checkbox" v-model="item.checked" @change="changeOrderSelect(item)"></el-checkbox>
                                            </drag>
                                        </td>
                                        <td>
                                            <strong style="font-weight: bold">
                                                <drag :transfer-data="dropOrderArr.length > 0 && item.checked ? dropOrderArr : item" 
                                                :draggable="judgeCanDrag(item)"
                                                @dragstart="setDragType('Order' + (item.canDoDelivery ? 'Delivery' : '') + (item.canDoLineHaul ? 'LineHaul' : '') + (item.canDoPickup ? 'Pickup' : '' ))" @dragend="setDragType(null)">{{ !listViewDataTitle[1].isHide ? item.pu_id : ''}}
                                                    <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                                </drag>
                                            </strong>
                                        </td>
                                        <td>
                                            <span>{{!tableViewDataTitle[2].isHide ? item.shipper_name : ''}}</span>
                                            <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                        </td>
                                        <td>
                                            <span>{{!tableViewDataTitle[3].isHide ? item.consignee_name : ''}}</span>
                                            <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                        </td>
                                        <td>
                                            <span>{{!tableViewDataTitle[4].isHide ? ('F: ' + (item.shipper_street ? item.shipper_street + ',' : '')
                                            + (item.shipper_street2 ? item.shipper_street2 + ',' : '')
                                            + (item.shipper_city ? item.shipper_city + ',' : '')
                                            + (item.shipper_state ? item.shipper_state + ',' : '')
                                            + (item.shipper_country ? item.shipper_country + ' ' : ' ')
                                            + item.shipper_zip) : ''}}</span>
                                            <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                        </td>
                                        <td>
                                            <span>{{!tableViewDataTitle[5].isHide ? ('T: ' + (item.consignee_street ? item.consignee_street + ',' : '')
                                            + (item.consignee_street2 ? item.consignee_street2 + ',' : '')
                                            + (item.consignee_city ? item.consignee_city + ',' : '')
                                            + (item.consignee_state ? item.consignee_state + ',' : '')
                                            + (item.consignee_country ? item.consignee_country + ' ' : ' ')
                                            + item.consignee_zip) : ''}}</span>
                                            <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                        </td>
                                        <td>
                                            <span>{{!tableViewDataTitle[6].isHide ? item.total_weights : ''}}</span>
                                            <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                        </td>
                                        <td>
                                            <span>{{!tableViewDataTitle[7].isHide ? item.total_pallets : ''}}</span>
                                            <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                        </td>
                                        <td>
                                            <span>{{!tableViewDataTitle[8].isHide ? item.total_mileage : ''}}</span>
                                            <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                        </td>
                                        <td>
                                            <span>{{!tableViewDataTitle[9].isHide ? (item.stage_category == 'P' ? item.delivery_mabd_from : item.delivery_mabd_to) : ''}}</span>
                                            <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="calendar-view-container" v-show="selectViewType == 'Calendar View'" style="height: 567px">
                <!-- <div id="example" class="k-content"></div>
                <div id="scheduler"></div> -->
                <div id="main" style="width: 100%;height:544px;"></div>
            </div>
        </div>

        <div class="detail-dialog" v-if="showOrderDetail">
            <div class="close-dialog" @click="closeDialog">╳</div>
            <div class="dialog-title">Order Detail (Pro: {{orderDetail.order_pro}})</div>
            <div class="dialog-detail" style="height: auto" v-loading="loadOrderDetail">
                <div class="grid-100 tablet-grid-100 item-row">
                    <div class="grid-33">
                        <div class="title">PU#</div>
                        <p>{{orderDetail.pu_id}}</p>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 item-row">
                    <div class="grid-33">
                        <div class="title">ID#</div>
                        <p>{{orderDetail.order_id}}</p>
                    </div>
                    <div class="grid-33">
                        <div class="title">Total Mileage#</div>
                        <p>{{orderDetail.total_mileage}}</p>
                    </div>
                    <div class="grid-33">
                        <div class="title">Priority#</div>
                        <p>{{orderDetail.priority}}</p>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 item-row">
                    <div class="grid-33">
                        <div class="title">Weight</div>
                        <p>{{orderDetail.total_weights}}</p>
                    </div>
                    <div class="grid-33">
                        <div class="title">Capacity</div>
                        <p>{{orderDetail.total_pallets}}</p>
                    </div>
                    <div class="grid-33">
                        <div class="title">Equipment</div>
                        <p>{{orderDetail.equiment_name}}</p>
                    </div>
                </div>
                <div class="grid-100 tablet-grid-100 item-row">
                    <div class="grid-100">
                        <div class="title">Date</div>
                        <p>{{orderDetail.order_pickup_date}} > {{orderDetail.appointment_delivery_date}}</p>
                    </div>
                </div>
                <div class="detail-location">
                    <div class="location-item">
                        <div class="circle"></div>
                        <p>Pickup location</p>
                        <span>{{ (orderDetail.shipper_street ? orderDetail.shipper_street + ',' : '')
                            + (orderDetail.shipper_street2 ? orderDetail.shipper_street2 + ',' : '')
                            + (orderDetail.shipper_city ? orderDetail.shipper_city + ',' : '')
                            + (orderDetail.shipper_state ? orderDetail.shipper_state + ',' : '')
                            + (orderDetail.shipper_country ? orderDetail.shipper_country + ' ' : ' ')
                            + orderDetail.shipper_zip
                            }}</span>
                    </div>
                    <div class="location-item">
                        <div class="circle"></div>
                        <p>Destination location</p>
                        <span>{{ (orderDetail.consignee_street ? orderDetail.consignee_street + ',' : '')
                            + (orderDetail.consignee_street2 ? orderDetail.consignee_street2 + ',' : '')
                            + (orderDetail.consignee_city ? orderDetail.consignee_city + ',' : '')
                            + (orderDetail.consignee_state ? orderDetail.consignee_state + ',' : '')
                            + (orderDetail.consignee_country ? orderDetail.consignee_country + ' ' : ' ')
                            + orderDetail.consignee_zip
                            }}</span>
                    </div>
                </div>
                <div class="detail-grid grid-100">
                    <div class="grid-25">
                        <span>Name of Good</span>
                        <div><span v-for="(item, index) in orderDetail.manifest_lines" :key="index">{{item.code ? item.code : ''}}</span></div>
                    </div>
                    <div class="grid-25">
                        <span>Shipper</span>
                        <div>{{orderDetail.shipper_name}}</div>
                    </div>
                    <div class="grid-25">
                        <span>Consignee</span>
                        <div>{{orderDetail.consignee_name}}</div>
                    </div>
                    <div class="grid-25">
                        <span>Biling Amount</span>
                        <div>{{orderDetail.quote_amount}}</div>
                    </div>
                </div>
                <div class="grid-100">
                    <div class="right advance-detail" @click="showAdvanceDetails = true">Advance Details</div>
                </div>

                <div class="grid-100" style="margin-top: 15px">
                    <button class="unis-btn unis-btn-primary color-white grid-40 right" @click="openTmsPage">Edit</button>
                </div>
            </div>
        </div>

        <advance-detail style="display: none"
            :detail="orderDetail"
            :type="'Order'"
            :show="showAdvanceDetails"
            @setShowOrHide="setShowOrHideFun"
        >
        </advance-detail>
    </div>
</template>
<style lang="scss" src="./orders.scss"></style>