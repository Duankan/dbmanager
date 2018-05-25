<script>
import { url } from '@ktw/ktools';
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
      switch (this.currentNode.typeId) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
          return this.currentNode.expand ? 'folder-open' : 'folder';
        case '20001': //点线面
        case '20010': //csv
        case '20011': //csv dataset
        case '20012': //csv zip
          switch (this.currentNode.shapeType.toUpperCase()) {
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
      }
    },
    // 节点类型
    nodeType() {
      if (this.currentNode.id === this.rootNode.id) {
        return 'rootDirectory';
      } else {
        switch (this.currentNode.typeId) {
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
      const search = url.parse(this.currentNode.serviceList[0].servicesurl).search;
      const layers = search.layers ? search.layers : search.typeName;
      this.$store.commit(SET_MAP_SERVICELIST, {
        [layers]: this.currentNode.serviceList,
      });
      // 查询
      // const queryUrl = this.currentNode.serviceList.filter(service => service.servicestype === 6)[0]
      //   .servicesurl;
      // this.$store.commit(SET_BUS_ATTRIBUTE, { title: this.nodeData.alias, url: queryUrl });
    },
    // 浏览元数据
    async viewMeta() {
      // const response = await api.db.findService({
      //   resourceId: nodeData.id,
      //   serivestatus: 0,
      //   metadataLayer: 1,
      // });
      // const search = url.parse(response.data[0].servicesurl).search;
      // const layers = search.layers ? search.layers : search.typeName;
      // this.$store.commit(SET_MAP_SERVICELIST, { [layername]: response.data });
    },
    // 删除服务资源
    // deleteNode() {
    //   this.$Modal.confirm({
    //     title: '删除服务资源',
    //     content: `确认要删除服务名称为 <b>${
    //       this.nodeData.name
    //     }</b> 的服务资源吗？</br></br><strong>删除操作将不可恢复！！！</strong>`,
    //     okText: '删除',
    //     onOk: async () => {
    //       await api.db.deleteResource([nodeData.id]);
    //       // this.$emit('on-delete', currentNode);
    //     },
    //   });
    // },
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
        v-if="isView"
        :size="16"
        icon-class="view"
        @click.native.stop="view"/>
      <SvgIcon
        v-if="isMetaView"
        :size="16"
        icon-class="view-meta"
        @click.native.stop="viewMeta"/>
        <!-- <SvgIcon
        v-if="!isDirectory"
        :size="16"
        icon-class="delete"
        @click.native.stop="deleteNode"/> -->
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
