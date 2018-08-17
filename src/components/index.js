import Vue from 'vue';
import FloatPanel from './floatpanel';

function importAll(r) {
  r.keys().forEach(key => {
    const name = key.match(/\/(\w+?)\.vue$/)[1];
    if (key.indexOf(name.toLowerCase()) > -1) {
      Vue.component(name, r(key).default);
    }
  });
}

// 处理公共模块依赖
importAll(require.context('./', true, /\.vue$/));

//处理需安装模块
const install = function(Vue, store) {
  Vue.prototype.$FloatPanel = new FloatPanel(store);
};

export default {
  install,
};
