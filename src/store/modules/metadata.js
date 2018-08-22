import * as types from '../types';
import api from 'api';

/**
 * 元数据交互store模块
 */
const metadata = {
  state: {
    //标签数据列表
    tagData: [],
    //分类树
    treeData: [],
  },

  getters: {},

  mutations: {
    [types.SEARCH_LABLE_DATAS](state, datas) {
      state.tagData = datas;
    },
    [types.SEARCH_TREE_DATA](state, dataTree) {
      state.treeData = dataTree;
    },
  },

  actions: {
    //标签数据列表
    async [types.SEARCH_LABLE_DATA]({ commit }) {
      const response = await api.db.findallBusiness({});
      const datas = response.data;
      commit(types.SEARCH_LABLE_DATAS, datas);
    },
    //分类数据
    async [types.SEARCH_TREE_DATA]({ commit }) {
      const response = await api.db.findalltypeBusiness({});
      const dataTree = response.data;
      commit(types.SEARCH_TREE_DATAS, dataTree);
    },
  },
};

export default metadata;
