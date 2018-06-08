<script>
import { createTableHeader } from './utils';
import config from 'config';
const MAP_WFS_QUERY = 'MAP_WFS_QUERY';
import * as types from '@/store/types';

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
      return this.$store.state.bus.field;
    },
    queryOptions() {
      return this.$store.getters.attribute;
    },
  },
  watch: {
    queryOptions(options) {
      options.forEach(option => {
        this.title = option.title;
        delete option.title;
        if (this[option.attributeType]) {
          this[option.attributeType](option);
        } else {
          this.wfsQuery(option);
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
      const state = {
        wfsQuery() {
          const row = JSON.parse(JSON.stringify(this.features[index]));
          this.$store.commit('SET_MAP_GEOJSON', row);
        },
        statisticsQuery() {},
      };
      state[currentRow.attributeType].call(this);
    },
    // 很不同类型做查询
    async wfsQuery(option) {
      delete option.attributeType;
      const response = await this.$store.dispatch(MAP_WFS_QUERY, option);
      this.tableData = [];
      this.features = response.features;
      this.total = response.totalFeatures;
      for (let i = 0; i < response.features.length; i++) {
        this.tableData.push({ ...response.features[i].properties, attributeType: 'wfsQuery' });
      }
    },
    async statisticsQuery(option) {
      delete option.attributeType;
      L.ajax({
        url: `${config.project.highgisUrl}/master/ows?service=wps&request=aggregate`,
        success: this.statisticsSuccess,
        dataType: 'json',
        fail: this.errback,
        type: 'POST',
        data: { statistics: JSON.stringify(option) },
      });
    },
    statisticsSuccess(data) {
      const response = JSON.parse(data);
      const columns = Object.keys(response[0]).map(p => {
        return {
          title: p,
          key: p,
          align: 'center',
        };
      });
      this.$store.commit(types.SET_BUS_FIELD, columns);
      this.tableData = response.map(p => {
        return {
          ...p,
          attributeType: 'statisticsQuery',
        };
      });
    },
    errback() {
      this.$Message.error('分析失败！');
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
