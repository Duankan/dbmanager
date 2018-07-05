<script>
import * as types from '@/store/types';
import Navigator from './navigator/Navigator';
import Operation from './operation/Operation';
import DataBreadcrumb from './breadcrumb/DataBreadcrumb';
import DataGrid from './manager/DataGrid';
import DataTable from './manager/DataTable';
import Vue from 'vue';

export default {
  name: 'DataManager',
  components: {
    Navigator,
    Operation,
    DataBreadcrumb,
    DataGrid,
    DataTable,
  },
  data() {
    return {
      component: 'DataTable',
    };
  },
  methods: {
    upload(name) {
      this.$events.emit('on-upload', { dictionary: name === 'dictionary' });
    },
    sort(key) {
      this.$store.commit(types.SORT_APP_NODES, { key });
    },
    refresh() {
      const currentNode = this.$store.state.app.currentDirectory;
      this.$store.dispatch(types.APP_NODES_FETCH, currentNode);
    },
    overload() {
      this.$router.go(0);
    },
  },
};
</script>

<template>
  <div class="data-manager">
    <Navigator/>
    <ContextMenu ref="contextmenu">
      <ContextMenuSubmenu title="查看方式">
        <ContextMenuItem @click="() => component = 'DataTable'">列表</ContextMenuItem>
        <ContextMenuItem @click="() => component = 'DataGrid'">缩略图</ContextMenuItem>
      </ContextMenuSubmenu>
      <ContextMenuSubmenu title="排序方式">
        <ContextMenuItem @click="sort('name')">文件名</ContextMenuItem>
        <ContextMenuItem @click="sort('size')">文件大小</ContextMenuItem>
        <ContextMenuItem @click="sort('updateTime')">修改时间</ContextMenuItem>
      </ContextMenuSubmenu>
      <ContextMenuItem divided>新建文件夹</ContextMenuItem>
      <ContextMenuSubmenu title="上传">
        <ContextMenuItem @click="upload('file')">文件</ContextMenuItem>
        <ContextMenuItem @click="upload('dictionary')">文件夹</ContextMenuItem>
      </ContextMenuSubmenu>
      <ContextMenuItem
        divided
        @click="refresh">刷新</ContextMenuItem>
      <ContextMenuItem @click="overload">重新加载页面</ContextMenuItem>
    </ContextMenu>
    </p><div
      v-contextmenu:contextmenu
      class="manager-container">
      <Operation :component.sync="component"/>
      <DataBreadcrumb></DataBreadcrumb>
      <keep-alive>
        <component :is="component"></component>
      </keep-alive>
    </div>
  </div>
</template>

<style lang="less" scoped>
.data-manager {
  display: flex;
  height: 100%;
  .manager-container {
    flex: 1;
    height: 100%;
    padding: 15px 25px;
  }
}
</style>
