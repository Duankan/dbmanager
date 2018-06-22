import Vue from 'vue';
import Vuex from 'vuex';
// import Bus from '@ktw/kbus/src/store';
import User from '@ktw/user';
import Message from '@ktw/message';
import Permission from '@ktw/permission';
import Cache from '@ktw/cache';
import Queue from '@ktw/queue';
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

const modules = {};

(r =>
  r.keys().forEach(key => {
    modules[key.match(/\/(.+?)\.js$/)[1]] = r(key).default;
  }))(require.context('./modules', true, /\.js$/));

export default new Vuex.Store({
  actions,
  getters,
  modules,
  plugins: [
    Cache({
      key: 'datamanager',
      paths: ['app'],
    }),
    User,
    // Bus,
    Message,
    Permission,
    Queue,
  ],
  strict: process.env.NODE_ENV !== 'production',
});
