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
      style="margin-right:0px;"
      @on-row-dblclick="dbclick"></Table>
  </div>
</template>

<script>
const SET_MAP_SERVICELIST = 'SET_MAP_SERVICELIST';
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
    layerNode: {
      type: Object,
      default: null,
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
      tableHeight: 0,
      dataStyle: [],
      searchKey: {
        alias: '',
        classify: '',
        name: '',
        orgId: this.$appUser.orgid,
        type: '',
      },
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
    async dbclick(item) {
      var url = new URL(this.layerNode.serviceUrl);
      var isLayerShow = false;
      for (var i = 0; i < this.$store.getters.ogcLayers.length; i++) {
        if (this.$store.getters.ogcLayers[i].options.layers == url.searchParams.get('layers')) {
          this.$store.getters.ogcLayers[i].setParams({ styles: item.name });
          isLayerShow = true;
          return;
        }
      }
      if (!isLayerShow) {
        //把显示的图层一个个的都丢到MapView.vue里面去。在哪个页面做修改
        const response = await api.db.findService({
          resourceId: this.layerNode.resourceId, // 资源id
          serivestatus: 0, // 服务状态(0 开启 1 关闭)
          baseservicetype: 1, // 基础服务
          metadataLayer: this.layerNode.metadataLayer, // 元数据图层
        });
        const layers = url.searchParams.get('layers');
        if (response.data.length === 1) {
          this.$store.commit(SET_MAP_SERVICELIST, {
            [layers]: [response.data[0]],
          });
        } else {
          this.$store.commit(SET_MAP_SERVICELIST, {
            [layers]: [response.data[0], response.data[1]],
          });
        }
        this.dbclick(item);
      } else {
        return;
      }
    },
  },
};
</script>
