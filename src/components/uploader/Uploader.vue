<script>
export default {
  name: 'Uploader',
  data() {
    return {
      model: false,
    };
  },
};
</script>

<template>
  <Modal
    v-model="model"
    title="Title"
  >
    <p>Content of dialog</p>
    <p>Content of dialog</p>
    <p>Content of dialog</p>
  </Modal>
</template>

<style lang="less" scoped>
</style>
