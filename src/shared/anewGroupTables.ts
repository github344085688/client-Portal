import { map, find, groupBy, forEach, keys } from "lodash-es";
import util from './util';
class AnewGroupTables {
    public funAnewGroup(viewDatas: any, layoutDetail: any, callbackGroupDetail: any) {
        let groupsHeads = map(layoutDetail.groupLIst, 'value');
        callbackGroupDetail.groupDatas = groupBy(viewDatas, (item: any) => {
            let ret = '';
            forEach(groupsHeads, (head: any) => {
                ret += `${head} : ${item[head]} ; `;
            });
            return ret;
        });
        callbackGroupDetail.groupsHeads = keys(callbackGroupDetail.groupDatas);
        this.sortItemSequence(layoutDetail, viewDatas, callbackGroupDetail);
    }

    private   sortSortFieldBy(lists: Array<any>, sortFieldBy: string, sortSequence: number) {
        util.sortBy(lists, sortFieldBy, sortSequence);
    }

    private sortItemSequence(layoutList: any, viewDatas: any, callbackGroupDetail: any) {
        let sortItemSequence = find(layoutList.groupLIst, 'sort');
        if (sortItemSequence) {
            callbackGroupDetail.sortHead = sortItemSequence.value;
            callbackGroupDetail.sortSort = sortItemSequence.sort;
            this.sortSortFieldBy(viewDatas, sortItemSequence.value, sortItemSequence.sort);
        } else {
            callbackGroupDetail.sortHead = null;
        }
    }
}
export default new AnewGroupTables();