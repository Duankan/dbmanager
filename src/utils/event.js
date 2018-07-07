function validate(value) {
  return typeof value == 'number' && value > 0;
}

class Event {
  constructor() {
    this._events = {};
  }
  // options: { priority 优先级, after 多少次之后触发, before 多少次之后将一直返回最后一次触发的值， times 调用多少次之后解除绑定  }
  on(eventName, callback, options = {}) {
    for (const key in options) {
      if (!validate(options[key])) {
        throw new Error(`${key} 类型错误，应为正整数！`);
        return;
      }
    }
    options.priority = options.priority == undefined ? 0 : options.priority;
    callback._options = options;
    if (!this._events[eventName]) {
      this._events[eventName] = { hookers: [callback] };
    } else if (!this._events[eventName].hookers) {
      this._events[eventName].hookers = [];
      this._events[eventName].hookers.push(callback);
    } else {
      this._events[eventName].hookers.push(callback);
      this._events[eventName].hookers.sort((a, b) => {
        return b._options.priority - a._options.priority;
      });
    }
  }
  once(eventName, callback) {
    this.on(eventName, callback, { times: 1 });
  }
  emit(eventName, payload, payloadCached = false) {
    if (this._events[eventName] && this._events[eventName].hookers) {
      this._events[eventName].hookers.forEach(callback => {
        // 记录调用次数
        if (!callback._options.count) {
          callback._options.count = 1;
        } else {
          callback._options.count += 1;
        }
        // 如果调用次数少于指定次数，不执行函数调用
        if (callback._options.after && callback._options.after < callback._options.count) {
          return;
        }
        // 如果调用次数超过指定次数，将一直返回上一次传递的值
        if (callback._options.before && callback._options.before > callback._options.count) {
          callback(callback._options.payload);
          return;
        }
        // 调用回调函数
        callback(payload);
        // 存储payload
        callback._options.payload = payload;
        // 超过调用次数 从队列中移除回调函数
        if (callback._options.times && callback._options.count >= callback._options.times) {
          this.off(eventName, callback);
        }
      });
    } else {
      // 缓存payload 等待事件监听时触发回调函数
      if (payloadCached) {
        this._events[eventName] = { payload };
      }
    }
  }
  off(eventName, callback) {
    if (callback) {
      const index = this._events[eventName].hookers.indexOf(callback);
      if (index >= 0) {
        this._events[eventName].hookers.splice(index, 1);
      }
      if (this._events[eventName].hookers.length == 0) {
        delete this._events[eventName];
      }
    } else {
      delete this._events[eventName];
    }
  }
  dispatch(componentName, eventName, params) {
    let parent = this.$parent || this.$root;
    let name = parent.$options.name;

    while (parent && (!name || name !== componentName)) {
      parent = parent.$parent;

      if (parent) {
        name = parent.$options.name;
      }
    }
    if (parent) {
      parent.$emit.apply(parent, [eventName].concat(params));
    }
  }
  broadcast(componentName, eventName, params) {
    this.$children.forEach(child => {
      const name = child.$options.name;

      if (name === componentName) {
        child.$emit.apply(child, [eventName].concat(params));
      } else {
        // todo 如果 params 是空数组，接收到的会是 undefined
        broadcast.apply(child, [componentName, eventName].concat([params]));
      }
    });
  }
}

export default {
  install(Vue, options = { ignore: false }) {
    const event = new Event();

    Vue.mixin({
      created() {
        if (this.$options.events) {
          for (const eventName in this.$options.events) {
            let target = this.$options.events[eventName];
            if (this[target]) {
              this.$events.on(eventName, this[target]);
            }
          }
        }
        this.$events.dispatch = this.$events.dispatch.bind(this);
        this.$events.broadcast = this.$events.broadcast.bind(this);
      },
      mounted() {
        if (this.$options.events) {
          for (const eventName in this.$events._events) {
            const payload = this.$events._events[eventName].payload;
            let target = this.$options.events[eventName];
            if (payload && target && this[target]) {
              this[target](payload);
            }
          }
        }
      },
      beforeDestroy() {
        if (this.$options.events) {
          for (const eventName in this.$options.events) {
            let target = this.$options.events[eventName];
            if (target && this[target]) {
              this.$events.off(eventName, this[target]);
            }
          }
        }
      },
    });

    Object.defineProperty(Vue.prototype, '$events', {
      get() {
        return event;
      },
    });
  },
};
