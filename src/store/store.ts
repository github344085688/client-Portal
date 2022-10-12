import Vue from 'vue';
import Vuex from 'vuex';
import { findIndex, cloneDeep } from 'lodash';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        dragType: null,
        dropedOrder: [],
        driverCalendarInfo: null,
        currentPanel: '',
        isShowOrderPanelBtn: false,
        isShowTripPanelBtn: false,
        mapViewOrder: null,
        isEditTrip: false,
        isNewTrip: false,
        orderHistoryArr: [],
        associatedOrderByTrip: '',
        associatedTripByOrder: '',
        associatedTripByWms: '',
        currentOrder: {
            orderPro: '',
            orderId: '',
            orderPu: ''
        },
        orderInfo: {},
        tripInfo: {},
        advanceSearchParams: {
            Order: {},
            Trip: {},
            WMS: {},
            PickAndDeliveryOrders: {},
            ExistingTrips: {}
        },
        refreshOrderAndTrip: {
            order: false,
            trip: false
        },
        tripLog: null,
        carrierLinkDriverId: '',
    },
    mutations: {
        editDragType (state, type) {
            state.dragType = type;
        },

        addDropedOrder(state: any, order) {
            state.dropedOrder.push({
                orderId: order.order_id,
                orderPu: order.pu_id,
                orderPro: order.order_pro,
            });
        },

        removeDropedOrder(state: any, orderNo) {
            let index = findIndex(state.dropedOrder, orderNo);
            state.dropedOrder.splice(index, 1);
        },

        showAssociatedOrderByTrip(state: any, tripNo: any) {
            state.associatedOrderByTrip = tripNo;
        },

        showAssociatedTripByOrder(state: any, OrderId: any) {
            state.associatedTripByOrder = OrderId;
        },

        showAssociatedTripByWms(state: any, WmsNo: any) {
            state.associatedTripByWms = WmsNo;
        },

        showMapViewOrder(state, orderNo) {
            state.mapViewOrder = orderNo;
        },

        changeCurrentPanel(state, panelName) {
            state.currentPanel = panelName;
        },

        returnOrderHistory(state, orderAndHistoryArr) {
            state.currentOrder.orderPro = orderAndHistoryArr.orderPro;
            state.currentOrder.orderId = orderAndHistoryArr.orderId;
            state.currentOrder.orderPu = orderAndHistoryArr.orderPu;
        },

        returnOrder(state, order) {
            state.orderInfo = order;
        },

        returnTrip(state, trip) {
            state.tripInfo = trip;
        },

        changeAdvanceSearchParams(state: any, searchParams: any) {
            if (searchParams.panel) {
                state.advanceSearchParams[searchParams.panel] = cloneDeep(searchParams);
            }
        },

        showOrderPanelBtn (state, isShow) {
            state.isShowOrderPanelBtn = isShow;
        },

        isEditTrip(state, isOnEdit) {
            state.isEditTrip = isOnEdit;
            if (!isOnEdit) {
                state.dropedOrder = [];
            }
        },

        isNewTrip(state, isNew) {
            state.isNewTrip = isNew;
        },

        showTripPanelBtn (state, isShow) {
            state.isShowTripPanelBtn = isShow;
        },

        setDriverCalendarInfo (state, info) {
            state.driverCalendarInfo = info;
        },

        refreshOrderAndTrip(state, orderAndTrip) {
            state.refreshOrderAndTrip.order = orderAndTrip.order;
            state.refreshOrderAndTrip.trip = orderAndTrip.trip;
        },

        showTripLog(state, tripLog) {
            state.tripLog = tripLog;
        },

        carrierLinkDriver(state, carrierLinkId) {
            state.carrierLinkDriverId = carrierLinkId;
        }
    },
    getters: {
        setDragType: state => state.dragType
    },
});

export default store;