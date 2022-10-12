<template>
    <div class="grid-100 d-flex tablet-grid-100 justify-content-center container pager" v-if="totalCount">
        <div class="paginate mr-4">
            <div class="pagination-panel">Show
                <element-select v-model="pageSize" :options="pageSizeOptions" @selectChange="reRenderWhenPageSizeChange" class="selectsize"></element-select>
            </div>
        </div>
        <div class="tablet-grid-80 d-flex flex-column justify-content-center">
            <div class="paginate mb-2 d-flex flex-column justify-content-center">
                <ul class="paginate_num d-flex justify-content-center align-items-center" >
                    <li class="prev" @click="loadFirstPage">
                        <button class="unis-btn" :disabled="pager.activedPage == 1">
                            <i class="icon-15"></i>
                        </button>
                    </li>
                    <li  @click="loadPrevPage">
                        <button class="unis-btn" style="padding-top: 4px" :disabled="pager.activedPage == 1">
                            <div><i class="icon-15"></i></div>
                            <div><i class="icon-15"></i></div>
                        </button>
                    </li>

                    <li v-for="page in pages" :key="page.number" :class="{'active':page.active}" @click="loadPage(page.number)">
                        <a>{{page.number}}</a>
                    </li>

                    <li  @click="loadNextPage">
                        <button class="unis-btn" style="padding-top: 4px" :disabled="pager.activedPage == pager.totalPage">
                            <div><i class="icon-8"></i></div>
                            <div><i class="icon-8"></i></div>
                        </button>
                    </li>
                    <li class="next" @click="loadLastPage"  >
                        <button class="unis-btn" :disabled="pager.activedPage == pager.totalPage">
                            <i class="icon-8"></i>
                        </button>
                    </li>
                </ul>
            </div>
            <div class="paginate">
                <div class="d-flex align-items-center justify-content-center">{{showingFrom }} - {{ showingTo }} of {{totalCount}}
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" src="./pager.scss">
