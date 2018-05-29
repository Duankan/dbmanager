<script>
import { createTableHeader } from './utils';

const MAP_WFS_QUERY = 'MAP_WFS_QUERY';

export default {
  name: 'DataTable',
  props: {
    height: {
      type: [String, Number],
      default: 200,
    },
  },
  data() {
    return {
      tableData: [],
      pageIndex: 0,
      pageSize: 10,
      total: 0,
      features: [],
      title: '',
    };
  },
  computed: {
    columns() {
      // return createTableHeader(this.tableData);
      return this.$store.state.bus.field;
    },
    queryOptions() {
      return this.$store.state.bus.attribute;
    },
  },
  watch: {
    queryOptions(options) {
      options.forEach(async option => {
        this.title = option.title;
        delete option.title;
        const response = await this.$store.dispatch(MAP_WFS_QUERY, option);
        console.log(response);
        this.tableData = [];
        this.features = response.features;
        this.total = response.totalFeatures;
        for (let i = 0; i < response.features.length; i++) {
          this.tableData.push(response.features[i].properties);
        }
      });
    },
  },
  methods: {
    label(h) {
      return (
        <span>
          {this.title}
          <icon type="ios-close-empty" />
        </span>
      );
    },
    rowClick(currentRow, index) {
      const row = JSON.parse(JSON.stringify(this.features[index]));
      this.$store.commit('SET_MAP_GEOJSON', row);
    },
  },
};
</script>

<template>
  <div class="datatable">
    <Tabs
      value="name1">
      <TabPane
        :label="label"
        name="name1">
        <Table
          :columns="columns"
          :data="tableData"
          :height="height"
          stripe
          border
          highlight-row
          size="small"
          @on-row-click="rowClick"
        ></Table>
        <Page
          :total="total"
          :page-size="10"
          :page-size-opts="[10, 20, 30, 40]"
          size="small"
          placement="top"
          show-total
          show-elevator
          show-sizer
          @on-change="(val) => pageIndex = val"
          @on-page-size-change="val => pageSize = val"
        ></Page>
      </TabPane>
    </Tabs>
  </div>
</template>

<style lang="less" scoped>
.k-page {
  margin: 10px 0;
}
</style>
