<script>
import * as types from '@/store/types';
import config from 'config';
import api from 'api';

export default {
  name: 'Upload',
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
    type: {
      type: String,
      validator(val) {
        return ['normal', 'style', 'metaData'].includes(val);
      },
      default: 'normal',
    },
  },
  data() {
    return {
      loading: false,
      resourceType: [],
      styleType: [],
      style: {
        classify: '',
      },
      resource: {
        type: '1',
        typeId: '10000',
      },
    };
  },
  computed: {
    current() {
      return this.$store.state.app.currentDirectory;
    },
    node() {
      return this.$store.state.app.selectNodes[0];
    },
    gisResourceType() {
      return this.resourceType.filter(item => item.parentId === '2');
    },
    action() {
      return `${config.project.YunServicesUrl}/clouddisk/gisserver/taskupload`;
    },
    multiple() {
      return this.type !== 'metaData';
    },
  },
  async created() {
    let response = await api.db.findResourceType({
      parentId: '1,2',
    });
    this.resourceType = response.data;

    response = await api.db.styleTypes();
    this.styleType = response.data;
  },
  methods: {
    visibleChange(visible) {
      this.$emit('input', visible);
    },
    // gis文件上传
    gisUpload() {},

    // 业务文件上传

    // 元数据上传
    async metaDataUpload() {
      await api.db.publishService({
        catalogId: this.current.childId,
        resourceId: this.node.id,
        name: this.node.name,
        title: this.node.alias,
        crs: '4490',
        styles: '',
        limits: 1,
        serviceType: '6,12',
        styleSourceType: '2',
        metadataLayer: 1,
        userId: this.$user.id,
      });
    },

    // 样式文件上传
    async styleUpload() {
      this.$refs.upload.files.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append(
          'data',
          JSON.stringify({
            name: file.name,
            alias: file.name,
            description: '',
            classify: this.style.classify,
            typeId: '20102',
            TypeName: 'sld',
            catalogId: this.current.childId,
            userId: this.$user.id,
            userName: this.$user.name,
            orgId: this.$user.orgid,
            orgName: this.$user.orgname,
          })
        );
        return api.db.addStyle(formData);
      });
    },

    // 点击上传按钮
    upload() {
      this.loading = true;
      this.$refs.upload.upload();
    },

    // 文件上传重命名检查
    checkFileName() {},

    // 上传成功触发回调 测试单个文件上传流程
    async uploadSuccess(rootFile, file, message, chunk) {
      message = JSON.parse(message);
      let { name, ...rest } = message.data;

      const fileName = file.name.slice(0, file.name.lastIndexOf('.'));

      await api.db.addresource({
        name: fileName,
        alias: fileName,
        typeId: this.resource.typeId,
        classify: '',
        description: '',
        catalogId: this.current.childId,
        userId: this.$user.id,
        userName: this.$user.name,
        orgId: this.$user.orgid,
        orgName: this.$user.orgname,
        ...rest,
      });
      await this.$store.dispatch(types.APP_NODES_FETCH, this.current);
      this.loading = false;
      this.visibleChange(false);
      this.$Message.success('文件上传成功！');
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
      v-if="type === 'normal'"
      :model="resource"
      :label-width="70">
      <FormItem label="文件类别">
        <RadioGroup v-model="resource.type">
          <Radio label="1">空间数据</Radio>
          <Radio label="2">业务文件</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem
        v-if="resource.type === '1'"
        label="数据类型">
        <Select
          v-model="resource.typeId"
          filterable>
          <Option
            v-for="item in gisResourceType"
            :key="item.id"
            :value="item.id">{{ item.resourceTypeName }}</Option>
        </Select>
      </FormItem>
    </Form>
    <Form
      v-if="type === 'style'"
      :model="style"
      :label-width="70">
      <FormItem
        label="样式分类:">
        <Select
          v-model="style.classify"
          clearable
          filterable>
          <Option
            v-for="item in styleType"
            :key="item.id"
            :value="item.code">{{ item.data }}</Option>
        </Select>
      </FormItem>
    </Form>
    <Uploader
      v-if="value"
      ref="upload"
      :dictionary="dictionary"
      :multiple="multiple"
      :action="action"
      :on-success="uploadSuccess"
      type="drag">
      <div style="padding: 60px 0">
        <Icon
          type="ios-cloud-upload"
          size="52"
          color="#358CF0"></Icon>
        <p>点击 或者 拖拽 文件/文件夹 以上传</p>
      </div>
    </Uploader>
    <div slot="footer">
      <Button
        :loading="loading"
        type="success"
        size="large"
        long
        @click="upload">上传</Button>
    </div>
  </Modal>
</template>

<style lang="less" scoped>
</style>
