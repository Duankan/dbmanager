<script>
import * as types from '@/store/types';
import api from 'api';
import * as utils from '@/utils/helps';
import config from 'config';
import ColorRibbon from '@/components/colorribbon/ColorRibbon';

//排除的上传类型
const EXCLUDE_FILTERS = [
  '20003',
  '20004',
  '20007',
  '20008',
  '20009',
  '20010',
  '20011',
  '20014',
  '20015',
  '20101',
  '20102',
  '20013',
];

/*
 * 批量上传模块
 */
export default {
  name: 'BatchResourceUploader',
  components: {
    ColorRibbon,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    dictionary: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '批量文件上传',
    },
  },
  data() {
    return {
      //是否在上传
      loading: false,
      //资源类型
      resourceTypes: [],
      //上传表单
      resource: {
        type: '2',
        typeId: '20001',
      },
      //文件过滤器
      fileAccept: 'application/zip',
      //显示自定义文件列表
      showCustomFileList: true,
      //上传头部信息
      headers: {
        'User-Operation-Info': 'a3UjjlaLC9He',
      },
      //上传文件列表
      uploadFiles: [],
      //正在处理的文件
      processFiles: [],
      //是否显示结果信息
      showResult: false,
      //结果列
      resultColumns: [
        {
          title: '文件名',
          key: 'name',
          width: 200,
          ellipsis: true,
        },
        {
          title: '执行结果',
          key: 'stateText',
          width: 90,
          render: (h, params) => {
            return h(
              'span',
              {
                class: {
                  'failed-text': params.row.state == 0,
                },
              },
              params.row.stateText
            );
          },
        },
        {
          title: '状态消息',
          key: 'message',
          ellipsis: true,
        },
      ],
      //结果数据
      resultData: [],
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
    //当前选择业务类型
    currentResTypes() {
      return this.resourceTypes.filter(item => item.parentId === this.resource.type);
    },
    //上传地址
    uploadUrl() {
      let uploadUrl = config.project.YunServicesUrl;
      if (this.resource.type === '2') {
        return `${uploadUrl}/clouddisk/gisserver/upload`;
      } else {
        let resourceType = this.resourceTypes.find(p => p.id == this.resource.typeId);
        let dataTypeId = resourceType ? resourceType.dataTypeId : '';
        return `${uploadUrl}/clouddisk/commonresource/upload/${dataTypeId}`;
      }
    },
  },
  async created() {
    //获取资源分类
    let response = await api.db.findResourceType({
      parentId: '1,2',
    });
    let uploaderTypes = response.data;
    uploaderTypes = uploaderTypes.filter(p => EXCLUDE_FILTERS.indexOf(p.id) < 0);
    uploaderTypes.forEach(p => {
      p.accept = utils.getFileAccept(p.id);
    });
    this.resourceTypes = uploaderTypes;
  },
  methods: {
    visibleChange(visible) {
      !visible && this.resetControl();
      this.$emit('input', visible);
    },
    //重置控件状态
    resetControl() {
      this.loading = false;
      this.resource = {
        type: '2',
        typeId: '',
      };
      this.uploadFiles = [];
      this.$refs.upload.clearFiles();
      this.showCustomFileList = true;
      this.processFiles = [];
      this.showResult = false;
      this.resultData = [];
    },
    //取消自动上传
    handleUpload(file) {
      this.uploadFiles.push(file);
      return false;
    },
    //文件上传完成
    uploadSuccess(file, fileInfo) {
      let segment = this.processFiles.find(p => p.name == fileInfo.name);
      if (file.data.size == 0) {
        segment.state = 0;
        segment.message = '上传文件失败!';
        this.showOutput();
      } else {
        segment.state = 2;
        this.addCloudResource(file.data);
      }
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
    //设置文件过滤器
    setFileFilter(id) {
      if (id) {
        let resourceType = this.resourceTypes.find(p => p.id == id);
        this.fileAccept = resourceType.accept;
      } else {
        this.fileAccept = '*.*';
      }
    },
    //上传资源到云盘
    async uploadCloudResource() {
      //表单数据校验
      if (!this.resource.typeId) {
        this.$Message.error('请选择文件类型！');
        return;
      }
      if (this.uploadFiles.length === 0) {
        this.$Message.error('未选择上传文件');
        return;
      }
      this.processFiles = [];
      this.showCustomFileList = false;
      this.loading = true;
      this.$refs.upload.clearFiles();
      this.uploadCloudFile();
    },
    //上传文件到云盘
    async uploadCloudFile() {
      for (let i = 0; i < this.uploadFiles.length; i++) {
        let resourceType = this.resourceTypes.find(p => p.id == this.resource.typeId);
        let file = this.uploadFiles[i];
        let fileData = {};
        if (this.resource.type === '2') {
          fileData.hasparent = '0';
          fileData.resourcetypeid = resourceType.dataTypeId;
        }
        this.processFiles.push({
          name: file.name,
          state: 1,
          message: '',
        });
        this.$refs.upload.post(file, fileData);
      }
    },
    //新增为应用资源
    async addCloudResource(fileInfo) {
      let fileName = fileInfo.name.substr(0, fileInfo.name.lastIndexOf('.'));
      let segment = this.processFiles.find(p => p.name == fileInfo.name);
      let params = {
        name: fileName,
        alias: fileName,
        typeId: this.resource.typeId,
        classify: '',
        description: '',
        catalogId: this.current.childId,
        userId: this.$appUser.id,
        userName: this.$appUser.name,
        orgId: this.$appUser.orgid,
        orgName: this.$appUser.orgname,
      };
      let postData = Object.assign({}, fileInfo, params);
      const postInfo = await api.db
        .addresource(postData)
        .catch(p => {
          return p;
        })
        .then(p => {
          if (!(p instanceof Error) && p.status == 200 && !p.data.message) {
            segment.state = 3;
            segment.message = '文件上传成功！';
          } else {
            segment.state = 0;
            segment.message = '新增资源失败！';
          }
          this.showOutput();
        });
    },
    //显示结果输出
    showOutput() {
      //判断是否所有流程都执行完成
      let items = this.processFiles.filter(p => p.state == 3 || p.state == 0);
      let isFinished = this.processFiles.length == items.length;
      if (!isFinished) return;
      //输出执行结果
      this.loading = false;
      this.showResult = true;
      items.forEach(p => {
        p.stateText = p.state == 3 ? '成功' : '失败';
      });
      this.resultData = items;
      //刷新目录节点
      this.$store.dispatch(types.APP_NODES_FETCH, this.current);
    },
  },
};
</script>

<template>
  <Modal
    :value="value"
    :title="title"
    :mask-closable="false"
    width="480"
    @on-visible-change="visibleChange">
    <div v-show="!showResult">
      <Form
        :model="resource"
        :label-width="90">
        <FormItem label="文件类别：">
          <RadioGroup v-model="resource.type">
            <Radio label="2">空间数据</Radio>
            <Radio label="1">业务文件</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          label="数据类型：">
          <Select
            v-model="resource.typeId"
            filterable
            @on-change="setFileFilter">
            <Option
              v-for="item in currentResTypes"
              :key="item.id"
              :value="item.id">{{ item.resourceTypeName }}</Option>
          </Select>
        </FormItem>
      </Form>
      <Upload
        ref="upload"
        :headers="headers"
        :before-upload="handleUpload"
        :on-success="uploadSuccess"
        :on-remove="deleteFile"
        :action="uploadUrl"
        :accept="fileAccept"
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
      <Button
        type="success"
        size="large"
        long
        class="upload-button"
        @click="uploadCloudResource">上传</Button>
    </div>
    <div v-show="showResult">
      <h4 class="indicator">上传结果列表</h4>
      <Table
        :columns="resultColumns"
        :data="resultData"
        size="small"
        height="300"></Table>
    </div>
    <div slot="footer"></div>
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

<style lang="less" scoped>
/deep/ .k-modal-footer {
  display: none;
}
/deep/ .upload-button {
  margin-top: 5px;
}
/deep/ .indicator {
  margin: 4px 0 8px 0;
  text-indent: 8px;
  border-left: 2px solid #318cf0;
}
/deep/ .failed-text {
  color: red;
}
</style>
