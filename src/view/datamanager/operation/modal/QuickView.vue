<script>
import { url } from '@ktw/ktools';
import * as helps from '@/utils/helps';

const SET_MAP_GOCLAYER_DELETE = 'SET_MAP_GOCLAYER_DELETE';
const SET_MAP_SERVICELIST = 'SET_MAP_SERVICELIST';
const MAP_WFS_QUERY = 'MAP_WFS_QUERY';
const SET_MAP_GEOJSON = 'SET_MAP_GEOJSON';

export default {
  name: 'QuickView',
  props: {
    //对话框是否打开
    value: {
      type: Boolean,
      default: false,
    },
    //是否显示元数据
    isMeta: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //是否显示表格
      showTable: true,
      //图层名
      layerName: '',
      //服务类型,0：WMS服务，1:WMTS服务
      serviceType: 0,
      //服务信息
      serviceList: [],
      //表格列
      columns: [],
      //表格数据
      data: [],
      //数据总数
      total: 0,
      //列宽度
      columnWidth: 122,
      //分页大小
      pageSize: 10,
      //分页控件是否已初始化
      pageInited: false,
      //当前分页数据
      pagedData: [],
      //数据是否在加载
      loading: false,
    };
  },
  computed: {
    //当前目录
    current() {
      return this.$store.state.app.currentDirectory;
    },
    //当前选择节点
    node() {
      return this.$store.state.app.selectNodes[0];
    },
    title() {
      return this.isMeta ? '浏览元数据' : '浏览地图';
    },
  },
  watch: {
    async value(val) {
      if (val) {
        const response = await this.getNodeInfo(this.node);
        this.serviceList = response.data;
        setTimeout(() => {
          this.loadMap();
          this.loadTable();
        }, 500);
      }
    },
  },
  methods: {
    //获取节点信息
    async getNodeInfo(node) {
      //元数据
      if (this.isMeta) {
        return api.db.findService({
          resourceId: node.resourceId,
          status: 0,
          metadataLayer: 1,
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve({ data: node.serviceList });
        });
      }
    },
    //预览地图
    loadMap() {
      let service = this.serviceList.find(service => service.servicestype === 12);
      if (service) {
        //WMS服务
        this.serviceType = 0;
        this.showTable = true;
      } else {
        //WMTS服务
        service = this.serviceList.find(service => service.servicestype === 5);
        this.serviceType = 1;
        this.showTable = false;
      }
      let { search } = url.parse(service.servicesurl);
      this.layerName = search.layers ? search.layers : search.typeName;
      this.$store.commit(SET_MAP_SERVICELIST, {
        [this.layerName]: this.serviceList,
      });
      window.dispatchEvent(new Event('resize'));
    },
    //加载表格
    loadTable() {
      if (this.serviceType != 0) return;
      this.pageInited = false;
      this.queryFeatures(1);
      this.$store.commit(SET_MAP_GEOJSON, { geojson: {}, type: 'once' });
    },
    //查询要素
    queryFeatures(pageIdx) {
      let service = this.serviceList.find(service => service.servicestype === 6);
      let serviceUrl = service.servicesurl;
      this.loading = true;
      this.$store
        .dispatch(MAP_WFS_QUERY, {
          url: serviceUrl,
          pageIndex: pageIdx,
          pageSize: this.pageSize,
        })
        .then(p => {
          this.loading = false;
          this.pagedData = p;
          this.columns = this.getTableColumns(p);
          this.data = this.getTableRows(p);
          if (!this.pageInited) {
            this.total = p.totalFeatures;
            this.pageInited = true;
          }
        })
        .catch(e => {
          this.loading = false;
          this.columns = [];
          this.data = [];
          this.total = 0;
          this.$Message.error('查询错误!');
        });
    },
    //获取表格列
    getTableColumns(data) {
      if (data.features.length == 0) {
        return [];
      }
      let cols = Object.keys(data.features[0].properties);
      if (this.isMeta) {
        cols = helps.filterMeta(cols);
      }
      cols = cols.map(p => {
        return {
          title: p,
          key: p,
          width: this.columnWidth,
          ellipsis: true,
        };
      });
      return cols;
    },
    //获取数据行
    getTableRows(data) {
      let rows = data.features.map(p => {
        return {
          ...p.properties,
          id: p.id,
        };
      });
      return rows;
    },
    //定位到要素
    zoomToFeature(item) {
      let feature = this.pagedData.features.find(p => p.id == item.id);
      this.$store.commit(SET_MAP_GEOJSON, { geojson: feature, type: 'once' });
    },
    visibleChange(visible) {
      if (!visible) {
        this.resetControls();
      }
      this.$emit('input', visible);
    },
    toggle(val) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    },
    //重设控件
    resetControls() {
      this.showTable = true;
      this.pageInited = false;
      this.loading = false;
      this.columns = [];
      this.data = [];
      this.total = 0;
      this.pagedData = [];
      this.$refs.page.changePage(1);
      this.$store.commit(SET_MAP_GOCLAYER_DELETE, [this.layerName]);
    },
  },
};
</script>

<template>
  <Modal
    v-model="value"
    :mask-closable="false"
    :title="title"
    class="large-modal"
    width="1000"
    @on-visible-change="visibleChange">
    <div
      :class="{expand:!showTable}"
      class="map">
      <Switch
        v-if="serviceType===0"
        v-model="showTable"
        size="large"
        @on-change="toggle">
        <span slot="open">数据</span>
        <span slot="close">数据</span>
      </Switch>
      <BaseMap
        ref="map">
        <TileWMSLayer/>
        <TileWMTSLayer/>
        <GeoJson />
      </BaseMap>
    </div>
    <div
      v-show="showTable"
      class="table">
      <Table
        :columns="columns"
        :data="data"
        :loading="loading"
        size="small"
        height="160"
        highlight-row
        @on-current-change="zoomToFeature"></Table>
      <Page
        ref="page"
        :total="total"
        size="small"
        show-total
        show-elevator
        @on-change="queryFeatures"></Page>
    </div>
    <div slot="footer">
    </div>
  </Modal>
</template>

<style lang="less" scoped>
.map {
  position: relative;
  height: 450px;
  .k-switch {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 5000;
  }
  &.expand {
    height: 638px;
  }
}
.k-modal {
  /deep/ &-body {
    padding: 5px;
  }
  /deep/ &-footer {
    padding: 0;
    border: none;
  }
}

.k-page {
  margin: 3px 0 0 10px;
}
</style>
