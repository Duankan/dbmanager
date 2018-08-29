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
      rowHeight: 100,
    };
  },
  watch: {
    historyLayerList: {
      handler(newVal) {
        if (newVal.length == 2) {
          this.layoutList = [
            { i: 'a', x: 0, y: 0, w: 6, h: 12 },
            { i: 'b', x: 6, y: 0, w: 6, h: 12 },
          ];
        } else if (newVal.length == 3) {
          this.layoutList = [
            { i: 'a', x: 0, y: 0, w: 4, h: 12 },
            { i: 'b', x: 4, y: 0, w: 4, h: 12 },
            { i: 'c', x: 8, y: 0, w: 4, h: 12 },
          ];
        } else if (newVal.length == 4) {
          this.layoutList = [
            { i: 'a', x: 0, y: 0, w: 6, h: 6 },
            { i: 'b', x: 6, y: 0, w: 6, h: 6 },
            { i: 'a', x: 0, y: 4, w: 6, h: 6 },
            { i: 'b', x: 6, y: 0, w: 6, h: 6 },
          ];
        } else if (newVal.length == 5) {
          this.layoutList = [
            { i: 'a', x: 0, y: 0, w: 6, h: 6 },
            { i: 'b', x: 0, y: 6, w: 6, h: 6 },
            { i: 'c', x: 6, y: 0, w: 6, h: 4 },
            { i: 'd', x: 6, y: 4, w: 6, h: 4 },
            { i: 'e', x: 6, y: 8, w: 6, h: 4 },
          ];
        } else if (newVal.length >= 6) {
          this.layoutList = [
            { i: 'a', x: 0, y: 0, w: 4, h: 6 },
            { i: 'b', x: 4, y: 0, w: 4, h: 6 },
            { i: 'c', x: 8, y: 0, w: 4, h: 6 },
            { i: 'd', x: 0, y: 6, w: 4, h: 6 },
            { i: 'e', x: 4, y: 6, w: 4, h: 6 },
            { i: 'f', x: 8, y: 6, w: 4, h: 6 },
          ];
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.getAllMap();
    window.dispatchEvent(new Event('resize'));
    debugger;
    this.rowHeight =
      (document.getElementsByClassName('main-gridLayout-div')[0].offsetHeight - 180) / 12;
    window.onresize = temp => {
      this.rowHeight =
        (document.getElementsByClassName('main-gridLayout-div')[0].offsetHeight - 180) / 12;
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
