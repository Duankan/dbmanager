<script>
import config from 'config';
import api from 'api';
import * as types from '@/store/types';
import { isDirectory, isGisResource, isFile, canView } from '@/utils';

export default {
  name: 'ShortCut',
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isDirectory() {
      return isDirectory(this.node);
    },
    isGisResource() {
      return isGisResource(this.node);
    },
    isFile() {
      return isFile(this.node);
    },
  },
  methods: {
    canView(serviceList) {
      return canView(serviceList);
    },
    clickMore(type) {
      this[type]();
    },
    // 收藏目录
    async favor() {
      await api.db.addCommonCatalog({
        favoriteId: this.node.id, //目录id
        name: this.node.name, //目录名称（可自定）
        type: '1001', // 1001:目录 1002:服务 1003:数据
        userId: this.$appUser.id, //用户id
      });
      this.$events.emit('on-common-tree-update');
    },
    // 业务文件下载
    download() {
      const link = document.createElement('a');
      link.setAttribute(
        'href',
        `${config.project.YunServicesUrl}/clouddisk/gisserver/download/${
          this.node.fResourceId
        }?license=a3UjjlaLC9He&filename=${this.node.alias}`
      );
      // link.setAttribute('download', this.node.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    quickPublish() {
      this.$events.emit('on-quick-publish', this.node);
    },
    rename() {
      this.$store.commit(types.UPDATE_APP_NODES, Object.assign(this.node, { _rename: true }));
    },
    quickView() {
      this.$events.emit('on-quick-view', this.node);
    },
    information() {
      this.$events.emit('on-information', this.node);
    },
    deleteNode() {
      this.$store.commit(types.SET_APP_SELECT_NODES, this.node);
      this.$events.emit('on-delete', this.node);
    },
  },
};
</script>

<template>
  <div class="shortcut">
    <Icon
      v-if="isDirectory"
      size="20"
      color="red"
      type="bookmark"
      @click.native.stop="favor"></Icon>
    <Icon
      v-if="isFile"
      type="ios-cloud-download-outline"
      size="20"
      color="#358CF0"
      @click.native.stop="download"/>
    <Icon
      v-if="isFile"
      type="ios-trash-outline"
      size="20"
      color="#358CF0"
      @click.native.stop="deleteNode"></Icon>
    <Icon
      v-if="isGisResource && !canView(node.serviceList)"
      type="ios-paperplane-outline"
      size="22"
      color="#358CF0"
      @click.native.stop="quickPublish"></Icon>
    <Icon
      v-if="isGisResource && canView(node.serviceList)"
      type="ios-eye-outline"
      size="22"
      color="#358CF0"
      @click.native.stop="quickView"></Icon>
    <Icon
      v-if="isGisResource"
      type="ios-information-outline"
      size="20"
      color="#358CF0"
      @click.native.stop="information"></Icon>
    <Dropdown
      v-if="isGisResource"
      trigger="click"
      @on-click="clickMore"
      @click.native.stop>
      <Icon
        type="more"
        size="20"
        color="#358CF0" />
      <DropdownMenu slot="list">
        <DropdownItem name="rename">重命名</DropdownItem>
        <DropdownItem name="deleteNode">删除</DropdownItem>
      </dropdownMenu>
    </Dropdown>
  </div>
</template>

<style lang="less" scoped>
.shortcut {
  > * {
    padding: 0 6px;
    cursor: pointer;
  }
}
</style>
