<script>
import * as types from '@/store/types';
import api from 'api';

/**
 * 上传元数据模块
 */
export default {
  name: 'UploadMataData',
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
      //数据文件
      fileName: '',
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
      return this.node ? `上传元数据到${this.node.name}` : '上传元数据';
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
    //获取上传文件
    getUploadFile(file) {
      this.cloudFile = file;
      this.fileName = file.name;
      return false;
    },
    //上传资源到云盘
    async uploadCloudResource() {
      //表单数据校验
      if (!this.resource.name) {
        this.$Message.warning('请输入数据名称！');
        return;
      }
      if (this.cloudFile == null) {
        this.$Message.warning('请选择上传文件！');
        return;
      }
      this.loading = true;
      //检查文件名
      let checkValid = await this.checkFileName();
      if (!checkValid) return;
    },
    //检查文件名
    async checkFileName() {
      const nameInfo = await api.db
        .nameCheck({
          name: this.resource.name,
          catalogId: this.current.childId,
        })
        .catch(p => {
          this.loading = false;
          return p;
        });
      return nameInfo.data.statusCode == 200;
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
    <Form
      :model="resource"
      :label-width="90">
      <FormItem
        label="数据名称：">
        <Input
          v-model="resource.name"
          placeholder="请输入数据名称" />
      </FormItem>
    </Form>
    <Upload
      ref="upload"
      :before-upload="getUploadFile"
      :show-upload-list="true"
      action="#"
      type="drag">
      <div style="padding: 30px 0">
        <Icon
          type="ios-cloud-upload"
          size="52"
          color="#358CF0"></Icon>
        <p>点击或者拖拽文件上传</p>
      </div>
    </Upload>
    <div>{{ fileName }}</div>
    <div slot="footer">
      <Button
        type="success"
        size="large"
        long
        @click="uploadCloudResource">上传</Button>
    </div>
    <Spin
      v-if="loading"
      fix>
      <Icon
        type="load-c"
        size="18"
        class="circle-spin-icon-load"></Icon>
    <div>正在上传文件...</div></Spin>
  </Modal>
</template>
<style lang="less">
</style>
