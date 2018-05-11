<script>
import api from 'api';
import * as types from '@/store/types';
import { filesize, cloneDeep } from '@ktw/ktools';

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
      loading: true,
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
          sortable: true,
          sortMethod(a, b, type) {},
          render: (h, params) => {
            const isDirectory = +params.row.typeId <= 8;
            return (
              <span class={'filename'}>
                <svgIcon iconClass={this.iconClass(params.row)} size={28} />
                {isDirectory ? (
                  <span
                    class={'directory'}
                    onClick={e => {
                      e.stopPropagation();
                      this.loading = true;
                      this.$emit('on-select-node', params.row);
                    }}
                  >
                    {params.row.alias}
                  </span>
                ) : (
                  <span>{params.row.alias}</span>
                )}
              </span>
            );
          },
        },
        {
          title: '服务',
          key: 'pubState',
          align: 'center',
          filters: [
            {
              label: '已发布',
              value: 1,
            },
            {
              label: '未发布',
              value: 0,
            },
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            return value === row.pubState;
          },
          render: (h, params) => {
            if (params.row.pubState == '-') return <span>-</span>;
            return params.row.pubState ? (
              <span class={['pubstate', 'published']} />
            ) : (
              <span class={['pubstate', 'unpublish']} />
            );
          },
        },
        {
          title: '大小',
          key: 'size',
          align: 'center',
          filters: [
            {
              label: '< 1Gb',
              value: 1,
            },
            {
              label: '1Gb ~ 10Gb',
              value: 0,
            },
            {
              label: '10Gb ~ 100Gb',
              value: 0,
            },
            {
              label: '> 100Gb',
              value: 0,
            },
          ],
          filterMethod(value, row) {
            return value === row.pubState;
          },
          sortable: true,
          sortMethod(a, b, type) {},
        },
        {
          title: '类型',
          key: 'typeName',
          filters: [
            {
              label: '< 1Gb',
              value: 1,
            },
            {
              label: '1Gb ~ 10Gb',
              value: 0,
            },
            {
              label: '10Gb ~ 100Gb',
              value: 0,
            },
            {
              label: '> 100Gb',
              value: 0,
            },
          ],
          filterMethod(value, row) {
            return value === row.pubState;
          },
          sortable: true,
          ellipsis: true,
        },
        {
          title: '拥有者',
          key: 'userName',
          align: 'center',
          sortable: true,
          sortMethod(a, b, type) {},
        },
        {
          title: '修改日期',
          key: 'updateTime',
          align: 'center',
          filters: [
            {
              label: '今天',
              value: 0,
            },
            {
              label: '昨天',
              value: 0,
            },
            {
              label: '一周内',
              value: 0,
            },
            {
              label: '其他',
              value: 0,
            },
          ],
          filterMultiple: false,
          filterMethod(value, row) {},
          sortable: true,
        },
      ],
      tableData: [],
      selection: [],
    };
  },
  computed: {
    selectNodes() {
      return this.$store.state.app.selectNodes;
    },
  },
  watch: {
    value: {
      handler(val) {
        this.tableData = this.handleData(val);
        this.loading = false;
      },
    },
    selectNodes: {
      handler(val) {
        if (val.length !== this.selection.length) {
          const params =
            this.selection.length > val.length ? [this.selection, val] : [val, this.selection];
          const difference = this.compare(...params);
          difference.forEach(node => {
            const index = this.tableData.findIndex(item => item.id === node.id);
            this.$refs.table.toggleSelect(index);
          });
          this.selection = cloneDeep(val);
        }
      },
    },
  },
  methods: {
    iconClass(node) {
      switch (node.typeId) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
          return 'folder';
        case '20001': //点线面
        case '20010': //csv
        case '20011': //csv dataset
        case '20012': //csv zip
          switch (node.shapeType.toUpperCase()) {
            case 'POINT':
              return 'point';
            case 'POLYLINE':
            case 'LINESTRING':
            case 'MULTILINESTRING':
              return 'line';
            case 'POLYGON':
            case 'MULTIPOLYGON':
              return 'polygon';
          }
        case '20002': //地名地址
          return 'dmdz';
        case '20003': //dom tiff
        case '20007': //dom 影像图幅文件
          return 'dom';
        case '20008': //dem tiff
        case '20009': //dem 影像图幅文件
          return 'dem';
        case '20005': //接图表shapezip
          return 'grid';
        case '20014': //controlcsvzip dataset
          return 'point';
        case '10005': //doc
          return 'doc';
        case '10006': //txt
          return 'txt';
        case '10007': //csv
          return 'csv';
        case '10008': //xls
          return 'xls';
        case '10009': //zip
          return 'zip';
        case '10010': //pdf
          return 'pdf';
        default:
          return 'other';
      }
    },
    handleData(data) {
      return data.map(item => {
        item.alias = item.alias ? item.alias : item.name;
        item.userName = item.userName ? item.userName : item.createusername || '-';
        item.size = item.size != undefined ? filesize(item.size) : '-';
        item.pubState = item.resourceTypeId == '2' ? item.pubState : '-';
        item.updateTime = new Date(item.updateTime).toLocaleDateString();
        return item;
      });
    },
    // 接受两个参数，根据id求两个数组参数的差集
    compare(superset, subset) {
      return superset.filter(ele => {
        const index = subset.findIndex(item => ele.id === item.id);
        return index === -1;
      });
    },
    clickRow(row, index) {
      this.$refs.table.toggleSelect(index);
    },
    selectRow(selection, row) {
      this.$store.commit(types.SET_APP_SELECT_NODES, row);
    },
    cancelSelectRow(selection, row) {
      this.$store.commit(types.REMOVE_APP_SELECT_NODES, row);
    },
    selectAllRow(selection) {
      this.$store.commit(types.SET_APP_SELECT_NODES, selection);
    },
    selectChange(selection) {
      this.selection = selection;
      if (!selection.length) {
        this.$store.commit(types.REMOVE_APP_SELECT_NODES);
      }
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
    :loading="loading"
    size="small"
    @on-row-click="clickRow"
    @on-select="selectRow"
    @on-select-cancel="cancelSelectRow"
    @on-select-all="selectAllRow"
    @on-selection-change="selectChange">
  </Table>
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
  /deep/ .k-table-cell {
    padding-left: 0px;
  }

  /deep/ .filename {
    display: flex;
    align-items: center;
    .k-svgicon {
      margin-right: 8px;
      & > svg {
        fill: #459aee !important;
      }
    }
    .directory:hover {
      color: #459aee;
      cursor: pointer;
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
