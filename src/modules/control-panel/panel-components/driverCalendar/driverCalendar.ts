import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import template from "./driverCalendar.vue";
import EleCalendar from 'ele-calendar';
import { forEach } from 'lodash';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import ElementSelect from '@components/element-select/element-select';
import 'ele-calendar/dist/vue-calendar.css';
import '@assets/css/panel.scss';
const moment = extendMoment(Moment);

@Component({
    mixins: [template],
    name: 'driverCalendar',
    components: {
        EleCalendar,
        ElementSelect,
    }
})
export default class DriverCalendar extends Vue {
    dateValue: any = '';
    timeValue: any = '';
    date: any = '';
    driverDateList: any = [];
    prop: any = 'date';
    driverName: string = '';
    driverDateData: any = [];

    initDriverDate() {
        this.driverDateList = [];
        if (!this.driverDateData) {
            this.driverDateList = [];
        } else {
            forEach(this.driverDateData, (o: any) => {
                if (o.trip_end_date) {
                    this.driverDateList = this.driverDateList.concat(this.getTimeRangArray(o.trip_start_date, o.trip_end_date));
                } else {
                    this.driverDateList = this.driverDateList.concat([{date: o.trip_start_date, status: 'onDuty'}]);
                }
            });
        }
    }

    daySelect() {
        return false;
    }

    getTimeRangArray(start: any, end: any) {
        const startTime = moment(start, 'YYYY-MM-DD');
        const endTime   = moment(end, 'YYYY-MM-DD');
        const range = moment.range(startTime, endTime);
        let arr = Array.from(range.by('days')).map(m => m.format('YYYY-MM-DD'));
        let dateArr: any = [];
        forEach(arr, (o: any) => {
            dateArr.push(
                {date: o, status: 'onDuty'}
            );
        });
        return dateArr;
    }

    renderContent (h: any, parmas: any) {
        const loop = (data: any) => {
            return data.defvalue.value.status === 'onDuty' ? h('div', {
                style: {
                    background: '#39f',
                    height: '100%',
                    color: '#fff'
                }
            }, data.defvalue.text) : h('div', [h('div', data.defvalue.text)]);
        };
        return h('div', [loop(parmas)]);
    }

    get driverInfo() {
        return this.$store.state.driverCalendarInfo;
    }

    @Watch('driverInfo', {
        deep: true
    })
    getDriverInfo(data: any) {
        this.driverName = data.driver_firstname + ', ' + data.driver_lastname;
        this.driverDateData = data.dispatchs;
        this.initDriverDate();
    }

    mounted() {
        // this.init();
    }
}