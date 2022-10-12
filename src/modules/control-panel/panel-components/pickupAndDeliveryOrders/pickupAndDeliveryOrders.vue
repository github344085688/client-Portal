<template>
    <div class="panel_c_wrap p-d-orders">
        <div class="view-head-title">
            <h2>Pickup and delivery orders
                <span>{{totalCompleted}} Completed</span>
                <strong>{{totalCanceled}} Cancelled</strong>
                <div class="close-panel-btn right" @click="hideOrderPanel" v-show="!showViewTripsPanelBtn && showCloseBtn">╳</div>
                <div class="view-panel-btn right" style="margin-top: -3px; margin-right: 10px">
                    <button class="unis-btn unis-btn-primary color-white" style="margin-left: 10px" v-show="showViewTripsPanelBtn" @click="viewTripPanle">View Trips</button>
                </div>
                <div class="view-panel-btn right" style="margin: -3px 20px 0">
                    <button class="unis-btn unis-btn-primary color-white" style="margin-left: 10px" v-show="showViewTripsPanelBtn" @click="createNewTrip">+ New Trips</button>
                </div>
                <div class="hide-btn right" @click="hideOrShowStageBar">
                    <i :class="showStageBar ? 'el-icon-view' : 'el-icon-view icon-color-hide'"> 
                        <em v-show="!showStageBar">\</em>
                    </i>{{showStageBar ? 'Hide stage bar' : 'Show stage bar'}}</div>
            </h2>
        </div>
        <div class="view-head" v-show="showStageBar">
            <h2></h2>
            <div class="head-mes">
                <div class="grid-100 tablet-grid-100">
                    <div class="grid-20" v-for="(item, index) in headDataArr" :key="index">
                        <div class="head-mes-num">
                            <strong :class="isViewNormal ? 'bold-num view-status-size' : 'bold-num'" @click="viewIssueOrNormal(index, 'normal')">{{item.normal}}</strong>
                            <span>●</span>
                            <span :class="isViewNormal ? '' : 'view-status-size'" @click="viewIssueOrNormal(index, 'issue')">{{item.issue}}</span>
                        </div>
                        <div :class="'head-mes-type color-p-d-orders-bt-' + item.name">{{item.name}}</div>
                        <div class="head-mes-pdw">   
                            <!-- <p>
                                <span v-for="(dataItem, dataIndex) in isViewNormal ? item.normal : item.issue" :key="dataIndex" v-show="dataIndex != 'total'" @click="filterType(index, item.name, dataIndex)" :class="item.filter == (item.name + '-' + dataIndex) ? '--filter': ''">
                                    {{dataIndex}}({{dataItem}})
                                </span>
                            </p> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div :class="showStageBar ? 'view-body' : 'view-body add-height'">
            <div class="body-control" style="padding-left: 5px">
                <div class="body-top">
                    <div class="grid-15">
                        <el-select no-match-text="No Data" v-model="selectViewType" @change="selectView(selectViewType)">
                            <el-option v-for="(item, index) in viewType" :key="index" :label="item" :value="item">
                        </el-option>
                        </el-select>
                    </div>
                    <div class="grid-15" v-if="selectViewType != 'Card View'">
                        <el-select no-match-text="Status" placeholder="Status" v-model="orderStatusFilter" @change="filterOrderByStatus">
                            <el-option v-for="(item, index) in orderStatusArr" :key="index" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="grid-25 dispatch-btn">
                        <div v-for="(item, index) in dispatchFilterArr" :class="item.select ? 'dispatch-select' : ''" :key="index" @click="dispatchFilter(item, index)">{{item.name}}</div>
                    </div>
                    <!-- <div class="grid-10 dispatch-filter-put">
                        <input type="text" placeholder="Shipper" v-model="filterShipper" @input="filterByName">
                    </div>
                    <div class="grid-10 dispatch-filter-put">
                        <input type="text" placeholder="Consignee" v-model="filterConsignee" @input="filterByName">
                    </div> -->
                    <div class="grid-25">
                        <button class="unis-btn unis-btn-secondary" style="width: 100%"  @click="showTerminalFilter = true">Terminal <span v-show="terminalSearch">{{'(' + (origin_terminal_array.length + dest_terminal_array.length) + ' selected)'}}</span>
                        </button>
                    </div>
                    <div class="grid-10" style="margin-top: 10px">
                        <el-checkbox v-show="orderChecked" v-model="orderChecked" @change="cancelOrderChecked">Unselect</el-checkbox>
                    </div>
                    <div class="grid-15 right">
                        <advance-search :class="isDefaultAdvanceSearch ? '' : 'searched'"
                            :panel="searchPanelName"
                            @click.native="searchPanelName = 'PickAndDeliveryOrders'"
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
                                    <google-map :centerLocation="gisCenterForTerminal" :height="showStageBar?'450px':'630px'"
                                                :locations="setmarkers"></google-map>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-view-container" v-show="selectViewType == 'Card View'">
                    <div class="body-mes">
                        <div class="grid-100 tablet-grid-100" style="padding-left: 5px">
                            <div :class="showStageBar ? 'card-view' : 'card-view add-view-height'">
                                <div class="top-title">
                                    <div :class="'grid-' + item.size" v-for="(item, index) in dataList" :key="index">
                                        {{item[index]}}
                                        <div class="item-control">
                                            <strong v-show="!item.isHide">{{item.type == 'PickedOrder' ? 'Picked Order' : (item.type == 'LineHaul' ? 'Line Haul' : item.type )}}</strong>
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
                                <div class="card-con-box-small d-flex">
                                    <div :class="'grid-' + item.size" v-for="(item, index) in dataList" :key="index">
                                        <div class="item-list" v-show="!item.isHide">
                                            <drag :transfer-data="dropOrderArr.length > 0 && data.checked ? dropOrderArr : data"
                                            
                                            @dragstart="setDragType('Order' + (data.canDoDelivery ? 'Delivery' : '') + (data.canDoLineHaul ? 'LineHaul' : '') + (data.canDoPickup ? 'Pickup' : '' ))" 
                                            
                                            @dragend="setDragType(null)"

                                            :draggable="judgeCanDrag(data)"

                                            :class="'item-card-view color-p-d-orders-'+ item.type + (onEditTrip ? (judgeCanDrag(data) ? '' : ' notDrag') : '') + (associatedOrderNo == data.order_id ? ' associated' : '')" 

                                            v-for="(data, dataIndex) in item.secData" :key="dataIndex"

                                            v-show="data.isInfilter && data.nameFilter"
                                            >
                                                <div class="card-tag">{{data.stage_category}}</div>
                                                <strong style="display: block" v-if="data.order_pro">Pro：{{data.order_pro}}</strong>
                                                <strong style="display: block" v-else>PU：{{data.pu_id}}</strong>
                                                <p>{{data.total_weights}}lb/{{data.total_pallets}}PL/{{data.total_mileage}}mil</p>
                                                <p>P: {{data.shipper_city + ' ' + data.shipper_state}}
                                                </p>
                                                <p>D: {{data.consignee_city + ' ' + data.consignee_state}}
                                                </p>
                                                <p>Date: {{data.stage_category == 'P' ? data.delivery_mabd_from : data.delivery_mabd_to}}</p>
                                                <!-- <div class="card-arrow"></div> -->
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(data)" @dblclick="dbClickForDetail(data)" @click="showOrderHistory(data)"></div>
                                                <el-checkbox v-if="judgeCanDrag(data) && onEditTrip" class="order-checkbox" v-model="data.checked" @change="changeOrderSelect(data, $event)"></el-checkbox>
                                            </drag>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="list-view-container" v-show="selectViewType == 'List View'">
                    <div class="list-table list-view  body-mes">
                        <div style="height: 510px" :class="showStageBar ? 'table-out' : 'table-out add-view-height'">
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
                                    <tr v-for="(item, index) in viewArr" :key="index" :class="'colorL-p-d-orders-'+ item.order_stage + ' ' + (onEditTrip ? (judgeCanDrag(item) ? '' : ' notDrag') : '') + (item.selected ? ' item-select' : '')  + (associatedOrderNo == item.order_id ? ' associated' : '')"
                                    v-show="item.isInfilter && item.nameFilter" @dblclick="dbClickForDetail(item)">
                                        <td>
                                            <drag :transfer-data="dropOrderArr.length > 0 && item.checked ? dropOrderArr : item"
                                                @dragstart="setDragType('Order')" @dragend="setDragType(null)">
                                                <span>{{!listViewDataTitle[0].isHide ? item.order_stage : ''}}
                                                    <br>{{ !listViewDataTitle[0].isHide ? 'Pro: ' + item.order_pro : ''}}
                                                </span>
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showOrderHistory(item)">
                                                </div>
                                                <el-checkbox v-if="judgeCanDrag(item) && onEditTrip" class="order-checkbox" v-model="item.checked" @change="changeOrderSelect(item)"></el-checkbox>
                                            </drag>
                                        </td>
                                        <td>
                                            <strong>
                                                <drag :transfer-data="dropOrderArr.length > 0 && item.checked ? dropOrderArr : item"
                                                @dragstart="setDragType('Order')" @dragend="setDragType(null)">
                                                    {{ !listViewDataTitle[1].isHide ? '#' + item.pu_id + ' ' + (item.stage_category) : ''}} <br>{{ !listViewDataTitle[1].isHide ? item.driver_lastname : ''}}
                                                    {{item.isNormal}}
                                                    <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showOrderHistory(item)">
                                                    </div>
                                                </drag>
                                            </strong>
                                        </td>
                                        <td>
                                            <span>
                                                {{ !listViewDataTitle[2].isHide ? item.shipper_name : ''}}
                                                <span>{{ !listViewDataTitle[2].isHide ? item.consignee_name : ''}}</span>
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showOrderHistory(item)"></div>
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
                                            <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showOrderHistory(item)"></div>
                                        </td>
                                        <td>
                                            <span>{{ !listViewDataTitle[4].isHide ? item.total_weights + '/' : ''}}{{ !listViewDataTitle[3].isHide ? item.total_pallets + '/' : ''}}</span>
                                            <span>{{ !listViewDataTitle[4].isHide ? item.total_mileage : ''}}</span>
                                            <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showOrderHistory(item)"></div>
                                        </td>
                                        <td>
                                            <span>{{ !listViewDataTitle[5].isHide ? (item.stage_category == 'P' ? item.delivery_mabd_from : item.delivery_mabd_to) : ''}}</span>
                                            <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showOrderHistory(item)"></div>
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
                        <div :class="showStageBar ? 'table-out' : 'table-out add-view-height'" style="height: 510px">
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
                                <tbody>
                                    <tr v-for="(item, index) in viewArr" :key="index" :class="'colorL-p-d-orders-'+ item.order_stage + (onEditTrip ? (judgeCanDrag(item) ? '' : ' notDrag') : '') + (item.selected ? ' item-select' : '') +(associatedOrderNo == item.order_id ? ' associated' : '')"
                                    v-show="item.isInfilter && item.nameFilter" @dblclick="dbClickForDetail(item)">
                                        <td>
                                            <drag :transfer-data="item" @dragstart="setDragType('Order')" @dragend="setDragType(null)">
                                                <span>{{!tableViewDataTitle[0].isHide ? item.order_stage : ''}}
                                                    <br>{{ !tableViewDataTitle[0].isHide ? 'Pro: ' + item.order_pro : ''}}
                                                </span>
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showOrderHistory(item)"></div>
                                                <el-checkbox v-if="judgeCanDrag(item) && onEditTrip" class="order-checkbox" v-model="item.checked" @change="changeOrderSelect(item)"></el-checkbox>
                                            </drag>
                                        </td>
                                        <td>
                                            <drag :transfer-data="item" @dragstart="setDragType('Order')" @dragend="setDragType(null)">
                                                <strong>{{!tableViewDataTitle[1].isHide ? ('#' + item.pu_id + ' ' + (item.stage_category)) : ''}}
                                                </strong>
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showOrderHistory(item)"></div>
                                            </drag>
                                        </td>
                                        <td>
                                            <span>{{!tableViewDataTitle[2].isHide ? item.shipper_name : ''}}</span>
                                            <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showOrderHistory(item)"></div>
                                        </td>
                                        <td>
                                            <span>{{!tableViewDataTitle[3].isHide ? item.consignee_name : ''}}</span>
                                            <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showOrderHistory(item)"></div>
                                        </td>
                                        <td>
                                            <div v-show="!tableViewDataTitle[4].isHide" class="belongs-trip">
                                                <span :class="'belongs-trip-' + trip.trip_stage"  v-for="(trip, tripIndex) in item.trips" :key="tripIndex" v-show="trip.trip_stage == 'pickup'">
                                                    {{trip.trip_stage == 'pickup' ? trip.trip_id : ''}}
                                                </span>
                                            </div>
                                            <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showOrderHistory(item)"></div>
                                        </td> 
                                        <td>
                                            <div v-show="!tableViewDataTitle[5].isHide" class="belongs-trip">
                                                <span :class="'belongs-trip-' + trip.trip_stage"  v-for="(trip, tripIndex) in item.trips" :key="tripIndex" v-show="trip.trip_stage == 'linehaul'">
                                                    {{trip.trip_stage == 'linehaul' ? trip.trip_id : ''}}
                                                </span>
                                            </div>
                                            <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showOrderHistory(item)"></div>
                                        </td> 
                                        <td>
                                            <div v-show="!tableViewDataTitle[6].isHide" class="belongs-trip">
                                                <span :class="'belongs-trip-' + trip.trip_stage"  v-for="(trip, tripIndex) in item.trips" :key="tripIndex" v-show="trip.trip_stage == 'delivery'">
                                                    {{trip.trip_stage == 'delivery' ? trip.trip_id : ''}}
                                                </span>
                                            </div>
                                            <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showOrderHistory(item)"></div>
                                        </td> 
                                        <td>
                                            <span>{{!tableViewDataTitle[7].isHide ? ('F: ' + (item.shipper_street ? item.shipper_street + ',' : '')
                                            + (item.shipper_street2 ? item.shipper_street2 + ',' : '')
                                            + (item.shipper_city ? item.shipper_city + ',' : '')
                                            + (item.shipper_state ? item.shipper_state + ',' : '')
                                            + (item.shipper_country ? item.shipper_country + ' ' : ' ')
                                            + item.shipper_zip) : ''}}</span>
                                            <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showOrderHistory(item)"></div>
                                        </td>
                                        <td>
                                            <span>{{!tableViewDataTitle[8].isHide ? ('T: ' + (item.consignee_street ? item.consignee_street + ',' : '')
                                            + (item.consignee_street2 ? item.consignee_street2 + ',' : '')
                                            + (item.consignee_city ? item.consignee_city + ',' : '')
                                            + (item.consignee_state ? item.consignee_state + ',' : '')
                                            + (item.consignee_country ? item.consignee_country + ' ' : ' ')
                                            + item.consignee_zip) : ''}}</span>
                                            <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showOrderHistory(item)"></div>
                                        </td>
                                        <td>
                                            <span>{{!tableViewDataTitle[9].isHide ? item.total_weights : ''}}</span>
                                            <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                        </td>
                                        <td>
                                            <span>{{!tableViewDataTitle[10].isHide ? item.total_pallets : ''}}</span>
                                            <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                        </td>
                                        <td>
                                            <span>{{!tableViewDataTitle[11].isHide ? item.total_mileage : ''}}</span>
                                            <div class="right-menu" @click="showOrderHistory(item)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                        </td>
                                        <td>
                                            <span>{{!tableViewDataTitle[12].isHide ? (item.stage_category == 'P' ? item.delivery_mabd_from : item.delivery_mabd_to) : ''}}</span>
                                            <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showOrderHistory(item)"></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="detail-dialog" v-if="showOrderDetail">
            <div class="close-dialog" @click="closeDialog">╳</div>
            <div class="dialog-title">Order Detail (Pro: {{orderDetail.order_pro}})</div>
            <div class="dialog-detail" style="height: auto"  v-loading="loadOrderDetail">
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

        <div class="detail-dialog terminal-dialog" v-if="showTerminalFilter">
            <div class="close-dialog" @click="showTerminalFilter = false">╳</div>
            <div class="dialog-title">Filter by terminal</div>
            <div class="dialog-detail terminal-box" style="height: auto">
                <div class="grid-100">
                    <div class="grid-70">
                        <label for="">Origin terminal ({{origin_terminal_array.length}} selected)</label>
                        <el-select no-match-text="Select Origin terminal" filterable placeholder="Select Origin terminal" v-model="origin_terminal_array" multiple>
                            <el-option v-for="(item, index) in terminalList" :key="index" :label="item.location_code+ ' ' + item.location_state" :value="item.location_id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="grid-30">
                        <button class="unis-btn unis-btn-secondary right" style="margin-top: 24px" @click="origin_terminal_array = []">Reset</button>
                    </div>
                </div>
                <div class="grid-100" style="margin-top: 20px">
                    <div class="grid-70">
                        <label for="">Destination terminal ({{dest_terminal_array.length}} selected)</label>
                        <el-select no-match-text="Select Destination terminal" filterable placeholder="Select Destination terminal" v-model="dest_terminal_array" multiple>
                            <el-option v-for="(item, index) in terminalList" :key="index" :label="item.location_code+ ' ' + item.location_state" :value="item.location_id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="grid-30">
                        <button class="unis-btn unis-btn-secondary right" style="margin-top: 24px" @click="dest_terminal_array = []">Reset</button>
                    </div>
                </div>
            </div>
            <div class="grid-100">
                <button class="unis-btn unis-btn-primary color-white right grid-20" @click="filterTerminal">Search</button>
            </div>
        </div>


        <advance-detail style="display:none"
            :detail="orderDetail"
            :type="'Order'"
            :show="showAdvanceDetails"
            @setShowOrHide="setShowOrHideFun"
        >
        </advance-detail>

        <new-trip
            :show="showTripDialog"
            :isEdit="false"
            :currentTrip="{}"
            @closeNewTrip="closeNewTripDialog"
            :styleCss="'left: 20%'"
        ></new-trip>
    </div>
</template>
<style lang="scss" src="./pickupAndDeliveryOrders.scss"></style>