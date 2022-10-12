import Datepicker from 'vue2-datepicker';
import WiseVue from "@shared/wise-vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./date-range.vue";
import ElementSelect from "../element-select/element-select";
import util from "@shared/util";

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

    @Prop({ default: '' })
    modeType!: string;

    @Prop({ default: false })
    limit30DayRange!: boolean;

    highlight: any = {};
    disabledDates: any = {};
    opendate: any;
    index: number = 0;
    // 'Last month', 'Last year', 'Week to date', 'Month to date', 'Year to date', '2nd Quarter (2018)', '1nd Quarter (2018)', '4th Quarter (2017)', '3rd Quarter (2017)'
    dateRanges: Array<string> = ['Today', 'Yesterday', 'Tomorrow', 'Next 7 days', 'Last 7 days', 'Next 30 days', 'Last 30 days', 'Last 60 days', 'Last 90 days'];
    dateRange: any = { range: null, timeFrom: null, timeTo: null };
    show: boolean = false;
    orginRange: any = null;
    endDate: string = "";
    minDate: string = "";

    private setDate(range: string) {
        this.$nextTick(() => {
            this.dateRange.range = range;
            let currentDate = new Date();
            switch (range) {
                case 'Today': currentDate.setTime(currentDate.getTime()); break;
                case 'Yesterday': currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000); break;
                case 'Tomorrow': currentDate.setTime(currentDate.getTime() + 24 * 60 * 60 * 1000); break;
                case 'Next 7 days': currentDate.setTime(currentDate.getTime() + 24 * 60 * 60 * 1000 * 6); break;
                case 'Last 7 days': currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000 * 6); break;
                case 'Next 30 days': currentDate.setTime(currentDate.getTime() + 24 * 60 * 60 * 1000 * 29); break;
                case 'Last 30 days': currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000 * 29); break;
                case 'Last 60 days': currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000 * 59); break;
                case 'Last 90 days': currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000 * 89); break;
            }
            if (range == "Today" || range == "Yesterday" || range == "Last 7 days" || range == "Last 30 days" || range == "Last 60 days" || range == "Last 90 days") {
                if (range == "Yesterday") {
                    this.dateRange.timeTo = this.dateRange.timeFrom = util.fomateDateYYYYDDMM(currentDate);
                } else {
                    this.dateRange.timeTo = util.fomateDateYYYYDDMM(new Date());
                    this.dateRange.timeFrom = util.fomateDateYYYYDDMM(currentDate);
                }

            } else if (range == "Tomorrow" || range == "Next 7 days" || range == "Next 30 days") {
                if (range == "Tomorrow") {
                    this.dateRange.timeFrom = this.dateRange.timeTo = util.fomateDateYYYYDDMM(currentDate);
                } else {
                    this.dateRange.timeTo = util.fomateDateYYYYDDMM(currentDate);
                    this.dateRange.timeFrom = util.fomateDateYYYYDDMM(new Date()) + "T " + (++this.index);
                }

            }
        });

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
        if (this.defaultTimeFrom) {
            let splitDate = this.defaultTimeFrom.split('T');
            this.dateRange.timeFrom = splitDate[0];
        } else {
            this.dateRange.timeFrom = null;
        }
        if (this.defaultTimeTo) {
            let splitDate = this.defaultTimeTo.split('T');
            this.dateRange.timeTo = splitDate[0];
        } else {
            this.dateRange.timeTo = null;
        }
        this.transforDateRange();
    }

    // @Watch("defaultTimeTo")
    // timeToUpdate() {
    //     if (this.defaultTimeTo) {
    //         let splitDate = this.defaultTimeTo.split('T');
    //         this.dateRange.timeTo = splitDate[0];
    //     } else {
    //         this.dateRange.timeTo = null;
    //     }

    //     this.transforDateRange();
    // }


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
        if (this.limit30DayRange) {
            this.dateRanges = ['Today', 'Yesterday', 'Tomorrow', 'Next 7 days', 'Last 7 days', 'Next 30 days', 'Last 30 days'];
        }
    }


    formatDates(date: string) {
        if (!date) return;
        let splitDate = date.split('-');
        return splitDate[1] + "-" + splitDate[2] + "-" + splitDate[0];
    }

    apply() {
        this.show = !this.show;
        this.emitParent();
    }

    private emitParent() {
        this.orginRange = this.dateRange.range;
        let returnDateRange: any = {};
        if (this.dateRange.timeFrom) {
            returnDateRange.timeFrom = this.dateRange.timeFrom + "T00:00:00";
        }
        if (this.dateRange.timeTo) {
            returnDateRange.timeTo = this.dateRange.timeTo + "T23:59:59.999";
        }
        if (!this.dateRange.timeFrom && !this.dateRange.timeTo) {
            this.dateRange.range = null;
            this.orginRange = null;
        }
        this.$emit("selectDateRange", returnDateRange);
    }

    removeRange() {
        this.dateRange = {};
        this.dateRange.range = null;
        this.endDate = "";
        this.minDate = "";
    }


    private transforDateRange() {
        if (this.dateRange.timeTo && this.dateRange.timeFrom) {
            if (util.fomateDateYYYYDDMM(new Date()) === this.dateRange.timeTo) {
                let betweenDate = Math.floor((new Date(this.dateRange.timeTo).getTime() - new Date(this.dateRange.timeFrom).getTime()) / (24 * 60 * 60 * 1000));
                switch (betweenDate) {
                    case 0: this.dateRange.range = 'Today'; break;
                    case 6: this.dateRange.range = 'Last 7 days'; break;
                    case 29: this.dateRange.range = 'Last 30 days'; break;
                    case 59: this.dateRange.range = 'Last 60 days'; break;
                    case 89: this.dateRange.range = 'Last 90 days'; break;
                    default: this.formateRangeValue(); break;
                }
            } else if (util.fomateDateYYYYDDMM(new Date()) === this.dateRange.timeFrom) {
                let betweenDate = Math.floor((new Date(this.dateRange.timeTo).getTime() - new Date(this.dateRange.timeFrom).getTime()) / (24 * 60 * 60 * 1000));
                switch (betweenDate) {
                    case 6: this.dateRange.range = 'Next 7 days'; break;
                    case 29: this.dateRange.range = 'Next 30 days'; break;
                    default: this.formateRangeValue(); break;
                }
            }
            else if (this.dateRange.timeTo === this.dateRange.timeFrom) {
                let betweenDate = Math.floor(((new Date()).getTime() - new Date(this.dateRange.timeFrom).getTime()) / (24 * 60 * 60 * 1000));
                if (betweenDate === 1) {
                    this.dateRange.range = 'Yesterday';
                } else if (betweenDate === -1) {
                    this.dateRange.range = 'Tomorrow';
                }
                else {
                    this.formateRangeValue();
                }
            } else {
                this.formateRangeValue();
            }
        } else {
            this.formateRangeValue();
        }
    }

    private formateRangeValue() {
        let mouths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let timeTo = "", timeFrom = "";
        if (this.dateRange.timeTo) {
            let splitDate = this.dateRange.timeTo.split('-');
            let monthNum = parseInt(splitDate[1]) - 1;
            timeTo = mouths[monthNum] + " " + splitDate[2] + "," + splitDate[0];
        }
        if (this.dateRange.timeFrom) {
            let splitDate = this.dateRange.timeFrom.split('-');
            let monthNum = parseInt(splitDate[1]) - 1;
            timeFrom = mouths[monthNum] + " " + splitDate[2] + "," + splitDate[0];
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

    // formatDates 2019-05-18
    dateOneSelect(val: any) {
        if (this.modeType === 'MTD') {
            this.dateRange.timeTo = val;
            if (!this.dateRange.timeTo) return;
            let splitDate = this.dateRange.timeTo.split('-');
            this.dateRange.timeFrom = splitDate[0] + "-" + splitDate[1] + "-01";
        } else {
            this.dateRange.timeFrom = val;
            if (this.dateRange.timeFrom && this.limit30DayRange) {
                let currentDate = new Date(this.dateRange.timeFrom);
                currentDate.setTime(currentDate.getTime() + 24 * 60 * 60 * 1000 * 29);
                this.endDate = util.fomateDateYYYYDDMM(currentDate);
                currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000 * 29 * 2);
                this.minDate = util.fomateDateYYYYDDMM(currentDate);
                if (this.dateRange.timeTo && this.dateRange.timeTo > this.endDate) {
                    this.dateRange.timeTo = this.endDate;
                }
            }
        }
        this.transforDateRange();
    }

    dateTwoSelect(val: any) {
        this.dateRange.timeTo = val;
        this.transforDateRange();
    }

}



