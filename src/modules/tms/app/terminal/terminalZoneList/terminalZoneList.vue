<template>
    <div class="grid-100">
        <div class="head grid-100 pt-2">
            <h2 class="pt-2 grid-80">Terminal transit zones</h2>
            <!-- <div class="control right">
                <predefined-export-btn btn-class="right" :value="'Import/Export'" :export-dates="btns"
                @selectExportName="onSelectExportName" :is-loading="exportLoading"></predefined-export-btn>
            </div> -->
        </div>
        <div class="filter-area grid-100">
            <div class="grid-100">
                <div class="grid-40 input-address">
                    <div class="icon-7"></div>
                    <input type="text" class="pl-4" v-model="searchParams.search_term">
                </div>
            </div>
            <div class="control right grid-100">
                <button class="unis-btn unis-btn-primary color-white grid-15 right"  @click="getTerminalZoneList">Search</button>
            </div>
        </div>

        <div class="mt-4 grid-100">
            <table class="tms-table-space mt-3 border-tr-table zone-table" v-loading="loadingTerminalZone">
                <thead>
                    <tr>
                        <th v-for="(item, index) in tableHead" :key="index" class="ft-grey700">
                            {{item}}
                        </th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="br-1 br-aLink" v-for="(item, index) in terminalZoneList" :key="index">
                        <td class="po-r">
                            {{item.terminal_name}}
                        </td>
                        <td >
                            <strong>{{item.terminal_code}}</strong>
                        </td>
                        <td v-for="(zoneItem, zoneIndex) in zoneTit" :index="zoneIndex">
                            <strong>{{item[zoneItem]}}</strong>
                        </td>
                        <td >
                            <strong>{{item.zone_total}}</strong>
                        </td>
                        <td >
                            <div class="d-flex align-items-center justify-content-end">
                                <div>
                                    <button class="unis-icon-btn unis-dropdown unis-icon-btn-option h-w-3 ml-4"
                                            style="height: 32px;width: 32px;">
                                        <span class="icon-57"></span>
                                        <ul class="right pl-0 pr-0">
                                            <li style="height: 26px;" @click="goZoneDetailPage(item.terminal_id)">
                                                Go to terminal details
                                            </li>
                                        </ul>
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <pager :totalCount="searchResultPaging.totalNum" :customizePageSize="searchParams.page_size" @reloadContent="triggerSearchFromPager"></pager>
        </div>

        <!-- <unis-product-modal
            :modalName="'importCsv'"
            :width="'621px'"
        >
            <div class="flex-wrap unis-product">
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
                <div style="margin: 0 auto; width: 92%" class="p-0 mt-4" v-loading="loadingUpload">
                    <el-upload
                        class="upload-dom"
                        drag
                        :auto-upload="true"
                        :multiple="false"
                        :http-request="autoUpload"
                        :show-file-list="false"
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
                        <button class="unis-btn unis-btn-primary">Import</button>
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
                    <i class="f-24 icon-30 cursor-p" @click="closeModal"></i>
                </div>
                <div class="mt-auto wid100 p-4">
                    <div class="d-flex justify-content-end">
                        <button class="unis-btn unis-btn-primary" @click="closeModal">OK</button>
                    </div>
                </div>
            </div>
        </unis-product-modal> -->
    </div>
</template>
<style scoped lang="scss" src="./terminalZoneList.scss" />