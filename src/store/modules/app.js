import * as types from '../types';
import api from 'api';
import { clone } from '@ktw/ktools';

const app = {
  state: {
    // 当前浏览的目录节点对象
    currentCatalog: {},
    // 根据当前浏览的目录节点对象查询的子节点
    nodes: [],
    // 当前选择的节点对象列表
    selectNodes: [],
  },
  getters: {},
  mutations: {
    // 设置目录对象
    [types.SET_APP_CURRENT_CATALOG](state, catalog) {
      state.currentCatalog = catalog;
    },
    // 对当前浏览的目录节点对象进行排序 默认降序排列
    [types.SORT_APP_NODES](state, { key, desc = true }) {
      state.nodes.sort((a, b) => {
        const judge = (b[key] || 0) - (a[key] || 0);
        return desc ? judge : -judge;
      });
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
  actions: {
    // 接受目录类型节点
    async [types.APP_NODES_FETCH]({ commit, state, rootState }, node) {
      const response = await api.db.findCatalog({
        owner: 1,
        ownerId: rootState.user.info.orgid,
        access: 1,
        hasChild: false,
        relatedType: 1,
        orderby: 'sort_asc',
        getmode: 'all',
        resourceTypeId: '1,2',
        parentId: node.childId,
      });
      state.nodes = response.data.filter(item => item.typeId !== '20102');
      commit(types.SET_APP_CURRENT_CATALOG, clone(node));
      commit(types.REMOVE_APP_SELECT_NODES);
    },
  },
};

export default app;
