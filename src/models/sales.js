import { isResOK } from '@/utils/BizUtil';
import {
  // 维修记录
  pageWareRecord,
  addWareRecord,
  deleteWareRecord,
  editWareRecord,
  getWareRecord,
  getWareRecordInfo,
} from '@/services/cars';

const servToReduce = {
  // 维修记录
  pageWareRecord: { method: pageWareRecord, reduce: 'pageWareRecord' },
  addWareRecord: { method: addWareRecord, reduce: null },
  deleteWareRecord: { method: deleteWareRecord, reduce: null },
  editWareRecord: { method: editWareRecord, reduce: null },
  getWareRecord: { method: getWareRecord, reduce: 'getWareRecord' },
  getWareRecordInfo: { method: getWareRecordInfo, reduce: 'getWareRecordInfo' },
};

//
export default {
  namespace: 'sales',

  state: {
    // 维修记录
    pageWareRecord: {},
    wareRecord: {},
    wareRecordInfo: {},
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
    *clearWareRecordInfo({ payload }, { put }) {
      yield put({
        type: 'getWareRecordInfo',
        payload,
      });
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
    getWareRecordInfo(state, action) {
      return {
        ...state,
        wareRecordInfo: action.payload,
      };
    },
  },
};
