<script>
const REFS = ['polygon', 'rectangle', 'marker', 'polyline', 'circle'];

export default {
  name: 'Map',
  events: {
    'on-set-bbox': 'setBbox',
  },
  data() {
    const size = 16;
    return {
      //工具栏
      plugin: [
        {
          plugin: 'HomeView',
          option: {
            size: 16,
          },
        },
        {
          plugin: 'PreView',
          option: {
            size: 16,
          },
        },
        {
          plugin: 'NextView',
          option: {
            size: 16,
          },
        },
        {
          plugin: 'Position',
          option: {
            size: 16,
          },
        },
        {
          plugin: 'Measure',
          option: { type: 'length', content: '测量长度', iconClass: 'measurelength', size: 16 },
        },
        {
          plugin: 'Measure',
          option: { type: 'area', content: '测量面积', iconClass: 'measurearea', size: 16 },
        },
        {
          plugin: 'PointQuery',
          option: { size: 16 },
        },
        {
          plugin: 'PolygonQuery',
          option: { size: 16 },
        },
        {
          plugin: 'RectQuery',
          option: { size: 16 },
        },
        {
          plugin: 'ClearMapTools',
          option: { size: 16 },
        },
      ],
    };
  },
  mounted() {
    this.$events.emit('on-getdraw-refs', { drawRefs: this.$refs, REFS }, true);
  },
  methods: {
    setBbox({ bbox, index }) {
      if (bbox) {
        this.$refs.map.setBounds(bbox);
      } else {
        this.$store.getters.ogcLayers[index - 1].fitBounds();
      }
    },
    handleClick() {},
    drawGeometry(layers) {
      this.$events.emit('on-get-drawlayer', layers);
    },
  },
};
</script>

<template>
  <div class="map">
    <ContextMenu ref="contextmenu">
      <ContextMenuItem>长度测量</ContextMenuItem>
      <ContextMenuItem>面积测量</ContextMenuItem>
      <ContextMenuGroup max-width="240px">
        <ContextMenuItem @click="handleClick">
          <Icon type="flag"></Icon>点选查询
        </ContextMenuItem>
        <ContextMenuItem @click="handleClick">
          <Icon type="star"></Icon>拉框查询
        </ContextMenuItem>
        <ContextMenuItem @click="handleClick">
          <Icon type="heart"></Icon>多边形查询
        </ContextMenuItem>
        <ContextMenuItem @click="handleClick">
          <Icon type="heart-broken"></Icon>地图拾取
        </ContextMenuItem>
      </ContextMenuGroup>
    </ContextMenu>
    <BaseMap
      v-contextmenu:contextmenu
      ref="map"
    >
      <slot/>
      <NavControl/>
      <MapTool :plugins="plugin" />
      <!--<MapSearch/>-->
      <LayerTree/>
      <LayerCollect/>
      <TileWMSLayer/>
      <TileWMTSLayer/>
      <BaseLayer/>
      <TemporaryLayers></TemporaryLayers>
      <GeoJson
        ref="geojson"
        light-geometry/>
      <MousePosition/>
      <MapPolygon
        ref="polygon"
        @on-draw-polygon="drawGeometry"></MapPolygon>
      <MapRectangle
        ref="rectangle"
        @on-draw-rectangle="drawGeometry"></MapRectangle>
      <MapMarker
        ref="marker"
        @on-draw-marker="drawGeometry"></MapMarker>
      <MapPolyLine
        ref="polyline"
        @on-draw-polyline="drawGeometry"></MapPolyLine>
      <MapCircle
        ref="circle"
        @on-draw-circle="drawGeometry"></MapCircle>
    </BaseMap>
  </div>
</template>

<style lang="less" scoped>
.map {
  flex: 1;
  /deep/.leaflet-top,
  /deep/.leaflet-bottom {
    z-index: 800 !important;
  }
}

.k-mouse-position {
  position: absolute;
  font-size: 16px;
  bottom: 20px;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  z-index: 800;
}

.k-maptool {
  top: 25px;
  left: 100px;
  border-radius: 2px;
  z-index: 900;
  /deep/ .k-maptool-btn {
    padding: 4px 10px !important;
  }
}
</style>
