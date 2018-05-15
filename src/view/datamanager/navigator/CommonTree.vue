<script>
import api from 'api';

export default {
  name: 'CommonTree',
  inheritAttrs: false,
  data() {
    return {
      common: [],
    };
  },
  created() {
    this.fetchData();
  },
  events: {
    'on-common-tree-update': function() {
      this.fetchData();
    },
  },
  methods: {
    async fetchData() {
      const response = await api.db.findCommonCatalog({
        userId: this.$user.id,
      });
      this.common = response.data;
    },
    async removeFavor(data) {
      await api.db.deleteCommonCatalog({
        ids: [data.id], // ids为[]，清除所有
        type: '1001', // 1001:目录 1002:服务 1003:数据
        userId: this.$user.id, // 用户id
      });
      const deleteIndex = this.common.findIndex(item => item.id === data.id);
      this.common.splice(deleteIndex, 1);
    },
    renderContent(h, { root, node, data }) {
      return (
        <div class="common-tree-node">
          <svgIcon icon-class="folder-favor" size="16" />
          <span class="common-tree-node-title">{data.name}</span>
          <svgIcon
            class="common-tree-node-remove"
            icon-class="delete"
            size="16"
            nativeOnClick={() => this.removeFavor(data)}
          />
        </div>
      );
    },
  },
};
</script>

<template>
  <Tree
    :data="common"
    :render="renderContent"
    v-bind="$attrs"
    v-on="$listeners"></Tree>
</template>

<style lang="less">
.common-tree-node {
  display: flex;
  &-title {
    flex: 1;
    margin-left: 6px;
  }
  &-remove {
    display: none;
  }
  &:hover &-remove {
    display: block;
  }
}
</style>
