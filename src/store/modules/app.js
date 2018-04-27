import * as types from '../types';

const app = {
  state: {
    bbox: [],
  },
  getters: {},
  mutations: {
    [types.SET_APP_BBOX](state, bbox) {
      state.bbox = [...bbox];
    },
  },
  actions: {},
};

export default app;
