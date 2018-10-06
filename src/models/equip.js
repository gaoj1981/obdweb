import { getLicCountSum } from '../services/equip';

export default {
  namespace: 'equip',

  state: {
    licCountSum: [],
  },

  effects: {
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
  },
};
