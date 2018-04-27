<script>
export default {
  name: 'CommonTree',
  data() {
    return {
      common: [],
    };
  },
  async beforeCreate() {
    const response = await api.db.findCommonCatalog({
      userId: this.$user.id,
    });
    this.common = response.data;
  },
  methods: {
    renderContent(h, { root, node, data }) {
      return (
        <div class="common-tree-node">
          <svgIcon icon-class="folder" size="16" />
          <span class="common-tree-node-title">{data.name}</span>
        </div>
      );
    },
  },
};
</script>
<template>
  <Tree
    :data="common"
    :render="renderContent"></Tree>
</template>

<style lang="less">
.common-tree-node-title {
  margin-left: 6px;
}
</style>
