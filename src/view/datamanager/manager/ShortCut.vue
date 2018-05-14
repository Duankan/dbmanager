<script>
import config from 'config';
import { isGisResource, isFile, canView } from '@/utils';

export default {
  name: 'ShortCut',
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  computed: {
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
    deleteNode() {},
    quickPublish() {},
    quickView() {},
    information() {},
  },
};
</script>

<template>
  <div class="shortcut">
    <Icon
      v-if="isFile"
      type="ios-cloud-download-outline"
      size="20"
      color="#358CF0"
      @click.stop.native="download"/>
    <Icon
      v-if="isFile"
      type="ios-trash-outline"
      size="20"
      color="#358CF0"
      @click.stop.native="deleteNode"></Icon>
    <Icon
      v-if="isGisResource && !canView(node.serviceList)"
      type="ios-paperplane-outline"
      size="22"
      color="#358CF0"
      @click.stop.native="quickPublish"></Icon>
    <Icon
      v-if="isGisResource && canView(node.serviceList)"
      type="ios-eye-outline"
      size="22"
      color="#358CF0"
      @click.stop.native="quickView"></Icon>
    <Icon
      v-if="isGisResource"
      type="ios-information-outline"
      size="20"
      color="#358CF0"
      @click.stop.native="information"></Icon>
    <Dropdown
      v-if="isGisResource"
      @on-click="clickMore">
      <Icon
        type="more"
        size="20"
        color="#358CF0" />
      <DropdownMenu slot="list">
        <DropdownItem name="move">移动到</DropdownItem>
        <DropdownItem name="rename">重命名</DropdownItem>
        <DropdownItem name="deleteNode">删除</DropdownItem>
      </dropdownMenu>
    </Dropdown>
  </div>
</template>

<style lang="less" scoped>
.shortcut {
  > * {
    margin-right: 14px;
    cursor: pointer;
  }
}
</style>
