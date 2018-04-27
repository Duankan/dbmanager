<script>
import { filesize } from '@ktw/ktools';

export default {
  name: 'DataTable',
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      height: 760,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '文件名',
          key: 'alias',
          width: 800,
        },
        {
          title: '大小',
          key: 'size',
        },
        {
          title: '已发布服务',
          key: 'pubState',
        },
        {
          title: '类型',
          key: 'typeName',
        },
        {
          title: '上传人',
          key: 'userName',
        },
        {
          title: '修改日期',
          key: 'updateTime',
        },
      ],
    };
  },
  computed: {
    tableData() {
      return this.value.map(item => {
        item.alias = item.alias ? item.alias : item.title;
        item.userName = item.userName ? item.userName : item.createusername || '-';
        item.size = item.size ? filesize(item.size) : '-';
        item.pubState = item.pubState ? item.pubState : '-';
        item.updateTime = new Date(item.updateTime).toLocaleDateString();
        return item;
      });
    },
  },
};
</script>

<template>
  <Table
    ref="table"
    :columns="columns"
    :data="tableData"
    :height="height"
    size="small" ></Table>
</template>

<style lang="less" scoped>
.k-table-wrapper {
  border: none;
  /deep/ .k-table {
    &::before,
    &::after {
      display: none;
    }
  }
}
</style>
