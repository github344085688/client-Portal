<template>
    <div>

        <!-- BEGIN CONTAINER -->
        <div class="sidebar-menu">

            <div class="page-sidebar navbar-collapse collapse" style="position: fixed; z-index:5; height: 100% !important; min-width:220px">

                <div class="menu-tip">
                    <div class="unis-image">
                        <img src="@/assets/images/unis.svg" alt="logo" width="88" height="36" />
                    </div>
                    <div class="nav-line">
                        <img src="@/assets/images/nav-line.svg" alt="logo" width="20" height="12" />
                    </div>

                </div>
                <div class="module-title">{{project}}</div>
                <sidebar-menu :menu-data="menuData" class="page-sidebar-menu"></sidebar-menu>

            </div>
            <app-header @sideBarMenuData="switchSideBarMenuData"></app-header>
            <!-- BEGIN CONTENT -->
            <div class="page-content-wrapper">
                <div class="page-content">
                    <!-- BEGIN ACTUAL CONTENT -->
                    <div>
                        <div style="padding: 20px;">

                            <router-view>

                            </router-view>
                        </div>
                    </div>

                    <!-- END ACTUAL CONTENT -->
                </div>
            </div>
            <!-- END CONTENT -->
        </div>
    </div>
</template>