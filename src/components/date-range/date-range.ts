import Datepicker from 'vuejs-datepicker';
import WiseVue from "../../shared/wise-vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./date-range.vue";
import ElementSelect from "../element-select/element-select";
import util from "../../shared/util";

@Component({
    mixins: [template],
    name: 'date-range',
    components: {
        ElementSelect
    }
})

export default class DateRange extends WiseVue {

    @Prop({ default: '' })
    defaultTimeFrom!: string;

    @Prop({ default: '' })
    defaultTimeTo!: string;

    highlight: any = {};
    disabledDates: any = {};
    opendate: any;
    // 'Last month', 'Last year', 'Week to date', 'Month to date', 'Year to date', '2nd Quarter (2018)', '1nd Quarter (2018)', '4th Quarter (2017)', '3rd Quarter (2017)'
    dateRanges: Array<string> = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Last 90 days'];
    dateRange: any = { range: null, timeFrom: null, timeTo: null };
    show: boolean = false;
    orginRange: any = null;
    private setDate(range: string) {

        this.dateRange.timeTo = util.fomateEndDate(new Date());
        this.dateRange.range = range;
        let currentDate = new Date();
        switch (range) {
            case 'Today': currentDate.setTime(currentDate.getTime()); break;
            case 'Yesterday': currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000); this.dateRange.timeTo = util.fomateEndDate(currentDate); break;
            case 'Last 7 days': currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000 * 6); break;
            case 'Last 30 days': currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000 * 29); break;
            case 'Last 90 days': currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000 * 89); break;
        }
        this.dateRange.timeFrom = util.fomateStartDate(currentDate);
    }

    selectRange(payload: any) {
        this.setDate(payload);
    }

    mounted() {
        if (!this.defaultTimeFrom && !this.defaultTimeTo) {
            this.dateRange.range = null;
        }
    }

    @Watch("defaultTimeFrom")
    timeFromUpdate() {
        this.dateRange.timeFrom = this.defaultTimeFrom;
        this.transforDateRange();
    }

    @Watch("defaultTimeTo")
    timeToUpdate() {
        this.dateRange.timeTo = this.defaultTimeTo;
        this.transforDateRange();
    }


    dateRangeShow() {
        this.show = !this.show;
    }

    cancel() {
        this.show = !this.show;
    }

    created() {
        let cxt = this;
        document.addEventListener('click', (e: any) => {
            if (!this.$el.contains(e.target)) {
              if (this.show) {
                this.show = false;
                if (cxt.orginRange != cxt.dateRange.range) {
                    cxt.emitParent();
                }
              }
            }
        });
    }


    formatDates(date: string) {
        if (!date) return;
        return util.fomateDateDDMMYYYY(new Date(date));
    }

    apply() {
        this.show = !this.show;
        this.emitParent();
    }

    private emitParent() {
        this.orginRange = this.dateRange.range;
        if (this.dateRange.timeFrom) {
            this.dateRange.timeFrom = util.fomateStartDate(new Date(this.dateRange.timeFrom));
        }
        if (this.dateRange.timeTo) {
            this.dateRange.timeTo = util.fomateEndDate(new Date(this.dateRange.timeTo));
        }
        if (!this.dateRange.timeFrom && !this.dateRange.timeTo) {
            this.dateRange.range = null;
            this.orginRange = null;
        }
        this.$emit("selectDateRange", this.dateRange);
    }

    removeRange() {
        this.dateRange = {};
        this.dateRange.range = null;
    }


    private transforDateRange() {
        if (this.dateRange.timeTo && this.dateRange.timeFrom) {
            if (util.fomateEndDate(new Date()) === util.fomateEndDate(new Date(this.dateRange.timeTo))) {
                let betweenDate = Math.floor((new Date(this.dateRange.timeTo).getTime() - new Date(this.dateRange.timeFrom).getTime()) / (24 * 60 * 60 * 1000));
                switch (betweenDate) {
                    case 0: this.dateRange.range = 'Today'; break;
                    case 6: this.dateRange.range = 'Last 7 days'; break;
                    case 29: this.dateRange.range = 'Last 30 days'; break;
                    case 89: this.dateRange.range = 'Last 90 days'; break;
                    default: this.formateRangeValue(); break;
                }
            } else if (util.fomateDateDDMMYYYY(new Date(this.dateRange.timeTo)) === util.fomateDateDDMMYYYY(new Date((this.dateRange.timeFrom)))) {
                this.dateRange.range = 'Yesterday';
            } else {
                this.formateRangeValue();
            }
        } else {
            this.formateRangeValue();
        }
    }

    private formateRangeValue() {
        let mouths = ["January", "February", "March", "April", "may", "June", "July", "August", "September", "October", "November", "December"];
        let timeTo = "", timeFrom = "";
        if (this.dateRange.timeTo) {
            let data = new Date(this.dateRange.timeTo);
            let monthNum = data.getMonth();
            timeTo = mouths[monthNum] + " " + data.getDate() + "," + data.getFullYear();
        }
        if (this.dateRange.timeFrom) {
            let data = new Date(this.dateRange.timeFrom);
            let monthNum = data.getMonth();
            timeFrom = mouths[monthNum] + " " + data.getDate() + "," + data.getFullYear();
        }
        this.dateRange.range = timeFrom + ' - ' + timeTo;
        if (this.dateRange.range === ' - ') {
            this.dateRange.range = null;
        }
        this.dateRange = Object.assign({}, this.dateRange);
    }


    datepickerSetUp: any = {
        startOpen: true,
        inline: true,
        showActionButtons: false,
        showShortcutsMenuTrigger: false
    };

    transforToRangeTxt(val: any) {
        if (val === ' - ' || !val) {
            return 'Select Time Range';
        } else {
            return val;
        }

    }

    dateOneSelect(val: any) {
        this.dateRange.timeFrom = val;
        this.transforDateRange();
    }

    dateTwoSelect(val: any) {
        this.dateRange.timeTo = val;
        this.transforDateRange();
    }

}



