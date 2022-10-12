<template>
    <div class="grid-100">
        <div class="head grid-100 pt-2">
            <h2 class="pt-2 grid-80">Terminal matrix</h2>
            <div class="control right">
                <!-- <waitting-btn btn-class="unis-btn unis-btn-primary cancel_botton h-40-p" @click="exportTerminalmatrix" :is-loading="loadingExport" :value="'Export'">
                </waitting-btn> -->
                <predefined-export-btn btn-class="right" :value="'Import/Export'" :export-dates="btns"
                @selectExportName="onSelectExportName" :is-loading="exportLoading" ></predefined-export-btn>
            </div>
        </div>
        <div class="filter-area grid-100">
            <div class="grid-40 input-address">
                <div class="icon-41"></div>
                <input type="text" class="pl-4" v-model="terminalParams.search_term">
            </div>
            <div class="control right grid-100">
                <button class="unis-btn unis-btn-primary grid-10 right"  @click="getTerminalList">Search</button>
                <button v-if="!multipleView" class="unis-btn unis-btn-secondary grid-10 mr-4 right"  @click="getAllTerminalList">All matrix</button>
            </div>
        </div>

        <div class="mt-4 grid-100" v-loading="loadingMatrix" v-if="multipleView">
            <div class="grid-100 no-data" v-if="tableData.length == 0">
                No data
            </div>
            <table class="table-client mt-2" v-else>
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <template v-for="head in tabNav">
                            <th :key="head">{{head}}</th>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <tr class="child-table-total" v-for="(item, index) in tableData" :key="index">
                        <td>{{item.pickupCode}}</td>
                        <td v-for="(data, dataIndex) in item.array" :key="dataIndex" :class="data.matrix_transit_days ? '' : 'no-days'">
                            <input type="number" class="unis-input static-input" v-model="data.matrix_transit_days" placeholder="e.g., 1,2,6">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="mt-4 grid-100" v-loading="loadingMatrix" v-if="!multipleView">
            <div class="grid-100 no-data" v-if="selectTerminalMatrix.length == 0">
                No data
            </div>
            <table class="table-client mt-2" v-else>
                <thead>
                    <tr>
                        <th>Pickup terminal code</th>
                        <th>Delivery terminal code</th>
                        <th>Days</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="child-table-total" v-for="(item, index) in selectTerminalMatrix" :key="index">
                        <td>{{item.pickup_terminal_code}}</td>
                        <td>{{item.delivery_terminal_code}}</td>
                        <td :class="item.days ? '' : 'no-days'">
                            <input type="number" class="unis-input static-input" v-model="item.days" placeholder="e.g., 1,2,6">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="control grid-100 pl-4 mt-4">
            <div class="right">
                <waitting-btn btn-class="unis-btn unis-btn-primary cancel_botton h-40-p" @click="saveMatrix" :is-loading="loadingSave" :value="'Save'">
                </waitting-btn>
            </div>
        </div>

        <unis-product-modal
            :modalName="'selectOneTerminal'"
            :width="'500px'"
        >
            <div class="flex-wrap unis-product">
                <div class="d-flex p-4 justify-content-between wid100">
                    <h2 class="grid-80 p-0">Select terminal to view matrix.</h2>
                    <i class="f-24 icon-30 cursor-p" @click="closeModal"></i>
                </div>
                <div class="mt-auto wid100 p-4">
                    <div class="mb-4 terminal-result">
                        <div class="grid-100 mb-2" v-for="(item, index) in terminalList" :key="index">
                            <input type="checkbox" name="layout" v-model="item.selectTerminal" :id="'selectTerminal' + index" class="unis-checkbox" @change="selectTerminal(item)">
                            <label :for="'selectTerminal' + index" class="m-0 pl-3_5">{{item.terminal_name}} &nbsp; ({{item.terminal_code}})</label>
                        </div>
                    </div>
                    <div class="d-flex justify-content-end">
                        <button class="unis-btn unis-btn-primary" :disabled="!selectTerminalData.terminal_id" @click="searchSelectTerminal">View matrix</button>
                    </div>
                </div>
            </div>
        </unis-product-modal>

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
                        <span class="color-B700 cursor-p" @click="downloadMatrixTemplate">Matrix template.</span>
                    </div>
                </div>
                <div class="content c-error d-flex p-4" v-else>
                    <div class="icon-4 pr-2 pt-1"></div>
                    <div>File could not be imported. Please make sure that each column matches the columns from our <span class="color-B700 cursor-p" @click="downloadMatrixTemplate">product template</span>.
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
            :modalName="'confirmSave'"
            :width="'500px'"
        >
            <div class="flex-wrap unis-product">
                <div class="d-flex p-4 justify-content-between wid100">
                    <h2 class="grid-80 p-0">Save success.</h2>
                    <i class="f-24 icon-30 cursor-p" @click="closeAndRefresh"></i>
                </div>
                <div class="mt-auto wid100 p-4">
                    <div class="d-flex justify-content-end">
                        <button class="unis-btn unis-btn-primary" @click="closeAndRefresh">OK</button>
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
                    <i class="f-24 icon-30 cursor-p" @click="closeAndRefresh"></i>
                </div>
                <div class="mt-auto wid100 p-4">
                    <div class="d-flex justify-content-end">
                        <button class="unis-btn unis-btn-primary" @click="closeAndRefresh">OK</button>
                    </div>
                </div>
            </div>
        </unis-product-modal>
    </div>
</template>
<style scoped lang="scss" src="./terminalMatrix.scss" />