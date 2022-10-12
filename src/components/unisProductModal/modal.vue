<template>
    <modal :name="modalName"  :width="width" height="auto" :clickToClose="true">
        <slot></slot>
    </modal>
</template>
<style lang="scss" src="./modal.scss" scoped></style>
