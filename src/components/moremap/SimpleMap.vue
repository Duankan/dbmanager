<script>
export default {
  props: {
    historyLayerList: {
      type: Array,
      default: () => [],
    },
    layerIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      selectLayer: '',
      mapId: this.uniqueId(6),
    };
  },
  computed: {
    map() {
      return this.$refs.map;
    },
  },
  watch: {
    historyLayerList: {
      handler(val) {
        debugger;
      },
    },
  },
  mounted() {
    debugger;
    this.selectLayer = this.historyLayerList[this.layerIndex].title;
    var serviceList = {
      [this.historyLayerList[this.layerIndex].title]: [
        {
          servicestype: 12,
          servicesurl: this.historyLayerList[this.layerIndex].url,
          title: this.historyLayerList[this.layerIndex].title,
        },
      ],
    };
    this.$store.commit(`${this.mapId}/SET_MAP_SERVICELIST`, serviceList);
    window.dispatchEvent(new Event('resize'));
  },
  methods: {
    uniqueId(length) {
      let len = length || 9;
      let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
      let maxPos = chars.length;
      let id = '';
      for (let i = 0; i < len; i++) {
        id += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return id;
    },
  },
};
</script>

<template>
  <div class="main-div">
    <BaseMap
      ref="map"
      :map-id="mapId"
      class="map">
      <TileWMSLayer></TileWMSLayer>
    </BaseMap>
    <Select 
      v-model="selectLayer" 
      class="select-layer">
      <Option 
        v-for="item in historyLayerList" 
        :value="item.title" 
        :key="item.title">{{ item.time }}</Option>
    </Select>
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
.main-div {
  height: 100%;
  width: 100%;
  position: relative;
}
.select-layer {
  width: 200px;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 999 !important;
}
.k-map-container {
  height: 100%;
  width: 100%;
}
</style>
