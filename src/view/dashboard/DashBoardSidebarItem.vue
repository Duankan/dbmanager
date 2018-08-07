<script>
export default {
  name: 'DashBoardSidebarItem',
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    style() {
      return this.$route.name === this.value.name ? { backgroundColor: '#459aee' } : {};
    },
  },
};
</script>

<template>
  <div
    :style="style"
    class="sider-item"
  >
    <Tooltip
      :content="value.title"
      placement="right">
      <SvgIcon
        :icon-class="value.icon"
        size="24"></SvgIcon>
    </Tooltip>
  </div>
</template>

<style lang="less" scoped>
.sider-item {
  text-align: center;
  padding: 10px;
  cursor: pointer;
}
</style>
