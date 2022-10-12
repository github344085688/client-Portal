<template>
    <div class="autu-pop-up-win" v-show="show">
        <div class="position-re">
            <div class="modification">
                <div class="title" v-if="options.title">{{options.title}}</div>
                <div class="content" v-if="options.content" v-html="options.content"></div>
                <div class="bottom_box">
                    <div class="bottom unis-btn unis-btn-primary" @click.stop="successBtn($event)" v-if="options.confirm">{{options.confirm}}</div>
                    <div class="bottom unis-btn unis-btn-secondary" @click.stop="cancelBtn" v-if="options.cancel">{{options.cancel}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./mssage-box.scss"/>

