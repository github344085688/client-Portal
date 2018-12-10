<template>
    <div class="grid-100 tablet-grid-100 container pager" v-show="totalCount">
        <!-- <div class="grid-100 tablet-grid-100 container" > -->
        <!-- <div class="grid-40 tablet-grid-20 text-left">
            <div role="status" aria-live="polite">{{showingFrom }} to {{ showingTo }} of {{totalCount}}
            </div>
        </div> -->
        <div class="grid-100 tablet-grid-80 text-right right">
            <div class="paginate">
                <div role="status" aria-live="polite">{{showingFrom }} to {{ showingTo }} of {{totalCount}} Results
                </div>
            </div>
            <div class="paginate">
                <div class="pagination-panel">Show
                    <element-select v-model="pageSize" :options="pageSizeOptions" @selectChange="reRenderWhenPageSizeChange" class="selectsize"></element-select>
                </div>
            </div>
            <div class="paginate">
                <ul class="paginate_num" style="visibility: visible;">

                    <li class="prev" @click="loadFirstPage">
                        <a title="First">
                            <i class="fa fa-angle-double-left"></i>
                        </a>
                    </li>
                    <li :class="{'prev disabled':pager.activedPage === 1}" @click="loadPrevPage">
                        <a title="Prev">
                            <i class="fa fa-angle-left fa-num"></i>
                        </a>
                    </li>

                    <li v-for="page in pages" :key="page.number" :class="{'active':page.active}" @click="loadPage(page.number)">
                        <a>{{page.number}}</a>
                    </li>

                    <li :class="{'next disabled':pager.activedPage == pager.totalPage}" @click="loadNextPage">
                        <a title="Next">
                            <i class="fa fa-angle-right"></i>
                        </a>
                    </li>
                    <li class="next" @click="loadLastPage">
                        <a title="Last">
                            <i class="fa fa-angle-double-right"></i>
                        </a>
                    </li>
                </ul>
            </div>
            <!-- <div class="paginate" >

        
                <div class="pagination-panel">Page:
                    <input type="number" v-model="inputPage"  class="pagination-panel-input" maxlenght="5"><a
                        href="javascript:void(0)" class="btn default" @click="goToPage">Go</a><span class="pagination-panel-total"></span>
                </div>
          
        </div> -->

        </div>
    </div>
</template>
<style lang="scss" src="./pager.scss">
