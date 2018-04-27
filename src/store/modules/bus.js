import * as types from '../types';
import { cloneDeep } from '@ktw/ktools';

const bus = {
  state: {
    // 存储系统目录信息
    catalog: {},
    // 存储系统资源信息
    resource: {},
    // 存储系统服务信息
    service: {},
    // 存储系统需要发布的资源信息
    publish: [],
    // 存储系统查询属性信息对象
    attribute: [],
  },
  mutations: {
    // 存储、更新目录
    [types.SET_BUS_CATALOG](state, catalog) {
      catalog = Array.isArray(catalog) ? catalog : [catalog];
      catalog.forEach(item => {
        if (!state.catalog[item.id]) {
          state.catalog[item.id] = cloneDeep(item);
        }
      });
    },
    // 存储、更新资源信息
    [types.SET_BUS_RESOURCE](state, resource) {
      resource = Array.isArray(resource) ? resource : [resource];
      resource.forEach(item => {
        if (!state.resource[item.id]) {
          state.resource[item.id] = cloneDeep(item);
        }
      });
    },
    // 存储、更新服务信息
    [types.SET_BUS_SERVICE](state, service) {
      service = Array.isArray(service) ? service : [service];
      if (!state.service[service[0].servicesname]) {
        state.service[service[0].servicesname] = cloneDeep(service);
      }
    },
    // 服务发布提交
    [types.SET_BUS_PUBLISH](state, resources) {
      if (Array.isArray(resources)) {
        state.publish = state.publish.concat(cloneDeep(resources));
      } else {
        state.publish.push(cloneDeep(resources));
      }
    },
    // 移除所有需要发布的资源信息
    [types.REMOVE_BUS_PUBLISH](state) {
      state.publish = [];
    },
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
