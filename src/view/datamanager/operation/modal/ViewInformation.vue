<script>
export default {
  name: 'ViewInformation',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    node: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<template>
  <Modal
    :value="value"
    width="360">
  </Modal>
</template>

<style lang="less" scoped>
</style>
