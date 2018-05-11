<script>
import * as types from '@/store/types';
import { cloneDeep } from '@ktw/ktools';
import api from 'api';
import Navigator from './navigator/Navigator';
import Operation from './operation/Operation';
import DataBreadcrumb from './breadcrumb/DataBreadcrumb';
import DataGrid from './manager/DataGrid';
import DataTable from './manager/DataTable';

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
      componentId: 'DataTable',
      value: [],
    };
  },
  methods: {
    // 接受目录类型节点
    async loadNodes(node) {
      this.$store.commit(types.SET_APP_CURRENT_CATALOG, cloneDeep(node));
      this.$store.commit(types.REMOVE_APP_SELECT_NODES);

      const response = await api.db.findCatalog({
        owner: 1,
        ownerId: this.$user.orgid,
        access: 1,
        hasChild: false,
        relatedType: 1,
        orderby: 'sort_asc',
        getmode: 'all',
        resourceTypeId: '1,2',
        parentId: node.childId,
      });
      response.data = response.data.filter(item => item.typeId !== '20102');
      this.value = response.data;
    },
  },
};
</script>

<template>
  <div class="data-manager">
    <Navigator @on-select-node="loadNodes"/>
    <div class="manager-container">
      <Operation @toggle-mode="(val) => componentId = val"/>
      <DataBreadcrumb
        :value="value"
        @on-select-node="loadNodes"></DataBreadcrumb>
      <keep-alive>
        <component
          :is="componentId"
          :value="value"
          @on-select-node="loadNodes"></component>
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
    max-height: 100%;
    padding: 15px 25px;
  }
}
</style>
