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
    //表格查询标签
    tableDatas: [],
  },

  getters: {},

  mutations: {
    [types.SEARCH_LABLE_DATAS](state, datas) {
      state.tagData = datas;
    },
    [types.SEARCH_TREE_DATAS](state, dataTree) {
      state.treeData = dataTree;
    },
    [types.SEARCH_TABLE_TAGS](state, tableData) {
      state.tableDatas = tableData;
    },
  },

  actions: {
    //标签数据列表
    async [types.SEARCH_LABLE_DATA]({ commit, state }) {
      const response = await api.db.findallBusiness({});
      const datas = response.data;
      //给列表每一项添加标记，用来判断点击状态
      for (let i in datas) {
        datas[i].isEdit = false;
      }
      commit(types.SEARCH_LABLE_DATAS, datas);
    },
    //分类数据
    async [types.SEARCH_TREE_DATA]({ commit, state }) {
      const response = await api.db.findalltypeBusiness({});
      const dataTree = response.data;
      // for (let i in dataTree) {
      //   dataTree[i].isEdits = false;
      //   debugger;
      // }
      commit(types.SEARCH_TREE_DATAS, dataTree);
    },
    //通过标签对表格元数据进行筛选
    async [types.SEARCH_TABLE_TAG]({ commit, state }, tableId) {
      const response = await api.db.findpagelistbusiness({
        name: '', //表名
        restype: '', //资源分类
        keyword: tableId, //标签关键字
        orderfield: '', //排序字段
        sort: '', //排序方式
        pageinfo: {
          pageIndex: 1, //当前页
          pageSize: 10, //每页总数
          orderby: '', //排序字段
        },
      });
      // 获取表格数据
      const tableData = response.data.dataSource;
      //获取表格分页的总页数
      const totalCount = response.data.pageInfo.totalCount;
      //获取表格分页的当前页
      const pageIndex = response.data.pageInfo.pageIndex;
      commit(types.SEARCH_TABLE_TAGS, tableData);
    },
  },
};

export default metadata;
