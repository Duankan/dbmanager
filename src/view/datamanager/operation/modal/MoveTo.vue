<script>
import * as types from '@/store/types';
import api from 'api';

export default {
  name: 'MoveTo',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    nodes: {
      type: [Object, Array],
      required: true,
    },
  },
  data() {
    return {
      moveToNode: {},
    };
  },
  computed: {
    current() {
      return this.$store.state.app.currentDirectory;
    },
  },
  methods: {
    visibleChange(visible) {
      this.$emit('input', visible);
    },
    async moveNode() {
      await api.fetch.all(
        this.nodes.map(node =>
          api.db.moveCatalog({
            catalogId: node.childId, //  迁移目录ID，即选中节点的childId
            fromId: node.parentId, //  原始父目录ID ,即选中节点的parentId
            toId: this.moveToNode.childId, //  新的父目录ID ，即新目录节点的childId
            toSort: 1, //  目标节点排列顺序（缺省值为最后）
          })
        )
      );
      this.$store.dispatch(types.APP_NODES_FETCH, this.current);
    },
  },
};
</script>

<template>
  <Modal
    :value="value"
    :mask-closable="false"
    width="400"
    title="移动到"
    scrollable
    @on-ok="moveNode"
    @on-visible-change="visibleChange">
    <DataTree
      v-if="value"
      directory
      accordion
      @on-current-select="(node) => moveToNode = node">
    </DataTree>
  </Modal>
</template>

<style lang="less" scoped>
.k-modal {
  /deep/ &-body {
    max-height: 300px;
    overflow: auto;
  }
}
</style>
