<script>
import { isDirectory, isGisResource, canView } from '@/utils';

export default {
  name: 'ServiceTree',
  data() {
    return {};
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
    :filter-node="filterNode"></DataTree>
</template>

<style lang="less" scoped>
</style>
