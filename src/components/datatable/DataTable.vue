<script>
import { createTableHeader } from './utils';
import config from 'config';
const MAP_WFS_QUERY = 'MAP_WFS_QUERY';
const MAP_WPS_OVERLAP = 'MAP_WPS_OVERLAP';
const SET_MAP_TEMPORARYLAYERS = 'SET_MAP_TEMPORARYLAYERS';
const SET_MAP_TEMPORARYLAYERS_DELETE = 'SET_MAP_TEMPORARYLAYERS_DELETE';
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
      tableLoading: false,
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
        this.tableLoading = true;
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
          this.$store.commit('SET_MAP_GEOJSON', { geojson: row, type: 'once' });
        },
        statisticsQuery() {},
      };
      if (currentRow.attributeType !== 'statisticsQuery') {
        state['wfsQuery'].call(this);
      } else {
        state[currentRow.attributeType].call(this);
      }
    },
    // 很不同类型做查询
    async wfsQuery(option, isShowColumns) {
      delete option.attributeType;
      const response = await this.$store.dispatch(MAP_WFS_QUERY, option);
      this.tableLoading = false;
      this.tableData = [];
      this.features = response.features;
      this.total = response.totalFeatures;
      for (let i = 0; i < response.features.length; i++) {
        this.tableData.push({ ...response.features[i].properties, attributeType: 'wfsQuery' });
      }
      if (isShowColumns) {
        if (response.features.length == 0) {
          return [];
        }
        let cols = Object.keys(response.features[0].properties).map(p => {
          return {
            title: p,
            key: p,
            align: 'center',
            width: 100,
            maxWidth: 300,
          };
        });
        this.$store.commit(types.SET_BUS_FIELD, cols);
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
      this.tableLoading = false;
      const response = JSON.parse(data);
      if (response.length !== 0) {
        this.total = response.length;
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
      }
    },
    errback() {
      this.$Message.error('分析失败！');
    },
    async overlayQuery(option) {
      const baseUrl = option.baseUrl;
      delete option.attributeType;
      const response = await this.$store.dispatch(MAP_WPS_OVERLAP, option);
      this.tableLoading = false;
      const analysData = {
        ...JSON.parse(response),
        baseUrl: option.url,
      };
      this.setLayer(analysData);
      this.overLapLayerData = analysData;
    },
    setLayer(analysData) {
      if (this.overLapLayerData && this.overLapLayerData.layers !== analysData.layers) {
        this.$store.commit(SET_MAP_TEMPORARYLAYERS_DELETE, [this.overLapLayerData.layers]);
      }
      this.$nextTick(() => {
        delete this.$store.commit(SET_MAP_TEMPORARYLAYERS, {
          [this.overLapLayerData.layers]: {
            ...this.overLapLayerData,
            url: this.overLapLayerData.baseUrl,
          },
        });
        // 参数处理
        const wfsParams = {
          url: `${this.overLapLayerData.baseUrl}?typeName=${this.overLapLayerData.layers}`,
          pageIndex: 1,
          pageSize: 10,
        };
        this.wfsQuery(wfsParams, true);
      });
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
          :loading="tableLoading"
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
