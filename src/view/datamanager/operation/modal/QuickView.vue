<script>
import { url } from '@ktw/ktools';

const SET_MAP_GOCLAYER_DELETE = 'SET_MAP_GOCLAYER_DELETE';
const SET_MAP_SERVICELIST = 'SET_MAP_SERVICELIST';

export default {
  name: 'QuickView',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    node: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showMap: true,
    };
  },
  watch: {
    value(val) {
      if (val) {
        const service = this.node.serviceList.find(service => service.servicestype === 12);
        const { search } = url.parse(service.servicesurl);
        this.layerName = search.layers ? search.layers : search.typeName;
        this.$store.commit(SET_MAP_SERVICELIST, {
          [this.layerName]: this.node.serviceList,
        });
        window.dispatchEvent(new Event('resize'));
        const bbox = search.bbox.split(',');
        this.bbox = [[+bbox[1], +bbox[0]], [+bbox[3], +bbox[2]]];
      }
    },
  },
  methods: {
    visibleChange(visible) {
      if (!visible) {
        this.$store.commit(SET_MAP_GOCLAYER_DELETE, [this.layerName]);
      }
      this.$emit('input', visible);
    },
    resize() {
      this.$refs.map.setBounds(this.bbox);
    },
    toggle() {},
  },
};
</script>

<template>
  <Modal
    v-model="value"
    width="1000"
    @on-visible-change="visibleChange">
    <div class="map">
      <Switch
        v-model="showMap"
        size="large"
        @on-change="toggle">
        <span slot="open">地图</span>
        <span slot="close">数据</span>
      </Switch>
      <BaseMap
        v-show="showMap"
        ref="map"
        @k-resize="resize">
        <TileWMSLayer/>
      </BaseMap>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>

<style lang="less" scoped>
.map {
  position: relative;
  .k-map-container {
    height: 600px;
  }
  .k-switch {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
  }
}
.k-modal {
  /deep/ &-close {
    display: none;
  }
  /deep/ &-footer {
    padding: 0;
    border: none;
  }
}
</style>
