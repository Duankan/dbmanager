<script>
// const api = require('@ktw/api');
import Vue from 'vue';
import { url } from '@ktw/ktools';
import api from '@ktw/api';
import * as helps from '@/utils/helps';
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
    //搜索关键字
    searchTreeKey: {
      type: String,
      default: '',
    },
    // 只显示目录
    directory: {
      type: Boolean,
      default: false,
    },
    clickNodeExpand: {
      type: Boolean,
      default: true,
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
  events: {
    'on-refresh-nav-tree': 'refreshTree',
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
    searchTreeKey(val) {
      this.refreshTree();
    },
  },
  async mounted() {
    await this.loadRootNode();
    // 默认展开加载根节点后，展开根节点
    this.$nextTick(p => {
      if (!this.clickNodeExpand) {
        this.$refs.tree.$children[0].handleSelect();
      }
      this.$refs.tree.$children[0].handleExpand();
    });
  },
  methods: {
    //刷新目录树
    async refreshTree() {
      await this.loadRootNode();
      this.$refs.tree.$children[0].handleExpand();
    },
    //关键字搜索树目标重新加载
    async searchTreeDataLoad(key) {
      const response = await api.public.findCatalog({
        name: key,
        owner: 1,
        ownerId: this.$appUser.orgid,
        access: 1,
        hasChild: true,
        orderby: 'sort_asc',
        resourceTypeId: '1,2',
      });
      this.treeData = [];
      if (response) {
        response.data[0].loading = false;
        response.data[0].children = [];
        response.data[0].title = response.data[0].name;
        this.treeData.push(response.data[0]);
        this.$refs.tree.$children[0].handleExpand();
      }
    },
    // 获取根节点信息
    async loadRootNode() {
      this.treeData = [];
      const response = await api.public.findCatalog({
        owner: 1,
        ownerId: this.$appUser.orgid,
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
      var temp = {
        owner: 1,
        ownerId: this.$appUser.orgid,
        access: 1,
        hasChild: false,
        relatedType: 1,
        orderby: 'sort_asc',
        getmode: 'all',
        resourceTypeId: '1,2',
        parentId: item.childId,
      };
      if (this.searchTreeKey != '' && item.name == '组织目录') {
        temp.name = this.searchTreeKey;
        temp.hasChild = true;
      }
      const response = await api.public.findCatalog(temp);
      const children = [];
      response.data.forEach(node => {
        const nodeType = helps.nodeType(node);
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
      return helps.nodeType(dragOverNode.node) === 'directory' ? true : false;
    },
    dragEnd(event, node) {
      const { top, left, right, bottom } = document
        .getElementsByClassName('k-map-container')[0]
        .getBoundingClientRect();
      if (left <= event.clientX <= right && top <= event.clientY <= bottom) {
        if (helps.nodeType(node) === 'directory' || (node.children && node.children.length)) {
          const serviceObject = node.children.reduce((previous, current) => {
            if (current.isView) {
              const service = current.serviceList.find(service => service.servicestype === 12);
              const { search } = url.parse(service.servicesurl);
              const layers = search.layers ? search.layers : search.typeName;
              previous[layers] = current.serviceList;
            }
            return previous;
          }, {});
          this.$store.commit(SET_MAP_SERVICELIST, serviceObject);
        } else {
          const service = node.serviceList.find(service => service.servicestype === 12);
          const { search } = url.parse(service.servicesurl);
          this.layerName = search.layers ? search.layers : search.typeName;
          this.$store.commit(SET_MAP_SERVICELIST, {
            [this.layerName]: node.serviceList,
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
      :click-node-expand="clickNodeExpand"
      v-bind="$attrs"
      v-on="$listeners"
      @on-drag-end="dragEnd"
    />
  </div>
</template>
