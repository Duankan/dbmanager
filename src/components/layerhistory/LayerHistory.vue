<script>
import { date } from '@ktw/ktools';
import QueryLayerHistory from './QueryLayerHistory';
import MoreMap from '../moremap/MoreMap';

export default {
  name: 'LayerHistory',
  components: { QueryLayerHistory, MoreMap },
  props: {
    layerData: {
      type: Array,
      default: () => [],
    },
    //原始图层名称
    originalLayerName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isShowQueryList: false,
      queryLayerData: {},
      //当前浏览的历史图层
      currentLayer: null,
      historyLayerList: [],
    };
  },
  methods: {
    //格式化时间
    formatDate(time) {
      return date.format(new Date(time), 'YYYY-M-D HH:mm');
    },
    // 设置图层信息
    setLayerInfo(layerName) {
      this.$store.getters.ogcLayers.forEach(layer => layer.setVisible(false));
      var layerUrl = this.$store.state.map.serviceList[
        this.originalLayerName
      ][0].servicesurl.replace(this.originalLayerName, layerName);
      const url = new URL(layerUrl);
      return {
        baseUrl: url.origin + url.pathname,
      };
    },
    //图层预览
    layerView(item) {
      this.clearLayerView();
      this.$nextTick(p => {
        this.addLayerView(item);
      });
      this.currentLayer = item.layer.name;
    },
    //添加图层预览
    addLayerView(item) {
      //ktw_136703855 点; ktw_fffffffd97ef3980 线 ktw_fffffffb5bda492f
      const layerInfo = this.setLayerInfo(item.layer.name);
      var styleName = 'ktw_fffffffd97ef3980';
      if (item.layer.style.name == 'point') {
        styleName = 'ktw_136703855';
      } else if (item.layer.style.name == 'polygon') {
        styleName = 'ktw_fffffffb5bda492f';
      }
      const temporaryData = {
        [item.layer.name]: {
          url: layerInfo.baseUrl,
          bbox:
            item.layer.latLonBox.minx +
            ',' +
            item.layer.latLonBox.miny +
            ',' +
            item.layer.latLonBox.maxx +
            ',' +
            item.layer.latLonBox.maxy,
          crs: item.layer.srs,
          layers: item.layer.name,
          styles: styleName,
        },
      };
      this.$store.commit('SET_MAP_TEMPORARYLAYERS', temporaryData);
    },
    // 属性查询
    showQueryList(data) {
      const layerInfo = this.setLayerInfo(data.layer.name);
      this.queryLayerData = { ...data, ...layerInfo };
      this.layerView(data);
      this.isShowQueryList = true;
    },
    //清除图层预览
    clearLayerView() {
      if (this.currentLayer) {
        this.$store.commit('SET_MAP_TEMPORARYLAYERS_DELETE', [this.currentLayer]);
      }
      this.currentLayer = null;
    },
    //重置控件
    reset() {
      this.clearLayerView();
      this.$store.getters.ogcLayers.forEach(layer => layer.setVisible(true));
      if (this.$refs.history) {
        this.$refs.history.clear();
      }
    },
    //返回时间轴视图
    goBack() {
      this.isShowQueryList = false;
      this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'once' });
    },
    moreMap() {
      let container = document.body;
      var layerObject = this.$store.state.map.serviceList[this.originalLayerName].find(item => {
        return item.servicestype == 12;
      });
      //获取当前图层的url
      let originalLayerUrl = layerObject.servicesurl;
      this.historyLayerList.push({
        url: originalLayerUrl,
        title: this.originalLayerName,
        time: '当前图层',
        type: this.layerData[0].layer.style.name,
      });
      this.layerData.forEach(item => {
        this.historyLayerList.push({
          url: originalLayerUrl.replace(this.originalLayerName, item.layer.title),
          title: item.layer.title,
          time: item.createTime,
          type: item.layer.style.name,
        });
      });
      this.historyHandler = this.$FloatPanel.create({
        title: '图层历史版本  ' + this.originalLayerName,
        width: container.clientWidth,
        height: container.clientHeight,
        position: {
          x: 0,
          y: 0,
        },
        disableDrag: true,
        render: h => {
          return h(MoreMap, {
            props: {
              historyLayerList: this.historyLayerList,
            },
          });
        },
        onClose() {
          //self.historyHandler.getContent().reset();
        },
      });
    },
  },
};
</script>
<template>
  <div class="layer-history-wrapper">
    <div
      v-if="!isShowQueryList"
      class="layer-history">
      <div class="layer-title">
        <span>源图层名称:</span>
        <ellipsis
          :length="18"
          class="layer-name">{{ originalLayerName }}</ellipsis>
        <SvgIcon
          :size="16"
          class="layer-compare"
          icon-class="contrast"
          color="#1296db"
          title="图层多屏对比"
          @click.native="moreMap"/>
      </div>
      <div class="layer-content">
        <Timeline>
          <TimelineItem
            v-for="item in layerData"
            :key="item.id"
            @click.native.stop="layerView(item)">
            <Icon
              slot="dot"
              type="map"></Icon>
            <p class="history-time">{{ formatDate(item.createTime) }}</p>
            <p
              :title="item.layer.name"
              class="history-layer">{{ '图层名称：'+item.layer.name }}</p>
            <div class="history-buttons">
              <SvgIcon
                :size="18"
                color="#1296db"
                icon-class="eye"
                title="图层预览"
                @click.native.stop="layerView(item)"/>
              <SvgIcon
                :size="18"
                color="#1296db"
                style="margin-left:4px;"
                icon-class="search"
                title="查询统计"
                @click.native.stop="showQueryList(item)"/>
            </div>
          </TimelineItem>
        </Timeline>
      </div>
    </div>
    <QueryLayerHistory
      v-if="isShowQueryList"
      ref="history"
      :layer-data="queryLayerData"
      @go-back="goBack"></QueryLayerHistory>
  </div>

</template>

<style lang="less">
.layer-history-wrapper {
  position: relative;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  .layer-history {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  .layer-title {
    padding: 0 5px;
    margin: 4px 5px;
    border-left: 2px solid #318cf0;
    font-size: 14px;
  }
  .layer-content {
    position: absolute;
    top: 25px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
  }
  /deep/.k-ellipsis {
    display: inline;
  }
  .layer-name {
    font-weight: bold;
    color: #2d8cf0;
  }
  .layer-compare {
    float: right;
    margin-right: 5px;
  }
  .k-timeline {
    margin: 10px;
  }
  .k-timeline-item {
    cursor: pointer;
  }
  .history-time {
    font-weight: bold;
  }
  .history-layer {
    height: 24px;
    line-height: 24px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: #333333;
  }
  .k-svgicon {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
  .k-timeline-item-content {
    margin-left: 20px;
    padding-left: 5px;
    border-radius: 1px;
    &:hover {
      background-color: #eeeeee;
    }
  }
}
</style>
