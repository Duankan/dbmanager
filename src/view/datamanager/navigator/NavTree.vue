<script>
export default {
  name: 'NavTree',
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
      v-model="value4"
      style="margin-top:8px;margin-bottom:8px;width:100%" 
      icon="ios-search" 
      placeholder="请输入资源目录关键字..." ></Input>
    <DataTree
      :click-node-expand="false"
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
