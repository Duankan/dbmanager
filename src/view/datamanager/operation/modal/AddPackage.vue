<script>
import config from 'config';
import * as types from '@/store/types';
import { date } from '@ktw/ktools';

/*
 * 增量包上传模块
 */
export default {
  name: 'AddPackage',
  props: {
    //对话框是否打开
    value: {
      type: Boolean,
      default: false,
    },
    //是否可以上传多个文件
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //显示自定义文件列表
      showCustomFileList: true,
      //上传文件类型
      typeId: '20099',
      //上传头部信息
      headers: { 'User-Operation-Info': 'a3UjjlaLC9He' },
      //上传文件列表
      uploadFiles: [],
      //已完成的上传文件
      completedFiles: [],
      //上传地址
      uploadUrl: `${config.project.YunServicesUrl}/clouddisk/gisserver/upload`,
      //是否正在上传
      loading: false,
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
      return this.node ? `追加增量包到${this.node.name}` : '追加增量包';
    },
  },
  methods: {
    //对话框显示改变
    visibleChange(visible) {
      !visible && this.resetControl();
      this.$emit('input', visible);
    },
    //重置控件状态
    resetControl() {
      this.uploadFiles = [];
      this.$refs.upload.clearFiles();
      this.showCustomFileList = true;
      this.loading = false;
      this.completedFiles = [];
    },
    //取消自动上传
    handleUpload(file) {
      this.uploadFiles.push(file);
      return false;
    },
    //删除上传文件
    deleteFile(item) {
      for (let i = this.uploadFiles.length - 1; i >= 0; i--) {
        let file = this.uploadFiles[i];
        if (item.name == file.name) {
          this.uploadFiles.splice(i, 1);
        }
      }
    },
    //开始上传文件
    upload() {
      if (this.uploadFiles.length === 0) {
        this.$Message.error('未选择上传文件');
        return false;
      }
      this.completedFiles = [];
      this.showCustomFileList = false;
      this.loading = true;
      this.$refs.upload.clearFiles();
      for (let i = 0; i < this.uploadFiles.length; i++) {
        let item = this.uploadFiles[i];
        let fileData = {
          hasparent: '0',
          resourcetypeid: this.typeId,
        };
        this.$refs.upload.post(item, fileData);
      }
    },
    //文件上传完成
    uploadSuccess(file, fileInfo) {
      this.completedFiles.push(file);
      if (this.completedFiles.length == this.uploadFiles.length) {
        //上传完成，检查是否全部上传成功
        let failedFiles = this.completedFiles.filter(p => !p.data);
        if (failedFiles.length > 0) {
          this.loading = false;
          this.$Message.error({
            content: `文件上传中有${failedFiles.length}个失败，增量包更新失败！`,
            duration: 2,
          });
        } else {
          this.addPackage(this.completedFiles);
        }
      }
    },
    //增量包更新
    async addPackage(resources) {
      let requests = resources.map(p => this.addPackageMock(p));
      let responses = await Promise.all(requests);
      this.addPollTask(responses);
      this.loading = false;
      this.$Notice.info({
        title: `${this.node.name}增量包上传完成`,
        desc: `增量包更新任务已进入后台队列，处理完成后会通知用户！`,
      });
      this.visibleChange(false);
    },
    //模拟增量包更新
    async addPackageMock(resource) {
      return new Promise((resolve, reject) => {
        const response = api.db.addpackage(
          {
            name: this.node.name,
            updatePath: resource.data.path,
          },
          {},
          {
            headers: { Authorization: 'Basic YWRtaW46Z2Vvc2VydmVy' },
          }
        );
        resolve(response);
      });
    },
    //新增轮询任务
    addPollTask(responses) {
      responses.forEach(p => {
        let task = {
          taskId: p.data,
          taskType: '增量包更新',
          taskName: this.node.name,
          taskTime: date.format(new Date(), 'YYYY-M-D HH:mm'),
        };
        this.$store.commit(types.ADD_POLL_TASK, task);
      });
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
    <Upload
      ref="upload"
      :headers="headers"
      :before-upload="handleUpload"
      :on-success="uploadSuccess"
      :on-remove="deleteFile"
      :action="uploadUrl"
      :multiple="multiple"
      type="drag">
      <div style="padding: 30px 0">
        <Icon
          type="ios-cloud-upload"
          size="52"
          style="color: #3399ff"></Icon>
        <p>点击或拖拽文件上传增量包</p>
      </div>
    </Upload>
    <ul
      v-if="showCustomFileList"
      class="k-upload-list">
      <li
        v-for="(item, index) in uploadFiles"
        :key="index"
        track-by="$index"
        class="k-upload-list-file">
        <Icon type="document" />
        <span>{{ item.name }}</span>
        <Icon
          type="ios-close-empty"
          class="k-upload-list-remove"
          @click.native="deleteFile(item)" />
      </li>
    </ul>
    <div slot="footer">
      <Button
        type="success"
        size="large"
        long
        @click="upload">上传</Button>
    </div>
    <Spin
      v-if="loading"
      fix>
      <Icon
        type="load-c"
        size="18"
        class="circle-spin-icon-load"></Icon>
    <div>正在追加文件...</div></Spin>
  </Modal>
</template>

<style lang="less">
</style>
