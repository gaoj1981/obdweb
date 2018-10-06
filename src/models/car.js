import { getCarPage } from '@/services/equip';

//
export default {
  namespace: 'car',

  state: {
    carPageList: {},
  },

  effects: {
    *fetchPageCar({ payload }, { call, put }) {
      const response = yield call(getCarPage, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
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
