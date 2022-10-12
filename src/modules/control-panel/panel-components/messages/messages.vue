<template>
    <div class="small-cover" style="padding-left: 0; padding-top: 15px; height: 750px">
        <div class="panel_c_wrap" style="background: #fff; height: 735px">
            <div class="small-title" style="height: 60px; line-height: 60px">
                <h2>Messages <span style="font-size: 14px">{{mesTitle}}</span></h2>
            </div>

            <div class="send-message-box">
                <p>Send Phone Message</p>
                <el-select no-match-text="No Data" v-model="selectContactPhone">
                    <el-option v-for="(item, index) in contacts" :key="index" :label="item.type + ':  ' + item.name" :value="item.phone">
                    </el-option>
                </el-select>
                <input type="text" placeholder="Message" v-model="messageText">
                <div class="right" style="padding-right:10px">
                    <waitting-btn btn-class="unis-btn unis-btn-primary color-white right h-40-p"
                        :value="'Send Message'"
                        :is-loading="sending" :disabled="!selectContactPhone || !messageText"
                        @click="sendPhoneMessage"
                        >
                    </waitting-btn>
                </div>
            </div>

            <div class="message-list">
                <iframe v-if="showMessage" scrolling="no" class="chat-box" :src="chatUrl" frameborder="0"></iframe>
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="./messages.scss"></style>