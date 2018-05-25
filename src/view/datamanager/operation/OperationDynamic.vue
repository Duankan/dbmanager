<script>
import config from 'config';
import MoveTo from './modal/MoveTo';
import QuickView from './modal/QuickView';
import ViewInformation from './modal/ViewInformation';
import DeleteResource from './modal/DeleteResource';
import * as types from '@/store/types';
import { isDirectory, isFile, isVector, isGisResource, canView } from '@/utils';

export default {
  name: 'OperationDynamic',
  components: {
    MoveTo,
    QuickView,
    ViewInformation,
    DeleteResource,
  },
  data() {
    return {
      publishModal: false,
      publishNode: {},
      batchPublishModal: false,
      batchPublishNodes: [],
      quickViewModal: false,
      quickViewNode: {},
      moveToModal: false,
      moveNodes: [],
      informationModal: false,
      informationNode: {},
      deleteModal: false,
      deleteNodes: [],
    };
  },
  computed: {
    selectNodes() {
      return this.$store.state.app.selectNodes;
    },
    single() {
      return this.selectNodes.length === 1;
    },
    showPublish() {
      const publishNode = this.selectNodes.filter(node => {
        return isGisResource(node) && !node.pubState;
      });
      return publishNode && publishNode.length;
    },
    showQuickView() {
      return (
        this.selectNodes[0] &&
        isGisResource(this.selectNodes[0]) &&
        canView(this.selectNodes[0].serviceList)
      );
    },
    showMetaData() {
      return (
        this.selectNodes[0] &&
        isGisResource(this.selectNodes[0]) &&
        !this.selectNodes[0].hasMetadata
      );
    },
    showAppendData() {
      return this.selectNodes[0] && isGisResource(this.selectNodes[0]);
    },
    showRename() {
      return this.selectNodes[0] && !isFile(this.selectNodes[0]);
    },
    showMoveTo() {
      return this.selectNodes[0] && isDirectory(this.selectNodes[0]);
    },
    showInformation() {
      return this.selectNodes[0] && isVector(this.selectNodes[0]);
    },
    showDownload() {
      return this.selectNodes[0] && isFile(this.selectNodes[0]);
    },
    hasSelectNode() {
      return !!this.selectNodes.length;
    },
    onlyDirectory() {
      return this.selectNodes.every(node => isDirectory(node));
    },
    onlyGisResource() {
      return this.selectNodes.every(node => isGisResource(node));
    },
    forbidPublish() {
      return this.selectNodes.some(node => !isGisResource(node) || node.pubState);
    },
    forbidDelete() {
      const directoryNode = this.selectNodes.filter(node => isDirectory(node));
      return directoryNode.some(node => node.isChild === 'open');
    },
  },
  events: {
    'on-quick-view': function(node) {
      this.quickViewModal = true;
      this.quickViewNode = node;
    },
    'on-information': function(node) {
      this.informationModal = true;
      this.informationNode = node;
    },
    'on-delete': function(node) {
      this.deleteModal = true;
      this.deleteNodes = [node];
    },
  },
  methods: {
    favor() {
      this.selectNodes.forEach(async node => {
        await api.db.addCommonCatalog({
          favoriteId: node.id, //目录id
          name: node.name, //目录名称（可自定）
          type: '1001', // 1001:目录 1002:服务 1003:数据
          userId: this.$user.id, //用户id
        });
      });
      this.$events.emit('on-common-tree-update');
    },
    // 业务文件下载
    download() {
      const link = document.createElement('a');
      link.setAttribute(
        'href',
        `${config.project.YunServicesUrl}/clouddisk/gisserver/download/${
          this.selectNodes[0].fResourceId
        }?license=a3UjjlaLC9He&filename=${this.selectNodes[0].alias}`
      );
      // link.setAttribute('download', this.selectNodes[0].name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    rename() {
      this.$store.commit(
        types.UPDATE_APP_NODES,
        Object.assign(this.selectNodes[0], { _rename: true })
      );
    },
    quickView() {
      this.quickViewModal = true;
      this.quickViewNode = this.selectNodes[0];
    },
    publish() {
      if (this.single) {
        this.publishModal = true;
        this.publishNode = this.selectNodes[0];
      } else {
        this.batchPublishModal = true;
        this.batchPublishNodes = this.selectNodes;
      }
    },
    metaData() {
      this.$events.emit('on-upload', { title: '元数据补录', type: 'metaData' });
    },
    appendData() {
      this.$events.emit('on-upload', { title: '数据追加', node: this.selectNodes[0] });
    },
    moveTo() {
      this.moveToModal = true;
      this.moveNodes = this.selectNodes;
    },
    information() {
      this.informationModal = true;
      this.informationNode = this.selectNodes[0];
    },
    deleteNode() {
      this.deleteModal = true;
      this.deleteNodes = this.selectNodes;
    },
  },
};
</script>

<template>
  <div class="operation-dynamic">
    <Button
      v-if="showPublish"
      :disabled="forbidPublish"
      type="primary"
      @click="publish">
      <Icon
        type="ios-paperplane"
        size="14"
        style="margin-right: 8px"></Icon>
      发布
    </Button>
    <Button
      v-if="hasSelectNode && onlyDirectory"
      type="ghost"
      @click="favor">
      <Icon
        type="bookmark"
        size="14"
        color="red"
        style="margin-right: 8px"></Icon>
      收藏
    </Button>
    <ButtonGroup>
      <Button
        v-if="showQuickView"
        :disabled="!single"
        type="ghost"
        @click="quickView">快速浏览</Button>
      <Button
        v-if="showMetaData"
        :disabled="!single"
        type="ghost"
        @click="metaData">元数据补录</Button>
      <Button
        v-if="showAppendData"
        :disabled="!single"
        type="ghost"
        @click="appendData">数据追加</Button>
      <Button
        v-if="showRename"
        :disabled="!single"
        type="ghost"
        @click="rename">重命名</Button>
      <Button
        v-if="showMoveTo"
        :disabled="!onlyDirectory"
        type="ghost"
        @click="moveTo">移动到</Button>
      <Button
        v-if="showDownload"
        :disabled="!single"
        type="ghost"
        @click="download">下载</Button>
      <Button
        v-if="showInformation"
        :disabled="!single"
        type="ghost"
        @click="information">属性</Button>
      <Button
        v-if="hasSelectNode"
        :disabled="forbidDelete"
        type="ghost"
        @click="deleteNode">删除</Button>
    </ButtonGroup>
    <Publish
      v-model="publishModal"
      :node="publishNode"></Publish>
    <BatchPublish
      v-model="batchPublishModal"
      :nodes="batchPublishNodes"></BatchPublish>
    <QuickView
      v-model="quickViewModal"
      :node="quickViewNode"></QuickView>
    <ViewInformation
      v-model="informationModal"
      :node="informationNode"></ViewInformation>
    <MoveTo
      v-model="moveToModal"
      :nodes="moveNodes"></MoveTo>
    <DeleteResource
      v-model="deleteModal"
      :nodes="deleteNodes"></DeleteResource>
  </div>
</template>

<style lang="less" scoped>
.operation-dynamic {
  .k-btn-group {
    margin-left: 8px;
  }
}
</style>
