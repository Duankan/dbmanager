<script>
export default {
  name: 'QueryModules',
  props: {
    modulesType: {
      type: String,
      validator(value) {
        return ['QueryAttrs', 'QuerySpace', 'QueryCompound', 'Statistics', 'Overlay'].includes(
          value
        );
      },
      default: '',
    },
    modulesTitle: {
      type: String,
      default: '复合查询',
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: this.isVisible,
    };
  },
  watch: {
    isVisible(newVal) {
      this.visible = newVal;
    },
  },
  methods: {
    //窗口关闭事件
    hidden() {
      this.$emit('on-change-visible', false);
    },
  },
};
</script>

<template>
  <Window
    v-model="visible"
    :title="modulesTitle"
    :resizable="false"
    :draggable="false"
    footer-hide
    @on-hidden="hidden">
    <component
      :is="modulesType"
    ></component>
  </Window>
</template>

<style lang="less" scoped>
/deep/.k-window {
  min-width: 420px;
  height: auto !important;
}
</style>
