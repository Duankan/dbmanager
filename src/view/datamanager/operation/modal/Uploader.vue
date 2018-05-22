<script>
export default {
  name: 'Upload',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    dictionary: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    visibleChange(visible) {
      this.$emit('input', visible);
    },
    upload() {},
  },
};
</script>

<template>
  <Modal
    :value="value"
    :title="dictionary ? '文件夹上传' : '文件上传'"
    :mask-closable="false"
    width="600"
    @on-visible-change="visibleChange">
    <Uploader
      v-if="value"
      :dictionary="dictionary"
      multiple
      show-upload-list
      type="drag"
      action="//jsonplaceholder.typicode.com/posts/">
      <div style="padding: 60px 0">
        <Icon
          type="ios-cloud-upload"
          size="52"
          color="#358CF0"></Icon>
        <p>点击 或者 拖拽 文件/文件夹 以上传</p>
      </div>
    </Uploader>
    <div slot="footer">
      <Button
        type="success"
        size="large"
        long
        @click="upload">上传</Button>
    </div>
  </Modal>
</template>

<style lang="less" scoped>
</style>
