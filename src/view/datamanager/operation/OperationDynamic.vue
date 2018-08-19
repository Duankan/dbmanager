<script>
import config from 'config';
import MoveTo from './modal/MoveTo';
import QuickView from './modal/QuickView';
import ViewInformation from './modal/ViewInformation';
import DeleteResource from './modal/DeleteResource';
import UploadMataData from './modal/UploadMataData';
import AppendData from './modal/AppendData';
import AddPackage from './modal/AddPackage';
import AddHostory from './modal/AddHostory';
import BatchPublish from '@/components/batchpublish/BatchPublish';
import * as types from '@/store/types';
import { isDirectory, isFile, isVector, isGisResource, canView, canAppend } from '@/utils';

export default {
  name: 'OperationDynamic',
  components: {
    MoveTo,
    QuickView,
    ViewInformation,
    DeleteResource,
    UploadMataData,
    AppendData,
    AddPackage,
    AddHostory,
    BatchPublish,
  },
  data() {
    return {
      publishModal: false,
      publishNode: {},
      batchPublishModal: false,
      quickViewModal: false,
      isMeta: false,
      moveToModal: false,
      moveNodes: [],
      informationModal: false,
      informationNode: {},
      deleteModal: false,
      deleteNodes: [],
      updateMataModal: false,
      appendDataModal: false,
      addPackageModal: false,
      addHistoryModal: false,
    };
  },
  computed: {
    current() {
      return this.$store.state.app.currentDirectory;
    },
    selectNodes() {
      return this.$store.state.app.selectNodes;
    },
    single() {
      return this.selectNodes.length === 1;
    },
    isFirst() {
      return this.selectNodes.length === 1 && this.selectNodes[0]._index !== 0;
    },
    isDirectoryEnd() {
      if (this.selectNodes.length === 1) {
        if (isDirectory(this.selectNodes[0])) {
          if (this.selectNodes[0]._index < this.$store.state.app.nodes.length) {
            return isDirectory(this.$store.state.app.nodes[this.selectNodes[0]._index + 1]);
          } else {
            return true;
          }
        }
      }
      return false;
    },
    showPublish() {
      return (
        this.selectNodes[0] && isGisResource(this.selectNodes[0]) && !this.selectNodes[0].pubState
      );
    },
    showBatchPublish() {
      return this.selectNodes[0] && isDirectory(this.selectNodes[0]);
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
    showViewMeta() {
      return (
        this.selectNodes[0] && isGisResource(this.selectNodes[0]) && this.selectNodes[0].hasMetadata
      );
    },
    showAppendData() {
      return this.selectNodes[0] && canAppend(this.selectNodes[0]) && this.selectNodes[0].pubState;
    },
    showAddPackage() {
      return this.selectNodes[0] && canAppend(this.selectNodes[0]) && this.selectNodes[0].pubState;
    },
    showAddHistory() {
      return this.selectNodes[0] && canAppend(this.selectNodes[0]) && this.selectNodes[0].pubState;
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
    forbidDelete() {
      const directoryNode = this.selectNodes.filter(node => isDirectory(node));
      return directoryNode.some(node => node.isChild === 'open');
    },
  },
  events: {
    'on-quick-view': 'invokeQuickView',
    'on-quick-publish': 'invokeQuickPublish',
    'on-information': 'invokeInfomation',
    'on-delete': 'invokeDelete',
  },
  methods: {
    invokeQuickView(node) {
      this.isMeta = false;
      this.quickViewModal = true;
    },
    invokeQuickPublish(node) {
      this.publishModal = true;
      this.publishNode = node;
    },
    invokeInfomation(node) {
      this.informationModal = true;
      this.informationNode = node;
    },
    invokeDelete(node) {
      this.deleteModal = true;
      this.deleteNodes = [node];
    },
    favor() {
      this.selectNodes.forEach(async node => {
        await api.db.addCommonCatalog({
          favoriteId: node.id, //目录id
          name: node.name, //目录名称（可自定）
          type: '1001', // 1001:目录 1002:服务 1003:数据
          userId: this.$appUser.id, //用户id
        });
      });
      this.$events.emit('on-common-tree-update');
    },
    // 业务文件下载
    download() {
      let node = this.selectNodes[0];
      let fileName = `${node.alias}.${node.typeName}`;
      const link = document.createElement('a');
      link.setAttribute(
        'href',
        `${config.project.YunServicesUrl}/clouddisk/gisserver/download/${
          this.selectNodes[0].fResourceId
        }?license=a3UjjlaLC9He&filename=${fileName}`
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
      this.isMeta = false;
      this.quickViewModal = true;
    },
    publish() {
      this.publishModal = true;
      this.publishNode = this.selectNodes[0];
    },
    batchPublish() {
      this.batchPublishModal = true;
    },
    metaData() {
      this.updateMataModal = true;
    },
    viewMeta() {
      this.isMeta = true;
      this.quickViewModal = true;
    },
    async deleteMeta() {
      let node = this.selectNodes[0];
      await api.db.deleteMetaData({ id: node.id });
      await this.$store.dispatch(types.APP_NODES_FETCH, this.current);
      this.$Message.success('删除元数据成功！');
    },
    appendData() {
      this.appendDataModal = true;
    },
    addPackage() {
      this.addPackageModal = true;
    },
    moveTo() {
      this.moveToModal = true;
      this.moveNodes = this.selectNodes;
    },
    async sortCatalog(type) {
      let node = this.selectNodes[0];
      let fd = new FormData();
      fd.append('id', node.id);
      fd.append('type', type);
      await api.db.sortCatalog({}, fd, {
        headers: { 'User-Operation-Info': 'a3UjjlaLC9He' },
      });
      //await this.$store.dispatch(types.APP_NODES_FETCH, this.current);
      this.$events.emit('on-refresh-nav-tree');
      this.$store.dispatch(types.APP_NODES_FETCH, this.current);
      this.$store.commit(types.REMOVE_APP_SELECT_NODES);
    },
    information() {
      this.informationModal = true;
      this.informationNode = this.selectNodes[0];
    },
    deleteNode() {
      this.deleteModal = true;
      this.deleteNodes = this.selectNodes;
    },
    addHistoryLayer() {
      this.addHistoryModal = true;
    },
  },
};
</script>

<template>
  <div class="operation-dynamic">
    <Button
      v-if="showPublish"
      :disabled="!single"
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
    <ButtonGroup >
      <Button
        v-if="showQuickView"
        :disabled="!single"
        type="ghost"
        @click="quickView">浏览地图</Button>
      <Button
        v-if="showMetaData"
        :disabled="!single"
        type="ghost"
        @click="metaData">元数据补录</Button>
      <Button
        v-if="showViewMeta"
        :disabled="!single"
        type="ghost"
        @click="viewMeta">浏览元数据</Button>
      <Button
        v-if="showViewMeta"
        :disabled="!single"
        type="ghost"
        @click="deleteMeta">删除元数据</Button>
      <Button
        v-if="showAppendData"
        :disabled="!single"
        type="ghost"
        @click="appendData">数据追加</Button>
      <Button
        v-if="showAddPackage"
        :disabled="!single"
        type="ghost"
        @click="addPackage">增量包更新</Button>
      <Button
        v-if="showAddHistory"
        :disabled="!single"
        type="ghost"
        @click="addHistoryLayer">历史图层生成</Button>
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
        v-if="showMoveTo"
        :disabled="!isFirst"
        type="ghost"
        @click="sortCatalog(2)">置顶</Button>
      <Button
        v-if="showMoveTo"
        :disabled="!isFirst"
        type="ghost"
        @click="sortCatalog(0)">上移</Button>
      <Button
        v-if="showMoveTo"
        :disabled="!isDirectoryEnd"
        type="ghost"
        @click="sortCatalog(1)">下移</Button>
      <Button
        v-if="showMoveTo"
        :disabled="!isDirectoryEnd"
        type="ghost"
        @click="sortCatalog(3)">置底</Button>
      <Button
        v-if="showBatchPublish"
        :disabled="!single"
        type="ghost"
        @click="batchPublish">批量发布</Button>
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
    <BatchPublish v-model="batchPublishModal"></BatchPublish>
    <QuickView
      v-model="quickViewModal"
      :is-meta="isMeta"></QuickView>
    <ViewInformation
      v-model="informationModal"
      :node="informationNode"></ViewInformation>
    <MoveTo
      v-model="moveToModal"
      :nodes="moveNodes"></MoveTo>
    <DeleteResource
      v-model="deleteModal"
      :nodes="deleteNodes"></DeleteResource>
    <UploadMataData v-model="updateMataModal">
    </UploadMataData>
    <AppendData v-model="appendDataModal">
    </AppendData>
    <AddPackage v-model="addPackageModal">
    </AddPackage>
    <AddHostory v-model="addHistoryModal">
    </AddHostory>
  </div>
</template>

<style lang="less" scoped>
.operation-dynamic {
  .k-btn-group {
    margin-left: 8px;
  }
}
</style>
