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
    'on-common-tree-update': 'fetchData',
  },
  methods: {
    async fetchData() {
      const response = await api.db.findCommonCatalog({
        userId: this.$appUser.id,
      });
      this.common = Array.isArray(response.data) ? response.data : [];
    },
    async removeFavor(data) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>您确定要删除收藏吗？</p>',
        onOk: async () => {
          await api.db.deleteCommonCatalog({
            ids: [data.id],
            type: '1001',
            userId: this.$appUser.id,
          });
          const deleteIndex = this.common.findIndex(item => item.id === data.id);
          this.common.splice(deleteIndex, 1);
        },
      });
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
            nativeOnClick={e => {
              e.stopPropagation();
              this.removeFavor(data);
            }}
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
    empty-text="暂无收藏目录"
    v-on="$listeners"></Tree>
</template>

<style lang="less" scoped>
.k-tree {
  /deep/ &-title-selected {
    background: transparent;
  }
  /deep/ .common-tree-node {
    display: flex;
    &-title {
      flex: 1;
      margin-left: 6px;
    }
    &-remove {
      display: none;
    }
    &:hover .common-tree-node-remove {
      display: block;
    }
  }
}
</style>
