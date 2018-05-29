<script>
export default {
  name: 'NavTree',
  events: {
    'on-nav-tree-update': function() {},
  },
  methods: {
    select(node) {
      this.$emit('on-current-select', node);
    },
  },
};
</script>

<template>
  <DataTree
    :click-node-expand="false"
    directory
    accordion
    @on-current-select="select">
  </DataTree>
</template>

<style lang="less" scoped>
.k-tree {
  /deep/ &-title-selected {
    background: transparent;
  }
}
</style>
