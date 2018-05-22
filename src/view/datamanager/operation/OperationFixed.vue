<script>
import Uploader from './modal/Uploader';
import CreateDirectory from './modal/CreateDirectory';

export default {
  name: 'OperationFixed',
  components: {
    Uploader,
    CreateDirectory,
  },
  data() {
    return {
      dictionary: false,
      uploaderModal: false,
      directoryModal: false,
    };
  },
  events: {
    'on-upload': function(name) {
      this.upload(name);
    },
  },
  methods: {
    upload(name) {
      this.dictionary = name === 'dictionary';
      this.uploaderModal = true;
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
        <DropdownItem>第三方服务</DropdownItem>
        <DropdownItem>空间数据库</DropdownItem>
      </DropdownMenu>
    </Dropdown>
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
      :dictionary="dictionary"/>
    <CreateDirectory v-model="directoryModal"/>
  </div>
</template>

<style lang="less" scoped>
.k-dropdown {
  margin-right: 8px;
}
</style>
