<template>
    <div class="grid-100 tablet-grid-100 container footer">
        <div class="grid-100 tablet-grid-100 container">
            <div class="footer-button">
                <div class="grid-50 tablet-grid-50">
                    <button type="button" class="button-standard-large" @click="leftBtnAction">{{leftBtnText}}</button>
                </div>

                <div class="grid-50 tablet-grid-50">
                    <button type="button" class="button-yellow-large" @click="rightBtnAction">{{rightBtnText}}</button>
                </div>
            </div>
        </div>
    </div>
</template>