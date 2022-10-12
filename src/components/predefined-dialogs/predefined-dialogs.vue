<template>
    <div class="predefined-dialogs">
        <div class="position-re">
            <div class="modification" :style="{'width':setStyle.width,'height':setStyle.height}">
                <div class="title">{{title}}</div>
                <div class="content">
                        <slot name="content"></slot>
                </div>
                <div class="bottom">
                        <slot name="bottom"></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="./predefined-dialogs.scss">