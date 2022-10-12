<template>
    <div class="small-cover" style="padding-top: 15px" v-loading="loadNtification">
        <div class="panel_c_wrap" style="background: #fff">
            <div class="small-title">
                <h2>Notifications</h2>
            </div>
            <div class="message-list" style="height: 508px">
                <!-- <ul>
                    <li v-for="(item, index) in notificationList" :key="index">
                        <div>
                            <strong>#{{item.tms_order_id}} {{item.dispatch_type}}</strong>
                        </div>
                        <div class="notif-info">{{item.text}}</div>
                    </li>
                </ul> -->
                <iframe scrolling="no" class="chat-box" style="height: 498px" :src="notificationUrl" frameborder="0"></iframe>
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="./notifications.scss"></style>