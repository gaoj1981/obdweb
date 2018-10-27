import { isResOK } from '@/utils/BizUtil';
import {
  getCarCountSum,
  getCarPage,
  createCar,
  getCarInfo,
  modifyCar,
  delCar,
} from '@/services/equip';
import {
  pageBindUser,
  addBindUser,
  delBindUser,
  editBindUser,
  getBindUser,
  editBindUserDefault,
  getBindUserDefault,
  //
  pageCarMot,
  addCarMot,
  delCarMot,
  editCarMot,
  getCarMot,
  getCarMotInfo,
  // 车辆保险
  pageCarInsur,
  addCarInsur,
  delCarInsur,
  editCarInsur,
  getCarInsur,
} from '@/services/cars';

const servToReduce = {
  carCountSum: { method: getCarCountSum, reduce: 'saveCarSum' },
  addCar: { method: createCar, reduce: null },
  editCar: { method: modifyCar, reduce: null },
  delCar: { method: delCar, reduce: null },
  queryCarList: { method: getCarPage, reduce: 'queryList' },
  getCarInfo: { method: getCarInfo, reduce: 'queryCarInfo' },
  pageBindUser: { method: pageBindUser, reduce: 'pageBindUser' },
  addBindUser: { method: addBindUser, reduce: null },
  delBindUser: { method: delBindUser, reduce: null },
  editBindUser: { method: editBindUser, reduce: null },
  getBindUser: { method: getBindUser, reduce: 'getBindUser' },
  editBindUserDefault: { method: editBindUserDefault, reduce: null },
  getBindUserDefault: { method: getBindUserDefault, reduce: 'getBindUserDefault' },
  //
  pageCarMot: { method: pageCarMot, reduce: 'pageCarMot' },
  addCarMot: { method: addCarMot, reduce: null },
  delCarMot: { method: delCarMot, reduce: null },
  editCarMot: { method: editCarMot, reduce: null },
  getCarMot: { method: getCarMot, reduce: 'getCarMot' },
  getCarMotInfo: { method: getCarMotInfo, reduce: 'getCarMotInfo' },
  // 车辆保险
  pageCarInsur: { method: pageCarInsur, reduce: 'pageCarInsur' },
  addCarInsur: { method: addCarInsur, reduce: null },
  delCarInsur: { method: delCarInsur, reduce: null },
  editCarInsur: { method: editCarInsur, reduce: null },
  getCarInsur: { method: getCarInsur, reduce: 'getCarInsur' },
};
//
export default {
  namespace: 'car',

  state: {
    carCountSum: 0,
    carPageList: {},
    carInfo: {},
    pageBindUser: {},
    bindUser: {},
    bindUserDefault: [],
    //
    pageCarMot: {},
    carMot: {},
    carMotInfo: {},
    // 车辆保险
    pageCarInsur: {},
    carInsur: {},
  },

  effects: {
    *reqCommon({ service, payload, callback }, { call, put }) {
      const postParamObj = servToReduce[service];
      const response = yield call(postParamObj.method, payload);
      //
      if (isResOK(response)) {
        const { reduce } = postParamObj;
        if (reduce) {
          yield put({
            type: reduce,
            payload: response,
          });
        }
        if (callback) callback();
      }
    },
    *reqCommonNowarn({ service, payload, callback }, { call, put }) {
      const postParamObj = servToReduce[service];
      const response = yield call(postParamObj.method, payload);
      //
      if (isResOK(response, true)) {
        const { reduce } = postParamObj;
        if (reduce) {
          yield put({
            type: reduce,
            payload: response,
          });
        }
        if (callback) callback();
      }
    },
    *fetchCarCountSum(_, { call, put }) {
      const response = yield call(getCarCountSum);
      yield put({
        type: 'saveCarSum',
        payload: response,
      });
    },
    *clearBindUser({ payload }, { put }) {
      yield put({
        type: 'queryBindUser',
        payload,
      });
    },
    *clearCarInfo({ payload }, { put }) {
      yield put({
        type: 'queryCarInfo',
        payload,
      });
    },
    *clearCarMotInfo({ payload }, { put }) {
      yield put({
        type: 'getCarMotInfo',
        payload,
      });
    },
  },

  reducers: {
    saveCarSum(state, action) {
      return {
        ...state,
        carCountSum: action.payload,
      };
    },
    queryList(state, action) {
      return {
        ...state,
        carPageList: action.payload,
      };
    },
    queryCarInfo(state, action) {
      return {
        ...state,
        carInfo: action.payload,
      };
    },
    pageBindUser(state, action) {
      return {
        ...state,
        pageBindUser: action.payload,
      };
    },
    getBindUser(state, action) {
      return {
        ...state,
        bindUser: action.payload,
      };
    },
    getBindUserDefault(state, action) {
      return {
        ...state,
        bindUserDefault: action.payload,
      };
    },
    pageCarMot(state, action) {
      return {
        ...state,
        pageCarMot: action.payload,
      };
    },
    getCarMot(state, action) {
      return {
        ...state,
        carMot: action.payload,
      };
    },
    getCarMotInfo(state, action) {
      return {
        ...state,
        carMotInfo: action.payload,
      };
    },
    // 车辆保险
    pageCarInsur(state, action) {
      return {
        ...state,
        pageCarInsur: action.payload,
      };
    },
    getCarInsur(state, action) {
      return {
        ...state,
        carInsur: action.payload,
      };
    },
  },
};
