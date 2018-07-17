<script>
import config from 'config';
import buffer from '@turf/buffer';

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
    itemClass: 'draw-clear',
  },
];
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
    radius: {
      type: Number,
      default: 0,
    },
    units: {
      type: String,
      default: 'meters',
    },
  },
  data() {
    return {
      iconConfig,
      fileConfig: {
        content: '上传面文件',
        itemClass: 'draw-upload',
      },
      uploadAction: '#',
    };
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
  events: {
    'on-getdraw-refs': 'invokeGetDrawRefs',
    'on-get-drawlayer': 'invokeGetDrawLayers',
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
    invokeGetDrawRefs(draw) {
      this.$drawRefs = draw.drawRefs;
      this.drawType = draw.REFS;
    },
    invokeGetDrawLayers(layers) {
      let wktStr = L.Wkt.Wkt.prototype.fromJson(layers.toGeoJSON(), true);
      wktStr = wktStr.write();
      wktStr = wktStr.replace(/undefined/g, ' ');
      this.$emit('on-get-drawlayer', layers, wktStr);
    },
    // 清除操作
    clearLayers() {
      if (this.drawType) {
        this.drawType.forEach(item => {
          this.$drawRefs[item].clearDrawLayer();
        });
      }
    },
    setParams() {
      if (this.radius) {
        return {
          bufferOptions: {
            radius: this.radius,
            options: {
              units: this.units,
            },
          },
        };
      } else {
        return {};
      }
    },
    drawGeometry(name) {
      this.clearToolLayer();
      const drawType = name.split('-')[1];
      let params = this.setParams();
      if (this.drawType.includes(drawType)) {
        this.$drawRefs[drawType].drawGeometry(params);
      } else {
        const state = {
          defineline() {
            this.$drawRefs['polyline'].drawGeometry({
              customDraw: true,
              params,
            });
          },
          file() {},
          delete() {
            this.$emit('on-get-drawlayer', null);
          },
        };
        state[drawType].call(this);
      }
    },
    uploadSuccess(data) {
      this.clearToolLayer();
      if (data.data) {
        const wkt = new L.Wkt.Wkt();
        wkt.read(data.data[0]);
        this.geometry = wkt.toObject(false);
        this.geometry.addTo(this.$drawRefs.geojson.$queryLayers);
        if (this.radius) {
          const bufferedGeoJson = buffer(this.geometry.toGeoJSON(), this.radius, {
            units: this.units,
          });
          this.bufferLayers = L.GeoJSON.geometryToLayer(bufferedGeoJson);
          this.bufferLayers.addTo(this.$drawRefs.geojson.$queryLayers);
          this.$emit('on-get-drawlayer', this.bufferLayers, data.data[0]);
        } else {
          this.$emit('on-get-drawlayer', this.geometry, data.data[0]);
        }
      }
    },
    clearToolLayer() {
      this.clearLayers();
      if (this.geometry) {
        this.$drawRefs.geojson.$queryLayers.removeLayer(this.geometry);
      }
      if (this.bufferLayers) {
        this.$drawRefs.geojson.$queryLayers.removeLayer(this.bufferLayers);
      }
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
