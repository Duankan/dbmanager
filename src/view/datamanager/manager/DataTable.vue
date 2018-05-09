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
          align: 'center',
          sortable: true,
          sortMethod(a, b, type) {},
        },
        {
          title: '已发布服务',
          key: 'pubState',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            if (params.row.pubState == '-') return <span>-</span>;
            return params.row.pubState ? (
              <span class={['pubstate', 'published']} />
            ) : (
              <span class={['pubstate', 'unpublish']} />
            );
          },
          sortMethod(a, b, type) {},
        },
        {
          title: '类型',
          key: 'typeName',
          sortable: true,
          ellipsis: true,
        },
        {
          title: '拥有者',
          key: 'userName',
          align: 'center',
        },
        {
          title: '修改日期',
          key: 'updateTime',
          align: 'center',
          sortable: true,
        },
      ],
    };
  },
  computed: {
    tableData() {
      return this.value.map(item => {
        item.alias = item.alias ? item.alias : item.name;
        item.userName = item.userName ? item.userName : item.createusername || '-';
        item.size = item.size != undefined ? filesize(item.size) : '-';
        item.pubState = item.pubState != undefined ? item.pubState : '-';
        item.updateTime = new Date(item.updateTime).toLocaleDateString();
        return item;
      });
    },
  },
  methods: {
    sort() {},
    clickRow(row, index) {},
  },
};
</script>

<template>
  <Table
    ref="table"
    :columns="columns"
    :data="tableData"
    :height="height"
    size="small"
    @on-row-click="clickRow"></Table>
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
  /deep/ .pubstate {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    &.published {
      background-color: #19be6b;
    }
    &.unpublish {
      background-color: #ff9900;
    }
  }
}
</style>
