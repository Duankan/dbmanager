<script>
import DataDisplay from './DataDisplay';
import BusinessSort from './BusinessSort';
import BusinessLable from './BusinessLable';
import BusinessTable from './BusinessTable';
// import DataDetails from './DataDetails';
export default {
  name: 'BusinessDataManager',
  components: {
    DataDisplay,
    BusinessSort,
    BusinessLable,
    BusinessTable,
    // DataDetails,
    //  <BusinessTable></BusinessTable>
    // <DataDetails></DataDetails>
  },
};
</script>

<template>
  <div style="width:100%;height:100%;">
    <div id="left-menu">
      <Tabs value="name1">
        <Tab-pane
          label="元数据管理"
          name="name1">
          <DataDisplay></DataDisplay>
          <BusinessSort></BusinessSort>
          <BusinessLable></BusinessLable>
        </Tab-pane>
        <Tab-pane
          label="业务数据展示"
          name="name2">标签二的内容</Tab-pane>
      </Tabs>
    </div>
    <div id="right-context">

      <BusinessTable></BusinessTable>
    </div>
  </div>
</template>
<style lang="less" scoped>
#left-menu {
  float: left;
  width: 300px;
  height: 100%;
  box-shadow: 0px 0px 25px #ced0d3;
}
#right-context {
  margin-left: 350px;
  height: 100%;
  background: #f1f3f7;
}
</style>
