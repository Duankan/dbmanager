<script>
import MoveTo from './modal/MoveTo';
import QuickView from './modal/QuickView';
import ViewInformation from './modal/ViewInformation';
import DeleteResource from './modal/DeleteResource';
import { isFile, isGisResource, canView } from '@/utils';

export default {
  name: 'OperationDynamic',
  components: {
    MoveTo,
    QuickView,
    ViewInformation,
    DeleteResource,
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
    showInformation() {
      return this.selectNodes[0] && isGisResource(this.selectNodes[0]);
    },
    showDownload() {
      return this.selectNodes[0] && isFile(this.selectNodes[0]);
    },
    hasSelectNode() {
      return this.selectNodes.length;
    },
    onlyGisResource() {
      return this.selectNodes.every(node => isGisResource(node));
    },
  },
  methods: {},
};
</script>

<template>
  <div class="operation-dynamic">
    <Button
      v-if="showPublish"
      :disabled="!onlyGisResource"
      type="primary">
      <Icon
        type="ios-paperplane"
        size="14"
        style="margin-right: 8px"></Icon>
      发布
    </Button>
    <ButtonGroup>
      <Button
        v-if="showMetaData"
        :disabled="!single"
        type="ghost">元数据补录</Button>
      <Button
        v-if="showAppendData"
        :disabled="!single"
        type="ghost">数据追加</Button>
      <Button
        v-if="showRename"
        :disabled="!single"
        type="ghost">重命名</Button>
      <Button
        v-if="hasSelectNode"
        type="ghost">移动到</Button>
      <Button
        v-if="showDownload"
        :disabled="!single"
        type="ghost">下载</Button>
      <Button
        v-if="showInformation"
        :disabled="!single"
        type="ghost">属性</Button>
      <Button
        v-if="hasSelectNode"
        type="ghost">删除</Button>
    </ButtonGroup>
    <MoveTo :value="true"></MoveTo>
    <QuickView></QuickView>
    <ViewInformation></ViewInformation>
    <DeleteResource></DeleteResource>
  </div>
</template>

<style lang="less" scoped>
.operation-dynamic {
  .k-btn-group {
    margin-left: 8px;
  }
}
</style>
