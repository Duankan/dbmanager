import * as types from '../types';
import api from 'api';
import { cloneDeep } from '@ktw/ktools';
import FunManager from '../../utils/function-manager';

const bus = {
  state: {
    // 存储系统查询属性信息对象
    attribute: [],
    //存储字段信息
    field: [],
    //选择方案列表信息
    selectplandata: [],
    //存储方案列表信息
    plandata: {},
  },
  getters: {
    attribute: state => FunManager.getQueryOptions(state.attribute),
  },
  mutations: {
    // 添加属性表查询对象信息
    [types.SET_BUS_ATTRIBUTE](
      state,
      { options, queryOptions = options, attributeType = 'wfsQuery' }
    ) {
      if (attributeType === 'wfsQuery' && !options.url) throw new Error('wfs查询参数 url 缺失');
      const index = state.attribute.findIndex(item => item.url === options.url);
      // 把queryOptions参数放在中间件中存放
      const attribute = cloneDeep(state.attribute);
      const deepOptions = cloneDeep(options);
      deepOptions.options = queryOptions;
      deepOptions.attributeType = attributeType;
      if (index > 0) {
        // 当attribute数组中存在url与options.url一致的查询对象时，替换该查询对象为传入的options对象
        attribute.splice(index, 1, deepOptions);
        FunManager.setQueryOptions(attribute);
        state.attribute.splice(index, 1, options);
      } else {
        // 不存在时，则将options对象添加在数组的末端
        attribute.push(deepOptions);
        FunManager.setQueryOptions(attribute);
        state.attribute.push({ options, attributeType });
      }
    },
    // 移除所有的查询对象信息
    [types.REMOVE_BUS_ATTRIBUTE](state) {
      state.attribute = [];
      FunManager.setQueryOptions([]);
    },
    // 增加字段信息
    [types.SET_BUS_FIELD](state, field) {
      state.field = field;
    },
    // 移除所有的字段信息
    [types.REMOVE_BUS_FIELD](state) {
      state.field = [];
    },
    // 添加方案列表查询对象信息
    [types.SET_BUS_PLANDATA](state, data) {
      state.plandata = data;
    },
  },
  actions: {
    async [types.SET_BUS_SELECT_PLANDATA]({ commit, state, rootState }, options) {
      const response = await api.db.findResourcePlan(options);
      if (response.status === 200) {
        commit(types.SET_BUS_PLANDATA, cloneDeep(response.data));
      } else {
        commit(types.SET_BUS_PLANDATA, [response, 'dd']);
      }
    },
  },
};

export default bus;
