<script>
import config from 'config';
import buffer from '@turf/buffer';
import MapRefs from '@/components/maptools/map-refs';
const REFS = ['polygon', 'rectangle', 'marker', 'polyline', 'circle'];

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
export default {
  name: 'DrawTools',
  props: {
    layerUrl: {
      type: String,
      default: '',
    },
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
    disabled: {
      type: Boolean,
      default: false,
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
      relRadius: this.radius,
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
    radius(newVal) {
      this.relRadius = newVal;
    },
  },
  events: {
    'on-get-drawlayer': 'invokeGetDrawLayers',
  },
  mounted() {
    this.uploadAction = `${
      config.project.basicUrl
    }/service/gisserver/getwktsbyshpzip?crs=EPSG:4490&count=1`;
    this.drawType = REFS;
    this.$mapObj = MapRefs.inst().getMap();
  },
  beforeDestroy() {
    this.clearToolLayer();
  },
  methods: {
    invokeGetDrawLayers(layers) {
      const wktStr = this.changeWkt(layers, true);
      const invokeGetWktStr = this.changeWkt(layers, false);
      this.$emit('on-get-drawlayer', layers, wktStr, invokeGetWktStr, this.geoType);
    },
    changeWkt(layers, isChange) {
      let wktStr = L.Wkt.Wkt.prototype.fromJson(layers.toGeoJSON(), isChange);
      wktStr = wktStr.write();
      wktStr = wktStr.replace(/undefined/g, ' ');
      return wktStr;
    },
    // 清除操作
    clearLayers() {
      this.$mapObj.$children.forEach(item => {
        if (item['destory']) {
          item.destory();
        }
      });
    },
    setParams() {
      if (this.relRadius !== 0) {
        return {
          bufferOptions: {
            url: this.layerUrl,
            radius: this.relRadius,
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
      this.geoType = name.split('-')[1];
      let params;
      if (this.geoType === 'circle') {
        this.relRadius = 0.0001;
      } else {
        this.relRadius = 0;
      }
      params = this.setParams();

      this.$drawRefs = MapRefs.inst().getDrawer(this.geoType);
      if (this.drawType.includes(this.geoType)) {
        this.$drawRefs.drawGeometry(params);
      } else {
        const state = {
          defineline() {
            this.$drawRefs = MapRefs.inst().getDrawer('polyline');
            this.$drawRefs.drawGeometry({
              customDraw: true,
              bufferOptions: params.bufferOptions ? params.bufferOptions : null,
              params,
            });
          },
          file() {},
          delete() {
            this.$emit('on-get-drawlayer', null);
          },
        };
        state[this.geoType].call(this);
      }
    },
    uploadSuccess(data) {
      this.clearToolLayer();
      if (data.data) {
        const wktFormat = new L.Format.WKT();
        this.geometry = wktFormat.readToLayer(data.data[0], false);
        const invokeGetWktStr = this.changeWkt(this.geometry, false);
        this.geometry.addTo(this.$mapObj.$queryLayers);
        if (this.relRadius !== 0) {
          const bufferedGeoJson = buffer(this.geometry.toGeoJSON(), this.relRadius, {
            units: this.units,
          });
          this.bufferLayers = L.GeoJSON.geometryToLayer(bufferedGeoJson);
          this.bufferLayers.addTo(this.$mapObj.$queryLayers);
          this.$emit('on-get-drawlayer', this.bufferLayers, data.data[0], invokeGetWktStr);
        } else {
          this.$emit('on-get-drawlayer', this.geometry, data.data[0], invokeGetWktStr);
        }
      }
    },
    clearToolLayer() {
      this.clearLayers();
      if (this.geometry) {
        this.$mapObj.$queryLayers.removeLayer(this.geometry);
      }
      if (this.bufferLayers) {
        this.$mapObj.$queryLayers.removeLayer(this.bufferLayers);
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
      :disabled="disabled"
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
      :disabled="disabled"
      :title="fileConfig.content">
      <Upload
        ref="uploadCtrl"
        :on-success="uploadSuccess"
        :action="uploadAction"
        accept="application/zip"
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
