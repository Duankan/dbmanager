/**
 * 用户信息附加到全局对象,$user在第一次登陆有问题
 */
export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$appUser', {
      get() {
        return JSON.parse(localStorage.user);
      },
    });
  },
};
