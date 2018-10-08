import { getCarPage, createCar } from '@/services/equip';

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
    *addCar({ payload, callback }, { call }) {
      yield call(createCar, payload);
      callback();
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
