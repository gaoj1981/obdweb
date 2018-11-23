import { isResOK } from '@/utils/BizUtil';
import {
  // 维修记录
  pageWareRecord,
  addWareRecord,
  delWareRecord,
  editWareRecord,
  getWareRecord,
} from '@/services/cars';

const servToReduce = {
  // 维修记录
  pageWareRecord: { method: pageWareRecord, reduce: 'pageWareRecord' },
  addWareRecord: { method: addWareRecord, reduce: null },
  delWareRecord: { method: delWareRecord, reduce: null },
  editWareRecord: { method: editWareRecord, reduce: null },
  getWareRecord: { method: getWareRecord, reduce: 'getWareRecord' },
};

//
export default {
  namespace: 'sales',

  state: {
    // 维修记录
    pageWareRecord: {},
    wareRecord: {},
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
        if (callback) callback(response);
      } else {
        const { err } = postParamObj;
        if (err) {
          yield put({
            type: err,
          });
        }
      }
    },
  },

  reducers: {
    pageWareRecord(state, action) {
      return {
        ...state,
        pageWareRecord: action.payload,
      };
    },
    getWareRecord(state, action) {
      return {
        ...state,
        wareRecord: action.payload,
      };
    },
  },
};
