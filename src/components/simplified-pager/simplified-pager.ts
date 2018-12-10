import WiseVue from "../../shared/wise-vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./simplified-pager.vue";
import ElementSelect from "../element-select/element-select";
import { uniq, sortBy } from 'lodash-es';


@Component({
    mixins: [template],
    name: 'simplified-pager',
    components: {
        ElementSelect
    }
})
export default class SimplifiedPager extends WiseVue {


    @Prop({ default: 10 })
    customizePageSize!: number;

    @Prop({ default: 0 })
    totalCount!: number;

    @Prop({ default: 5 })
    pagerShowCount!: number;

    @Prop({ default: "" })
    keyId!: string;

    get showingFrom() {
        return (this.pager.activedPage - 1) * this.pageSize + 1;
    }

    get showingTo() {
        return this.pager.activedPage * this.pageSize > this.totalCount ? this.totalCount : this.pager.activedPage * this.pageSize;
    }


    pager = { activedPage: 1, totalPage: 0, pagerShowCount: 0, halfPagerShowCount: 0, low: 0, high: 0 };
    pageSize = 0;
    inputPage = 1;
    lastPageSize = 0;
    lastTotalCount = 0;
    totalPage = 0;
    halfPagerShowCount = this.pagerShowCount / 2;
    stay = false;
    pages: any[] = [];
    pageSizeOptions: any[] = [10, 50, 100, 300, 500, 1000];

    mounted() {
        this.pageSize = this.customizePageSize;
        this.setupPageSizeOptions();
        this.initialPager();
        this.loadDefaultPager();
    }



    @Watch("totalCount")
    updateWhenTotalCountChange() {
        if (this.totalCount === 0 || this.lastTotalCount == this.totalCount) return;
        this.reInitialPager();
    }

    @Watch("customizePageSize")
    reRenderWhenCustomizePageSizeChange() {
        this.reRenderWhenPageSizeChange(this.customizePageSize);
    }


    reRenderWhenPageSizeChange(selectPageSize: number) {
        console.log("Page Size change from inside" + selectPageSize);
        if (selectPageSize) {
            this.pageSize = selectPageSize;
        }
        if (this.pageSize === 0 || this.lastPageSize == this.pageSize) return;
        this.reInitialPager();
        this.inputPage = this.pager.activedPage;
        if (this.keyId) {
            this.$emit("reloadContent", ({ 'currentPage': this.pager.activedPage, 'pageSize': this.pageSize, keyId: this.keyId }));

        } else {
            this.$emit("reloadContent", ({ 'currentPage': this.pager.activedPage, 'pageSize': this.pageSize }));

        }

    }



    private loadPage(page: number) {
        this.changeActivePage(page);
    }

    loadFirstPage() {
        this.changeActivePage(1);
    }

    loadPrevPage() {
        this.changeActivePage(this.pager.activedPage - 1 > 0 ? this.pager.activedPage - 1 : 1);
    }

    loadNextPage() {
        this.changeActivePage(this.pager.activedPage + 1 > this.pager.totalPage ? this.pager.totalPage : this.pager.activedPage + 1);
    }

    loadLastPage() {
        this.changeActivePage(this.pager.totalPage);
    }



    private changeActivePage(page: number) {
        if (this.pager.activedPage == page)
            return;
        this.pager.activedPage = page;
        this.inputPage = page;
        this.pages = this.loadPager(this.pager.activedPage);
        if (this.keyId) {
            this.$emit("reloadContent", ({ 'currentPage': page, 'pageSize': this.pageSize, 'totalCount': this.totalCount, keyId: this.keyId }));

        } else {
            this.$emit("reloadContent", ({ 'currentPage': page, 'pageSize': this.pageSize, 'totalCount': this.totalCount }));

        }

    }

    private initialPager() {
        this.pager.pagerShowCount = this.pagerShowCount;
        this.pager.halfPagerShowCount = Math.floor(this.pager.pagerShowCount / 2);
        this.pager.totalPage = Math.ceil(this.totalCount / this.pageSize);
        this.lastTotalCount = this.totalCount;
        this.lastPageSize = this.pageSize;
    }

    loadDefaultPager() {
        this.pager.activedPage = 1;
        this.pages = this.loadPager(this.pager.activedPage);
    }

    reInitialPager() {
        this.initialPager();
        if (this.stay) {
            if (this.pager.activedPage > this.pager.totalPage) {
                this.pager.activedPage = 1;
            }
            let reActivePage = this.pager.activedPage;
            this.pager.activedPage = -1;
            this.changeActivePage(reActivePage);
        } else {
            this.pager.activedPage = 1;
            this.pages = this.loadPager(this.pager.activedPage);
            //  comment out this since it will cause the content load twice.
            //  this.$emit("reloadContent", ({'currentPage': this.pager.activedPage, 'pageSize': this.pageSize, 'totalCount': this.totalCount}));
        }
    }

    setupPageSizeOptions() {
        let defaultPageSizeOptions = [1, 10, 20, 50, 100, 300, 500, 1000];
        defaultPageSizeOptions.push(this.pageSize);
        this.pageSizeOptions = sortBy(uniq(defaultPageSizeOptions));
    }

    loadPager(activedPage: number) {
        let halfPagerShowCount = this.pager.halfPagerShowCount;
        let totalPage = this.pager.totalPage;
        let pagerShowCount = this.pager.pagerShowCount;

        let pages = [];
        let low = (activedPage - halfPagerShowCount <= 1) ? 1 : activedPage + halfPagerShowCount <= totalPage ? activedPage - halfPagerShowCount : totalPage - (pagerShowCount - 1) <= 1 ? 1 : totalPage - (pagerShowCount - 1);
        let high = low + (pagerShowCount - 1) <= totalPage ? low + (pagerShowCount - 1) : totalPage;
        for (let i = low; i <= high; i++) {
            if (i === activedPage) {
                pages.push({ "number": i, "active": true });
            } else {
                pages.push({ "number": i, "active": false });
            }
        }
        this.pager.low = low;
        this.pager.high = high;
        return pages;
    }

}