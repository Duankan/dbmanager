<script>
const REFS = ['polygon', 'rectangle', 'marker', 'polyline', 'circle'];

export default {
  name: 'Map',
  events: {
    'on-set-bbox': function({ val, index }) {
      if (val) {
        this.$refs.map.setBounds(val);
      } else {
        this.$store.getters.ogcLayers[index - 1].fitBounds();
      }
    },
  },
  mounted() {
    this.$events.emit('on-getdraw-refs', { drawRefs: this.$refs, REFS }, true);
  },
  methods: {
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
      <MapSearch/>
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
}
</style>
