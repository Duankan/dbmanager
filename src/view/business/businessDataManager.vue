<script>
import DataDisplay from './DataDisplay';
import BusinessSort from './BusinessSort';
import BusinessLable from './BusinessLable';
import BusinessTable from './BusinessTable';
import DataDetails from './DataDetails';
export default {
  name: 'BusinessDataManager',
  components: {
    DataDisplay,
    BusinessSort,
    BusinessLable,
    BusinessTable,
    DataDetails,
    //  <BusinessTable></BusinessTable>
    // <DataDetails></DataDetails>
  },
  data() {
    return {
      labelsData: [],
      tableDatas: [],
      treeDatas: [],
    };
  },
  // watch: {
  //   lableData() {},
  // },
  methods: {
    //把子组件抛过来的事件的数据通过data传过来
    dataChange(data) {
      //把传过来的数据放到新的数组里面
      this.labelsData = data;
    },
    //表格数据传过来
    tableDataChange(data) {
      this.tableDatas = data;
    },
    //分类数据传过来
    treeDataChange(data) {
      this.treeDatas = data;
    },
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
          <!--左侧查询 -->
          <DataDisplay
            :lable-data="labelsData"
            :table-datas="tableDatas"
            :tree-datas="treeDatas"></DataDisplay>
          <!--左侧树 -->
          <BusinessSort @dataChangeEvnet="treeDataChange"></BusinessSort>
          <!--左侧标签 -->
          <BusinessLable @dataChangeEvnet="dataChange"></BusinessLable>
        </Tab-pane>
        <Tab-pane
          label="业务数据展示"
          name="name2">标签二的内容</Tab-pane>
      </Tabs>
    </div>
    <div id="right-context">
      <!--右侧表格 -->
      <BusinessTable @dataChangeEvnet="tableDataChange"></BusinessTable>
      <!--元数据详情-->
      <!--<DataDetails></DataDetails>-->
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
