<script>
import config from 'config';
const iconConfig = [
  {
    content: '点绘制',
    itemClass: 'draw-marker',
  },
  {
    content: '线绘制',
    itemClass: 'draw-polyline',
  },
  {
    content: '自定义线绘制',
    itemClass: 'draw-defineline',
  },
  {
    content: '多边形绘制',
    itemClass: 'draw-polygon',
  },
  {
    content: '拉框绘制',
    itemClass: 'draw-rectangle',
  },
  {
    content: '圆绘制',
    itemClass: 'draw-circle',
  },
  {
    content: '取消绘制',
    itemClass: 'draw-delete',
  },
];
let drawRefs, drawType;
export default {
  name: 'DrawTools',
  props: {
    layerCrs: {
      type: String,
      default: '',
    },
    buttonType: {
      type: String,
      default: 'ghost',
    },
    buttonSize: {
      type: String,
      default: 'default',
    },
    shape: {
      type: String,
      default: null,
    },
    iconColor: {
      type: String,
      default: '#5f6477',
    },
    iconSize: {
      type: [Number, String],
      default: '14',
    },
    showFile: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      iconConfig,
      fileConfig: {
        content: '上传面文件',
        itemClass: 'draw-file',
      },
      uploadAction: '#',
    };
  },
  events: {
    'on-getdraw-refs': function(draw) {
      drawRefs = draw.drawRefs;
      drawType = draw.REFS;
    },
    'on-get-drawlayer': function(layers) {
      this.$nextTick(() => {
        this.$emit('on-get-drawlayer', layers);
      });
    },
  },
  watch: {
    layerCrs(newVal) {
      if (newVal !== '') {
        this.uploadAction = `${
          config.project.basicUrl
        }/service/gisserver/getwktsbyshpzip?crs=${newVal}&count=1`;
      }
    },
  },
  mounted() {
    this.uploadAction = `${
      config.project.basicUrl
    }/service/gisserver/getwktsbyshpzip?crs=EPSG:4490&count=1`;
  },
  beforeDestroy() {
    this.clearToolLayer();
  },
  methods: {
    // 清除操作
    clearLayers() {
      if (drawType) {
        drawType.forEach(item => {
          drawRefs[item].clearDrawLayer();
        });
      }
    },
    drawGeometry(name) {
      this.clearToolLayer();
      const type = name.split('-')[1];
      if (drawType.includes(type)) {
        drawRefs[type].drawGeometry();
      } else {
        const state = {
          defineline() {
            drawRefs['polyline'].drawGeometry({ customDraw: true });
          },
          file() {},
          delete() {
            this.$emit('on-get-drawlayer', null);
          },
        };
        state[type].call(this);
      }
    },
    uploadSuccess(data) {
      if (data.data) {
        const wkt = new L.Wkt.Wkt();
        wkt.read(data.data[0]);
        this.geometry = wkt.toObject(false);
        this.$emit('on-get-drawlayer', this.geometry);
        this.geometry.addTo(drawRefs.geojson.$queryLayers);
      }
    },
    clearToolLayer() {
      this.clearLayers();
      if (this.geometry) drawRefs.geojson.$queryLayers.removeLayer(this.geometry);
    },
  },
};
</script>

<template>
  <ButtonGroup>
    <Button
      v-for="(item,index) in iconConfig"
      :key="index"
      :type="buttonType"
      :size="buttonSize"
      :shape="shape"
      :title="item.content"
      @click="drawGeometry(item.itemClass)">
      <SvgIcon
        :icon-class="item.itemClass"
        :color="iconColor"
        :size="iconSize" />
    </Button>
    <Button
      v-if="showFile"
      :type="buttonType"
      :size="buttonSize"
      :shape="shape"
      :title="fileConfig.content"
    >
      <Upload
        ref="uploadCtrl"
        :on-success="uploadSuccess"
        :action="uploadAction"
        name="shapefile">
        <SvgIcon
          :icon-class="fileConfig.itemClass"
          :color="iconColor"
          :size="iconSize" />
      </Upload>
    </Button>
  </ButtonGroup>
</template>

<style lang="less" scoped>
.k-btn-group {
  .k-btn {
    margin-bottom: 5px;
  }
  /deep/ .k-upload-list {
    display: none;
  }
}
</style>
