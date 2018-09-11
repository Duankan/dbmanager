<script>
import config from 'config';
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
      showLayerTitle: '',
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
      handler(val) {},
    },
  },
  mounted() {
    this.selectLayer = this.historyLayerList[this.layerIndex].title;
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
    selectChange(value) {
      debugger;
      this.$store.commit(`${this.mapId}/SET_MAP_GOCLAYER_DELETE`, [this.showLayerTitle]);
      this.$nextTick(() => {
        var item = this.historyLayerList.find(function(elem) {
          return elem.title == value;
        });
        var styleName = config.editStyle.polyline;
        if (item.type == 'point') {
          styleName = config.editStyle.point;
        } else if (item.type == 'polygon') {
          styleName = config.editStyle.polygon;
        }
        // var layerStyle = 'EditPointStyle'; //ktw_136703855 点; ktw_fffffffd97ef3980 线 ktw_fffffffb5bda492f
        if (item.time == '当前图层') {
          styleName = '';
        }
        var serviceList = {
          [item.title]: [
            {
              servicestype: 12,
              servicesurl: item.url,
              title: item.title,
              options: {
                styles: styleName,
              },
            },
          ],
        };
        this.$store.commit(`${this.mapId}/SET_MAP_SERVICELIST`, serviceList);
        this.showLayerTitle = item.title;
        window.dispatchEvent(new Event('resize'));
      });
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
      class="select-layer"
      @on-change="selectChange">
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
