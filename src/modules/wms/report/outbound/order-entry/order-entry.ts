import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import ItemAutoComplete from "@components/itemspec-auto-complete/itemspec-auto-complete";
import FacilitySelect from "@components/facility-select/facility-select";
import ElementSelect from "@components/element-select/element-select";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import Pager from "@components/pager/pager";
import CustomerWiseVue from "@shared/customer-wise-vue";
import { Component, Watch } from "vue-property-decorator";
import util from "@shared/util";
import { Subject, Observable } from "rxjs";
import "rxjs/add/operator/debounceTime";
import tlp from "./order-entry.vue";
import OrganizationAutoComplete from "@components/organization-auto-complete/organization-auto-complete";
import AddressInput from "@components/address-input/address-input";
import PopUpWindows from "@components/pop-up-windows/pop-up-windows";
import orderService from "@services/order-service";
import itemService from "@services/item-service";
import organizationService from "@services/organization-service";
import addressService from "@services/address-service";
import DatePicker from 'vue2-datepicker';
import { ValidationProvider } from 'vee-validate';
import { forEach, find, cloneDeep,  isEmpty, partition,  assign, keyBy } from 'lodash-es';
import SwitchButton from "@components/switch-button/switch-button";
import ItemDisplay from "@components/item-display/item-display";
import TagsInput from "@components/tags-input/tags-input";

@Component({
    mixins: [tlp],
    components: {
        OrganizationAutoComplete,
        PredefinedCustomerSelect,
        ElementSelect,
        FacilitySelect,
        Pager,
        WaittingBtn,
        PopUpWindows,
        ItemAutoComplete,
        DatePicker,
        ValidationProvider,
        AddressInput,
        SwitchButton,
        TagsInput,
        ItemDisplay
    }
})
export default class OrderEntry extends CustomerWiseVue {
    facilityId: any = '';
    addOrder: any = {};
    orderTypes: Array<any> = ['Regular Order', 'Title Transfer Order', 'Migo Transfer Order', 'DropShip Order', 'Blur Order', 'CrossDock', 'Auto Process Order'];
    itemListTotal: any = null;
    itemListPallets: any = null;
    isCarrierDisabled: boolean = true;
    isReset: any = {};
    containerSizeData: Array<any> = ["20'", "40'", "40'H", "45'"];
    receiveType: Array<any> = ['Bulk Receiving', 'Regular Receiving'];
    receiptType: Array<any> = ['Regular Receipt', 'Title Transfer Receipt', 'Migo Transfer Receipt', 'Inventory Receipt', 'CrossDock', 'Return', 'RDN', 'Auto Process Receipt', 'Customer Transfer'];
    selectItemListUoms: Array<any> = [];
    isSelectItemListUom: boolean = true;
    islistUomloading: boolean = false;
    addItem: any = {};
    addressSearch: any = {};
    itemLists: Array<any> = [];
    isAddItemPopup: boolean = false;
    popupTlitle: string = '';
    isEdit: boolean = false;
    isSubmit: boolean = false;
    isAttachment: boolean = false;
    isEditShipFrom: boolean = false;
    editIndex: any = '';
    shipFromMessage: any = '';
    addressResults: Array<any> = [];
    carrierShipMethods: Array<any> = ['Truckload', 'LTL', 'Small Parcel', 'Will Call'];
    indexCheckedAddress: any = '';
    isSearchAddress: boolean = false;
    submitName: any = "Save Order";
    orderId: any = null;
    unitId: any = '';
    cloneItemLists: Array<any> = [];
    showItemListIndex: any = '';
    removeItemLists: Array<any> = [];
    keyByCustomers: any = '';
    facility: any = {};
    isSameasshiptoSoldTo: boolean = false;
    isSameasshiptoBillTo: boolean = false;
    customerId:  any = '';
    cloneShippingAccountNo:  any = null;

    @Watch('customerId')
    private watchCustomer(val: any) {
        if (val) {
            this.addOrder.customerId = val;
            this._getCustomerOrderTypes();
        }
    }



