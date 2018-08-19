<script>
import { date } from '@ktw/ktools';

export default {
  name: 'LayerHistory',
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
      //当前浏览的历史图层
      currentLayer: null,
    };
  },
  methods: {
    //格式化时间
    formatDate(time) {
      return date.format(new Date(time), 'YYYY-M-D HH:mm');
    },
    //图层预览
    layerView(item) {
      //this.clearLayerView();
      this.$nextTick(p => {
        this.addLayerView(item);
      });
      this.currentLayer = item.layer.name;
    },
    //添加图层预览
    addLayerView(item) {
      this.$store.getters.ogcLayers.forEach(layer => layer.setVisible(false));
      var layerUrl = this.$store.state.map.serviceList[
        this.originalLayerName
      ][0].servicesurl.replace(this.originalLayerName, item.layer.name);
      const url = new URL(layerUrl);
      var styleName = 'EditPointStyle';
      if (item.layer.style.name == 'point') {
        styleName = 'EditPointStyle';
      } else if (item.layer.style.name == 'polygon') {
        styleName = 'ktw_fffffffe46997ca7';
      }
      const temporaryData = {
        [item.layer.name]: {
          url: url.origin + url.pathname,
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
    },
  },
};
</script>
<template>
<<<<<<< HEAD
  <div class="main">
=======
  <div class="layer-history-wrapper">
>>>>>>> 64c26990a0a7ca66ee6ec30fd51dc4f2b3d080ee
    <Timeline>
      <TimelineItem
        v-for="item in layerData"
        :key="item.id">
<<<<<<< HEAD
        <p class="time">{{ formatDate(item.createTime) }}</p>
        <p class="content">{{ '图层名称:'+item.layer.name }}</p>
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
          title="查询统计"/>
        <SvgIcon
          :size="16"
          style="margin-left:4px;"
          icon-class="contrast"
          color="#1296db"
          title="图层对比"
        />
      </svgicon></svgicon></TimelineItem>
    </Timeline>
  </div>
</template>
<style scoped>
.main {
  margin: 8px;
  width: 100%;
  height: 100%;
}
.time {
  font-size: 14px;
  font-weight: bold;
  width: 100%;
}
.content {
  font-size: 14px;
  width: 230px;
  text-overflow: ellipsis; //让超出的用...实现
  white-space: nowrap; //禁止换行
  overflow: hidden; //超出的隐藏
  display: inline-block;
=======
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
            title="查询统计"/>
          <SvgIcon
            :size="16"
            style="margin-left:4px;"
            icon-class="contrast"
            color="#1296db"
            title="图层对比"/>
        </div>
      </TimelineItem>
    </Timeline>
  </div>

</template>

<style lang="less">
.layer-history-wrapper {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
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
>>>>>>> 64c26990a0a7ca66ee6ec30fd51dc4f2b3d080ee
}
</style>
