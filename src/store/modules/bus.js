import * as types from '../types';

const bus = {
  state: {
    // 存储系统查询属性信息对象
    attribute: [],
  },
  mutations: {
    // 添加属性表查询对象信息
    [types.SET_BUS_ATTRIBUTE](state, options) {
      if (!options.url) throw new Error('wfs查询参数 url 缺失');
      const index = state.attribute.findIndex(item => item.url === options.url);
      if (index > 0) {
        // 当attribute数组中存在url与options.url一致的查询对象时，替换该查询对象为传入的options对象
        state.attribute.splice(index, 1, options);
      } else {
        // 不存在时，则将options对象添加在数组的末端
        state.attribute.push(options);
      }
    },
    // 移除所有的查询对象信息
    [types.REMOVE_BUS_ATTRIBUTE](state) {
      state.attribute = [];
    },
  },
};

export default bus;
