<template>
    <div style="padding-bottom: 80px" v-loading="loadingTerminal">
        <div class="head d-flex justify-content-between grid-100 mt-4">
            <div class="d-flex justify-content-start grid-80">
                <div class="back-arrow mr-4" @click="goTerminalListPage">←</div>
                <h2 class="pt-2">New Terminal</h2>
                <div class="control d-flex pl-4">
                    <span class="pl-4 pt-2 pr-4">Status</span>
                    <el-select style="width: 100px" no-match-text="No Data" v-model="terminalInfo.status" placeholder="Terminal Code">
                        <el-option v-for="(item, index) in statusArr" :key="index" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="control right grid-20">
                <waitting-btn btn-class="unis-btn unis-btn-primary cancel_botton h-40-p" @click="saveTerminal" :is-loading="loadingSave" :value="'Save'">
                </waitting-btn>
            </div>
        </div>

        <div class="terminal-info grid-100 pl-4 mt-4">
            <h3 class="mt-2">Basic information</h3>
            <h4 class="mt-4">General</h4>
            <div class="mt-4">
                <div class="grid-30">
                    <label for="name">Terminal name*</label>
                    <input type="text" v-model="terminalInfo.terminal_name">
                </div>
                <div class="grid-30">
                    <label for="name">Terminal code*</label>
                    <input type="text" v-model="terminalInfo.terminal_code">
                </div>
            </div>
            <div class="grid-100 p-0 mt-4">
                <div class="grid-30">
                    <label for="terminalType">Terminal type</label>
                    <el-select no-match-text="No Data" v-model="terminalInfo.terminal_type" placeholder="Terminal Code">
                        <el-option v-for="(item, index) in ['Revenue', 'Contract']" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="grid-30">
                    <label for="terminalType">GP Location Code</label>
                    <input type="text" v-model="terminalInfo.gp_code">
                </div>
            </div>
            <div class="grid-60 mt-3">
                <label for="">Description</label>
                <input type="text" v-model="terminalInfo.description">
            </div>
            <div class="grid-60">
                <label for="">Country*</label>
                <input type="text"  v-model="terminalInfo.country">
            </div>
            <div class="grid-60">
                <label for="">Address 1*</label>
                <input type="text"  v-model="terminalInfo.address_01">
            </div>
            <div class="grid-60">
                <label for="">Address 2</label>
                <input type="text"  v-model="terminalInfo.address_02">
            </div>
            <div class="grid-60">
                <label for="">City*</label>
                <input type="text" placeholder="City" v-model="terminalInfo.city">
            </div>
            <div class="grid-100"></div>
            <div>
                <div class="grid-30">
                    <label for="name">State*</label>
                    <!-- <el-select no-match-text="No Data" v-model="terminalInfo.state" placeholder="Terminal Code">
                        <el-option v-for="(item, index) in ['Revenue', 'Contract']" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select> -->
                    <input type="text" v-model="terminalInfo.state">
                </div>
                <div class="grid-30">
                    <label for="name">ZIP code*</label>
                    <input type="text" v-model="terminalInfo.zip">
                </div>
            </div>
            <div class="grid-100"></div>
            <div class="number-control">
                <div class="grid-30">
                    <label for="name">Phone number</label>
                    <input type="text" v-model="terminalInfo.phone">
                </div>
                <div class="grid-30">
                    <label for="name">Label</label>
                    <el-select no-match-text="No Data" v-model="terminalInfo.label">
                        <el-option v-for="(item, index) in ['telephone', 'cellphone']" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </div>
                <!-- <div class="grid-20 pt-3">
                    <div class="x-close" @click="cleanPhone">×</div>
                </div> -->
            </div>
            <div class="grid-100"></div>
            <div class="grid-60">
                <label for="name">Email</label>
                <input type="text" v-model="terminalInfo.email">
            </div>
            <div class="grid-60">
                <label for="name">Fax</label>
                <input type="text" v-model="terminalInfo.fax">
            </div>
            <div class="grid-60">
                <label for="name">Notes</label>
                <input type="text" v-model="terminalInfo.notes">
            </div>
            <div class="grid-60 pl-0 pr-0">
                <div class="grid-33">
                    <label for="">Open</label>
                    <input type="text" v-model="terminalInfo.open">
                </div>
                <div class="grid-33">
                    <label for="">Close</label>
                    <input type="text" v-model="terminalInfo.close">
                </div>
                <div class="grid-33">
                    <label for="">Timezone</label>
                    <el-select no-match-text="No Data" v-model="terminalInfo.timezone" placeholder="Timezone">
                        <el-option v-for="(item, index) in ['PST', 'CST', 'EST', 'HST']" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>

        <div class="terminal-info grid-100 pl-4">
            <h4 class="mt-4">Main contact</h4>
            <div v-for="(item, index) in terminalInfo.location_main_contact_array" :key="index">
                <div class="grid-60 mt-3">
                    <label for="">Main contact</label>
                    <input type="text" v-model="item.contact_name">
                </div>
                <div class="grid-60">
                    <label for="">Title</label>
                    <input type="text" v-model="item.contact_title">
                </div>
                <div class="grid-60">
                    <label for="">Phone number</label>
                    <input type="number" v-model="item.contact_phone">
                </div>
                <div class="grid-60 mb-4">
                    <label for="">Email</label>
                    <input type="text" v-model="item.contact_email">
                </div>
                <div class="grid-60" v-if="index > 0">
                    <button class="unis-btn unis-btn-secondary grid-10 right" @click="removeContanct(index)">Remove</button>
                </div>
            </div>

            <div class="grid-100 color-B700 pt-2 cursor-p">
                <div class="icon-32" @click="addContact">Add another contact</div>
            </div>
        </div>
        <div class="control grid-20 pl-4 mt-4">
            <waitting-btn btn-class="unis-btn unis-btn-primary cancel_botton h-40-p" @click="saveTerminal" :is-loading="loadingSave" :value="'Save'">
            </waitting-btn>
        </div>

        <unis-product-modal
            :modalName="'removeConfirm'"
            :width="'621px'"
        >
            <div class="flex-wrap unis-product">
                <div class="d-flex p-4 justify-content-between wid100">
                    <h2>Are you sure to remove this contanct?</h2>
                    <i class="f-24 icon-30 cursor-p" @click="closeModal"></i>
                </div>
                <div class="mt-auto wid100 p-4">
                    <div class="d-flex justify-content-end">
                        <button class="unis-btn unis-btn-secondary mr-3" @click="closeModal">Cancel</button>
                        <button class="unis-btn unis-btn-primary" @click="sureRemove">Remove</button>
                    </div>
                </div>
            </div>
        </unis-product-modal>
    </div>
</template>
<style scoped lang="scss" src="./newTerminal.scss" />