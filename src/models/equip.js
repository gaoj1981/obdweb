import { isResOK } from '@/utils/BizUtil';
import {
  getLicCountSum,
  equipAnalysis,
  equipImport,
  // 设备详情
  pageEquipInfo,
  addEquipInfo,
  delEquipInfo,
  editEquipInfo,
  getEquipInfo,
  delEquipBatch,
} from '@/services/equip';

const servToReduce = {
  equipAnalysis: { method: equipAnalysis, reduce: 'equipAnalysis', err: 'equipAnalysisClear' },
  equipImport: { method: equipImport, reduce: 'equipImport', err: 'equipImportClear' },
  // 设备详情
  pageEquipInfo: { method: pageEquipInfo, reduce: 'pageEquipInfo' },
  addEquipInfo: { method: addEquipInfo, reduce: null },
  delEquipInfo: { method: delEquipInfo, reduce: null },
  editEquipInfo: { method: editEquipInfo, reduce: null },
  getEquipInfo: { method: getEquipInfo, reduce: 'getEquipInfo' },
  delEquipBatch: { method: delEquipBatch, reduce: null },
};

//
export default {
  namespace: 'equip',

  state: {
    licCountSum: [],
    equipAnalysisInfo: {},
    equipImportInfo: null,
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
    *fetchLicCountSum(_, { call, put }) {
      const response = yield call(getLicCountSum);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *clearEquipAnalysis(_, { put }) {
      yield put({
        type: 'equipAnalysisClear',
      });
    },
    *clearEquipImport(_, { put }) {
      yield put({
        type: 'equipImportClear',
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
    equipImport(state, action) {
      return {
        ...state,
        equipImportInfo: action.payload,
      };
    },
    equipImportClear(state) {
      return {
        ...state,
        equipImportInfo: null,
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
