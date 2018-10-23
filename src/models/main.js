import { queryOssPolicy } from '@/services/api';

export default {
  namespace: 'main',

  state: {
    ossPolicyInfo: {},
  },

  effects: {
    *fetchOssPolicy({ payload, callback }, { call, put }) {
      const response = yield call(queryOssPolicy, payload);
      yield put({
        type: 'ossPolicy',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    ossPolicy(state, action) {
      return {
        ...state,
        ossPolicyInfo: action.payload,
      };
    },
  },
};
