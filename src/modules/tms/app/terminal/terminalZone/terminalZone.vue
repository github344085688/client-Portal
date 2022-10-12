<template>
    <div class="grid-100">
        <div class="head grid-100 pt-2">
            <div class="grid-100 pl-0">
                <div class="back-arrow mr-4 mb-4 pl-0" @click="goTerminalZoneListPage">←</div>
            </div>
            <h2 class="pt-2 grid-80 pl-0">Terminal transit zone ({{zoneDetail.terminal_code}})</h2>
            <div class="control right grid-15">
                <predefined-export-btn btn-class="right" :value="'Import/Export'" :export-dates="btns"
                @selectExportName="onSelectExportName" :is-loading="exportLoading"></predefined-export-btn>
            </div>
        </div>
        <div class="filter-area grid-100">
            <div class="grid-40 input-address">
                <div class="icon-41"></div>
                <input disabled type="text" class="pl-4" v-model="zoneDetail.address">
            </div>
            <div class="control grid-100 pl-0">
                <div class="grid-20 mt-3">
                    <el-select no-match-text="No Data" v-model="viewModule" placeholder="" @change="changeViewModule">
                        <el-option v-for="view in ['Zone view', 'All ZIP code view']" :key="view" :label="view" :value="view">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>

        <div class="mt-4 grid-100 pb-4" v-loading="loadingZone">
            <div class="zone-tab-tit d-flex justify-content-start align-items-center">
                <div class="grid-70 p-0 d-flex justify-content-start align-items-center">
                    <div v-show="viewModule == 'Zone view'" v-for="(item, index) in tabTit" :key="index" :class="tabArr[index] ? 'choose-tit' : ''" @click="tab(index)">{{item}}</div>
                </div>
                <div class="grid-30 p-0">
                    <span class="right color-b-g900">ZIP codes ({{showChooseZone.length}})</span>
                </div>
            </div>
            <table class="table-client mt-2 br-0">
                <thead>
                    <tr>
                        <template v-for="head in tableHead">
                            <th :key="head">{{head}}</th>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <tr class="child-table-total" v-for="(item, index) in showChooseZone" :key="index">
                        <td class="f-b">{{item.zip}}</td>
                        <td>{{item.state}}</td>
                        <td>
                            <el-select no-match-text="No Data" v-model="item.zone_category" placeholder="" @change="changeZoneConfirm(item)">
                                <el-option v-for="view in tabTit" :key="view" :label="view" :value="view">
                                </el-option>
                            </el-select>
                        </td>
                        <td>{{item.distance_to_center_miles}}</td>
                        <td>{{item.time_to_center_minutes}}</td>
                        <td>{{item.lng}}</td>
                        <td>{{item.lat}}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <unis-product-modal
            :modalName="'importCsv'"
            :width="'621px'"
        >
            <div class="flex-wrap unis-product" v-loading="loadingUpload">
                <div class="d-flex p-4 justify-content-between wid100">
                    <h2>Import </h2>
                    <i class="f-24 icon-30 cursor-p" @click="closeModal"></i>
                </div>
                <div class="content d-flex p-4" v-if="!importError">
                    <div class="icon-4 pr-2 pt-1"></div>
                    <div>Each column of your CSV file must match the correct headings. 
                    Download the template here: 
                        <span class="color-B700 cursor-p" @click="downloadTerminalZoneTemplate">Terminal_transit_zonetemplate .</span>
                    </div>
                </div>
                <div class="content c-error d-flex p-4" v-else>
                    <div class="icon-4 pr-2 pt-1"></div>
                    <div>File could not be imported. Please make sure that each column matches the columns from our <span class="color-B700 cursor-p" @click="downloadTerminalZoneTemplate">product template</span>.
                    </div>
                </div>
                <div style="margin: 0 auto; width: 92%" class="p-0 mt-4">
                    <el-upload
                        class="upload-dom"
                        drag
                        :auto-upload="false"
                        :limit="1"
                        :on-change="changeFile"
                        :on-remove="removeFile"
                        :multiple="false"
                        accept=".xls"
                        action="">
                        <div class="el-upload__text">
                            <i class="el-icon-upload"></i>
                            <span>Drag and drop files here or <em>browse</em></span></div>
                        <div class="el-upload__tip" slot="tip"></div>
                    </el-upload>
                </div>
                <div class="mt-auto wid100 p-4">
                    <div class="d-flex justify-content-end">
                        <button class="unis-btn unis-btn-secondary mr-3" @click="closeModal">Cancel</button>
                        <button class="unis-btn unis-btn-primary" @click="autoUpload" :disabled="!this.fileObj.raw">Import</button>
                    </div>
                </div>
            </div>
        </unis-product-modal>

        <unis-product-modal
            :modalName="'importSelect'"
            :width="'621px'"
        >
            <div class="flex-wrap unis-product">
                <div class="d-flex p-4 justify-content-between wid100">
                    <h2>This import contains one or more duplicate terminals</h2>
                    <i class="f-24 icon-30 cursor-p" @click="closeModal"></i>
                </div>
                <div class="pl-4 pr-4">
                    <div>How would you like to proceed?</div>
                    <div class="radio-box mt-4">
                        <input type="radio" name="radio" id="rd1" :value="'override'" v-model="importChoose" class="unis-radio">
                        <label for="rd1">
                            <span class="pl-3_5">Override current terminals and import new terminals</span>
                        </label>
                    </div>
                    <div class="radio-box mt-4">
                        <input type="radio" name="radio" id="rd2" :value="'notImport'" v-model="importChoose" class="unis-radio">
                        <label for="rd2">
                            <span class="pl-3_5">Do not import duplicate terminals</span>
                        </label>
                    </div>
                </div>
                <div class="mt-auto wid100 p-4">
                    <div class="d-flex justify-content-end">
                        <button class="unis-btn unis-btn-secondary mr-3" @click="closeModal">Cancel</button>
                        <button class="unis-btn unis-btn-primary" :disabled="!importChoose" @click="continueImport">Import</button>
                    </div>
                </div>
            </div>
        </unis-product-modal>
        <unis-product-modal
            :modalName="'importSuccess'"
            :width="'621px'"
        >
            <div class="flex-wrap unis-product">
                <div class="d-flex p-4 justify-content-between wid100">
                    <h2>Import success</h2>
                    <i class="f-24 icon-30 cursor-p" @click="closeModalAndRefresh"></i>
                </div>
                <div class="mt-auto wid100 p-4">
                    <div class="d-flex justify-content-end">
                        <button class="unis-btn unis-btn-primary" @click="closeModalAndRefresh">OK</button>
                    </div>
                </div>
            </div>
        </unis-product-modal>

        <unis-product-modal
            :modalName="'confirmChange'"
            :width="'500px'"
        >
            <div class="flex-wrap unis-product">
                <div class="d-flex p-4 justify-content-between wid100">
                    <h2 class="grid-80 p-0">Are you sure you want to change the zone for this ZIP code?</h2>
                    <i class="f-24 icon-30 cursor-p" @click="closeModal"></i>
                </div>
                <div class="mt-auto wid100 p-4">
                    <div class="d-flex justify-content-end">
                        <button class="unis-btn unis-btn-secondary mr-4" @click="closeModal">Cancel</button>
                        <button class="unis-btn unis-btn-primary" @click="changeZone">Change zone</button>
                    </div>
                </div>
            </div>
        </unis-product-modal>
    </div>
</template>
<style scoped lang="scss" src="./terminalZone.scss" />