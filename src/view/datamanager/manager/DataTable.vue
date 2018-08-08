<script>
import ShortCut from './ShortCut';
import api from 'api';
import * as types from '@/store/types';
import { filesize, date, cloneDeep } from '@ktw/ktools';
import * as utils from '@/utils';

export default {
  name: 'DataTable',
  data() {
    return {
      height: 610,
      isActive: true,
      loading: true,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '文件名',
          key: '_alias',
          width: 660,
          sortable: true,
          sortMethod(a, b, type) {},
          render: (h, params) => {
            let child = params.row._alias;
            if (params.row._rename) {
              child = (
                <div class="rename">
                  <Input
                    value={params.row._alias}
                    nativeOnInput={e => {
                      params.row.alias = e.target.value;
                    }}
                    nativeOnClick={e => e.stopPropagation()}
                  />
                  <icon
                    type="checkmark-round"
                    color="#19be6b"
                    size="14"
                    nativeOnClick={async e => {
                      e.stopPropagation();
                      if (!params.row.alias) {
                        params.row.alias = params.row._alias;
                      }
                      if (!this.validateRename(params.row)) return;
                      if (utils.isDirectory(params.row)) {
                        await api.db.updateCatalog({
                          name: params.row.alias, //  目录名称
                          id: params.row.childId, // 目录childId
                        });
                        this.$events.emit('on-common-tree-update');
                        this.$events.emit('on-refresh-nav-tree');
                      }
                      if (utils.isGisResource(params.row)) {
                        await api.db.updateResourceInfo({
                          id: params.row.id, // 资源id
                          alias: params.row.alias, // 资源别名
                        });
                      }
                      this.$Message.success('重命名操作成功！');
                      //刷新当前节点
                      const currentNode = this.$store.state.app.currentDirectory;
                      this.$store.dispatch(types.APP_NODES_FETCH, currentNode);
                    }}
                  />
                  <icon
                    type="close-round"
                    color="#000"
                    size="14"
                    nativeOnClick={e => {
                      e.stopPropagation();
                      this.$store.commit(
                        types.UPDATE_APP_NODES,
                        Object.assign(params.row, { _rename: false })
                      );
                    }}
                  />
                </div>
              );
            }
            return (
              <span class="file">
                <svgIcon iconClass={utils.iconClass(params.row)} size={28} />
                <span class="filename">
                  {utils.isDirectory(params.row) ? (
                    <span
                      class="directory"
                      onClick={e => {
                        if (params.row._rename) return;
                        e.stopPropagation();
                        this.loading = true;
                        this.$store.dispatch(types.APP_NODES_FETCH, params.row);
                      }}
                    >
                      {child}
                    </span>
                  ) : (
                    child
                  )}
                </span>
              </span>
            );
          },
        },
        {
          title: '服务',
          key: '_pubState',
          width: 80,
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
            return value === row._pubState;
          },
          render: (h, params) => {
            if (params.row._pubState == '-') return <span>-</span>;
            return params.row._pubState ? (
              <span class={['pubstate', 'published']} />
            ) : (
              <span class={['pubstate', 'unpublish']} />
            );
          },
        },
        {
          title: '大小',
          key: '_size',
          align: 'center',
          filters: [
            {
              label: '< 1Gb',
              value: `0, ${filesize.parse('1Gb')}`,
            },
            {
              label: '1Gb ~ 10Gb',
              value: `${filesize.parse('1Gb')}, ${filesize.parse('10Gb')}`,
            },
            {
              label: '10Gb ~ 100Gb',
              value: `${filesize.parse('10Gb')}, ${filesize.parse('100Gb')}`,
            },
            {
              label: '> 100Gb',
              value: `${filesize.parse('100Gb')}, Infinity`,
            },
          ],
          filterMethod(value, row) {
            if (row._size === '-') return false;
            const sizeArr = value.split(',').map(item => Number(item));
            return (
              sizeArr[0] <= filesize.parse(row._size) && filesize.parse(row._size) <= sizeArr[1]
            );
          },
          sortable: true,
          sortMethod(a, b, type) {},
        },
        {
          title: '类型',
          key: 'typeName',
          filters: [
            {
              label: '矢量',
              value: 'isVector',
            },
            {
              label: '影像',
              value: 'isRaster',
            },
            {
              label: '文档',
              value: 'isFile',
            },
            {
              label: '服务',
              value: 'isService',
            },
          ],
          filterMethod(value, row) {
            return utils[value](row);
          },
          ellipsis: true,
        },
        {
          title: '拥有者',
          key: '_userName',
          align: 'center',
        },
        {
          title: '修改日期',
          key: '_updateTime',
          align: 'center',
          filters: [
            {
              label: '今天',
              value: 0,
            },
            {
              label: '昨天',
              value: 1,
            },
            {
              label: '三天内',
              value: 3,
            },
            {
              label: '一周内',
              value: 7,
            },
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            const updateTimeStamp = date.parse(row._updateTime, 'YYYY-M-D HH:mm').getTime();
            return updateTimeStamp >= utils.getTimeStamp(value);
          },
          sortable: true,
          sortMethod(a, b, type) {},
        },
      ],
      selection: [],
    };
  },
  computed: {
    tableData() {
      return this.handleData(cloneDeep(this.$store.state.app.nodes));
    },
    selectNodes() {
      return this.$store.state.app.selectNodes;
    },
  },
  watch: {
    tableData() {
      if (this.isActive) {
        this.loading = false;
      }
    },
    selectNodes: {
      handler(val) {
        if (val.length !== this.selection.length) {
          const params =
            this.selection.length > val.length ? [this.selection, val] : [val, this.selection];
          const difference = this.compare(...params);
          difference.forEach(node => {
            const index = this.tableData.findIndex(item => item.id === node.id);
            if (index > -1) {
              this.$refs.table.toggleSelect(index);
            }
          });
          this.selection = cloneDeep(val);
        }
      },
    },
  },
  activated() {
    this.isActive = true;
    this.loading = false;
  },
  deactivated() {
    this.isActive = false;
    this.loading = true;
  },
  methods: {
    validateRename(row) {
      if (row.alias.trim() === '') {
        this.$Message.error('名称不能为空');
        return false;
      } else if (row.alias.length > 64) {
        this.$Message.error('名称不能超过64字符');
        return false;
      }
      return true;
    },
    handleData(data) {
      return data.map((item, index) => {
        item._checked = !!this.selectNodes.find(p => p.id == item.id);
        item._alias = item.alias ? item.alias : item.name;
        item._userName = item.userName ? item.userName : item.createusername || '-';
        item._size = item.size != undefined ? filesize(item.size) : '-';
        item._pubState = item.resourceTypeId == '2' ? item.pubState : '-';
        item._updateTime = date.format(new Date(item.updateTime), 'YYYY-M-D HH:mm');
        item._index = index;
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
      if (!row._rename) {
        this.$store.commit(types.SET_APP_SELECT_NODES, row);
      }
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
  <div class="data-table">
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
  </div>
</template>

<style lang="less" scoped>
.data-table {
  position: relative;
  .select-count {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 28px;
    right: 0;
    height: 30px;
    font-weight: 700;
    padding: 7px 11px;
    background-color: #f8f8f9;
  }
}

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

  /deep/ .file {
    display: flex;
    align-items: center;
    .k-svgicon {
      margin-right: 8px;
      & > svg {
        fill: #459aee !important;
      }
    }
    .filename {
      flex: 1;
      .directory:hover {
        color: #459aee;
        cursor: pointer;
      }
      .rename {
        .k-input-wrapper {
          width: 200px;
        }
        .k-icon {
          margin-left: 14px;
        }
      }
    }
    .shortcut {
      opacity: 0;
    }
    &:hover {
      .shortcut {
        opacity: 1;
      }
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
