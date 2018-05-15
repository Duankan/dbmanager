<script>
export default {
  name: 'MoveTo',
  props: {
    value: {
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
    check(node) {},
  },
};
</script>

<template>
  <Modal
    :value="value"
    width="400"
    title="移动到"
    @on-visible-change="visibleChange">
    <DataTree
      directory
      accordion
      show-checkbox
      @on-current-check="check">
    </DataTree>
  </Modal>
</template>

<style lang="less" scoped>
</style>
