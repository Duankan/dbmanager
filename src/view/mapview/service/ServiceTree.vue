<script>
import { isDirectory, isGisResource, canView } from '@/utils';
import { StringDecoder } from 'string_decoder';

export default {
  name: 'ServiceTree',
  props: {
    filterText: {
      type: String,
      default: '',
    },
  },
  methods: {
    filterNode(node) {
      if (isDirectory(node)) return false;
      return isGisResource(node) && !canView(node.serviceList);
    },
    mapLayerEditStyle(value) {
      this.$emit('style-edit-event', value);
    },
  },
};
</script>

<template>
  <DataTree
    :filter-type="['sld', 'file']"
    :filter-text="filterText"
    :filter-node="filterNode"
    draggable
    @style-edit-event="mapLayerEditStyle"></DataTree>
</template>

<style lang="less" scoped>
</style>
