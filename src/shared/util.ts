import { Subject } from 'rxjs/Subject';
import Vue from 'vue';
import { Observable } from 'rxjs/Observable';


export default {

    isSubject: (subject: any) => {
        return subject && (
            typeof subject.next === 'function' ||
            typeof subject.onNext === 'function'
        );
    },

    eventToObservable: function (el: any, evtName: Array<any> | string) {
        const evtNames = Array.isArray(evtName) ? evtName : [evtName];
        const obs$ = Observable.create((observer: any) => {
            const eventPairs = evtNames.map(name => {
                const callback = (msg: any) => observer.next({ name, msg });
                el.$on(name, callback);
                return { name, callback };
            });

            return () => {
                // Only remove the specific callback
                eventPairs.forEach(pair => el.$off(pair.name, pair.callback));
            };
        });
        return obs$;
    },
    exportFile(res: any, filename: any) {
        let octetStreamMime = 'application/octet-stream';
        let headers = res.headers;
        let contentType = headers['content-type'] || octetStreamMime;

        let blob = new Blob([res.data], {
            type: contentType
        });
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = objectUrl;
        link.setAttribute('download', filename);

        document.body.appendChild(link);
        link.click();

    },

    fomateStartDate(date: any) {
        let mouthAndDay = this.getMouthAndDay(date);
        return date.getFullYear() + "-" + mouthAndDay.month + "-" + mouthAndDay.day + " 00:00:00";
    },
    fomateEndDate(date: any) {
        let mouthAndDay = this.getMouthAndDay(date);
        return date.getFullYear() + "-" + mouthAndDay.month + "-" + mouthAndDay.day + " 23:59:59";
    },
    fomateDateDDMMYYYY(date: any) {
        let mouthAndDay = this.getMouthAndDay(date);
        return mouthAndDay.month + "-" + mouthAndDay.day + "-" + date.getFullYear();
    },

    getMouthAndDay(date: any) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        return { month: month, day: day };
    },

    sortBy(objects: Array<any>, sortByName: any, order: any) {

        let compare = (item1: any, item2: any) => {
            if (/[\u4E00-\u9FA5]/g.test(item1[sortByName])) {
                return (item1[sortByName]).localeCompare(item2[sortByName]);
            } else if (/^[0-9]+$/g.test(item1[sortByName]) && /^[0-9]+$/g.test(item2[sortByName])) {
                return parseInt(item1[sortByName]) < parseInt(item2[sortByName]) ? 1 : -1;
            } else {
                return item1[sortByName] < item2[sortByName] ? 1 : -1;
            }
        };
        if (order < 0) {
            compare = (item1: any, item2: any) => {
                if (/[\u4E00-\u9FA5]/g.test(item1[sortByName])) {
                    return (item2[sortByName]).localeCompare(item1[sortByName]);
                } else if (/^[0-9]+$/g.test(item1[sortByName]) && /^[0-9]+$/g.test(item2[sortByName])) {
                    return parseInt(item2[sortByName]) < parseInt(item1[sortByName]) ? 1 : -1;
                } else {
                    return item2[sortByName] < item1[sortByName] ? 1 : -1;
                }
            };
        }
        return objects.sort(compare);
    }
};
