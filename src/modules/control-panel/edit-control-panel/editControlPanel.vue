<template>
    <div>
        <div class="grid-100 tablet-grid-100">

            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-40 component-title bold">{{type}}</div>
                <div class="grid-20">&nbsp;</div>
                <div class="grid-40">
                    <waitting-btn btn-class="unis-btn unis-btn-primary color-white h-40-p" class="right" @click="saveOrUpdateControlPanel" :value="'Save'" :is-loading="saving">
                    </waitting-btn>
                    <button class="unis-btn unis-btn-primary color-white grid-30 right h-40-p" style="margin: 0 15px" @click="cancelEditControlPanel">Cancel</button>
                    <button v-if="!isNew" class="unis-btn unis-btn-primary color-white grid-25 right h-40-p" @click="deletePanel"> Delete</button>
                </div>
            </div>
        
            <div class="grid-20 tablet-grid-100 container" style="margin-top: 20px">
                <label for="">Panel Components:</label>
                <el-select no-match-text="No Data" v-model="selectPanel" multiple placeholder="All" @change="selectPanelComponents">
                    <el-option v-for="(item, index) in panels" :disabled="item == 'Wms' ? !checkoutPermission('controlPanel::wmsPanel_read') : false" :key="index" :label="item + (item == 'Wms' && !checkoutPermission('controlPanel::wmsPanel_read') ? ' (no permission)' : '' )" :value="item">
                    </el-option>
                </el-select>
            </div>

            <div class="panel-list grid-80 tablet-grid-100" v-if="!isNew" style="border: 0">
                <div v-for="(item, index) in userPanelList" :key="index" :class="[currentPanel == item.name ? 'select' : '']" @click="selectPanelView(item)">
                    {{item.name}}
                </div>
                <div class="create-new" @click="createNew">+ Create New</div>
            </div>

            <div class="grid-100 tablet-grid-100 container">
                <input class="inset-title" type="text" placeholder="Inset Title" v-model="currentPanelTitle">
            </div>
            
            <div class="grid-100 tablet-grid-100 container" style="min-width: 1440px; overflow-y: auto">
                <div class="bcg-grid">
                    <grid-layout
                        :layout.sync="layout"
                        :col-num="24"
                        :cols="{ lg: 24, md: 24, sm: 24, xs: 24, xxs: 24 }"
                        :responsive="true"
                        :row-height="150"
                        :is-draggable="true"
                        :is-resizable="false"
                        :is-mirrored="true"
                        :vertical-compact="true"
                        :margin="[0, 0]"
                        :use-css-transforms="false"
                    >

                        <grid-item v-for="(item, index) in layout"
                                :x="item.x"
                                :y="item.y"
                                :w="item.w"
                                :h="item.h"
                                :i="item.i"
                                :key="index">
                                <div class="per-dom"></div>
                                <div class="per-dom"></div>
                                <div class="per-dom"></div>
                                <div class="per-dom"></div>
                        </grid-item>
                    </grid-layout>
                    
                    <div class="grid-box">
                        <grid-layout
                        :layout.sync="domLayout"
                        :col-num="24"
                        :cols="{ lg: 24, md: 24, sm: 24, xs: 24, xxs: 24 }"
                        :responsive="false"
                        :row-height="150"
                        :is-draggable="true"
                        :is-resizable="false"
                        :is-mirrored="false"
                        :margin="[0, 0]"
                        :vertical-compact="false"
                        :use-css-transforms="true"
                        @layout-updated="layoutUpdatedEvent"
                    >

                        <grid-item v-for="(item, index) in domLayout" style="overflow-x: auto;"
                                :x="item.x"
                                :y="item.y"
                                :w="item.w"
                                :h="item.h"
                                :i="item.i"
                                :key="index"
                                :static="item.static"
                                :class="item.selected ? 'panel-select' : ''"
                                @click.native="selected(item)"
                                @move="moving(index)"
                                @moved="movedEvent(item.i, item.x, item.y, item.w, item.h, item.component)">
                                <component v-bind:is="item.component"></component>
                                <div class="remove-panel" @click="removePanel(item.component)"></div>
                        </grid-item>
                    </grid-layout>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<style lang="scss" src="./editControlPanel.scss" />