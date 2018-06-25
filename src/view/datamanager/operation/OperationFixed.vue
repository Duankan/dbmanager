<script>
import Uploader from './modal/Uploader';
import CreateDirectory from './modal/CreateDirectory';
import LinkThirdPartService from './modal/LinkThirdPartService';

export default {
  name: 'OperationFixed',
  components: {
    Uploader,
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
    'on-upload': function(params) {
      if (params) {
        for (const key in params) {
          this[key] = params[key];
        }
      }
      this.uploaderModal = true;
    },
  },
  methods: {
    upload(name) {
      this.$events.emit('on-upload', { dictionary: name === 'dictionary' });
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
      placement="bottom-start"
      @on-click="upload">
      <Button
        type="primary"
        @click="upload('file')">
        <Icon
          type="upload"
          size="14"
          style="margin-right: 8px"></Icon>
        上传
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem name="file">文件上传</DropdownItem>
        <DropdownItem name="dictionary">文件夹上传</DropdownItem>
      </DropdownMenu>
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
    <Uploader
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
