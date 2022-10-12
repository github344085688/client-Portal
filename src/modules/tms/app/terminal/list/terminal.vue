<template>
    <div class="grid-100">
        <div class="head grid-100">
            <h2>Terminals</h2>
            <div class="control right grid-100">
                <button class="unis-btn unis-btn-primary color-white grid-15 right ml-4" @click="goNewTerminalPage">Create New Terminal</button>
                <div class="control right grid-15">
                    <predefined-export-btn btn-class="right" :value="'Import/Export'" :export-dates="btns"
                    @selectExportName="onSelectExportName" :is-loading="exportLoading" ></predefined-export-btn>
                </div>
            </div>
        </div>
        <div class="filter-area grid-100">
            <div class="grid-100">
                <div class="grid-40 input-address">
                    <div class="icon-7"></div>
                    <input type="text" class="pl-4" v-model="searchParams.search_term">
                </div>
            </div>
            <div class="control right grid-100">
                <button class="unis-btn unis-btn-primary color-white grid-15 right" @click="getTerminalListByTerm">Search</button>
            </div>
        </div>

        <div class="mt-4 grid-100" v-loading="loadingTerminal">
            <div class="grid-100 no-data" v-if="terminalList.length == 0">
                No data
            </div>
            <table class="table-client" v-else>
                <thead>
                    <tr>
                        <template v-for="head in tableHead">
                            <th :key="head">{{head}}</th>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <tr class="child-table-total" v-for="(item, index) in terminalList" :key="index">
                        <td>{{item.terminal_name}}</td>
                        <td>{{item.terminal_code}}</td>
                        <td>
                            <strong>{{item.address}}</strong>
                            <strong>{{item.city}}, {{item.state}} {{item.zip}} </strong>
                            <strong>{{item.country}}</strong>
                        </td>
                        <td>{{item.city}}</td>
                        <td>{{item.state}}</td>
                        <td>{{item.country}}</td>
                        <td>{{item.zip}}</td>
                        <td>{{item.phone}}</td>
                        <td>{{item.terminal_type}}</td>
                        <td><span :class="'isActive-' + item.is_active">{{item.is_active == 'Y' ? 'Active' : 'Inactive'}}</span></td>
                        <td>{{item.fax}}</td>
                        <td>
                            <div class="pt-1">
                                <button class="unis-icon-btn unis-dropdown unis-icon-btn-option h-w-3"
                                        style="height: 32px;width: 32px;">
                                    <span class="icon-57"></span>
                                    <ul class="right pl-0 pr-0 grid-25">
                                        <li style="height: 34px;" @click="goEditDetailPage(item.terminal_id)">View Detail</li>
                                        <li style="height: 34px;" @click="goEditTerminalPage(item.terminal_id)">Edit terminal details</li>
                                        <li style="height: 34px;" @click="goTerminalMatrixPage(item.terminal_id, item.terminal_code)">Go to terminal matrix</li>
                                        <li style="height: 34px;" @click="goTerminalZonePage(item.terminal_id)">Go to terminal transit zones</li>
                                    </ul>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <pager :totalCount="searchResultPaging.total" :customizePageSize="searchParams.page_size" @reloadContent="triggerSearchFromPager"></pager>
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
                        <span class="color-B700 cursor-p" @click="downloadTerminalTemplate">Terminal template.</span>
                    </div>
                </div>
                <div class="content c-error d-flex p-4" v-else>
                    <div class="icon-4 pr-2 pt-1"></div>
                    <div>File could not be imported. Please make sure that each column matches the columns from our <span class="color-B700 cursor-p" @click="downloadTerminalTemplate">product template</span>.
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
                    <i class="f-24 icon-30 cursor-p" @click="closeModal"></i>
                </div>
                <div class="mt-auto wid100 p-4">
                    <div class="d-flex justify-content-end">
                        <button class="unis-btn unis-btn-primary" @click="closeModal">OK</button>
                    </div>
                </div>
            </div>
        </unis-product-modal>
    </div>
</template>
<style lang="scss" src="./terminal.scss" />