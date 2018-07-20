<script>
import config from 'config';

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
      //显示自定义文件列表
      showCustomFileList: true,
      //上传文件类型
      typeId: '20001',
      //上传头部信息
      headers: { 'User-Operation-Info': 'a3UjjlaLC9He' },
      //上传文件列表
      uploadFiles: [],
      //已完成的上传文件
      completedFiles: [],
      //正在追加的资源
      currentIdx: 0,
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
      return this.node ? `追加数据到${this.node.name}` : '追加数据';
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
      this.currentIdx = 0;
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
          resourcetypeid: '20001',
        };
        this.$refs.upload.post(item, fileData);
      }
    },
    //文件上传完成
    uploadSuccess(file, fileList) {
      this.completedFiles.push(file);
      if (this.completedFiles.length == this.uploadFiles.length) {
        //上传完成，检查是否全部上传成功
        let failedFiles = this.completedFiles.filter(p => !p.data);
        if (failedFiles.length > 0) {
          this.loading = false;
          this.$Message.error({
            content: `文件上传中有${failedFiles.length}个失败，数据追加终止！`,
            duration: 2,
          });
        } else {
          this.appendResource(this.completedFiles);
        }
      }
    },
    //追加资源
    async appendResource(resources) {
      let resource = resources[this.currentIdx];
      let success = true;
      const response = await api.db
        .appendData({
          resourceId: this.node.id,
          alias: resource.data.name,
          typeId: this.typeId,
          classify: '',
          description: '',
          catalogId: this.current.childId,
          userId: this.$appUser.id,
          userName: this.$appUser.name,
          orgId: this.$appUser.orgid,
          orgName: this.$appUser.orgname,
          ...resource.data,
        })
        .catch(p => {
          success = false;
        });
      if (success && response.statusCode == 200) {
        this.currentIdx++;
        if (this.currentIdx < resources.length) {
          this.appendResource(resources);
        } else {
          this.$Message.success('数据追加成功！');
          this.loading = false;
        }
      } else {
        this.$Message.error('数据追加失败，已终止！');
        this.loading = false;
      }
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
      multiple
      type="drag">
      <div style="padding: 30px 0">
        <Icon
          type="ios-cloud-upload"
          size="52"
          style="color: #3399ff"></Icon>
        <p>点击或拖拽文件上传追加数据</p>
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
    <div>正在上传文件...</div></Spin>
  </Modal>
</template>

<style lang="less">
</style>