    async mounted() {
      document.addEventListener('click', (e: any) => this.showItemListIndex = -1);
      this.searchShipFromAddress();
      this.keyByCustomers = keyBy(this.getCustomers(), 'id');
      this.addOrder.customerId = this.customerId;
      if ((<any>this).$parent.isHeavyLoad) {
          (<any>this).$parent.isHeavyLoad = false;
          let cloneDeepAddOrder = cloneDeep(this.addOrder);
          this.addOrder = {};
          this.addOrder.customerId = cloneDeepAddOrder.customerId;
          this.addItem = {};
          return;
      }
        let route = this.$route;
        if (route.query && route.query.orderId) {
            this.orderId = route.query.orderId;
            await this.getOrderInfo(this.orderId);
        }

    }

    private getOrderInfo(orderId: any) {
        orderService.getBamOrder(orderId).subscribe(
            (res: any) => {
                if (res.shippingAccountNo) this.cloneShippingAccountNo = res.shippingAccountNo;
                let shipFrom = this.addOrder.shipFrom;
                let shipFromId = this.addOrder.shipFromId;
                this.submitName = "Update Order";
                this.addOrder = res;
                let itemLines = res.itemLines;
                this.shipFromMessage = res.shipFrom ? res.shipFrom : shipFrom;
                this.addOrder.shipFromId = res.shipFromId ? res.shipFromId : shipFromId;
                if (itemLines) {
                    this.itemLists = itemLines;
                    this.cloneItemLists = cloneDeep(itemLines);
                    forEach(this.itemLists, item => {
                        this.$set(item, 'ItemName', (item.itemSpecName + "( " + item.itemSpecDesc + " )"));
                        this.$set(item, 'state', 'new');
                    });
                }
                if (res.referenceNo) this.$set(this.structureUpdataDynamicFields, 'referenceNo', res.referenceNo);
                if (res.referenceNo01) this.$set(this.structureUpdataDynamicFields, 'referenceNo01', res.referenceNo01);
                if (res.referenceNo02) this.$set(this.structureUpdataDynamicFields, 'referenceNo02', res.referenceNo02);
                if (res.referenceNo03) this.$set(this.structureUpdataDynamicFields, 'referenceNo03', res.referenceNo03);
                if (res.referenceNo04) this.$set(this.structureUpdataDynamicFields, 'referenceNo04', res.referenceNo04);
                if (res.referenceNo05) this.$set(this.structureUpdataDynamicFields, 'referenceNo05', res.referenceNo05);
                this.getOrderDynamicFields(this.addOrder.customerId);
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
        this.isReset['customer'] = false;
        this.$set(this.isReset, 'carrier', true);
        this.$delete(this.addOrder, "carrierId");
    }

    onSelectCarrier(carrier: any) {
        this.isReset['carrier'] = false;
        this._setInfoByCarrierId(carrier.id, true);

    }

    carrierServiceTypes: Array<any> = [];

    private _setInfoByCarrierId(carrierId: any, needValidateSCAC: boolean) {
        if (carrierId) {
            this.addOrder.shipMethod = '';
            organizationService.getCarrierByOrgId(carrierId).subscribe(
                (res: any) => {
                    if (!res.scac && needValidateSCAC) {
                        this.error("SCAC Code for carrier " + res.name + " was empty, please add the SCAC code for this carrier first.");
                    }
                    this.carrierServiceTypes = res.serviceTypes;
                     this.carrierShipMethods = isEmpty(res.shippingMethods) ? this.carrierShipMethods : res.shippingMethods;
                    if (res.defaultShippingMethod) {
                        this.addOrder.shipMethod = res.defaultShippingMethod;
                    }
                }
            );
        }

    }

    onSelectFacility(facility: any) {
        this.$delete(this.addOrder, "carrierId");
        this.$delete(this.addItem, "itemSpecId");
        this.$set(this.isReset, 'customer', true);
        this.$set(this.isReset, 'item', true);
        this.searchShipFromAddress(true);
    }


    onFacilityChangeCauseByCustomerChange(facility: any) {
        this.searchShipFromAddress(true, facility);
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
        this.addOrder.listUom = '';
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
                        return;
                    }
                    let existItem: any = {
                        itemSpecId: this.addItem.itemSpecId,
                        unitId: this.addItem.unitId,
                        titleId: this.addItem.titleId
                    };
                    if (this.addItem.lotNo)existItem.lotNo = this.addItem.lotNo;
                    if (find(this.itemLists, existItem)) {
                        this.error('Duplicate ItemLine!');
                        return;
                    }
                    this.$set(this.addItem, 'state', 'new');
                    if (!this.addItem.id) this.addItem.createTimestamp = new Date().getTime();
                    util.removeEmptyString([this.addItem]);
                    this.itemLists.push(this.addItem);
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
            (res: any)  => {
                let validateErrors = (this as any).errors.items;
                console.log(validateErrors);
                if (validateErrors.length > 0) {
                    document.getElementsByName(validateErrors[0]['field'])[0].scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                        inline: "center"
                    });
                }
                if (res) {
                    this.isSubmit = true;
                    let addOrder = cloneDeep(this.addOrder);
                    addOrder.source = "CLIENT PORTAL";
                    util.removeEmptyString(this.itemLists);
                    let itemLines = cloneDeep(this.itemLists);
                    forEach(itemLines, itemList => {
                        this.$delete(itemList, 'state');
                    });
                    if ( this.orderId ) {
                        this.upDataOrder(addOrder, itemLines);
                    } else {
                       this.createOrder(addOrder, itemLines);
                    }

                }
            }
        );
    }

    private upDataOrder (addOrder: any, itemLines: any) {
        orderService.upDataOrder(this.orderId, addOrder).subscribe(
            (res: any) => {
                this.succeed(`outbound order ${this.orderId} update success.`);
                if (itemLines.length > 0) this.createOrderItemLine(res.id, itemLines);
                else {
                    this.isSubmit = false;
                    this.getOrderInfo(this.orderId);
                }
            },
            (err: any) => {
                this.isSubmit = false;
                this.error(err);
            }
        );
    }

    private createOrder(addOrder: any, itemLines: any) {
        orderService.createOrder(addOrder).subscribe(
            (res: any) => {
                this.orderId = res.id;
                this.succeed(`outbound order ${res.id} created.`);
                if (itemLines.length > 0) this.createOrderItemLine(res.id, itemLines);
                else {
                    this.isSubmit = false;
                    this.getOrderInfo(this.orderId);
                }
            },
            (err: any) => {
                this.isSubmit = false;
                this.error(err);
            }
        );
    }

    private async createOrderItemLine(orderId: any, itemLines: any) {
        let partitionItemListById = partition(itemLines, 'id');
        let upDataItemList = partitionItemListById[0];
        let createItemList = partitionItemListById[1];
        let removeItemList =  this.removeItemLists;
        let handlePromises: Array<any> = [];
        if (upDataItemList.length > 0) {
            forEach(upDataItemList, itemLine => {
                handlePromises.push(itemService.upDataOrderItemLine(orderId, itemLine).toPromise());
            });
        }
        if (createItemList.length > 0) {
            forEach(createItemList, itemLine => {
                handlePromises.push(itemService.createOrderItemLine(orderId, itemLine).toPromise());
            });
        }
        if (removeItemList.length > 0) {
            forEach(removeItemList, itemLine => {
                handlePromises.push(itemService.deleteOrderItemLine(orderId, itemLine.id).toPromise());
            });
        }

        await Promise.all(this.handlePromise(handlePromises))
            .then((res: any) => {
                forEach(res, request => {
                    if (request.err) this.error(request.err);
                });
            }, err => this.error(err));
        this.isSubmit = false;
        this.getOrderInfo(this.orderId);

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

    emitShipFromCancel() {
        this.isEditShipFrom = false;
        this.addressSearch.keyword = '';
    }

    onEditShipFrom() {
        this.isEditShipFrom = true;
        this.searchAddress({organizationId: this.addOrder.customerId});
    }

    onAddressResult(address: any, index: any) {
        this.indexCheckedAddress = index;
        this.addOrder.shipFromInfo = address;
    }

    onemitShipFromCancel() {
        this.isEditShipFrom = false;
        this.addOrder.shipFrom = `${this.addOrder.shipFromInfo.name}-${this.addOrder.shipFromInfo.address1} ${this.addOrder.shipFromInfo.city}, ${ this.addOrder.shipFromInfo.state} ${ this.addOrder.shipFromInfo.zipCode}, ${ this.addOrder.shipFromInfo.country}`;
        this.shipFromMessage = this.addOrder.shipFrom;
        this.addOrder.shipFromId = this.addOrder.shipFromInfo.id;
        this.addressSearch.keyword = '';
    }

    private searchShipFromAddress(ischangedfacility: any = false, facility: any = false) {
        let facilityId =  facility ? facility.id : this.facility.id;
        addressService.search({organizationId: facilityId}).subscribe(
            (res: any) => {
                if (!ischangedfacility) this.addOrder.shipFrom = this.addOrder.shipFrom ? this.addOrder.shipFrom : `${res[0].name}-${res[0].address1} ,${res[0].city}, ${ res[0].state} ${ res[0].zipCode}, ${ res[0].country}`;
                else this.addOrder.shipFrom = `${res[0].name}-${res[0].address1} ,${res[0].city}, ${ res[0].state} ${ res[0].zipCode}, ${ res[0].country}`;
                this.shipFromMessage = this.addOrder.shipFrom;
                this.addOrder.shipFromId = res[0].id;
                this.$forceUpdate();
            },
            (err: any) => {
                this.error(err);
                this.addOrder.shipFromInfo = '';
            }
        );
    }

    searchAddress(params: any) {
        this.isSearchAddress = true;
        this.$forceUpdate();
        addressService.search(params).subscribe(
            (res: any)  => {
                this.isSearchAddress = false;
                this.addressResults = res;
            },
            (err: any) => {
                this.error(err);
            }
        );

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
    dynamicFields: any = {};
    orderItemLineDynamicFields: any = {};
    isShowDynamicFields: any = {};
    structureUpdataDynamicFields: any = {};
    isshowItemListDynamicFieldIndex: any = -1;
    isupdateItemLineDynamicFields: boolean = false;
    isOrderDynamicFields: boolean = false;
    isLoadingBatchCode: boolean = false;
    isLoadingUpdateStructureDynamicFields: boolean = false;
    updataItemListDynamicFields: any = {};
    originalItemLineDynamicFields: any = {
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


    getOrderDynamicFields(customerId: string) {
        organizationService.getCustomerByOrgId(customerId)
            .subscribe(
                (res: any) => {
                    this.dynamicFields = res.orderDynamicFields;
                    this.orderItemLineDynamicFields = res.orderItemLineDynamicFields;
                    forEach(res.orderDynamicFields, (field, key) => {
                        if (this.addOrder.dynamicFields[key]) this.$set(this.structureUpdataDynamicFields, key, this.addOrder.dynamicFields[key]);
                    });
                    this.isOrderDynamicFields = false;
                    this.$forceUpdate();
                },
                (err: any) => {
                    this.isLoadingDynamicFields[this.orderId] = false;
                    this.error(err);
                }
            );
    }


    onShowDynamicFields(index: any, itemLine: any, orderItemLineDynamicFields: any) {
        if (this.isshowItemListDynamicFieldIndex == index) this.isshowItemListDynamicFieldIndex = -1;
        else {
            this.isshowItemListDynamicFieldIndex = index;
        }
        if (!itemLine.dynamicFields) {
            forEach(orderItemLineDynamicFields, (dynamicField: any, key: any) => {
                this.$set(this.updataItemListDynamicFields, key, '');
            });
        }
        else this.updataItemListDynamicFields = itemLine.dynamicFields;
    }


    updateStructureDynamicFields() {
        this.isLoadingUpdateStructureDynamicFields = true;
        let update: any = {dynamicFields: {}, id: this.addOrder.id};
        if (this.structureUpdataDynamicFields.referenceNo) update['referenceNo'] = this.structureUpdataDynamicFields.referenceNo;
        if (this.structureUpdataDynamicFields.referenceNo01) update['referenceNo01'] = this.structureUpdataDynamicFields.referenceNo01;
        if (this.structureUpdataDynamicFields.referenceNo02) update['referenceNo02'] = this.structureUpdataDynamicFields.referenceNo02;
        if (this.structureUpdataDynamicFields.referenceNo03) update['referenceNo03'] = this.structureUpdataDynamicFields.referenceNo03;
        if (this.structureUpdataDynamicFields.referenceNo04) update['referenceNo04'] = this.structureUpdataDynamicFields.referenceNo04;
        if (this.structureUpdataDynamicFields.referenceNo05) update['referenceNo05'] = this.structureUpdataDynamicFields.referenceNo05;
        forEach(this.structureUpdataDynamicFields, (field, key) => {
            if (field) update.dynamicFields[key] = field;
        });
        orderService.upDataOrder( this.addOrder.id, update).subscribe(
            (res: any) => {
                this.isLoadingUpdateStructureDynamicFields = false;
                this.isOrderDynamicFields = false;
                this.succeed('Update successful.');
                this.getOrderInfo(this.orderId);
            },
            (err: any) => {
                this.isLoadingUpdateStructureDynamicFields = false;
                this.isOrderDynamicFields = false;
                this.error(err);
            }
        );
    }

    updateItemLineDynamicFields (itemLine: any) {
        this.isupdateItemLineDynamicFields = true;
        itemLine.dynamicFields = assign(itemLine.dynamicFields, this.updataItemListDynamicFields);
        itemService.upDataOrderItemLine(this.orderId, itemLine)
            .subscribe(
                (res: any) => {
                    this.isupdateItemLineDynamicFields = false;
                    this.succeed('Update successful.');
                    this.getOrderInfo(this.orderId);
                },
                (err: any) => {
                    this.isupdateItemLineDynamicFields = false;
                    this.error(err);
                }
            );
    }

    onSelectTitle(title: any) {
        this.addItem.titleName = title ? title.name : "";
    }


    onSelectSupplier(supplier: any) {
        this.addItem.supplierName = supplier ? supplier.name : "";
    }

    getAddressCustomer() {
        let searchAddressCustomer = this.keyByCustomers[this.addOrder.customerId];
        if (searchAddressCustomer) return searchAddressCustomer.name;
    }

    sameasshiptoSoldTo() {
        this.$set(this.addOrder, 'soldToAddress', cloneDeep(this.addOrder.shipToAddress));
    }

    sameasshiptoBillTo() {
        this.$set(this.addOrder, 'billToAddress', cloneDeep(this.addOrder.shipToAddress));
    }

    onsSlectAddress(address: any) {
        if (this.isSameasshiptoSoldTo) this.$set(this.addOrder, 'soldToAddress', address);
        if (this.isSameasshiptoBillTo) this.$set(this.addOrder, 'billToAddress', address);
    }

    private _getCustomerOrderTypes() {
        let orderTypes = cloneDeep( this.orderTypes);
        this.orderTypes = [];
        this.$delete(this.addOrder, 'orderType');
        organizationService.getCustomerByOrgId(this.addOrder.customerId)
            .subscribe(
                (res: any) => {
                    this.orderTypes = res.supportedOrderTypes ? res.supportedOrderTypes : orderTypes;
                },
                (err: any) => {
                    this.error(err);
                }
            );
    }

    onSelectFreightTerm() {
        if (this.addOrder.freightTerm === 'Collect') {
            if (this.orderId && this.cloneShippingAccountNo) this.addOrder.shippingAccountNo = null;
            else this.$delete(this.addOrder, 'shippingAccountNo');
        }
    }
}
