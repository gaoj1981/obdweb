import { isResOK } from '@/utils/BizUtil';
import { chartCarProvGroup } from '@/services/cars';

const servToReduce = {
  chartCarProvGroup: { method: chartCarProvGroup, reduce: 'chartCarProvGroup' },
};

export default {
  namespace: 'charts',

  state: {
    carProvGroup: [],
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
    chartCarProvGroup(state, action) {
      return {
        ...state,
        carProvGroup: action.payload,
      };
    },
  },
};
