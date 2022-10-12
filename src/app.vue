<template>
  <div id="sitebody">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
};
</script>

<style lang="scss">
     @import './assets/css/unis.css';

    #sitebody > div {
      height: 100%;
    }
    .sidebar-menu {
      height: 100%;
    }
    .unis-aside {
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
    }
    .page-sidebar-menu {
      width: 100%;
    }
    .parent-details .unis-a {
      font-weight: bold !important;
    }
    .business-item {
      white-space: normal !important;
      padding: 0.4rem 1rem 0.4rem 0.5rem;
      margin: 0.35rem 0.1rem;
    }
    .business-item a {
      display: block !important;
      // word-break: break-all;
    }
    .business {
      font-family: 'unis' !important;
      font-style: bold;
    }
</style>
<style lang="scss" src="./assets/css/global.scss"/>