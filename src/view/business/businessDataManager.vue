<script>
import DataDisplay from './DataDisplay';
import BusinessSort from './BusinessSort';
import BusinessLable from './BusinessLable';
import BusinessTable from './BusinessTable';
import DataDetails from './DataDetails';
import Classify from './datapresentation/Classify';
import TagData from './datapresentation/TagData';
import TableData from './datapresentation/TableData';
export default {
  name: 'BusinessDataManager',
  components: {
    DataDisplay,
    BusinessSort,
    BusinessLable,
    BusinessTable,
    DataDetails,
    Classify,
    TagData,
    TableData,
    // <DataDetails></DataDetails>
  },
  data() {
    return {
      treeDatas: [],
      tableDatas: {},
      treeData: [],
      labelsData: [],
      display: true,
    };
  },
  methods: {
    //表格数据
    tableDataChange(data) {
      this.tableDatas = data;
    },
    //分类数据
    treeDataChange(data) {
      this.treeDatas = data;
    },
    //标签数据
    TagDataChange(data) {
      this.labelsData = data;
    },
    //标签切换
    toggle() {
      this.display = !this.display;
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
      <Tabs
        value="name1"
        @on-click="toggle()">
        <Tab-pane
          label="元数据管理"
          class="tabpane"
          name="name1">
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
          name="name2">
          <Classify :labels-data="labelsData"></Classify>
          <TagData
            :labels-data="labelsData"
          ></TagData>
        </Tab-pane>
      </Tabs>
    </div>
    <div
      v-if="display"
      id="right-context">
      <!--元数据管理 -->
      <BusinessTable
        :table-datas="tableDatas"
        :tree-data = "treeData"
      ></BusinessTable>
    </div>
    <div
      v-else
      id="right-contexts">
      <!--业务数据展示-->
      <TableData></TableData>
    </div>
  </div>
</template>
<style lang="less" scoped>
.k-tabs {
  height: 100%;
}
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
#right-contexts {
  margin-left: 350px;
  height: 100%;
  background: #f1f3f7;
}
/deep/.k-tabs-content.k-tabs-content-animated {
  height: 100%;
}
/deep/.k-tabs .k-tabs-tabpane {
  height: 100%;
}
</style>
