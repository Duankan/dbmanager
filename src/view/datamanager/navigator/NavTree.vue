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
    async searchTree() {
      debugger;
      // const searchTree = await api.db.findCatalog({
      //   name: this.searchTreeKey,
      //   owner: 1,
      //   ownerId: this.$appUser.orgid,
      //   access: 1,
      //   hasChild: false,
      //   relatedType: 1,
      //   orderby: 'sort_asc',
      //   getmode: 'all',
      //   resourceTypeId: '1,2',
      //   parentId: item.childId,
      // });
    },
  },
};
</script>

<template>
  <div>
    <Input
      v-model="searchTreeKey"
      clearable
      style="margin-top:8px;margin-bottom:8px;width:100%"
      icon="ios-search"
      placeholder="请输入资源目录关键字..."
      @on-click="searchTree">
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
