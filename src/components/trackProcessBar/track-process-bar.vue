<template>

    <div class="grid-100 tablet-grid-100 progressbar-container">
        <ul>
            <li>Origin</li>
            <li>In Transit</li>
            <li>Destination</li>
        </ul>
        <ul class="progressbar">
            <li :class="{current: stage > 0}">
                <span>{{originDate}}</span>
                <br>
                <span>{{originLocation}}</span>
            </li>
            <li :class="{current: stage > 1}">
                <span></span>
                <span></span>
                <span class="line" :class="{current: stage > 1}"></span>
            </li>
            <li :class="{current: stage > 2}">
                <span>Estimated: {{destinationDate}}</span>
                <br>
                <span>{{destinationLocation}}</span>
                <span class="line" :class="{current: stage > 2}"></span>
            </li>
        </ul>
    </div>

</template>
<style lang="scss" src="./track-process-bar.scss" scoped></style>