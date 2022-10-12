<template>
    <div style="background: #FDFDFD; padding: 10px 0 0; min-height:800px" v-loading="isPanelLoading">

        <div class="grid-100 tablet-grid-100">

            <div class="grid-100 tablet-grid-100 container">
                <div class="grid-15 component-title bold" style="line-height: 40px">{{currentPanel}}</div>
                <div class="grid-15 tablet-grid-100">
                    <el-select no-match-text="No Data" v-model="currentPanel" @change="selectPanelView(currentPanel)">
                        <el-option :style="index == 0 ? 'color: #39f' : ''" v-for="(item, index) in userPanelList" :key="index" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                </div>
                <div class="grid-20">&nbsp;</div>
                <div class="grid-50">
                    <button class="unis-btn unis-btn-primary color-white grid-20 right" style="margin: 0 15px" @click="editPanel" v-show="currentPanel != 'Control Panel' && currentPanel != 'Dispatch Dashboard'">Edit Panel</button>
                    <button class="unis-btn unis-btn-primary color-white grid-20 right" style="margin: 0 0 0 15px" @click="createNewPanel"> Create New</button>
                    <button class="unis-btn unis-btn-primary color-white grid-20 right" style="margin: 0 15px" @click="clonePanel">Replicate Panel</button>
                    <button class="unis-btn unis-btn-primary color-white grid-20 right" style="margin: 0 15px" @click="goRelationshipPage" v-permission-check="'controlPanel::panelRelationship_read'">Relationship</button>
                </div>
            </div>
            
            <div class="grid-100 tablet-grid-100 container" style="min-width: 1440px; overflow-y: auto; background: #FDFDFD; margin-top: 25px">
                <div class="bcg-grid">
                    <div class="grid-box" style="position: static">
                        <grid-layout
                        :layout.sync="domLayout"
                        :col-num="24"
                        :cols="{ lg: 24, md: 24, sm: 24, xs: 24, xxs: 24 }"
                        :responsive="false"
                        :row-height="150"
                        :is-draggable="false"
                        :is-resizable="false"
                        :is-mirrored="false"
                        :margin="[0, 0]"
                        :vertical-compact="false"
                        :use-css-transforms="true"
                    >

                        <grid-item v-for="(item, index) in domLayout" style="overflow-x: auto; box-size: border-box"
                                :x="item.x"
                                :y="item.y"
                                :w="item.w"
                                :h="item.h"
                                :i="item.i"
                                :key="index"
                                @moved="movedEvent(item.i, item.x, item.y, item.w, item.h, item.component)">
                                <component v-bind:is="item.component"></component>
                        </grid-item>
                    </grid-layout>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script type="text/javascript" src="../../../mapjs/jsmap.js" async>
</script>
<style lang="scss" scoped src="./controlPanel.scss" />