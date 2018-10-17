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
  },
};
