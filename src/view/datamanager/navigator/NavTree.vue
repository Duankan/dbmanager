<script>
export default {
  name: 'NavTree',
  data() {
    return {
      searchTreeKey: '',
    };
  },
  methods: {
    select(node) {
      this.$emit('on-current-select', node);
    },
  },
};
</script>

<template>
  <div class="nav-tree-wrapper">
    <Input
      v-model="searchTreeKey"
      clearable
      size="small"
      icon="ios-search"
      class="search-input"
      placeholder="请输入资源目录关键字...">
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

<style lang="less">
.nav-tree-wrapper {
  .search-input {
    margin: 0 5px 5px 15px;
    width: 195px;
  }
}
</style>
