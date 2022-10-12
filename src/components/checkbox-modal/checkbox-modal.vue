<template>
    <modal :name="modalName"  :adaptive="true" :with="400" height="auto" :scrollable="true" :draggable="true" :clickToClose="false">
        <div class="grid-100 tablet-grid-100 container accessorial" :style="accAry.length > 12 ? styleObj : ''">
            <div class='main-content' style="padding-bottom: 30px;">
                <span class='title'>{{title}}</span>
                <checkbox :isSelect="validateSelected(accessorial.acc_id)" v-for="accessorial in accAry" :key="accessorial.acc_id" :id ="accessorial.acc_id" :content="accessorial.acc_name"  @changeSelect="changes(accessorial.acc_id)"></checkbox>
                <button-set  :rightBtnText="'SAVE'"  class='button-red-large' @leftBtnAction="cancelSelect" @rightBtnAction="saveSelect"></button-set>
            </div>
        </div>
    </modal>
</template>
<style lang="scss" src="./checkbox-modal.scss"/>