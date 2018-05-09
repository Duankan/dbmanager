import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import Kcore from '@ktw/kcore';
import Kmap from '@ktw/kmap';
import '@ktw/kmap/dist/kmap.min.css';
import { install as Ktools, shortKey } from '@ktw/ktools';
import filter from '@/filter';
import directive from '@/directive';
import event from '@/utils/event';
import store from '@/store';
import router from '@/router';
import App from './App';
import '@/components';
import '@/config/system/k-config-api';
import '@/styles/index.less';

Vue.config.devtools = true;
Vue.config.productionTip = false;

Vue.use(Kcore);
Vue.use(Kmap, store);
Vue.use(Ktools);
Vue.use(event);
Vue.use(shortKey, {});

sync(store, router);

// 全局注册filter
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key]);
});
// 全局注册directive
Object.keys(directive).forEach(key => {
  Vue.directive(key, directive[key]);
});

// 处理svg模块依赖
// 详情见： https://doc.webpack-china.org/guides/dependency-management/#require-context
const requireAll = (requireContext = {}) => requireContext.keys().map(requireContext);
const req = require.context('./assets/icon', true, /\.svg$/);
requireAll(req);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
