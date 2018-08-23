import Vue from 'vue';
import FloatPanel from './FloatPanel.vue';
import { uuid } from '@ktw/ktools';

/**
 * 浮动窗口默认选项
 */
const defaultOpts = {
  value: true,
  title: '浮动窗口',
  width: 250,
  position: {
    x: 0,
    y: 0,
  },
  closeBehavior: true,
};

/**
 * 浮动窗口管理器
 */
class FloatPanelManager {
  /**
   * Vuex Store对象
   * @param {Vuex.Store} store
   */
  constructor(store) {
    /**
     * 全局store对象，用来注入到所有子对象中
     */
    this.store = store;
    /**
     * 全局窗口对象集合
     */
    this.panels = {};
  }
  /**
   * 创建浮动窗口
   * @param {any} options 窗口选项
   */
  create(options = {}) {
    let vm = new Vue({
      store: this.store, //Vuex在全局设置mixin(见vuex组件注入源码)，这里设置store会注入到所有组件树
      render(h) {
        const props = Object.assign({}, defaultOpts, options);
        return h(
          FloatPanel,
          {
            props,
            ref: 'floatPanel',
            on: {
              close: () => {
                options.onClose && options.onClose();
              },
            },
          },
          [options.render ? options.render(h) : '']
        );
      },
    });
    //创建实例
    const mountElement = document.createElement('div');
    let parent = options.parent || document.body;
    parent.appendChild(mountElement);
    vm.$mount(mountElement);
    //添加到管理器中
    const instance = vm.$refs.floatPanel;
    instance.panelId = uuid();
    this.panels[instance.panelId] = instance;
    return instance;
  }

  /**
   * 隐藏浮动窗口
   * @param {String} id
   */
  hide(id) {
    let instance = this.panels[id];
    if (instance) {
      instance.hide();
    }
  }

  /**
   * 关闭浮动窗口
   * @param {String} id 窗口ID
   */
  remove(id) {
    let instance = this.panels[id];
    if (instance) {
      instance.$el.remove();
      instance.$destroy();
      delete this.panels[id];
    }
  }

  /**
   * 关闭所有窗口
   */
  removeAll() {
    for (let key in this.panels) {
      let instance = this.panels[key];
      instance.$el.remove();
      instance.$destroy();
    }
    this.panels = {};
  }
}

export default FloatPanelManager;
