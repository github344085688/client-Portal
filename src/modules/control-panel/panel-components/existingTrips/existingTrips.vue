<template>
    <div class="panel_c_wrap p-d-orders exsting-trip">
        <div class="view-head-title">
            <h2>Existing trips
                <span>{{totalCompleted}} Completed</span>
                <strong>{{totalCanceled}} Cancelled</strong>
                <div class="close-panel-btn right" v-show="!showViewOrderPanelBtn && showCloseBtn" @click="hideTripsPanel">╳</div>
                <div class="view-panel-btn right" style="margin-top: -3px">
                    <button class="unis-btn unis-btn-primary color-white" @click="viewOrderPanle" v-show="showViewOrderPanelBtn">View Orders</button>
                </div>
                <div class="view-panel-btn right mt-1">
                    <button class="unis-btn mt-4 unis-btn-primary color-white" @click="createNewTrip"> + New Trip</button>
                </div>
                <div class="hide-btn right mr-4" @click="hideOrShowStageBar">
                    <i :class="showStageBar ? 'el-icon-view' : 'el-icon-view icon-color-hide'"> 
                        <em v-show="!showStageBar">\</em>
                    </i>{{showStageBar ? 'Hide stage bar' : 'Show stage bar'}}</div>
            </h2>
        </div>
        <div class="view-head" v-show="showStageBar">
            <h2></h2>
            <div class="head-mes">
                <div class="grid-100 tablet-grid-100">
                    <div :class="index == 0 ? 'grid-33' : 'grid-66'" v-for="(item, index) in headDataArr" :key="index">
                        <div class="head-mes-num">
                            <strong :class="isViewNormal ? 'bold-num view-status-size' : 'bold-num'" @click="viewIssueOrNormal(index, 'normal')">{{item.normal.total}}</strong>
                            <span>●</span>
                            <span :class="isViewNormal ? '' : 'view-status-size'" @click="viewIssueOrNormal(index, 'issue')">{{item.issue.total}}</span>
                        </div>
                        <div :class="'head-mes-type colortrip-bt-' + item.name">{{item.name}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div :class="showStageBar ? 'view-body' : 'view-body add-height'">
            <div class="body-control" style="padding-left: 5px">
                <div class="body-top">
                    <div class="grid-20">
                        <el-select no-match-text="No Data" v-model="selectViewType" @change="selectView(selectViewType)">
                            <el-option v-for="(item, index) in viewType" :key="index" :label="item" :value="item">
                        </el-option>
                        </el-select>
                    </div>
                    <div class="grid-20" v-if="selectViewType != 'Card View'">
                        <el-select no-match-text="Status" placeholder="Status" v-model="tripStatusFilter" @change="filterTripByStatus">
                            <el-option v-for="(item, index) in tripStatusArr" :key="index" :label="item" :value="item">
                        </el-option>
                        </el-select>
                    </div>
                    <!-- <div class="grid-25">
                        <div class="hide-btn">
                            <i :class="showCustomizeFields ? 'el-icon-view' : 'el-icon-view icon-color-hide'"> 
                                <em v-show="!showCustomizeFields">\</em>
                            </i>Customize fields</div>
                    </div> -->
                    <div class="grid-20 right">
                        <advance-search  :class="isDefaultAdvanceSearch ? '' : 'searched'"
                            :panel="searchPanelName"
                            @click.native="searchPanelName = 'ExistingTrips'"
                            @closeAdvanceSearch="closeAdvance"
                        >
                        </advance-search>
                    </div>
                </div>
            </div>

            <div class="view-container"  v-loading="loadingTrip" element-loading-text="loading data">
                <div class="card-view-container" v-show="selectViewType == 'Card View'">
                    <div class="body-mes">
                        <div class="grid-100 tablet-grid-100" style="padding-left: 5px">
                            <div :class="showStageBar ? 'card-view existing-card-view' : 'card-view  add-view-height existing-card-view'">
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
                                <div class="card-con-box-small d-flex">
                                    <div :class="'grid-' + item.size" v-for="(item, index) in dataList" :key="index">
                                        <div class="item-list" v-show="!item.isHide">
                                            <div 
                                                :class="'item-card-view color-trips-'+ item.type + ' grid-' + (parseInt(100 / item.cols) - 3) + (item.cols ? ' cols-card' : '')  + (associatedTripNo == data.trip_no ? ' associated' : '')"

                                                v-for="(data, dataIndex) in item.secData" :key="dataIndex"

                                                v-show="headDataArr[index].filter ? headDataArr[index].filter.toUpperCase() == data.trip_status_category.toUpperCase().replace('_', '-') + '-' + data.trip_stage_category : true"
                                                v-menu="menuItem" @click="showTripLog(data.logs, data.trip_no)" @contextmenu.prevent="mouseclick(data)" @dblclick="dbClickForDetail(data)"
                                            >
                                                <div class="card-tag" v-show="!item.isHide">{{data.trip_stage_category}} {{item.showMore}}</div>
                                                <strong>#{{data.trip_no}}</strong>
                                                <p>{{data.total_weights}}lb/{{data.total_pallets}}PL/{{data.total_mileage}}mil</p>
                                                <p v-if="data.original_terminal != undefined">F:{{data.original_terminal.location_city + ' ' + data.original_terminal.location_state}}</p>
                                                <!-- <p v-if="data.destination_terminal != undefined">T:{{data.destination_terminal.location_city + ' ' + data.destination_terminal.location_state}}</p> -->
                                                <p v-if="data.tasks.length != 0">T: {{(data.tasks[data.tasks.length-1].stops)[data.tasks[data.tasks.length-1].stops.length-1].stop_location.location_address}}</p>
                                                <p style="margin-bottom: 5px">Driver: {{data.driver_firstname + ' ' + data.driver_lastname}}</p>
                                                <div :class="data.showMore ? 'common-arrow trun-deg' : 'common-arrow'" @click="dropDownTrip(data)"></div>
                                                <div class="show-more-item" v-show="data.showMore">
                                                    <!-- <p>{{data.total_mileage}} mil</p> -->
                                                    <div class="per-task" v-for="(task, taskIndex) in data.tasks" :key="taskIndex">
                                                        <div class="per-stop" v-for="(stop, stopIndex) in task.stops" :key="stopIndex" style="margin-bottom: 10px">
                                                            <strong style="display: block;margin-bottom: 5px">Stop {{stopIndex + 1}}:
                                                            <span class="right">{{stop.stage_text ? stop.stage_text.substring(0,1).toUpperCase() : ''}}</span></strong>
                                                            <strong style="display: block;margin-bottom: 5px">{{stop.stop_location.location_city}}, {{stop.stop_location.location_state}}</strong>
                                                            <div class="per-order" v-for="(line, lineIndex) in stop.lines" :key="lineIndex">
                                                                <div v-if="stop.stage!= 'truck inspection'">
                                                                    <div class="per-order" v-for="(order, orderIndex) in line.orders" :key="orderIndex">
                                                                        <p style="margin-bottom: 2px" @click="getOrderDetailById(order.order_id)" >{{order.order_pro ? 'Pro: ' + order.order_pro : 'Pu: ' + order.pu_id}} | {{order.pallets + 'PLT'}} | {{order.weights + 'lbs'}}</p>
                                                                    </div>
                                                                </div>
                                                                <div v-else>
                                                                    truck inspection
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
                    </div>
                </div>

                <div class="list-view-container" v-show="selectViewType == 'List View'">
                    <div class="list-table table-view existing-list-view drop-down-table body-mes">
                        <div :class="showStageBar ? 'table-out' : 'table-out add-view-height'" style="height: 510px">
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
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
                                    <slot v-for="(item, index) in viewArr">
                                        <tr :key="index" :class="(associatedTripNo == item.trip_no ? 'associated' : '')" @dblclick="dbClickForDetail(item)">
                                            <td :class="'drop-down-table-arrow-box arrow-box-' + item.trip_status_category">
                                                <div :class="[item.showDropDown ? 'drop-down-table-arrow arrow-dowm' : 'drop-down-table-arrow']" @click="clickDropDown(index)"></div>
                                            </td>
                                            <td><strong>{{!tableViewDataTitle[0].isHide ? item.trip_no : ''}}</strong>
                                            <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div></td>
                                            <td>{{!tableViewDataTitle[1].isHide ? item.total_mileage : ''}}
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div>
                                            </td>
                                            <td>{{!tableViewDataTitle[2].isHide ? item.priority : ''}}
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div>
                                            </td>
                                            <td>{{!tableViewDataTitle[3].isHide ? item.dispatcher : ''}}
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div>
                                            </td>
                                            <td>{{!tableViewDataTitle[4].isHide ? item.carrier_name : ''}}
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div>
                                            </td>
                                            <td>{{!tableViewDataTitle[5].isHide ? item.trip_end_date + ' ' + item.trip_start_time_to : ''}}
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div>
                                            </td>
                                            <td>{{!tableViewDataTitle[6].isHide ? item.trip_start_date + ' ' + item.trip_start_time_from  + ' > ' + item.trip_end_date + ' ' + item.trip_start_time_to : ''}}
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div>
                                            </td>
                                            <td>{{!tableViewDataTitle[7].isHide ? (item.original_terminal.location_street ? item.original_terminal.location_street + ',' : '')
                                            + (item.original_terminal.location_city ? item.original_terminal.location_city + ',' : '')
                                            + (item.original_terminal.location_state ? item.original_terminal.location_state + ',' : '')
                                            + item.destination_terminal.location_zip : ''}}
                                            <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div></td>
                                            <td>
                                                <span v-for="(task, taskIndex) in item.tasks" :key="taskIndex" v-show="taskIndex == (item.tasks.length -1)">
                                                    <span v-for="(stop, stopIndex) in task.stops" :key="stopIndex" v-show="stopIndex == (task.stops.length -1)">
                                                        {{!listViewDataTitle[8].isHide ? (stop.stop_location.location_street ? stop.stop_location.location_street + ',' : '')
                                                        + (stop.stop_location.location_city ? stop.stop_location.location_city + ',' : '')
                                                        + (stop.stop_location.location_state ? stop.stop_location.location_state + ',' : '')
                                                        + stop.stop_location.location_zip : ''}}
                                                    </span>
                                                </span>
                                            <div class="right-menu" @click="showTripLog(item.logs, item.trip_no)" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)"></div></td>
                                        </tr>
                                        <slot  v-for="(task) in item.tasks">
                                            <tr v-show="item.showDropDown">
                                                <td colspan="12" style="padding: 0; border: 0">
                                                    <div class="drop-down-items" v-for="(stop, stopIndex) in task.stops" :key="stopIndex">
                                                        <span>stop{{stop.stop_sequence}}</span>
                                                        <span v-if="stop.stage == 'truck inspection'">truck inspection</span>
                                                        <span v-if="stop.stop_location != undefined && stop.stage != 'truck inspection'">{{(stop.stop_location.location_street ? stop.stop_location.location_street + ',' : '')
                                                            + (stop.stop_location.location_city ? stop.stop_location.location_city + ',' : '')
                                                            + (stop.stop_location.location_state ? stop.stop_location.location_state + ',' : '')
                                                            + stop.stop_location.location_zip}}
                                                        </span>
                                                        <span v-if="stop.stage != 'truck inspection'">{{stop.weights}}libs</span>
                                                        <span v-if="stop.stage != 'truck inspection'">{{stop.pallets}}pallets</span>
                                                        <!-- <span v-if="stop.stage != 'truck inspection'">{{stop.miles}}miles</span> -->
                                                    </div>
                                                </td>
                                            </tr>
                                        </slot>
                                    </slot>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="table-view-container" v-show="selectViewType == 'Table View'">
                    <div class="list-table table-view existing-table-view drop-down-table body-mes">
                        <div :class="showStageBar ? 'table-out' : 'table-out add-view-height'" style="height: 510px">
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
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
                                    <slot v-for="(item, index) in viewArr">
                                        <tr :class="[index % 2 == 0 ? 'tr-green' : '']" :key="index">
                                            <td :class="'drop-down-table-arrow-box arrow-box-' + item.trip_status_category">
                                                <div :class="[item.showDropDown ? 'drop-down-table-arrow arrow-dowm' : 'drop-down-table-arrow']" @click="clickDropDown(index)"></div>
                                            </td>
                                            <td><strong>{{!tableViewDataTitle[0].isHide ? item.trip_no : ''}}</strong>
                                            <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div></td>
                                            <td>{{!tableViewDataTitle[1].isHide ? item.total_mileage : ''}}
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div>
                                            </td>
                                            <td>{{!tableViewDataTitle[2].isHide ? item.priority : ''}}
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div>
                                            </td>
                                            <td>{{!tableViewDataTitle[3].isHide ? item.dispatcher : ''}}
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div>
                                            </td>
                                            <td>{{!tableViewDataTitle[4].isHide ? item.carrier_name : ''}}
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div>
                                            </td>
                                            <td>{{!tableViewDataTitle[5].isHide ? item.trip_end_date + ' ' + item.trip_start_time_to : ''}}
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div>
                                            </td>
                                            <td>{{!tableViewDataTitle[6].isHide ? item.trip_start_date + ' ' + item.trip_start_time_from  + ' > ' + item.trip_end_date + ' ' + item.trip_start_time_to : ''}}
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div>
                                            </td>
                                            <td>{{!tableViewDataTitle[7].isHide ? (item.original_terminal.location_street ? item.original_terminal.location_street + ',' : '')
                                            + (item.original_terminal.location_city ? item.original_terminal.location_city + ',' : '')
                                            + (item.original_terminal.location_state ? item.original_terminal.location_state + ',' : '')
                                            + item.destination_terminal.location_zip : ''}}
                                            <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div></td>
                                            <td>{{!tableViewDataTitle[8].isHide ? (item.destination_terminal.location_street ? item.destination_terminal.location_street + ',' : '')
                                            + (item.destination_terminal.location_city ? item.destination_terminal.location_city + ',' : '')
                                            + (item.destination_terminal.location_state ? item.destination_terminal.location_state + ',' : '')
                                            + item.destination_terminal.location_zip : ''}}
                                            <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div></td>
                                            <td>{{!tableViewDataTitle[9].isHide ? item.driver_firstname + ' ' + item.driver_lastname : ''}}
                                                <div class="right-menu" v-menu="menuItem" @contextmenu.prevent="mouseclick(item)" @click="showTripLog(item.logs, item.trip_no)"></div>
                                            </td>
                                        </tr>
                                        <slot  v-for="(task) in item.tasks">
                                            <tr v-show="item.showDropDown">
                                                <td colspan="12" style="padding: 0; border: 0">
                                                    <div class="drop-down-items" v-for="(stop, stopIndex) in task.stops" :key="stopIndex">
                                                        <span>stop{{stop.stop_sequence}}</span>
                                                        <span v-if="stop.stage == 'truck inspection'">truck inspection</span>
                                                        <span v-if="stop.stop_location != undefined && stop.stage != 'truck inspection'">{{(stop.stop_location.location_street ? stop.stop_location.location_street + ',' : '')
                                                            + (stop.stop_location.location_city ? stop.stop_location.location_city + ',' : '')
                                                            + (stop.stop_location.location_state ? stop.stop_location.location_state + ',' : '')
                                                            + stop.stop_location.location_zip}}
                                                        </span>
                                                        <span v-if="stop.stage != 'truck inspection'">{{stop.weights}}libs</span>
                                                        <span v-if="stop.stage != 'truck inspection'">{{stop.pallets}}pallets</span>
                                                        <!-- <span v-if="stop.stage != 'truck inspection'">{{stop.miles}}miles</span> -->
                                                    </div>
                                                </td>
                                            </tr>
                                        </slot>
                                    </slot>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="map-view-container" v-show="selectViewType == 'Map View'">
                <div id="jsmap" style="height: 507px; width: 100%; z-index: 9;" :class="showTable ? 'small-map' : ''"></div>
                <div class="table-view-container maps-table-view" v-show="showTable">
                    <div class="close-tab" @click="hideMapTable">╳</div>
                    <div class="list-table table-view body-mes mapview-table">
                        <div class="table-out" style="height: 510px">
                            <table>
                                <thead>
                                    <tr>
                                        <th v-for="(item, index) in tableViewDataTitle" :key="index" :class="[!item.isHide ? '' : 'hide-th']">
                                            <strong>{{ !item.isHide ? item.name + (item.name == 'Weight' || item.name == 'Capacity' || item.name == 'Miles' ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🖊' : '') : ''}}</strong>
                                            <!-- <span class="position: relative">
                                                <div class="arrow"></div>
                                            </span> -->
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in viewArr" :key="index">
                                        <td>
                                            <strong>{{'#' + item.order_id + ' ' + (item.stage_category == 'P' ? 'P' : 'D')}}
                                            </strong>
                                        </td>
                                        <td>
                                            <span>{{item.shipper_name}}</span>
                                        </td>
                                        <td>
                                            <span>{{item.consignee_name}}</span>
                                        </td>
                                        <td>
                                            <span>{{'F: ' + (item.shipper_street ? item.shipper_street + ',' : '')
                                            + (item.shipper_street2 ? item.shipper_street2 + ',' : '')
                                            + (item.shipper_city ? item.shipper_city + ',' : '')
                                            + (item.shipper_state ? item.shipper_state + ',' : '')
                                            + (item.shipper_country ? item.shipper_country + ' ' : ' ')
                                            + item.shipper_zip}}</span>
                                        </td>
                                        <td>
                                            <span>{{'T: ' + (item.consignee_street ? item.consignee_street + ',' : '')
                                            + (item.consignee_street2 ? item.consignee_street2 + ',' : '')
                                            + (item.consignee_city ? item.consignee_city + ',' : '')
                                            + (item.consignee_state ? item.consignee_state + ',' : '')
                                            + (item.consignee_country ? item.consignee_country + ' ' : ' ')
                                            + item.consignee_zip}}</span>
                                        </td>
                                        <td>
                                            <input type="text" v-model="item.total_weights">
                                            <!-- <em>🖊</em> -->
                                        </td>
                                        <td>
                                            <input type="text" v-model="item.total_pallets">
                                        </td>
                                        <td>
                                            <input type="text" v-model="item.total_mileage">
                                        </td>
                                        <td>
                                            <span>{{item.stage_category == 'P' ? item.delivery_mabd_from : item.delivery_mabd_to}}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <trip-detail 
            :show="showTripDetail" 
            :tripId="currentTripId"
            @closeTripDetail="closeDialog"
            @editTrip="editTrip"
        ></trip-detail>

        <advance-detail
            :detail="orderDetail"
            :type="'Order'"
            :show="showAdvanceDetails"
            @setShowOrHide="setShowOrHideFun"
        >
        </advance-detail>

        <new-trip
            :show="showTripDialog"
            :isEdit="isEditTrip"
            :currentTrip="tripDetail"
            @closeNewTrip="closeNewTripDialog"
            :styleCss="'left: 20%'"
        ></new-trip>
    </div>
</template>
<style lang="scss" src="./existingTrips.scss"></style>