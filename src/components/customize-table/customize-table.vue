<template>
    <div class="table-field">
        <div class="init-line">
            <button class="button-unis color-white" @click.stop.prevent="customizeTableShow" style="padding: 0px 5px 0px 10px;">Customize Table
                <i class="fas fa-chevron-up dz-icon" v-if="show"></i>
                <i class="fas fa-chevron-down dz-icon" v-if="!show"></i>
            </button>

            <div class="table-detail" v-if="show && tableFileds.length>0">
                <div style="margin:5px 0px;">
                    <div class="child-field" :class="{'selected':fields.checked}" v-for=" fields in tableFileds" :key="fields.fieldId" @click.stop.prevent="checkedFiled(fields)">
                        <!-- <input type="checkbox" :id="fields.fieldId" :checked="fields.checked" @click.stop.prevent="checkedFiled(fields)">
                    <label class="checkbox" :for="fields.fieldId">
                        <span>{{fields.fieldName}}</span>
                    </label> -->
                        <div class="select-img">
                            <img src="@/assets/images/shape-copy.svg" v-if="fields.checked" />
                        </div>
                        <span>{{fields.fieldName}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="./customize-table.scss" >
