
import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import ItemAutoComplete from "@components/itemspec-auto-complete/itemspec-auto-complete";
import FacilitySelect from "@components/facility-select/facility-select";
import ElementSelect from "@components/element-select/element-select";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import Pager from "@components/pager/pager";
import CustomerWiseVue from "@shared/customer-wise-vue";
import { Component, Watch } from "vue-property-decorator";
import util from "@shared/util";
import { forEach,  find, cloneDeep,  partition, flattenDeep , assign, map, uniq, compact, isEmpty  } from 'lodash-es';
import { Subject, Observable } from "rxjs";
import "rxjs/add/operator/debounceTime";
import tlp from "./receipt-entry.vue";
import MultipleDragAndDrop from "@components/multiple-drag-and-drop/multiple-drag-and-drop";
import OrganizationAutoComplete from "@components/organization-auto-complete/organization-auto-complete";
import PopUpWindows from "@components/pop-up-windows/pop-up-windows";
import SwitchButton from "@components/switch-button/switch-button";
import receiptService from "@services/receipt-service";
import organizationService from "@services/organization-service";
import fileService from "@services/file-service";
import itemService from "@services/item-service";
import ItemDisplay from "@components/item-display/item-display";
import DatePicker from 'vue2-datepicker';
import { ValidationProvider } from 'vee-validate';
@Component({
  mixins: [tlp],
  components: {
      OrganizationAutoComplete,
      PredefinedCustomerSelect,
      ElementSelect,
      FacilitySelect,
      Pager,
      WaittingBtn,
      MultipleDragAndDrop,
      SwitchButton,
      PopUpWindows,
      ItemAutoComplete,
      DatePicker,
      ValidationProvider,
      ItemDisplay
  },
    filters: {
        amDateFormat(value: any) {
            if (value.indexOf('T')) return value.replace('T', " ");
            else return value;
        }
    }
})
export default class ReceiptEntry extends CustomerWiseVue {

    facilityId: any = '';
    addReceipt: any = {
        poNo: ''
    };
    itemListTotal: any = null;
    itemListPallets: any = null;
    isCarrierDisabled: boolean = true;
    isTitleDisabled: boolean = true;
    isReset: any = {};
    containerSizeData: Array<any> = ["20'", "40'", "40'H", "45'", "flat bed", "box truck"];
    receiveType: Array<any> = ['Bulk Receiving', 'Regular Receiving'];
    receiptTypes: Array<any> = ['Regular Receipt', 'Title Transfer Receipt',  'Sales Return', 'RDN', 'Auto Process Receipt', 'Customer Transfer', 'Purchase Return'];
    selectItemListUoms: Array<any> = [];
    isSelectItemListUom: boolean = true;
    islistUomloading: boolean = false;
    addItem: any = {};
    itemLists: Array<any> = [];
    isAddItemPopup: boolean = false;
    popupTlitle: string = '';
    isEdit: boolean = false;
    isAttachment: boolean = false;
    isSubmit: boolean = false;
    editIndex: any = '';
    reportId: any = null;
    submitName: any = "Save Receipt";
    unitId: any = " ";
    cloneItemLists: Array<any> = [];
    showItemListIndex: any = '';
    removeItemLists: Array<any> = [];
    reportFileInfo: Array<any> = [];
    trailerSize = ["48'", "53'"];
    customerId:  any = '';
    disabledGoodsType:  any = false;
    isShowGoodsTypes:  any = true;

    @Watch('customerId')
    private watchCustomer(val: any) {
        if (val) {
            this.addReceipt.customerId = val;
            this._getCustomerReceiptTypes();
        }
    }

   async mounted() {
       document.addEventListener('click', (e: any) => this.showItemListIndex = -1);
       this.addReceipt.customerId = this.customerId;
       if ((<any>this).$parent.isHeavyLoad) {
           (<any>this).$parent.isHeavyLoad = false;
           let cloneDeepaddReceipt = cloneDeep(this.addReceipt);
           this.addReceipt = {};
           this.addReceipt.customerId = cloneDeepaddReceipt.customerId;
           this.addItem = {};
           return;
       }
       let route = this.$route;
       if (route.query && route.query.reportId) {
           this.reportId = route.query.reportId;
           await this.getReportInfo(this.reportId );
       }
    }

