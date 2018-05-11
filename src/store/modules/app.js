import * as types from '../types';

const app = {
  state: {
    // 当前浏览的目录节点对象
    currentCatalog: {},
    // 当前选择的节点对象列表
    selectNodes: [],
  },
  getters: {},
  mutations: {
    // 设置目录对象
    [types.SET_APP_CURRENT_CATALOG](state, catalog) {
      state.currentCatalog = catalog;
    },
    // 新增选择节点 根据id去重
    [types.SET_APP_SELECT_NODES](state, node) {
      if (!Array.isArray(node)) {
        node = [node];
      }
      node.forEach(item => {
        const index = state.selectNodes.findIndex(ele => ele.id === item.id);
        if (index < 0) {
          state.selectNodes.push(item);
        }
      });
    },
    // 移除选择的节点 当node参数为unfined时，清除selectNodes节点对象数组
    [types.REMOVE_APP_SELECT_NODES](state, node) {
      if (node) {
        const index = state.selectNodes.findIndex(ele => ele.id === node.id);
        if (index > -1) {
          state.selectNodes.splice(index, 1);
        }
      } else {
        state.selectNodes = [];
      }
    },
  },
  actions: {},
};

export default app;
