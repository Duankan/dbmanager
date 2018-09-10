<script>
import * as types from '@/store/types';
import api from 'api';
import * as utils from '@/utils/helps';

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
  '20099', //第三方资源
];

/**
 * 资源上传模块
 */
export default {
  name: 'ResourceUploader',
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
      default: '文件上传',
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
        name: '',
        typeId: '20001',
      },
      //上传数据
      cloudFile: null,
      //数据文件
      fileName: '',
      //文件过滤器
      fileAccept: 'application/zip',
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
    //是否多文件上传
    multiple() {
      return false;
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
        name: '',
        typeId: '',
      };
      this.cloudFile = null;
      this.fileName = '';
    },
    //获取上传文件
    getUploadFile(file) {
      this.cloudFile = file;
      this.fileName = file.name;
      return false;
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
      if (!this.resource.name) {
        this.$Message.warning('请输入数据名称！');
        return;
      }
      if (this.resource.name.length > 64) {
        this.$Message.warning('数据名称长度不能超过64个字符！');
        return;
      }
      if (!this.resource.typeId) {
        this.$Message.warning('请选择文件类型！');
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
      //上传文件到云盘
      let fileInfo = await this.uploadCloudFile();
      if (!fileInfo.data.id) {
        this.loading = false;
        this.$Message.error('上传文件失败！');
        return;
      }
      //新增为应用资源
      let addValid = await this.addCloudResource(fileInfo.data);
      if (!addValid) return;
      //刷新目录节点
      await this.$store.dispatch(types.APP_NODES_FETCH, this.current);
      this.loading = false;
      this.visibleChange(false);
      this.$Message.success('文件上传成功！');
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
    //上传文件到云盘
    async uploadCloudFile() {
      let resourceType = this.resourceTypes.find(p => p.id == this.resource.typeId);
      let fd = new FormData();
      if (this.resource.type === '1') {
        //上传业务数据到云盘
        fd.append('file', this.cloudFile);
        return api.db.commonResourceUpload({ id: resourceType.dataTypeId }, fd, {
          headers: { 'User-Operation-Info': 'a3UjjlaLC9He' },
        });
      } else if (this.resource.type === '2') {
        //上传GIS数据到云盘
        fd.append('file', this.cloudFile);
        fd.append('hasparent', '0');
        fd.append('resourcetypeid', resourceType.dataTypeId);
        return api.db.upload({}, fd, {
          headers: { 'User-Operation-Info': 'a3UjjlaLC9He' },
        });
      }
    },
    //新增为应用资源
    async addCloudResource(fileInfo) {
      let params = {
        name: this.resource.name,
        alias: this.resource.name,
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
      const postInfo = await api.db.addresource(postData).catch(p => {
        this.loading = false;
        return p;
      });
      return postInfo.status == 200 && !postInfo.data.message;
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
        label="数据名称：">
        <Input
          v-model="resource.name"
          placeholder="请输入数据名称" />
      </FormItem>
      <FormItem
        label="数据类型：">
        <Select
          v-model="resource.typeId"
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
      :before-upload="getUploadFile"
      :show-upload-list="true"
      :accept="fileAccept"
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

<style lang="less" scoped>
</style>
