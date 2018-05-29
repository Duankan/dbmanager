<script>
import * as types from '@/store/types';

export default {
  name: 'DeleteResource',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    nodes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      columns: [
        {
          title: '文件名',
          key: '_alias',
          ellipsis: true,
        },
        {
          title: '类型',
          key: 'typeName',
          ellipsis: true,
        },
        {
          title: '大小',
          key: '_size',
          ellipsis: true,
        },
        {
          title: '上传人',
          key: '_userName',
          ellipsis: true,
        },
        {
          title: '所属组织',
          key: 'orgName',
          ellipsis: true,
        },
      ],
    };
  },
  methods: {
    visibleChange(visible) {
      this.$emit('input', visible);
    },
    async deleteNode() {
      await this.$store.dispatch(types.APP_SELECT_NODES_DELETE);
      // 更新目录收藏
      this.$events.emit('on-common-tree-update');
      // 提示删除成功 隐藏modal
      this.$Message.success('资源删除成功！');
      this.visibleChange(false);
    },
  },
};
</script>

<template>
  <Modal
    :value="value"
    width="500"
    scrollable
    @on-visible-change="visibleChange">
    <p
      slot="header"
      style="color:#f60;text-align:center">
      <Icon type="information-circled"></Icon>
      <span>删除确认</span>
    </p>
    <div class="delete-resource">
      <p class="tip">删除操作不可逆，确认删除后，文件将无法被找回！</p>
      <Table
        :columns="columns"
        :data="nodes"
        :height="nodes.length > 5 ? '230' : 'auto'"
        size="small"></Table>
    </div>
    <div slot="footer">
      <Button
        :loading="loading"
        type="error"
        size="large"
        long
        @click="deleteNode">删除</Button>
    </div>
  </Modal>
</template>

<style lang="less" scoped>
.delete-resource {
  text-align: center;
  .tip {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 20px;
  }
}
.k-table-wrapper {
  border: none;
  /deep/ .k-table {
    &::after {
      background-color: transparent;
    }
    th {
      border: none;
    }
  }
}
</style>