    private getReportInfo(reportId: any) {
        receiptService.getBamReceipt(reportId).subscribe(
            (res: any) => {
                this.submitName = "Update Receipt";
                this.addReceipt = res;
                let itemLines = res.itemLines;
                if (itemLines) {
                    this.itemLists = itemLines;
                    this.cloneItemLists = cloneDeep(itemLines);
                    forEach(this.itemLists, item => {
                        this.$set(item, 'ItemName', (item.itemSpecName + "( " + item.itemSpecDesc + " )"));
                        this.$set(item, 'state', 'new');
                        this.isShowDynamicFields[item.id] = false;
                    });
                    this.controlGoodsType();
                }
                this.getReceiptDynamicFields(this.addReceipt.customerId);
                this.$forceUpdate();
            },
            (err: any) => {
                this.error(err);
            }
        );

    }

    controlActionShow(index: any) {
        this.showItemListIndex = index;
    }

    onSelectCustomer(customer: any) {
        this.isCarrierDisabled = false;
        this.isTitleDisabled = false;
        this.isReset['customer'] = false;
        this.$set(this.isReset, 'title', true);
        this.$set(this.isReset, 'carrier', true);
        this.$delete(this.addReceipt, "carrierId");
        this.$delete(this.addReceipt, "titleId");
    }

    onSelectCarrier(customer: any) {
        this.isReset['carrier'] = false;
    }

    onSelectTitle(customer: any) {
        this.isReset['title'] = false;
    }

    onSelectFacility(facility: any) {
        this.$delete(this.addReceipt, "carrierId");
        this.$delete(this.addItem, "itemSpecId");
        this.$set(this.isReset, 'customer', true);
        this.$set(this.isReset, 'item', true);
    }

    unitChoose(unit: any) {
        this.$set(this.addItem, 'unit', unit);
    }

    onSelectItem(item: any) {
        this.$delete(this.addItem, 'unitId');
        this.isReset['item'] = false;
        this.isSelectItemListUom = true;
        this.islistUomloading = true;
        this.selectItemListUoms = [];
        this.addReceipt.listUom = '';
        this.$set(this.addItem, 'ItemName',  ( item.name + "( " + item.desc + " )"));
        this.$set(this.addItem, 'desc', item.desc);
        this.$set(this.addItem, 'filterItem', item);
        this.searchItemUnit(item.id);
    }

    searchItemUnit(itemSpecId: any) {
        itemService.searchItemUnit({itemSpecId: itemSpecId}).subscribe(
            (res: any)  => {
                let baseUnit = find(res.units, 'isBaseUnit');
                if (baseUnit && baseUnit.id) {
                    this.addItem.unitId = baseUnit.id;
                    this.addItem.unitName = baseUnit.name;
                }
                this.selectItemListUoms = res.units;
                this.isSelectItemListUom = false;
                this.islistUomloading = false;
            }
        );
    }

    onSubmitItem(scope: any) {
        this.$validator.validateAll(scope).then(
            res => {
                if (res) {
                    if (this.isEdit) {
                        this.itemLists.splice(this.editIndex, 1, this.addItem);
                        this.isAddItemPopup = false;
                        this.controlGoodsType();
                        return;
                    }
                    let existItem: any = {
                        itemSpecId: this.addItem.itemSpecId,
                        unitId: this.addItem.unitId
                    };
                    if (this.addItem.lotNo) existItem.lotNo = this.addItem.lotNo;
                    if (find(this.itemLists, existItem)) {
                        this.error('Duplicate ItemLine!');
                        return;
                    }
                    this.$set(this.addItem, 'state', 'new');
                    if (!this.addItem.id) this.addItem.createTimestamp = new Date().getTime();
                    util.removeEmptyString([this.addItem]);
                    this.itemLists.push(this.addItem);
                    this.controlGoodsType();
                    this._sumItemList();
                    this.isAddItemPopup = false;
                }
            }
        );
    }

    editItemList(item: any, index: any) {
        this.popupTlitle = 'Edit Item List';
        if (item) {
            this.addItem = cloneDeep(item);
            this.searchItemUnit(item.itemSpecId);
        }
        this.isAddItemPopup = true;
        this.isEdit = true;
        this.editIndex = index;
        this.showItemListIndex = -1;
    }

