<script>
import CreateDirectory from './modal/CreateDirectory';

export default {
  name: 'OperationFixed',
  components: {
    CreateDirectory,
  },
  data() {
    return {
      directoryModal: false,
    };
  },
};
</script>

<template>
  <div class="operation-fixed">
    <Dropdown placement="bottom-start">
      <Button type="primary">
        <Icon
          type="upload"
          size="14"
          style="margin-right: 8px"></Icon>
        上传
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem>文件上传</DropdownItem>
        <DropdownItem>文件夹上传</DropdownItem>
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
    <CreateDirectory v-model="directoryModal"/>
  </div>
</template>

<style lang="less" scoped>
.k-dropdown {
  margin-right: 8px;
}
</style>
