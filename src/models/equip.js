import { isResOK } from '@/utils/BizUtil';
import {
  getLicCountSum,
  equipAnalysis,
  // 设备详情
  pageEquipInfo,
  addEquipInfo,
  delEquipInfo,
  editEquipInfo,
  getEquipInfo,
} from '@/services/equip';

const servToReduce = {
  equipAnalysis: { method: equipAnalysis, reduce: 'equipAnalysis', err: 'equipAnalysisClear' },
  // 设备详情
  pageEquipInfo: { method: pageEquipInfo, reduce: 'pageEquipInfo' },
  addEquipInfo: { method: addEquipInfo, reduce: null },
  delEquipInfo: { method: delEquipInfo, reduce: null },
  editEquipInfo: { method: editEquipInfo, reduce: null },
  getEquipInfo: { method: getEquipInfo, reduce: 'getEquipInfo' },
};

//
export default {
  namespace: 'equip',

  state: {
    licCountSum: [],
    equipAnalysisInfo: {},
    // 设备详情
    pageEquipInfo: {},
    equipInfo: {},
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
      } else {
        const { err } = postParamObj;
        if (err) {
          yield put({
            type: err,
          });
        }
      }
    },
    *fetchLicCountSum(_, { call, put }) {
      const response = yield call(getLicCountSum);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        licCountSum: action.payload,
      };
    },
    equipAnalysis(state, action) {
      return {
        ...state,
        equipAnalysisInfo: action.payload,
      };
    },
    equipAnalysisClear(state) {
      return {
        ...state,
        equipAnalysisInfo: {},
      };
    },
    pageEquipInfo(state, action) {
      return {
        ...state,
        pageEquipInfo: action.payload,
      };
    },
    getEquipInfo(state, action) {
      return {
        ...state,
        equipInfo: action.payload,
      };
    },
  },
};
