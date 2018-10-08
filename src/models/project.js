import { queryProjectNotice } from '@/services/api';

export default {
  namespace: 'project',

  state: {
    notice: [],
  },

  effects: {
    *fetchNotice(_, { call, put }) {
      // const response = yield call(queryProjectNotice);
      console.log(queryProjectNotice, call);
      const response = null;
      yield put({
        type: 'saveNotice',
        payload: Array.isArray(response) ? [] : [],
      });
    },
  },

  reducers: {
    saveNotice(state, action) {
      return {
        ...state,
        notice: action.payload,
      };
    },
  },
};
