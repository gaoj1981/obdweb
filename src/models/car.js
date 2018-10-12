import { isResOK } from '@/utils/BizUtil';
import { getCarPage, createCar, getCarInfo } from '@/services/equip';

const servToReduce = {
  addCar: { method: createCar, reduce: null },
  queryCarList: { method: getCarPage, reduce: 'queryList' },
  getCarInfo: { method: getCarInfo, reduce: 'queryCarInfo' },
};
//
export default {
  namespace: 'car',

  state: {
    carPageList: {},
    carInfo: {},
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
  },

  reducers: {
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
  },
};
