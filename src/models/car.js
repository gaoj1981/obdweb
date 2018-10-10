import { isResOK } from '@/utils/BizUtil';
import { getCarPage, createCar } from '@/services/equip';

const servToReduce = {
  addCar: { method: createCar, reduce: null },
  queryCarList: { method: getCarPage, reduce: 'queryList' },
};
//
export default {
  namespace: 'car',

  state: {
    carPageList: {},
  },

  effects: {
    *reqCommon({ service, payload, callback }, { call, put }) {
      const postParamObj = servToReduce[service];
      const response = yield call(postParamObj.method, payload);
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
  },
};
