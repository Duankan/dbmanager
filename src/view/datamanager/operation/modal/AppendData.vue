<script>
import * as types from '@/store/types';
import api from 'api';

/**
 * 追加数据模块
 */
export default {
  name: 'AppendData',
  props: {
    //对话框是否打开
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //是否在上传
      loading: false,
      //上传表单
      resource: {
        name: '',
        typeId: '20013',
      },
      //上传数据
      cloudFile: null,
    };
  },
  computed: {
    //当前目录
    current() {
      return this.$store.state.app.currentDirectory;
    },
    //当前选择节点
    node() {
      return this.$store.state.app.selectNodes[0];
    },
    //对话框标题
    title() {
      return this.node ? `追加数据到${this.node.name}` : '追加数据';
    },
  },
  methods: {
    //对话框可见性改变
    visibleChange(visible) {
      !visible && this.resetControl();
      this.$emit('input', visible);
    },
    //重置控件状态
    resetControl() {
      this.loading = false;
      this.resource.name = null;
      this.cloudFile = null;
      this.fileName = '';
    },
  },
};
</script>

<template>
  <Modal
    :value="value"
    :mask-closable="false"
    :title="title"
    width="480"
    @on-visible-change="visibleChange">
  </Modal>
</template>

<style lang="less">
</style>
