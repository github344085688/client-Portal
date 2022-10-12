import { split, trim, map, difference, constant, sum, forEach } from 'lodash-es';
import { Observable } from 'rxjs/Observable';
import { MessageBox, Message } from 'element-ui';

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
        let contentDisposition = headers['content-disposition'] || "";
        if (contentDisposition.match(/CSV/g) || contentDisposition.match(/csv/g)) {
            filename = filename.replace("xlsx", "csv");
        }
        let blob = new Blob([res.data], {
            type: contentType
        });
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = objectUrl;
        filename = this.addTimeForFilename(filename);
        link.setAttribute('download', filename);

        document.body.appendChild(link);
        link.click();

    },

    addTimeForFilename(fileName: string) {
        let addTimeForFilename = fileName.split('.');
        let format = addTimeForFilename[addTimeForFilename.length - 1];
        addTimeForFilename.pop();
        let refileName = addTimeForFilename.join("");
        let YYMMDDHHMMSS = this.getCurrentYYMMDDHHMMSS();
        return refileName + "(" + YYMMDDHHMMSS + ")." + format;
    },

    getCurrentYYMMDDHHMMSS() {
        let date: any = new Date();
        let YY = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let HH = date.getHours();
        let MM = date.getMinutes();

        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        HH = HH < 10 ? "0" + HH : HH;
        MM = MM < 10 ? "0" + MM : MM;
        let YYMMDDHHMMSS = YY + "" + month + "" + day + "" + HH + "" + MM ;
        return YYMMDDHHMMSS;
    },

    fomateCurrentMMFirstDay(date: any) {
        let mouthAndDay = this.getMouthAndDay(date);
        return date.getFullYear() + "-" + mouthAndDay.month + "-01" + "T00:00:00";
    },

    fomateStartDate(date: any) {
        let mouthAndDay = this.getMouthAndDay(date);
        return date.getFullYear() + "-" + mouthAndDay.month + "-" + mouthAndDay.day + "T00:00:00";
    },

    fomateEndDate(date: any) {
        let mouthAndDay = this.getMouthAndDay(date);
        return date.getFullYear() + "-" + mouthAndDay.month + "-" + mouthAndDay.day + "T23:59:59.999";
    },

    fomateDateDDMMYYYY(date: any) {
        let mouthAndDay = this.getMouthAndDay(date);
        return mouthAndDay.month + "-" + mouthAndDay.day + "-" + date.getFullYear();
    },
    fomateDateYYYYDDMM(date: any) {
        let mouthAndDay = this.getMouthAndDay(date);
        return date.getFullYear() + "-" + mouthAndDay.month + "-" + mouthAndDay.day;
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
    },

    deleteMessageBox(message: string, title: string, fn: Function) {
        MessageBox.confirm(message, title, {
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            customClass: 'clien-portal-box',
            cancelButtonClass: 'cancel-class',
            confirmButtonClass: 'delete-class',
            type: 'warning'
        }).then(() => {
            fn();
        });
    },
    popUpSucceedMessage(message: string) {
        Message.success(message);
    },
    buildItemDownloadUrl(fileId: string) {
        let fileDownloadUrl = "/shared/file-app/file-download/" + fileId;
        return fileDownloadUrl;
    },
    buildPackingListDownloadUrl(orderId: string) {
        let fileDownloadUrl = "/report-center/outbound/packing-list/pdf/download/" + orderId ;
        return fileDownloadUrl;
    },
    popUpWarningMessage(message: string) {
        Message.warning(message);
    },

    judgeIfHasPermission(requiredPermissions: any, userPermissions: any) {
        if (isPermissionDisabled || !requiredPermissions) {
            return true;
        }
        if (!userPermissions) {
            return true;
        }
        let permissions = split(requiredPermissions, ",");
        requiredPermissions = map(permissions, trim);
        if (requiredPermissions.length == 0) {
            return true;
        } else if (difference(userPermissions, requiredPermissions).length >= userPermissions.length) {
            return false;
        } else {
            return true;
        }
    },

    sum(Lists: Array<any>, mapName: string) {
        return sum(map(Lists, (item) => {
            return Number(item[mapName]);
        }));
    },

    removeEmptyString(Lists: Array<any>) {
        forEach(Lists, function (object) {
            forEach(object, function (value, key) {
                if (value == "") {
                    delete object[key];
                }
            });
        });
    },

    itemDisplay(item: any) {
        let itemDisplayName: any = '';
        let itemSpec: any = {};
        let itemSpecTitle: any = '';
        if (!item) return;
        itemSpec = {};
        if (item.name) {
            itemSpec = item;
        } else if (item.itemSpecName) {
            itemSpec.name = item.itemSpecName;
            itemSpec.desc = item.itemSpecDesc;
            itemSpec.shortDescription = item.shortDescription;
        } else if (item.itemName) {
            itemSpec.name = item.itemName;
            itemSpec.desc = item.itemDesc;
            itemSpec.shortDescription = item.shortDescription;
        }
        itemDisplayName = itemSpec.name;
        if (itemSpec.shortDescription && itemSpec.desc) {
            itemDisplayName = itemDisplayName + " (" + itemSpec.shortDescription + ")";
            itemSpecTitle = itemSpec.desc;
        } else if (itemSpec.shortDescription) {
            itemDisplayName = itemDisplayName + " (" + itemSpec.shortDescription + ")";
        } else if (itemSpec.desc) {
            itemDisplayName = itemDisplayName + " (" + itemSpec.desc + ")";
        }

        item.itemDisplayName = itemDisplayName;
        item.itemSpecTitle = itemSpecTitle;
    }


};
