<script>
import { url } from '@ktw/ktools';
import * as helps from '@/utils/helps';
// const SET_BUS_CATALOG = 'SET_BUS_CATALOG';
// const SET_BUS_RESOURCE = 'SET_BUS_RESOURCE';
// const SET_BUS_SERVICE = 'SET_BUS_SERVICE';
const SET_MAP_SERVICELIST = 'SET_MAP_SERVICELIST';
const SET_BUS_ATTRIBUTE = 'SET_BUS_ATTRIBUTE';

export default {
  name: 'DataTreeNode',
  props: {
    rootNode: {
      type: Object,
      default: () => ({}),
    },
    currentNode: {
      type: Object,
      default: () => ({}),
    },
    nodeData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    // 节点图标
    iconClass() {
      return helps.iconClass(this.currentNode);
    },
    // 节点类型
    nodeType() {
      if (this.currentNode.id === this.rootNode.id) {
        return 'rootDirectory';
      } else {
        return helps.nodeType(this.currentNode);
      }
    },
    // 节点状态标示
    nodeClass() {
      return [
        'k-datatree-node-state',
        {
          'k-datatree-node-view': this.isView,
          'k-datatree-node-meta-view': this.isMetaView,
          'k-datatree-node-publish': this.isPublish,
        },
      ];
    },
    // 节点为目录类型
    isDirectory() {
      return this.nodeType === 'rootDirectory' || this.nodeType === 'directory';
    },
    // 是否可浏览,不可浏览显示发布服务按钮
    isView() {
      if (this.nodeType === 'vector' || this.nodeType === 'raster') {
        const serviceList = this.currentNode.serviceList;
        return (
          serviceList.length >= 2 || (serviceList.length === 1 && serviceList[0].servicestype === 5)
        );
      }
      return false;
    },
    // 是否可浏览元数据
    isMetaView() {
      return (
        (this.nodeType === 'vector' || this.nodeType === 'raster') && !!this.nodeData.hasMetadata
      );
    },
    //样式是否可编辑
    isStyleEdit() {
      if (!this.nodeData.shapeType) return false;
      let shapeType = this.nodeData.shapeType.toUpperCase();
      return (
        shapeType === 'POINT' ||
        shapeType === 'POLYLINE' ||
        shapeType === 'LINESTRING' ||
        shapeType === 'MULTILINESTRING' ||
        shapeType === 'POLYGON' ||
        shapeType === 'MULTIPOLYGON'
      );
    },
    // 是否可发布
    isPublish() {
      return (this.nodeType === 'vector' || this.nodeType === 'raster') && !this.isView;
    },
  },
  // created() {
  //   // 标记当前节点的状态
  //   this.nodeData.isDirectory = this.isDirectory;
  //   this.nodeData.isView = this.isView;
  //   this.nodeData.isMetaView = this.isMetaView;
  //   this.nodeData.isPublish = this.isPublish;
  // },
  // mounted() {
  //   // 向store提交对应节点信息
  //   this.$nextTick(() => {
  //     if (this.isDirectory) {
  //       this.$store.commit(SET_BUS_CATALOG, this.nodeData);
  //     } else {
  //       if (this.isView) {
  //         this.$store.commit(SET_BUS_SERVICE, this.nodeData.serviceList);
  //       }
  //       this.$store.commit(SET_BUS_RESOURCE, this.nodeData);
  //     }
  //   });
  // },
  methods: {
    view() {
      // 浏览
      const service = this.currentNode.serviceList.find(
        service => service.servicestype === 12 || service.servicestype === 5
      );

      const { search } = url.parse(service.servicesurl);
      const layers = search.layers ? search.layers : search.typeName;
      this.$store.commit(SET_MAP_SERVICELIST, {
        [layers]: this.currentNode.serviceList,
      });
    },
    setStyle() {},
  },
};
</script>

<template>
  <div
    class="k-datatree-node">
    <span :class="nodeClass"></span>
    <SvgIcon
      :icon-class="iconClass"
      :size="16"/>
    <Ellipsis
      :length="10"
      tooltip>{{ isDirectory ? nodeData.title : nodeData.alias }}</Ellipsis>
    <span class="k-datatree-node-button">
      <slot
        :rootNode="rootNode"
        :currentNode="currentNode"
        :nodeData="nodeData"></slot>
      <SvgIcon
        v-if="isStyleEdit"
        :size="16"
        title="样式设置"
        icon-class="settings"
        @click.native.stop="setStyle"/>
      <SvgIcon
        v-if="isView"
        :size="16"
        icon-class="view"
        title="查看地图"
        @click.native.stop="view"/>
    </span>
  </div>
</template>

<style lang="less">
.k-datatree-node {
  position: relative;

  .k-datatree-node-state {
    position: absolute;
    top: -1px;
    left: 12px;
    &.k-datatree-node-view,
    &.k-datatree-node-meta-view,
    &.k-datatree-node-publish {
      height: 6px;
      width: 6px;
      border-radius: 50%;
      // background-color: #19be6b;
    }
    &.k-datatree-node-meta-view {
      // top: 10px;
      background-color: #19be6b;
    }
    &.k-datatree-node-publish {
      background-color: #ff9900;
    }
  }

  .k-svgicon {
    & > svg {
      fill: #459aee !important;
    }
  }

  .k-ellipsis {
    vertical-align: text-bottom;
  }

  .k-datatree-node-button {
    float: right;
    opacity: 0;
    transition: opacity 0.3s;
    > * {
      vertical-align: middle;
    }
  }

  &:hover {
    .k-datatree-node-button {
      opacity: 1;
    }
  }
}
</style>
