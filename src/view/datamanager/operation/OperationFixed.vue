<script>
import ResourceUploader from './modal/ResourceUploader';
import BatchResourceUploader from './modal/BatchResourceUploader';
import CreateDirectory from './modal/CreateDirectory';
import LinkThirdPartService from './modal/LinkThirdPartService';

export default {
  name: 'OperationFixed',
  components: {
    ResourceUploader,
    BatchResourceUploader,
    CreateDirectory,
    LinkThirdPartService,
  },
  data() {
    return {
      dictionary: false,
      title: '文件上传',
      uploaderModal: false,
      batchUploaderModal: false,
      directoryModal: false,
      linkServiceModal: false,
    };
  },
  events: {
    'on-upload': 'invokeUpload',
  },
  methods: {
    //接收上传事件
    invokeUpload(params) {
      //混合上传参数(dictionary,title)
      for (let key in params) {
        this[key] = params[key];
      }
      this.uploaderModal = true;
    },
    upload(name) {
      this.title = '文件上传';
      this.uploaderModal = true;
    },
    batchUpload() {
      this.batchUploaderModal = true;
    },
    linkService() {
      this.linkServiceModal = true;
    },
  },
};
</script>

<template>
  <div class="operation-fixed">
    <Dropdown
      trigger="click"
      placement="bottom-start">
      <Button
        type="primary">
        <Icon
          type="upload"
          size="14"
          style="margin-right: 8px"></Icon>
        上传
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem @click.native="upload">单个上传</DropdownItem>
        <DropdownItem @click.native="batchUpload">批量上传</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Dropdown
      placement="bottom-start"
      trigger="click">
      <Button type="primary">
        <Icon
          type="android-share-alt"
          size="14"
          style="margin-right: 8px"></Icon>
        连接
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem @click.native="linkService">第三方服务</DropdownItem>
        <DropdownItem>空间数据库</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <LinkThirdPartService v-model="linkServiceModal" />
    <Button
      type="primary"
      @click="directoryModal = true">
      <Icon
        type="folder"
        size="14"
        style="margin-right: 8px"></Icon>
      新建文件夹
    </Button>
    <ResourceUploader
      v-model="uploaderModal"
      :title="title"
      :dictionary="dictionary"/>
    <BatchResourceUploader
      v-model="batchUploaderModal" />
    <CreateDirectory v-model="directoryModal"/>
  </div>
</template>

<style lang="less" scoped>
.k-dropdown {
  margin-right: 8px;
}
</style>
