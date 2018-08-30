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
    <div
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
