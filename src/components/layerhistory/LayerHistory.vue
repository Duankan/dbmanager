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
      const layerInfo = this.setLayerInfo(item.layer.name);
      var styleName = 'EditPointStyle';
      if (item.layer.style.name == 'point') {
        styleName = 'EditPointStyle';
      } else if (item.layer.style.name == 'polygon') {
        styleName = 'ktw_fffffffe46997ca7';
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
          //styles: styleName,
        },
      };
      this.$store.commit('SET_MAP_TEMPORARYLAYERS', temporaryData);
    },
    // 属性查询
    showQueryList(data) {
      this.isShowQueryList = true;
      const layerInfo = this.setLayerInfo(data.layer.name);
      this.queryLayerData = { ...data, ...layerInfo };
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
    moreMap() {
      let container = document.body;
      this.historyLayerList = [];
      debugger;
      var originalLayerUrl = this.$store.state.map.serviceList[this.originalLayerName][0]
        .servicesurl;
      this.historyLayerList.push({
        url: originalLayerUrl,
        title: this.originalLayerName,
        time: '当前图层',
      });
      this.layerData.forEach(item => {
        this.historyLayerList.push({
          url: originalLayerUrl.replace(this.originalLayerName, item.layer.title),
          title: item.layer.title,
          time: item.createTime,
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
        //parent: container,
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
    <div class="title-div">
      <span>源图层名称:</span>
      <ellipsis 
        :length="18" 
        class="layer-name">{{ originalLayerName }}</ellipsis>
      <SvgIcon
        :size="16"
        style="margin-right:4px;float:right;"
        icon-class="contrast"
        color="#1296db"
        title="图层多屏对比"
        @click.native="moreMap"/>
    </div>
    <Timeline v-if="!isShowQueryList">
      <TimelineItem
        v-for="item in layerData"
        :key="item.id"
        @click.native="layerView(item)">
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
            @click.native="layerView(item)"/>
          <SvgIcon
            :size="18"
            color="#1296db"
            style="margin-left:4px;"
            icon-class="search"
            title="查询统计"
            @click.native="showQueryList(item)"/>
        </div>
      </TimelineItem>
    </Timeline>
    <div
      v-if="isShowQueryList"
      class="layer-his-list">
      <div class="layer-his-title">
        <Icon
          :size="18"
          type="arrow-left-a"
          title="返回时间轴"
          @click.native="isShowQueryList = false"></Icon>
        <span>数据列表</span>
      </div>
      <div class="layer-his-content">
        <QueryLayerHistory
          ref="history"
          :layer-data="queryLayerData"></QueryLayerHistory>
      </div>
    </div>
  </div>

</template>

<style lang="less" scoped>
.layer-history-wrapper {
  position: relative;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  .title-div {
    margin: 8px;
    font-size: 14px;
  }
  /deep/.k-ellipsis {
    display: inline;
  }
  .layer-name {
    font-weight: bold;
    color: #2d8cf0;
  }
  .k-timeline {
    margin: 10px;
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
  .layer-his-list {
    position: relative;
    height: 100%;
  }
  .k-timeline-item {
    cursor: pointer;
  }
  .layer-his-title {
    position: absolute;
    top: 0;
    left: 0;
    height: 26px;
    line-height: 26px;
    font-size: 14px;
    font-weight: bold;
    color: #666666;
    padding: 0 10px;
    .k-icon {
      font-size: 18px;
      position: relative;
      top: 2px;
      margin-right: 3px;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .layer-his-content {
    position: absolute;
    top: 26px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
