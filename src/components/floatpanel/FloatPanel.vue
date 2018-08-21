<script>
/*
 * 浮动面板
 */
export default {
  name: 'FloatPanel',
  props: {
    //是否可见
    value: {
      type: Boolean,
      default: false,
    },
    //标题
    title: {
      type: String,
      default: '浮动窗口',
    },
    //初始宽度
    width: {
      type: Number,
      default: 250,
    },
    //初始内容高度
    height: {
      type: Number,
      default: null,
    },
    //初始位置
    position: {
      type: Object,
      validator(value) {
        return 'x' in value && 'y' in value;
      },
      default: () => {
        return {
          x: 0,
          y: 0,
        };
      },
    },
    //关闭行为，如果设为true，则点击关闭组件会销毁，这种方式适用于通过FloatPanelManager创建的实例
    //组件一旦被销毁，再无法通过value属性控制组件显示
    //设置为false，则组件只是被隐藏，这种方式适用于通过模板创建的实例
    closeBehavior: {
      type: Boolean,
      default: false,
    },
    //禁用拖拽
    disableDrag: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //窗口是否可见
      visible: this.value,
    };
  },
  computed: {
    wrapStyle() {
      return {
        width: `${this.width}px`,
      };
    },
    contentStyle() {
      return {
        height: this.height ? `${this.height}px` : 'auto',
      };
    },
  },
  watch: {
    value(val) {
      this.visible = val;
    },
  },
  methods: {
    //隐藏窗口(模板组件调用此方法关闭窗口)
    hide() {
      this.visible = false;
      this.$emit('input', false);
    },
    //关闭窗口(FloatPanelManager调用此方法关闭窗口)
    close() {
      this.visible = false;
      this.$emit('input', false);
      this.$FloatPanel.remove(this.panelId);
    },
    doClose() {
      this.$emit('close');
      this.closeBehavior ? this.close() : this.hide();
    },
    //获取内容组件
    getContent() {
      return this.$children[0].$children[0].$children[1];
    },
  },
};
</script>
<template>
  <Draggable
    v-show="visible"
    :style="wrapStyle"
    :default-position="position"
    :disabled="disableDrag"
    bounds="parent"
    class="float-panel-wrapper"
    handle="strong">
    <div class="drag-box" >
      <strong class="cursor">
        <div class="drag-title">
          <div class="panel-title">{{ title }}</div>
          <SvgIcon
            :size="18"
            icon-class="close"
            title="关闭"
            class="panel-close"
            @click.native="doClose"></SvgIcon>
        </div>
      </strong>
      <div
        slot="content"
        :style="contentStyle"
        class="panel-content">
        <slot></slot>
      </div>
    </div>
  </Draggable>
</template>

<style lang="less">
.float-panel-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  z-index: 3000;
  min-width: 150px;
  user-select: none;

  .drag-title {
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #d9d9d9;
    background-color: #318cf0;
    color: #ffffff;
    border-radius: 2px 2px 0 0;
    padding-left: 7px;
    position: relative;
  }

  .panel-close {
    position: absolute;
    right: 5px;
    top: 3px;
    cursor: pointer;
  }

  .panel-content {
    background-color: #ffffff;
  }

  .k-draggable,
  .cursor {
    cursor: move;
    user-select: none;
  }
}
</style>
