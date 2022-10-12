<template>
    <div class='step-counter'> 
        <span :class="{'change-color':isActive, 'change-size':isSmaller}">{{ovalNum}}</span>
    </div>
</template>
<style src='./step-counter.scss'>

