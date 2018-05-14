<script>
export default {
  name: 'OperationInformation',
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
    return {
      loading: false,
    };
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
