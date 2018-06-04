<script>
import api from 'api';
import * as types from '@/store/types';
import { filesize, date } from '@ktw/ktools';
import { isDirectory, isGisResource } from '@/utils';

export default {
  name: 'DataGrid',
  data() {
    return {
      check: false,
      loading: false,
    };
  },
  computed: {
    nodes() {
      return this.$store.state.app.nodes;
    },
    selectNodes() {
      return this.$store.state.app.selectNodes;
    },
  },
  watch: {
    nodes() {
      this.loading = false;
    },
    selectNodes: {
      handler(val) {
        this.check = val.length === this.nodes.length;
      },
      immediate: true,
    },
  },
  created() {
    this.isDirectory = isDirectory;
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
    itemClasses(node) {
      const index = this.selectNodes.findIndex(item => node.id === item.id);
      return [
        'data-grid-item',
        {
          'data-grid-item-checked': index > -1,
        },
      ];
    },
    handleData(nodes) {
      return nodes.map(item => {
        item._alias = item.alias ? item.alias : item.name;
        item._userName = item.userName ? item.userName : item.createusername || '-';
        item._size = item.size != undefined ? filesize(item.size) : '-';
        item._pubState = item.resourceTypeId == '2' ? item.pubState : '-';
        item._updateTime = date.format(new Date(item.updateTime), 'YYYY-M-D HH:mm');
        return item;
      });
    },
    checkAll(checked) {
      if (checked) {
        this.$store.commit(types.SET_APP_SELECT_NODES, this.handleData(this.nodes));
      } else {
        this.$store.commit(types.REMOVE_APP_SELECT_NODES);
      }
    },
    checkNode(node) {
      const index = this.selectNodes.findIndex(item => node.id === item.id);
      if (index > -1) {
        this.$store.commit(types.REMOVE_APP_SELECT_NODES, node);
      } else {
        this.$store.commit(types.SET_APP_SELECT_NODES, this.handleData([node]));
      }
    },
    clickNode(node, index) {
      if (isDirectory(node)) {
        this.loading = true;
        this.$store.dispatch(types.APP_NODES_FETCH, node);
      } else {
        this.checkNode(node);
      }
    },
    rename(e) {
      this.alias = e.target.value;
    },
    async confirm(node) {
      if (!this.alias) return;
      if (isDirectory(node)) {
        await api.db.updateCatalog({
          name: this.alias, //  目录名称
          id: node.childId, // 目录childId
        });
      }
      if (isGisResource(node)) {
        await api.db.updateResourceInfo({
          id: node.id, // 资源id
          alias: this.alias, // 资源别名
        });
      }
      this.$Message.success('重命名操作成功！');
      this.$events.emit('on-common-tree-update');
      this.$store.commit(
        types.UPDATE_APP_NODES,
        Object.assign(node, { alias: this.alias, _rename: false })
      );
    },
    cancel(node) {
      this.alias = '';
      this.$store.commit(types.UPDATE_APP_NODES, Object.assign(node, { _rename: false }));
    },
    upload() {
      this.$events.emit('on-upload');
    },
  },
};
</script>

<template>
  <div class="data-grid">
    <div
      v-if="nodes.length"
      class="data-grid-wrap">
      <div class="data-grid-header">
        <Checkbox
          :value="check"
          @input="checkAll">
          <span
            v-if="selectNodes.length"
            class="total-check">已选择 {{ selectNodes.length }} 项</span>
          <span
            v-else
            class="total-check">全选</span>
        </Checkbox>
      </div>
      <div class="data-grid-container">
        <div
          v-for="(node, index) in nodes"
          :key="node.id"
          :class="itemClasses(node)"
          @click="clickNode(node, index)">
          <Icon
            type="checkmark-circled"
            size="22"
            color="#3F8CFF"
            @click.native.stop="checkNode(node)"></Icon>
          <SvgIcon
            :icon-class="iconClass(node)"
            size="60">
          </SvgIcon>
          <div
            v-if="node._rename"
            class="rename">
            <Input
              :value="node.alias || node.name"
              size="small"
              @input.native="rename"
              @click.native.stop/>
            <Icon
              type="checkmark-round"
              color="#19be6b"
              size="14"
              @click.native.stop="confirm(node)"/>
            <Icon
              type="close-round"
              color="#000"
              size="14"
              @click.native.stop="cancel(node)"/>
          </div>
          <Ellipsis
            v-else
            :class="isDirectory(node) ? 'directory' : ''"
            :length="10">{{ node.alias || node.name }}</Ellipsis>
        </div>
        <Spin
          v-if="loading"
          size="large"
          fix></Spin>
      </div>
    </div>
    <div
      v-else
      class="data-grid-empty">
      <img
        src="~assets/datamanager/empty-file.png"
        alt="">
      <span class="tips">您还没上传过文件哦，点击 <a
        href="#"
        @click="upload">上传</a> 按钮～</span>
    </div>
  </div>
</template>
<style lang="less" scoped>
.data-grid {
  height: calc(~'100% - 87px');
  &-empty {
    height: 100%;
    text-align: center;

    & > img {
      margin-top: 260px;
    }
    .tips {
      display: block;
      font-size: 14px;
      margin-top: 20px;
    }
  }
}
.data-grid-header {
  height: 32px;
  padding: 7px 11px;
  background-color: #f8f8f9;
  border-bottom: 1px solid #e9eaec;
  .total-check {
    font-weight: 700;
    margin-left: 8px;
  }
}

.data-grid-container {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  position: relative;
  height: calc(~'100% - 33px');

  .data-grid-item {
    position: relative;
    margin: 4px 0 0 6px;
    height: 120px;
    width: 130px;
    text-align: center;
    border-radius: 5px;
    border: 1px solid transparent;
    cursor: pointer;

    &-checked {
      border-color: #459aee;
      background-color: #eef8ff;
      .k-icon {
        opacity: 1 !important;
      }
    }

    &:hover {
      background-color: #eef8ff;
      .k-icon {
        opacity: 0.5;
      }
    }

    .rename {
      .k-input-wrapper {
        width: 60%;
      }
      .k-icon {
        margin-left: 4px;
        cursor: pointer;
      }
    }

    > .k-icon {
      position: absolute;
      top: 5px;
      left: 5px;
      opacity: 0;
      &:hover {
        opacity: 0.6;
      }
    }

    .k-svgicon {
      margin: 20px 34px 10px 34px;
    }

    .directory:hover {
      color: #459aee;
      cursor: pointer;
    }
    .k-ellipsis {
      text-align: center;
    }
  }
}
</style>
