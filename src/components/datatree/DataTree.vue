<script>
// const api = require('@ktw/api');
import Vue from 'vue';
import { url } from '@ktw/ktools';
import api from '@ktw/api';
import DataTreeNode from './DataTreeNode.vue';
// import * as types from '../../store/types';

const SET_MAP_SERVICELIST = 'SET_MAP_SERVICELIST';

export default {
  name: 'DataTree',
  components: {
    DataTreeNode,
  },
  inheritAttrs: false,
  props: {
    // 根节点名称
    rootNodeText: {
      type: String,
      default: '数据目录',
    },
    // 只显示目录
    directory: {
      type: Boolean,
      default: false,
    },
    // 多选模式
    checkbox: {
      type: Boolean,
      default: false,
    },
    // 过滤节点类型 ['sld', 'vector', 'raster', 'file']
    filterType: {
      type: [Array, String],
      validator(val) {
        const filter = ['sld', 'vector', 'raster', 'file'];
        if (!Array.isArray(val)) {
          val = [val];
        }
        return val.every(item => filter.includes(item));
      },
      default: () => ['sld'],
    },
    // 过滤节点函数，将在filterType之后调用，以便自定义
    filterNode: {
      type: Function,
      default: () => false,
    },
    // 搜索时节点过滤函数
    searchFilterNode: {
      type: Function,
      default: (value, node) => {
        if (!value) return true;
        return node.name.indexOf(value) !== -1;
      },
    },
    // 节点过滤值
    filterText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      treeData: [],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  async mounted() {
    await this.loadRootNode();
    // 默认展开加载根节点后，展开根节点
    if (!this.clickNodeExpand) {
      this.$refs.tree.$children[0].handleExpand();
    }
    this.$refs.tree.$children[0].handleSelect();
  },
  methods: {
    // 判断是否是目录节点
    nodeType(node) {
      switch (node.typeId) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
          return 'directory';
        case '20001': //点线面
        case '20010': //csv
        case '20011': //csv dataset
        case '20012': //csv zip
        case '20002': //地名地址
          return 'vector';
        case '20003': //dom tiff
        case '20007': //dom 影像图幅文件
        case '20008': //dem tiff
        case '20009': //dem 影像图幅文件
          return 'raster';
        case '20102': //sld 样式文件
          return 'sld';
        case '10005': //doc
        case '10006': //txt
        case '10007': //csv
        case '10008': //xls
        case '10009': //zip
        case '10010': //pdf
          return 'file';
      }
    },
    // 获取根节点信息
    async loadRootNode() {
      const response = await api.public.findCatalog({
        owner: 1,
        ownerId: this.$user.orgid,
        access: 1,
        hasChild: false,
        orderby: 'sort_asc',
      });
      response.data[0].loading = false;
      response.data[0].children = [];
      response.data[0].title = this.rootNodeText;

      this.treeData.push(response.data[0]);
    },
    //异步加载子目录和数据
    async loadData(item, callback) {
      const response = await api.public.findCatalog({
        owner: 1,
        ownerId: this.$user.orgid,
        access: 1,
        hasChild: false,
        relatedType: 1,
        orderby: 'sort_asc',
        getmode: 'all',
        resourceTypeId: '1,2',
        parentId: item.childId,
      });
      const children = [];
      response.data.forEach(node => {
        const nodeType = this.nodeType(node);
        if (this.directory) {
          if (nodeType === 'directory') {
            if (node.isChild === 'open') {
              node.loading = false;
              node.children = [];
            }
            node.title = node.name;
            children.push(node);
          }
        } else {
          if (!this.filterType.includes(nodeType) && !this.filterNode(node, nodeType)) {
            if (node.isChild === 'open') {
              node.loading = false;
              node.children = [];
            }
            node.title = node.name;
            children.push(node);
          }
        }
      });

      callback(children);
    },
    beforeDrop(dragNode, dragOverNode) {
      return this.nodeType(dragOverNode.node) === 'directory' ? true : false;
    },
    dragEnd(event, node) {
      const { top, left, right, bottom } = document
        .getElementsByClassName('k-map-container')[0]
        .getBoundingClientRect();
      if (left <= event.clientX <= right && top <= event.clientY <= bottom) {
        if (this.nodeType(node) === 'directory' || (node.children && node.children.length)) {
          const serviceObject = node.children.reduce((previous, current) => {
            if (current.isView) {
              const search = url.parse(current.serviceList[0].servicesurl).search;
              const layers = search.layers ? search.layers : search.typeName;
              previous[layers] = current.serviceList;
            }
            return previous;
          }, {});
          this.$store.commit(SET_MAP_SERVICELIST, serviceObject);
        } else {
          const search = url.parse(node.serviceList[0].servicesurl).search;
          const layers = search.layers ? search.layers : search.typeName;
          this.$store.commit(SET_MAP_SERVICELIST, {
            [layers]: node.serviceList,
          });
        }
      }
    },
    renderContent(h, { root, node, data }) {
      return h(
        DataTreeNode,
        {
          props: {
            rootNode: root[0].node,
            currentNode: node.node,
            nodeData: data,
          },
        },
        [this.$scopedSlots.default]
      );
    },
  },
};
</script>

<template>
  <div class="k-datatree">
    <Tree
      ref="tree"
      :data="treeData"
      :load-data="loadData"
      :render="renderContent"
      :filter-node="searchFilterNode"
      :before-drop="beforeDrop"
      :show-checkbox="checkbox"
      v-bind="$attrs"
      v-on="$listeners"
      @on-drag-end="dragEnd"
    />
  </div>
</template>
