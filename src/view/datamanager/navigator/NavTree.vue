<script>
export default {
  name: 'NavTree',
  data() {
    return {
      searchTreeKey: '',
    };
  },
  events: {
    'on-nav-tree-update': 'updateNavTree',
  },
  methods: {
    updateNavTree() {},
    select(node) {
      this.$emit('on-current-select', node);
    },
  },
};
</script>

<template>
  <div>
    <Input
      v-model="searchTreeKey"
      style="margin-top:8px;margin-bottom:8px;width:100%"
      icon="ios-search"
      placeholder="请输入资源目录关键字..."
    >
    </Input>
    <DataTree
      :click-node-expand="false"
      :search-tree-key="searchTreeKey"
      directory
      accordion
      @on-current-select="select">
    </DataTree>
  </div>
</template>

<style lang="less" scoped>
.k-tree {
  /deep/ &-title-selected {
    background: transparent;
  }
}
</style>
