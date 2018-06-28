//axios 全局设置

import axios from 'axios';
import config from 'config';
import { Message, LoadingBar } from '@ktw/kcore';

axios.defaults.baseURL = config.project.basicUrl;

axios.interceptors.request.use(
  config => {
    LoadingBar.start();
    return config;
  },
  err => {
    console.table(err);
    Message.error({ message: '请求发生错误!' });
    return Promise.resolve(err);
  }
);

axios.interceptors.response.use(
  data => {
    LoadingBar.finish();
    return data;
  },
  err => {
    console.table(err);
    Message.error({ message: '请求发生错误!' });
    return Promise.resolve(err);
  }
);
