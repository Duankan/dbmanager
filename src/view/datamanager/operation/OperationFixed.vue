<script>
import ResourceUploader from './modal/ResourceUploader';
import CreateDirectory from './modal/CreateDirectory';
import LinkThirdPartService from './modal/LinkThirdPartService';

export default {
  name: 'OperationFixed',
  components: {
    ResourceUploader,
    CreateDirectory,
    LinkThirdPartService,
  },
  data() {
    return {
      dictionary: false,
      type: 'normal',
      title: '文件上传',
      uploaderModal: false,
      directoryModal: false,
      linkServiceModal: false,
    };
  },
  events: {
    'on-upload': 'invokeUpload',
  },
  methods: {
    invokeUpload(params) {
      if (params) {
        for (const key in params) {
          this[key] = params[key];
        }
      }
      this.uploaderModal = true;
    },
    upload(name) {
      // this.$events.emit('on-upload');
      this.uploaderModal = true;
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
      placement="bottom-start">
      <Button
        type="primary"
        @click="upload">
        <Icon
          type="upload"
          size="14"
          style="margin-right: 8px"></Icon>
        上传
      </Button>
    </Dropdown>
    <Dropdown placement="bottom-start">
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
      type="ghost"
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
      :dictionary="dictionary"
      :type="type"/>
    <CreateDirectory v-model="directoryModal"/>
  </div>
</template>

<style lang="less" scoped>
.k-dropdown {
  margin-right: 8px;
}
</style>
