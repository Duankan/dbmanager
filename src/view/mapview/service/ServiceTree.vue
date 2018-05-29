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
  },
};
</script>

<template>
  <DataTree
    :filter-type="['sld', 'file']"
    :filter-text="filterText"
    :filter-node="filterNode"
    draggable></DataTree>
</template>

<style lang="less" scoped>
</style>
