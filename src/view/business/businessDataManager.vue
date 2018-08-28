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

    toggle() {
      debugger;
      this.display = flase;
    },
    toggleData() {
      debugger;
      this.display = flase;
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
          name="name1"
          @click="toggle">
          <!--左侧查询 -->
          <DataDisplay
            :tree-datas="treeDatas"
            :labels-data="labelsData"
            @on-dataChangeEvnet="tableDataChange"
          ></DataDisplay>
          <!--左侧树-->
          <BusinessSort @on-dataTreeChangeEvnet="treeDataChange"></BusinessSort>
          <!--左侧标签 -->
          <BusinessLable @on-dataTagChangeEvnet="TagDataChange"></BusinessLable>
        </Tab-pane>
        <Tab-pane
          label="业务数据展示"
          name="name2"
          @click="toggleData">
          <Classify :labels-data="labelsData"></Classify>
          <TagData
            :labels-data="labelsData"
            @on-dataTagChangeEvnet="TagDataChange"></TagData>
        </Tab-pane>
      </Tabs>
    </div>
    <div
      v-if="display"
      id="right-context">
      <!--元数据管理 -->
      <BusinessTable
        :table-datas="tableDatas"
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
</style>