    removeItemList(item: any, index: any) {
        this.showItemListIndex = -1;
        this.popups({
            title: 'Delete Confirm ',
            content: 'Would you like to remove this order plan',
            cancel: 'No',
            confirm: 'Yes'
        }).then(
            (res: any) => {
                this.itemLists.splice(index, 1);
                this.removeItemLists.push(item);
                this._sumItemList();
                this.isEdit = false;
                this.controlGoodsType();
            }
        );
    }

    duplicateItemList(item: any) {
        this.addItem = cloneDeep(item);
        this.searchItemUnit(item.itemSpecId);
        this.$set(this.addItem, 'state', 'duplicate');
        this.$delete(this.addItem, "id");
        this.isAddItemPopup = true;
        this.isEdit = false;
        this.showItemListIndex = -1;
    }

    onSubmit(scope: any) {
        this.$validator.validateAll(scope).then(
            res => {
                let validateErrors = (<any> this).errors.items;
                if (validateErrors.length > 0) {
                    document.getElementsByName(validateErrors[0]['field'])[0].scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                        inline: "center"
                    });
                }
                if (res) {
                    let addReceipt = cloneDeep(this.addReceipt);
                    util.removeEmptyString(this.itemLists);
                    addReceipt.itemLines = cloneDeep(this.itemLists);
                    forEach(addReceipt.itemLines, itemList => {
                        this.$delete(itemList, 'state');
                    });
                    if (this.reportId) this.upDataReceipt(addReceipt, this.itemLists);
                    else this.createReceiptr(addReceipt, this.itemLists);
                }
            }
        );
    }


    private upDataReceipt (receipt: any, itemLines: any) {
        this.isSubmit = true;
        receiptService.upDataReceipt(this.reportId, receipt).subscribe(
            (res: any) => {
                this.succeed(`Inbound receipt ${this.reportId} update success.`);
                this.isSubmit = false;
                if (itemLines.length > 0) this.createOrUpdataOrderItemLine(res.id, itemLines);
                else this.getReportInfo(this.reportId );
                if (receipt.filesIds.length > 0) this.UpdataFile(receipt.filesIds, res.id);
                this.$forceUpdate();

            },
            (err: any) => {
                this.isSubmit = false;
                this.error(err);
            }
        );
    }

    private createReceiptr(receipt: any, itemLines: any) {
        this.isSubmit = true;
        receipt.source = "MANUAL";
        receiptService.createdReceipt(receipt).subscribe(
            (res: any) => {
                this.reportId = res.id;
                this.isSubmit = false;
                this.succeed(`Inbound receipt ${res.id} created.`);
                this.getReportInfo(this.reportId );
                if (receipt.filesIds.length > 0) this.UpdataFile(receipt.filesIds, res.id);
                this.$forceUpdate();

            },
            (err: any) => {
                this.isSubmit = false;
                this.error(err);
            }
        );
    }

    private UpdataFile(filesIds: any, receiptId: any) {
        let flattenDeepFilesIds = flattenDeep(filesIds);
        forEach(flattenDeepFilesIds, id => {
            let params = {
                fileId: id,
                tags: [receiptId]
            };
            fileService.fileRntry(params).subscribe(
                (res: any) => {
                    this.isSubmit = false;
                    this.$forceUpdate();
                    this.getReportInfo(this.reportId );
                },
                (err: any) => {
                    this.isSubmit = false;
                    this.error(err);
                }
            );
        });
    }


    private async createOrUpdataOrderItemLine(receiptId: any, itemLines: any) {
        let partitionItemListById = partition(itemLines, 'id');
        let upDataItemList = partitionItemListById[0];
        let createItemList = partitionItemListById[1];
        let removeItemList =  this.removeItemLists;
        let handlePromises: Array<any> = [];
        if (upDataItemList.length > 0) {
            forEach(upDataItemList, itemLine => {
                handlePromises.push(itemService.upDataReceiptItemLine(receiptId, itemLine).toPromise());
            });
        }
        if (createItemList.length > 0) {
            forEach(createItemList, itemLine => {
                handlePromises.push(itemService.createReceiptItemLine(receiptId, itemLine).toPromise());
            });
        }
        if (removeItemList.length > 0) {
            forEach(removeItemList, itemLine => {
                handlePromises.push(itemService.deleteReceiptItemLine(receiptId, itemLine.id).toPromise());
            });
        }
        await Promise.all(this.handlePromise(handlePromises))
            .then((res: any) => {
                forEach(res, request => {
                    if (request.err) this.error(request.err);
                });
            }, err => this.error(err));
        this.isSubmit = false;
        this.$forceUpdate();
        this.addItem = [];
        this.$forceUpdate();
        this.getReportInfo(this.reportId);
    }


    private handlePromise(promiseList: any) {
        return promiseList.map((promise: any) =>
            promise.then((res: any) => ({res}), (err: any) => ({err}))
        );
    }


    addItemList(item: any) {
        this.popupTlitle = 'Add Item List';
        this.isAddItemPopup = true;
        this.isEdit = false;
        this.addItem = {};
        if (this.addReceipt.goodsType) {
            this.$set(this.addItem, 'goodsType', cloneDeep(this.addReceipt.goodsType));
        }
    }

    emitCancel() {
        this.isAddItemPopup = false;
    }


    private _sumItemList() {
        this.itemListTotal = util.sum(this.itemLists, 'qty');
        this.itemListPallets = util.sum(this.itemLists, 'palletQty');
    }


    onAttachment() {
        this.isAttachment = !this.isAttachment;
    }

    selectChangedUom() {
        let unit = find(this.selectItemListUoms, {'id': this.addItem.unitId});
        this.addItem.unit = unit;
        this.addItem.unitId = unit.id;
        this.addItem.unitName = unit.name;
    }

    showDynamicFields: boolean = true;
    isShowDynamicFieldsEdit: any = {};
    isLoadingDynamicFields: any = {};
    dynamicFields: Array<any> = [];
    receiptItemLineDynamicFields: any = {};
    isShowDynamicFields: any = {};
    structureUpdataDynamicFields: any = {};
    isshowItemListDynamicFieldIndex: any = -1;
    isEditItemListDynamicFields: boolean = false;
    isupdateItemLineDynamicFields: boolean = false;
    updataItemListDynamicFields: any = {};
    isLoadingUpdateStructureDynamicFields: boolean = false;
    ItemLineDynamicFields: any = {
        "dynTxtPropertyValue01": "Dynamic Text Property 01", "dynTxtPropertyValue02": "Dynamic Text Property 02",
        "dynTxtPropertyValue03": "Dynamic Text Property 03", "dynTxtPropertyValue04": "Dynamic Text Property 04",
        "dynTxtPropertyValue05": "Dynamic Text Property 05", "dynTxtPropertyValue06": "Dynamic Text Property 06",
        "dynTxtPropertyValue07": "Dynamic Text Property 07", "dynTxtPropertyValue08": "Dynamic Text Property 08",
        "dynTxtPropertyValue09": "Dynamic Text Property 09", "dynTxtPropertyValue10": "Dynamic Text Property 10",
        "dynTxtPropertyValue11": "Dynamic Text Property 11", "dynTxtPropertyValue12": "Dynamic Text Property 12",
        "dynTxtPropertyValue13": "Dynamic Text Property 13", "dynTxtPropertyValue14": "Dynamic Text Property 14",
        "dynTxtPropertyValue15": "Dynamic Text Property 15", "dynTxtPropertyValue16": "Dynamic Text Property 16",
        "dynTxtPropertyValue17": "Dynamic Text Property 17", "dynTxtPropertyValue18": "Dynamic Text Property 18",
        "dynTxtPropertyValue19": "Dynamic Text Property 19", "dynTxtPropertyValue20": "Dynamic Text Property 20",
        "dynDatePropertyValue01": "Dynamic Date Property 01", "dynDatePropertyValue02": "Dynamic Date Property 02",
        "dynDatePropertyValue03": "Dynamic Date Property 03", "dynDatePropertyValue04": "Dynamic Date Property 04",
        "dynDatePropertyValue05": "Dynamic Date Property 05"
    };

    onDynamicFields() {
        this.showDynamicFields = !this.showDynamicFields;
    }

    updateDynamicFields(dynamicFields: any) {
        this.isLoadingDynamicFields[this.reportId] = true;
        let params: any = {
            id: this.reportId,
            dynamicFields: dynamicFields
        };
        receiptService.updateReceipt(params).subscribe(
            (res: any) => {
                this.isLoadingDynamicFields[this.reportId] = false;
                this.isShowDynamicFieldsEdit[this.reportId] = false;
            },
            (err: any) => {
                this.isLoadingDynamicFields[this.reportId] = false;
                this.error(err);
            }
        );
    }

    getReceiptDynamicFields(customerId: string) {
        organizationService.getCustomerByOrgId(customerId).subscribe(
                (res: any) => {
                    this.dynamicFields = res.receiptDynamicFields;
                    this.receiptItemLineDynamicFields = res.receiptItemLineDynamicFields;
                    forEach(this.dynamicFields, (field, key) => {
                        if (this.addReceipt.dynamicFields[key]) this.$set(this.structureUpdataDynamicFields, key, this.addReceipt.dynamicFields[key]);
                    });
                    this.isEditItemListDynamicFields = false;
                    this.$forceUpdate();

                },
                (err: any) => {
                    this.isLoadingDynamicFields[this.reportId] = false;
                    this.error(err);
                }
            );
    }


    onShowDynamicFields(index: any, itemLine: any, receiptItemLineDynamicFields: any) {
        this.isEditItemListDynamicFields = false;
        if (this.isshowItemListDynamicFieldIndex == index) this.isshowItemListDynamicFieldIndex = -1;
        else {
            this.isshowItemListDynamicFieldIndex = index;
        }
        if (!itemLine.dynamicFields) {
            forEach(receiptItemLineDynamicFields, (dynamicField: any, key: any) => {
                this.$set(this.updataItemListDynamicFields, key, '');
            });
        }
        else this.updataItemListDynamicFields = itemLine.dynamicFields;

    }

    updateStructureDynamicFields() {
        this.isLoadingUpdateStructureDynamicFields = true;
        let update: any = {dynamicFields: {}, id: this.addReceipt.id};
        forEach(this.structureUpdataDynamicFields, (field, key) => {
            if (field) update.dynamicFields[key] = field;
        });
        receiptService.updateReceipt(update).subscribe(
            (res: any) => {
                this.isLoadingUpdateStructureDynamicFields = false;
                this.succeed('Update successful.');
                this.getReportInfo(this.reportId);
            },
            (err: any) => {
                this.isLoadingUpdateStructureDynamicFields = false;
                this.error(err);
            }
        );
    }

    updateItemLineDynamicFields(itemLine: any) {
        this.isupdateItemLineDynamicFields = true;
        itemLine.dynamicFields = assign(itemLine.dynamicFields, this.updataItemListDynamicFields);
        itemService.upDataReceiptItemLine(this.reportId, itemLine)
            .subscribe(
                (res: any) => {
                    this.isupdateItemLineDynamicFields = false;
                    this.succeed('Update successful.');
                    this.getReportInfo(this.reportId);
                },
                (err: any) => {
                    this.isupdateItemLineDynamicFields = false;
                    this.error(err);
                }
            );
    }

    onSelectSupplier(supplier: any) {
        this.addItem.supplierName = supplier ? supplier.name : "";
    }


    private _getCustomerReceiptTypes() {
        let receiptTypes = cloneDeep( this.receiptTypes);
        this.receiptTypes = [];
        this.$delete(this.addReceipt, 'receiptType');
        organizationService.getCustomerByOrgId(this.addReceipt.customerId)
            .subscribe(
                (res: any) => {
                    this.receiptTypes = !isEmpty(res.supportedReceiptTypesOnClientPortal) ? res.supportedReceiptTypesOnClientPortal : receiptTypes;
                },
                (err: any) => {
                    this.error(err);
                }
            );
    }

    private controlGoodsType() {
        let itemLinesGoodsType = compact(uniq(map(this.itemLists, "goodsType")));
        if (itemLinesGoodsType.length === 1) {
            this.addReceipt.goodsType = itemLinesGoodsType[0];
            this.disabledGoodsType = true;
            this.isShowGoodsTypes = true;
        }
        if (this.itemLists.length === 0) {
            this.disabledGoodsType = false;
            this.isShowGoodsTypes = true;
            this.addReceipt.goodsType = null;
        }
        if (itemLinesGoodsType.length > 1) {
            this.isShowGoodsTypes = false;
            this.disabledGoodsType = false;
            this.addReceipt.goodsType = null;
        }

    }

}

