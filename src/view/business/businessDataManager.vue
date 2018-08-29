<script>
import DataDisplay from './DataDisplay';
import BusinessSort from './BusinessSort';
import BusinessLable from './BusinessLable';
import BusinessTable from './BusinessTable';
import DataDetails from './DataDetails';
// import BasiclnRight from './BasiclnRight';
export default {
  name: 'BusinessDataManager',
  components: {
    DataDisplay,
    BusinessSort,
    BusinessLable,
    BusinessTable,
    DataDetails,
    // BasiclnRight,
    // <DataDetails></DataDetails>
  },
  data() {
    return {
      treeDatas: [],
      tableDatas: {},
      mainDate: '',
      labelsData: [],
      treeData: [],
    };
  },
  methods: {
    //表格数据传过来
    tableDataChange(data) {
      this.tableDatas = data;
    },
    //分类数据传过来
    treeDataChange(data) {
      this.treeDatas = data;
    },
    TagDataChange(data) {
      this.labelsData = data;
    },
    //联级树
    queryTreeData(data) {
      this.treeData = data;
    },
  },
};
</script>

<template>
  <div style="width:100%;height:100%;">
    <div id="left-menu">
      <Tabs value="mainDate">
        <Tab-pane
          label="元数据管理"
          name="mainDate">
          <!--左侧查询 -->
          <DataDisplay
            :tree-datas="treeDatas"
            :labels-data="labelsData"
            @on-dataChangeEvnet="tableDataChange"
            @TreeData="queryTreeData"
          ></DataDisplay>
          <!--左侧树-->
          <BusinessSort @on-dataTreeChangeEvnet="treeDataChange"></BusinessSort>
          <!--左侧标签 -->
          <BusinessLable @on-dataTagChangeEvnet="TagDataChange"></BusinessLable>
        </Tab-pane>
        <Tab-pane
          label="业务数据展示"
          name="mainDate">
          <!--<BasiclnRight></BasiclnRight>-->
        </Tab-pane>
      </Tabs>
    </div>
    <div id="right-context">
      <!--右侧表格 -->
      <BusinessTable
        :tree-data="treeData"
        :table-datas="tableDatas"
      ></BusinessTable>
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
