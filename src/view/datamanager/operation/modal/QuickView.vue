<script>
import { url } from '@ktw/ktools';

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
    return {};
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          const search = url.parse(this.node.serviceList[0].servicesurl).search;
          const layers = search.layers ? search.layers : search.typeName;
          this.$store.commit(SET_MAP_SERVICELIST, {
            [layers]: this.node.serviceList,
          });
        }
      },
      immediate: true,
    },
  },
  methods: {},
};
</script>

<template>
  <Modal
    :value="value"
    width="800">
    <BaseMap>
      <TileWMSLayer/>
    </BaseMap>
  </Modal>
</template>

<style lang="less" scoped>
</style>
