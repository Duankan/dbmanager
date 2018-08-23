<script>
import LayerEditor from './layer-editor';
/*
 * 编辑工具栏
 */
export default {
  name: 'LayerEditBar',
  props: {
    //编辑的图层ID
    layer: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      //图层编辑器对象
      layerEditor: null,
    };
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    //初始化编辑器
    initEditor() {
      this.layerEditor = new LayerEditor(this.layer, this.$store);
    },
    //新增要素
    addFeature() {
      this.layerEditor.addFeature();
    },
    //编辑要素
    editFeature() {
      this.layerEditor.editFeature();
    },
    //批量入库
    batchCommit() {
      this.layerEditor.addTransaction();
    },
    //重置
    reset() {
      this.layerEditor.reset();
    },
  },
};
</script>
<template>
  <div class="layer-editbar-wrapper">
    <div>
      <span>编辑图层:</span>
      <Tag :title="layer">{{ layer }}</Tag>
    </div>
    <div class="layer-buttons">
      <Button
        size="small"
        type="primary"
        @click.stop="addFeature">
        <Icon type="plus-round"></Icon>
        新增</Button>
      <Button
        size="small"
        type="warning"
        @click.stop="editFeature">
        <Icon type="edit"></Icon>
        编辑</Button>
      <Button
        size="small"
        type="error"
        @click.stop="reset">
        <Icon type="close-round"></Icon>
        清除</Button>
      <Button
        size="small"
        type="success"
        @click.stop="batchCommit">
        <Icon
          type="upload"></Icon>
        批量入库</Button>
    </div>
  </div>
</template>

<style lang="less">
.layer-editbar-wrapper {
  padding: 5px 10px 10px 10px;
  .k-tag {
    margin-left: 5px;
    margin-top: 0;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-style: dashed;
  }
  .layer-buttons {
    margin-top: 10px;
  }
}
</style>
