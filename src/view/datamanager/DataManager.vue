<script>
import Navigator from './navigator/Navigator';
import DataGrid from './manager/DataGrid';
import DataTable from './manager/DataTable';
import DataInfo from './manager/DataInfo';
import NavTool from './manager/NavTool';

export default {
  name: 'DataManager',
  components: {
    Navigator,
    NavTool,
    DataInfo,
    DataGrid,
    DataTable,
  },
  data() {
    return {
      componentId: 'DataTable',
      value: [],
    };
  },
};
</script>

<template>
  <div class="data-manager">
    <Navigator @on-load-nodes="(val) => value = val"/>
    <div class="manager-container">
      <NavTool @toggle-mode="(val) => componentId = val"/>
      <DataInfo :value="value"></DataInfo>
      <keep-alive>
        <component
          :is="componentId"
          :value="value"></component>
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
