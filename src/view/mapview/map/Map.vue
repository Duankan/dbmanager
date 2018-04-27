<script>
export default {
  name: 'Map',
  computed: {
    bbox() {
      return this.$store.state.app.bbox;
    },
  },
  watch: {
    bbox(val) {
      this.$refs.map.setBounds(val);
    },
  },
  methods: {
    handleClick() {},
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
      <BaseLayer/>
      <GeoJson/>
      <MousePosition/>
    </BaseMap>
  </div>
</template>

<style lang="less" scoped>
.map {
  flex: 1;
}
</style>
