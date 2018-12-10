<template>
    <div class="grid-100 tablet-grid-100 container title">
        <h1 class="title">{{headerTitle}}
            <div class="grid-50 tablet-grid-50 progressbar-container">
                <ul class="progressbar">
                    <template v-for="(item,index) in pages">
                        <li :key="index" :class="{current: stage > index}">
                            <span v-if="index > 0"></span>
                            <span></span>
                            <span :class="{current: stage > index}">{{item}}</span>
                        </li>
                    </template>
                </ul>
            </div>
        </h1>
        <p class="sub-title sub-header">{{headerSubtitle}}</p>
    </div>
</template>
