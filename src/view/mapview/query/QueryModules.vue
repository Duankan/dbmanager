<script>
import * as types from '@/store/types';
import * as queryModules from '../../../components';

export default {
  name: 'QueryModules',
  props: {
    modulesType: {
      type: String,
      validator(value) {
        return [
          'QueryAttrs',
          'QuerySpace',
          'QueryCompound',
          'Statistics',
          'Overlay',
          'ManageStyle',
          'ManageCRS',
        ].includes(value);
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
    width: {
      type: [Number, String],
      default: 420,
    },
    height: {
      type: [Number, String],
      default: 200,
    },
  },
  data() {
    return {};
  },
  watch: {
    isVisible(newVal) {
      if (!newVal) {
        this.$store.commit(types.CLOSE_BOTTOM_PANE);
        this.$events.emit('on-reset-query', true);
        this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'always' });
        this.$nextTick(() => {
          this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'once' });
        });
      }
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
    v-model="isVisible"
    :title="modulesTitle"
    :width="width"
    :height="height"
    :maximizable="false"
    :collapsible="false"
    :collapsed="false"
    :style="{left:'2.5%'}"
    footer-hide
    transfer
    @on-hidden="hidden">
    <component
      :is="modulesType"
    ></component>
  </Window>
</template>

<style lang="less" scoped>
</style>
