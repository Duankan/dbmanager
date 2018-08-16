<template>
  <div class="style-table-main">
    <div>
      <Row class="search-row">
        <Col 
        span="6" >样式名称：</Col>
        <Col span="18"><Input 
          v-model="searchKey.name" 
          size="small" 
          placeholder="输入样式名称关键字..."
          @on-change="getDataStyle"></Input></Col>
      </Row>
      <Row class="search-row">
        <Col 
          span="6" 
        >样式别名：</Col>
        <Col span="18"><Input 
          v-model="searchKey.alias" 
          size="small"
          placeholder="输入样式别名关键字..."
          @on-change="getDataStyle"></Input></Col>
      </Row>
      <Row class="search-row">
        <Col 
          span="6" 
        >样式分类：</Col>
        <Col span="18"><Input 
          size="small"
          placeholder="输入样式名称关键字..."></Input></Col>
      </Row>
    </div>
    <Table 
      :height="tableHeight"
      :columns="columnsStyle"
      :data="dataStyle" 
      style="margin-right:0px;"></Table>
  </div>
</template>
<style lang="less" scoped>
.style-table-main {
  width: 100%;
  height: 100%;
}

.search-row {
  margin-bottom: 8px;
  margin-right: 8px;
  vertical-align: middle;
  font-size: 12px;
}
</style>
<script>
export default {
  props: {
    layerType: {
      type: String,
      default: '',
    },
    styleType: {
      type: String,
      default: 'SingleSytle', //单一样式
    },
  },
  data() {
    return {
      columnsStyle: [
        {
          title: '样式名称',
          key: 'name',
        },
        {
          title: '样式别名',
          key: 'alias',
        },
      ],
      tableHight: 0,
      dataStyle: [],
      searchKey: {
        alias: '',
        classify: '',
        name: '',
        orgId: this.$appUser.orgid,
        type: '',
      },
      proportion: [
        {
          value: '500',
          label: '500',
        },
        {
          value: '1000',
          label: '1000',
        },
        {
          value: '2000',
          label: '2000',
        },
        {
          value: '2500',
          label: '2500',
        },
        {
          value: '5000',
          label: '5000',
        },
        {
          value: '10000',
          label: '10000',
        },
        {
          value: '20000',
          label: '20000',
        },
        {
          value: '50000',
          label: '50000',
        },
        {
          value: '100000',
          label: '100000',
        },
      ],
    };
  },
  watch: {
    layerType: {
      handler(val) {
        if (val == 'point') {
          this.searchKey.type = '1';
        } else if (val == 'polyline') {
          this.searchKey.type = '2';
        } else if (val == 'polygon') {
          this.searchKey.type = '3';
        }
        this.getDataStyle();
      },
      immediate: true,
    },
  },
  created() {
    //this.getDataStyle();
  },
  mounted() {
    //自适应高度
    this.tableHeight = document.getElementsByClassName('main')[0].offsetHeight - 220;
    window.onresize = temp => {
      this.tableHeight = document.getElementsByClassName('main')[0].offsetHeight - 220;
    };
  },
  methods: {
    async getDataStyle() {
      const response = await api.db.findSyleByType(this.searchKey);
      this.dataStyle = response.data;
    },
  },
};
</script>
