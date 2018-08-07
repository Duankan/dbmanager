import * as types from '../types';
import api from 'api';
import { cloneDeep } from '@ktw/ktools';
import { isDirectory, isFile, isSld, isGisResource } from '@/utils';

const app = {
  state: {
    // 当前浏览的目录节点对象
    currentDirectory: {},
    // 根据当前浏览的目录节点对象查询的子节点
    nodes: [],
    // 当前选择的节点对象列表
    selectNodes: [],
    //当前选择的数据节点
    selectNode: {},
    searchKey: '',
  },
  getters: {},
  mutations: {
    // 设置目录对象
    [types.SET_APP_CURRENT_DIRECTORY](state, directory) {
      state.currentDirectory = directory;
    },
    // 对当前浏览的目录节点对象进行排序 默认降序排列
    [types.SORT_APP_NODES](state, { key, desc = true }) {
      state.nodes.sort((a, b) => {
        const judge = (b[key] || 0) - (a[key] || 0);
        return desc ? judge : -judge;
      });
    },
    [types.UPDATE_APP_NODES](state, node) {
      const index = state.nodes.findIndex(ele => ele.id === node.id);
      state.nodes.splice(index, 1, node);
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
    [types.CHANGE_APP_NODES](state, node) {
      state.nodes = node;
    },
  },
  actions: {
    // 接受目录类型节点
    async [types.APP_NODES_FETCH]({ commit, state, rootState }, node) {
      state.selectNode = node;
      state.searchKey = '';
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
      const nodes = response.data.filter(item => item.typeId !== '20102');
      commit(types.CHANGE_APP_NODES, nodes);
      commit(types.SET_APP_CURRENT_DIRECTORY, cloneDeep(node));
      commit(types.REMOVE_APP_SELECT_NODES);
    },
    //根据关键字过滤删选文件
    async [types.APP_NODES_TABLE]({ commit, state, rootState }, keyStr) {
      state.searchKey = keyStr;
      const response = await api.db.findpagelist({
        objCondition: {
          orgId: rootState.user.info.orgid,
          findChildOrg: false,
          name: keyStr,
        },
        pageIndex: 1,
        pageSize: 50,
      });
      const nodes = response.data.dataSource;
      commit(types.CHANGE_APP_NODES, nodes);
      commit(types.REMOVE_APP_SELECT_NODES);
    },

    // 删除选择的节点数据
    async [types.APP_SELECT_NODES_DELETE]({ dispatch, state }) {
      // 删除非空的目录
      const directoryNode = state.selectNodes.filter(node => isDirectory(node));
      if (directoryNode.length) {
        await Promise.all(directoryNode.map(node => api.db.deleteCatalog({ id: node.id })));
      }
      // 删除gis资源和业务文件
      const resourceNode = state.selectNodes.filter(node => isGisResource(node) || isFile(node));
      if (resourceNode.length) {
        await api.db.deleteResource(resourceNode.map(node => node.id));
      }
      // 删除样式文件
      const styleNode = state.selectNodes.filter(node => isSld(node));
      if (styleNode.length) {
        await Promise.all(styleNode.map(node => api.db.deleteStyle({ id: node.id })));
      }
      // 重新获取当前目录下节点
      dispatch(types.APP_NODES_FETCH, state.currentDirectory);
    },
  },
};

export default app;
