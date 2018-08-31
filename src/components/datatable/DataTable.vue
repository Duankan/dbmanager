<script>
import { createTableHeader } from './utils.js';
import { setTableColumns } from '../../utils/assist.js';
import config from 'config';
const MAP_WFS_QUERY = 'MAP_WFS_QUERY';
const MAP_WPS_OVERLAP = 'MAP_WPS_OVERLAP';
const SET_MAP_TEMPORARYLAYERS = 'SET_MAP_TEMPORARYLAYERS';
const SET_MAP_TEMPORARYLAYERS_DELETE = 'SET_MAP_TEMPORARYLAYERS_DELETE';
import * as types from '@/store/types';
import AttributeFilter from '@/./components/extractplan/AttributeFilter';
import StatisticsFilter from '@/./components/extractplan/StatisticsFilter';
import { cloneDeep } from '@ktw/ktools';

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
      total: 0,
      pageIndex: 0,
      attributeType: 'wfsQuery',
      features: [],
      title: '',
      tableLoading: false,
      opt: '', //存储其他查询的初始值。
      optNum: '', //用来判断是二次过滤查询的还是点击其他组件查询的，好用来存储 其他组件查询初始值
      propWin: null,
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
      this.doQuery(options);
    },
  },
  methods: {
    popup() {
      if (this.propWin) {
        !this.propWin.visible && this.propWin.show();
        return;
      }
      let field = '';
      for (let item of this.$store.state.bus.field) {
        if (item.key) {
          field += item.key + ' ,';
        }
      }
      this.propWin = this.$window({
        title: '属性过滤',
        footerHide: true,
        render: h => {
          return h(
            AttributeFilter,
            {
              props: {
                value: { schemas: field, showButton: true },
              },
              on: {
                'on-attr-filter': this.query,
              },
            },
            [this.$scopedSlots.default]
          );
        },
        width: 560,
        height: 460,
      });
    },
    popupStatistics() {
      let field = '';
      for (let item of this.$store.state.bus.field) {
        field += item.key + ' ,';
      }
      field = field.substring(0, field.length - 1);
      this.vm = this.$window({
        title: '结果统计',
        footerHide: true,
        render: h => {
          return h(
            StatisticsFilter,
            {
              props: {
                value: { schemas: field, condition: this.opt, showButton: true },
              },
            },
            [this.$scopedSlots.default]
          );
        },
        width: 300,
        height: 400,
      });
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
    doQuery(options) {
      options.forEach(option => {
        this.title = option.title;
        this.pageIndex = option.pageIndex;
        this.attributeType = option.attributeType;
        this.tableLoading = true;
        if (this[option.attributeType]) {
          this[option.attributeType](option);
        } else {
          this.wfsQuery(option);
        }
      });
    },
    // 分页查询
    changePageQuery(options) {
      const option = options[0];
      this.title = option.title;
      this.pageIndex = option.pageIndex;
      this.attributeType = option.attributeType;
      this.tableLoading = true;
      const status = {
        wfsQuery() {
          this[option.attributeType](option);
        },
        statisticsQuery() {
          this[option.attributeType](option);
        },
        overlayQuery() {
          const wfsParams = {
            url: `${this.overLapLayerData.baseUrl}?typeName=${this.overLapLayerData.layers}`,
            pageIndex: this.pageIndex,
            pageSize: 10,
          };
          this.wfsQuery(wfsParams, true);
        },
      };
      if (status[this.attributeType]) status[this.attributeType].call(this);
    },
    // wfs属性，空间查询
    async wfsQuery(option, isShowColumns) {
      if (this.optNum != 2) {
        this.opt = option; //等于先查询的条件
      }
      this.optNum = 1;
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
        const cols = setTableColumns(response.features[0].properties);
        this.$store.commit(types.SET_BUS_FIELD, cols);
      }
    },
    // 统计分析查询
    async statisticsQuery(option) {
      const { attributeType, options, ...rest } = option;
      L.ajax({
        url: `${config.project.highgisUrl}/hgis/ows?service=wps&request=aggregate`,
        success: this.statisticsSuccess,
        dataType: 'json',
        fail: this.errback,
        type: 'POST',
        data: L.Util.getPostParams({ statistics: rest }),
      });
    },
    statisticsSuccess(data) {
      this.tableLoading = false;
      const response = JSON.parse(data);
      if (response.length !== 0) {
        this.total = response.length;
        const columns = setTableColumns(response[0]);
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
    // 叠加分析查询
    async overlayQuery(option) {
      const baseUrl = option.baseUrl;
      delete option.attributeType;
      const response = await this.$store.dispatch(MAP_WPS_OVERLAP, option);
      this.tableLoading = false;
      if (response.indexOf('bbox') > -1) {
        const analysData = {
          ...JSON.parse(response),
          baseUrl: option.url,
        };
        this.setOverlapLayer(analysData);
        this.overLapLayerData = analysData;
      }
    },
    setOverlapLayer(analysData) {
      if (this.overLapLayerData && this.overLapLayerData.layers !== analysData.layers) {
        this.$store.commit('SET_MAP_GOCLAYER_DELETE', [this.overLapLayerData.layers]);
      }
      this.$nextTick(() => {
        // 构造图层参数
        const serviceList = {
          [this.overLapLayerData.layers]: [
            {
              servicestype: 12,
              servicesurl: `${
                this.overLapLayerData.baseUrl
              }?service=WMS&version=1.1.1&request=GetMap&layers=${
                this.overLapLayerData.layers
              }&srs=${this.overLapLayerData.crs}&styles=polygon3&bbox=${
                this.overLapLayerData.bbox
              }`,
              title: `${[this.overLapLayerData.layers]}`,
            },
            {
              servicestype: 6,
              wfsurl: `${this.overLapLayerData.baseUrl}?typeName=${this.overLapLayerData.layers}`,
              title: `${[this.overLapLayerData.layers]}`,
            },
          ],
        };
        this.$store.commit('SET_MAP_SERVICELIST', serviceList);
        // 参数处理
        const wfsParams = {
          url: `${this.overLapLayerData.baseUrl}?typeName=${this.overLapLayerData.layers}`,
          pageIndex: 1,
          pageSize: 10,
        };
        this.wfsQuery(wfsParams, true);
      });
    },
    query(msg) {
      let cql_filterCopy = this.opt.options.cql_filter;
      this.opt.options.cql_filter = '';
      this.opt.options.geometry = null;
      this.optNum = 2;
      let copyopt = cloneDeep(this.opt);
      copyopt.options.cql_filter = cql_filterCopy;
      if (copyopt.options.cql_filter) {
        let cqlfs = copyopt.options.cql_filter.split('INTERSECTS');
        if (cqlfs.length == 2) {
          let cqlf = cqlfs[0] + ' ' + msg + ' and ' + 'INTERSECTS' + cqlfs[1];
          copyopt.options.cql_filter = cqlf;
          this.wfsQuery(copyopt);
        } else {
          copyopt.options.cql_filter += ' and ' + msg;
          this.wfsQuery(copyopt);
        }
      } else {
        copyopt.options.cql_filter = msg;
        this.wfsQuery(copyopt);
      }
      this.opt.options.cql_filter = cql_filterCopy;
    },
    changePage(pageIdx) {
      let options = [...this.queryOptions];
      options[0].pageIndex = pageIdx;
      options[0].attributeType = this.attributeType;
      this.changePageQuery(options);
    },
    changePageSize(pageSize) {
      let options = [...this.queryOptions];
      options[0].pageIndex = 1;
      options[0].pageSize = pageSize;
      options[0].attributeType = this.attributeType;
      this.doQuery(options);
    },
    dispose() {
      if (this.propWin) {
        this.propWin.destroy();
        this.propWin = null;
      }
    },
  },
};
</script>

<template>

  <div class="datatable">
    <div class="table-toolbar">
      <span class="table-title">{{ title }}</span>
      <div class="table-buttons">
        <Button
          type="warning"
          @click="popup()">二次过滤</Button>
        <Button
          v-if="false"
          type="warning"
          @click="popupStatistics()">结果统计</Button>
      </div>
    </div>
    <Table
      :columns="columns"
      :data="tableData"
      :height="height"
      :loading="tableLoading"
      stripe
      border
      highlight-row
      size="small"
      @on-row-click="rowClick"></Table>
    <Page
      :current="pageIndex"
      :total="total"
      :page-size="10"
      :show-sizer="false"
      size="small"
      placement="top"
      show-total
      show-elevator
      @on-change="changePage"
      @on-page-size-change="changePageSize"
    ></Page>
    </Tabs>
  </div>
</template>

<style lang="less" scoped>
.table-toolbar {
  height: 36px;
  .table-title {
    color: #2d8cf0;
  }
  .table-buttons {
    display: inline-block;
    margin-left: 10px;
  }
}
.k-page {
  margin: 5px 0;
}
</style>
