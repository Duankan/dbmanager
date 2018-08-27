<script>
export default {
  name: 'MoreMap',
  data() {
    return {
      mapList: [],
      layoutList: [
        { i: 'a', x: 0, y: 0, w: 1, h: 2 },
        { i: 'b', x: 1, y: 0, w: 3, h: 2 },
        { i: 'c', x: 4, y: 0, w: 1, h: 2 },
      ],
    };
  },
};
</script>
<style lang="less" scoped>
/deep/.layout-item {
  background: #ff0000;
}
</style>
<template>
  <GridLayout
    :layout="layoutList"
    :cols="12"
    :row-height="30"
    :is-draggable="true"
    :is-resizable="true"
    :margin="[8, 8]"
    :auto-size="true">
    <div
      v-for="item in layoutList"
      :key="item.i"
      class="layout-item">
      <span>{{ item.i }}</span>
    </div>
  </GridLayout>
</template>
