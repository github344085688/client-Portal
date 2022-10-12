<template>
    <div class="panel_c_wrap" v-permission-check="'controlPanel::wmsPanel_read'">
        <div class="view-head" style="width: 99%">
            <h2>WMS
                <span>RN {{totalRnCompleted}} Completed</span>
                <span>DN {{totalDnCompleted}} Completed</span>
                <strong>{{totalCanceled}} Cancelled</strong>
            </h2>
            <div class="head-mes">
                <div class="grid-100 tablet-grid-100">
                    <div :class="index == 0 ? 'grid-33' : 'grid-66'" v-for="(item, index) in headDataArr" :key="index">
                        <div class="head-mes-num">
                            <strong :class="isViewNormal ? 'bold-num view-status-size' : 'bold-num'" @click="viewIssueOrNormal(index, 'normal')">{{item.normal.in + item.normal.out}}</strong>
                            <span>●</span>
                            <span :class="isViewNormal ? '' : 'view-status-size'" @click="viewIssueOrNormal(index, 'issue')">{{item.issue.in + item.issue.out}}</span>
                        </div>
                        <div :class="'head-mes-type colorwms-bt-' + item.name">{{item.name}}</div>
                        <div class="head-mes-pdw">   
                            <p>
                                <span v-for="(dataItem, dataIndex) in isViewNormal ? item.normal : item.issue" :key="dataIndex" v-show="dataIndex != 'total'" @click="filterType(index, item.name, dataIndex)" :class="item.filter == (item.name + '-' + dataIndex) ? '--filter': ''">
                                    {{dataIndex.toUpperCase()}}({{dataItem}})
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="view-body">
            <div class="card-view-container">
                <div class="body-control" style="padding-left: 5px">
                    <div class="body-top">
                        <div class="grid-25">
                            <el-select no-match-text="No Data" v-model="selectViewType" @change="selectView(selectViewType)">
                                <el-option v-for="(item, index) in viewType" :key="index" :label="item" :value="item">
                            </el-option>
                            </el-select>
                        </div>
                        <div class="grid-25">
                            <predefined-customer-select v-model="customerId" @change="selectCustomer">
                            </predefined-customer-select>
                        </div>
                        <div class="grid-25">
                            <facility-select 
                                v-model="currentFacility"
                                :customerId="customerId"
                                :isShowFacilityAll="false"
                                @change="selectFacility(currentFacility)">
                            </facility-select>
                        </div>
                        <div class="grid-20 right">
                            <advance-search :class="isDefaultAdvanceSearch ? '' : 'searched'"
                            @click.native="searchPanelName = 'WMS'"
                            :panel="searchPanelName"
                            @closeAdvanceSearch="closeAdvance"
                            >
                            </advance-search>
                        </div>
                    </div>
                </div>
                <div class="body-mes" v-loading="loadingWms" element-loading-text="loading data">
                    <div class="grid-100 tablet-grid-100" style="padding-left: 5px">
                        <div class="card-view" v-show="selectViewType == 'Card View'">
                            <div class="top-title">
                                <div :class="'grid-' + item.size" v-for="(item, index) in dataList" :key="index">
                                    {{item[index]}}
                                    <div class="item-control">
                                        <strong v-show="!item.isHide">{{item.type == 'InYard' ? 'ET In Yard' : item.type}}</strong>
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
                                    <!-- {{item[index]}}
                                    <div class="item-control">
                                        <strong v-show="!item.isHide">{{item.type == 'InYard' ? 'ET In Yard' : item.type}}</strong>
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
                                    </div> -->
                                    <div class="item-list" v-show="!item.isHide">
                                        <div :class="'item-card-view color-wms-'+ item.type + ' grid-' + (parseInt(100 / item.cols) - 3) + (item.cols ? ' cols-card' : '') + (data.id + '' == associatedWmsNo ? ' associated' : '')"  v-for="(data, dataIndex) in item.secData" :key="dataIndex"
                                        v-show="headDataArr[index].filter ? headDataArr[index].filter.toUpperCase() == data.categories.toUpperCase().replace(/_/g, '-') + '-' + (data.isIn ? 'IN' : 'OUT') : true"
                                        >
                                            <div class="card-tag" v-show="!item.isHide">{{data.isIn ? 'IN': 'OUT'}}</div>
                                            <strong>{{data.id}}</strong>
                                            <p v-if="item.type == 'ET-In-Yard'&& data.checkInData!= undefined">{{data.checkInData.equipmentType}} / {{data.checkInData.tractor}}</p>
                                            <p v-else>{{data.status}}</p>
                                            <p v-if="item.type == 'ET-In-Yard' && data.checkInData!= undefined">Carrier:{{data.checkInData.carrierName}}</p>
                                            <p v-else>Customer: {{data.customerName}}</p>
                                            <p v-if="item.type == 'ET-In-Yard'">{{data.createdWhen}}</p>
                                            <p v-else>Carrier: {{data.carrierName}}</p>
                                            <p v-if="(data.id).indexOf('DN') != -1">To: {{
                                                item.shipToAddress ?
                                                ((item.shipToAddress.address1 ? item.shipToAddress.address1 + ',' : '')
                                                + (item.shipToAddress.city ? item.shipToAddress.city + ',' : '')
                                                + (item.shipToAddress.state ? item.shipToAddress.state + ',' : '')
                                                + (item.shipToAddress.country ? item.shipToAddress.country + ' ' : ' ')
                                                + item.shipToAddress.zipCode) : ''}}
                                            </p>
                                            <div class="right-menu" v-menu="(data.id).indexOf('DN') != -1 ?menuItemAssociated : menuItem" @contextmenu.prevent="mouseclick(data)" @dblclick="dbClickForDetail(data)"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="list-view-container" v-show="selectViewType == 'List View'">
                        <div class="list-table body-mes">
                            <div class="table-out" style="height: 567px">
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
                                        <tr v-for="(item, index) in viewArr" :key="index" :class="'colorL-wms-' + item.categories" @dblclick="dbClickForDetail(item)">
                                            <td>
                                                <strong>
                                                    {{ !listViewDataTitle[0].isHide ? item.id : ''}}
                                                </strong>
                                                <div class="right-menu" v-menu="(item.id).indexOf('DN') != -1 ?menuItemAssociated : menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                            </td>
                                            <td>
                                                <span>
                                                    {{ !listViewDataTitle[1].isHide ? item.status : ''}}
                                                </span>
                                                <div class="right-menu" v-menu="(item.id).indexOf('DN') != -1 ?menuItemAssociated : menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                            </td>
                                            <td>
                                                <span v-if="item.checkInData != undefined">{{ !listViewDataTitle[2].isHide ? item.checkInData.equipmentType + item.checkInData.equipmentType + ' / ' + item.checkInData.tractor : ''}} </span>
                                                <div class="right-menu" v-menu="(item.id).indexOf('DN') != -1 ?menuItemAssociated : menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                            </td>
                                            <td>
                                                <span v-if="item.id.indexOf('RN') != -1 || item.id.indexOf('DN') != -1">{{ !listViewDataTitle[3].isHide ? item.customerName : ''}}</span>
                                                <div class="right-menu" v-menu="(item.id).indexOf('DN') != -1 ?menuItemAssociated : menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                            </td>
                                            <td>
                                                <span v-if="item.id.indexOf('RN') != -1 || item.id.indexOf('DN') != -1">{{ !listViewDataTitle[4].isHide ? item.carrierName : ''}}</span>
                                                <span v-if="item.id.indexOf('ET') != -1 && item.checkInData != undefined">{{ !listViewDataTitle[4].isHide ? item.checkInData.carrierName : ''}}</span>
                                                <div class="right-menu" v-menu="(item.id).indexOf('DN') != -1 ?menuItemAssociated : menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                            </td>
                                            <td>
                                                <span v-if="item.id.indexOf('ET') != -1 && item.checkInData != undefined">{{ !listViewDataTitle[5].isHide ? item.checkInData.driverName : ''}}</span>
                                            </td>
                                            <td>
                                                <span>{{ !listViewDataTitle[6].isHide ? item.createdWhen : ''}}</span>
                                            </td>
                                            <td>
                                                <span>{{ !listViewDataTitle[7].isHide ? item.createdBy : ''}}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="table-view-container" v-show="selectViewType == 'Table View'">
                        <div class="list-table table-view body-mes">
                            <div class="table-out" style="height: 567px">
                                <table>
                                    <thead>
                                        <tr>
                                            <th v-for="(item, index) in tableViewDataTitle" :key="index" :class="[!item.isHide ? '' : 'hide-th']">
                                                <strong>{{ !item.isHide ? item.name : ''}}</strong>
                                                <span>
                                                    <el-dropdown>
                                                        <span class="el-dropdown-link">···</span>
                                                        <el-dropdown-menu slot="dropdown">
                                                            <el-dropdown-item @click.native="hideOrExpandTable(index)">{{item.isHide ? 'Expand' : 'Hide'}}</el-dropdown-item>
                                                            <el-dropdown-item :class="sort == '1' ? 'set-bg-color' : ''" @click.native="sortAscending()">Sort by date ascending</el-dropdown-item>
                                                            <el-dropdown-item :class="sort == '2' ? 'set-bg-color' : ''" @click.native="sortDecending()">Sort by date decending </el-dropdown-item>
                                                        </el-dropdown-menu>
                                                    </el-dropdown>
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in viewArr" :key="index" :class="'colorL-wms-' + item.categories">
                                            <td>
                                                <strong>
                                                    {{ !tableViewDataTitle[0].isHide ? item.id : ''}}
                                                </strong>
                                                <div class="right-menu" v-menu="(item.id).indexOf('DN') != -1 ?menuItemAssociated : menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                            </td>
                                            <td>
                                                <span>
                                                    {{ !tableViewDataTitle[1].isHide ? item.status : ''}}
                                                </span>
                                                <div class="right-menu" v-menu="(item.id).indexOf('DN') != -1 ?menuItemAssociated : menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                            </td>
                                            <td>
                                                <span v-if="item.checkInData != undefined">{{ !tableViewDataTitle[2].isHide ? item.checkInData.equipmentType + item.checkInData.equipmentType + ' / ' + item.checkInData.tractor : ''}} </span>
                                                <div class="right-menu" v-menu="(item.id).indexOf('DN') != -1 ?menuItemAssociated : menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                            </td>
                                            <td>
                                                <span v-if="item.id.indexOf('RN') != -1 || item.id.indexOf('DN') != -1">{{ !tableViewDataTitle[3].isHide ? item.customerName : ''}}</span>
                                                <div class="right-menu" v-menu="(item.id).indexOf('DN') != -1 ?menuItemAssociated : menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                            </td>
                                            <td>
                                                <span v-if="item.id.indexOf('RN') != -1 || item.id.indexOf('DN') != -1">{{ !tableViewDataTitle[4].isHide ? item.carrierName : ''}}</span>
                                                <span v-if="item.id.indexOf('ET') != -1 && item.checkInData != undefined">{{ !tableViewDataTitle[4].isHide ? item.checkInData.carrierName : ''}}</span>
                                                <div class="right-menu" v-menu="(item.id).indexOf('DN') != -1 ?menuItemAssociated : menuItem" @contextmenu.prevent="mouseclick(item)"></div>
                                            </td>
                                            <td>
                                                <span v-if="item.id.indexOf('ET') != -1 && item.checkInData != undefined">{{ !tableViewDataTitle[5].isHide ? item.checkInData.driverName : ''}}</span>
                                            </td>
                                            <td>
                                                <span>{{ !tableViewDataTitle[6].isHide ? item.createdWhen : ''}}</span>
                                            </td>
                                            <td>
                                                <span>{{ !tableViewDataTitle[7].isHide ? item.createdBy : ''}}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <wms-detail 
            :show="showWMSDetail"
            :wmsOrder="wmsDetail" 
            @closeWMSDetail="closeDialog">
        </wms-detail>
    </div>
</template>
<style lang="scss" src="./wms.scss"></style>