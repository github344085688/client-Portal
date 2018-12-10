import WiseVue from "../../shared/wise-vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./scroll-pager.vue";
import session from '../../shared/session';
import errorHanlder from '../../shared/error-handler';
import ElementSelect from "../element-select/element-select";


@Component({
    mixins: [template],
    name: 'scroll-pager',
    components: {
        ElementSelect
    }
})
export default class ScrollPager extends WiseVue {



    @Prop({ default: 10 })
    customizePageSize!: number;

    @Prop({ default: 0 })
    totalCount!: number;

    @Prop({ default: false })
    stay!: boolean;

    @Prop({ default: false })
    loading!: boolean;

    pager: any = { totalPage: 0, activedPage: 0 };
    lastTotalCount = 0;
    lastPageSize = 0;
    pageSize = 0;

    mounted() {
        this.pageSize = this.customizePageSize;
        this.initialPager();
        this.loadDefaultPager();
        window.addEventListener('scroll', this.scrollDownToLoadMore);
    }


    destroyed() {
        window.removeEventListener('scroll', this.scrollDownToLoadMore);
    }

    private scrollDownToLoadMore() {
        if (window.scrollY + document.body.offsetHeight > document.body.scrollHeight * 0.9) {
            this.loadMore();
        }
    }

    @Watch("totalCount")
    updateWhenTotalCountChange() {
        if (this.totalCount === 0 || this.lastTotalCount == this.totalCount) return;
        this.reInitialPager();
    }

    @Watch("customizePageSize")
    reRenderWhenCustomizePageSizeChange() {
        this.pageSize = this.customizePageSize;
        if (this.pageSize === 0 || this.lastPageSize == this.pageSize) return;
        this.reInitialPager();
    }

    @Watch("loading")
    updateLoading() {
        console.log(this.loading);
    }

    loadMore() {
        console.log(this.loading);
        if (!this.loading) {
            this.changeActivePage(this.pager.activedPage + 1 > this.pager.totalPage ? this.pager.totalPage : this.pager.activedPage + 1);
        }
    }

    changeActivePage(page: number) {
        if (this.pager.activedPage == page) {
            return;
        }
        this.pager.activedPage = page;
        this.$emit('reloadContent', { 'currentPage': page ? page : 1, 'pageSize': this.pageSize });

    }

    initialPager() {
        this.pager.totalPage = Math.ceil(this.totalCount / this.pageSize);
        this.lastTotalCount = this.totalCount;
        this.lastPageSize = this.pageSize;
    }

    loadDefaultPager() {
        this.pager.activedPage = 1;
    }

    reInitialPager() {
        this.initialPager();
        if (this.stay) {
            let reActivePage = this.pager.activedPage;
            this.pager.activedPage = -1;
            this.changeActivePage(reActivePage);
        } else {
            this.loadDefaultPager();
        }
    }

}