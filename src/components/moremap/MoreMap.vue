<script>
import SynchronizeMap from './synchronize-map.js';
import SimpleMap from './SimpleMap';
export default {
  name: 'MoreMap',
  components: {
    SimpleMap,
  },
  props: {
    historyLayerList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      mapList: [],
      layoutList: [
        { i: 'a', x: 0, y: 0, w: 6, h: 4 },
        { i: 'b', x: 6, y: 0, w: 6, h: 4 },
        { i: 'c', x: 0, y: 4, w: 12, h: 4 },
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
      (document.getElementsByClassName('main-gridLayout-div')[0].offsetHeight - 150) / 12;
    window.onresize = temp => {
      this.rowHeight =
        (document.getElementsByClassName('main-gridLayout-div')[0].offsetHeight - 150) / 12;
    };
  },
  methods: {
    getAllMap() {
      this.mapList = [];
      this.$refs.gridLayout.$children.forEach(item => {
        var map = item.$children[0].$children[0].$children[0].map;
        this.mapList.push(map);
      });
      var synchronizeMap = new SynchronizeMap();
      synchronizeMap.initSyncMaps(...this.mapList);
      synchronizeMap.startSyncMap();
    },
    resizeEvent(event) {
      window.dispatchEvent(new Event('resize'));
    },
  },
};
</script>
<style lang="less" scoped>
.main-gridLayout-div {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
/deep/.layout-item {
  // background: #ff0000;
}

.item-head,
.item-none {
  position: absolute;
  width: 100%;
  height: 20px;
  font-size: 12px;
  z-index: 899;
  background-color: rgba(0, 0, 0, 0);

  > span {
    padding-left: 10px;
    display: inline-block;
    line-height: 20px;
    font-size: 14px;
    font-weight: 700;
    color: rgba(10, 18, 32, 0.87);
  }
}
.item-head:hover {
  cursor: move;
}
</style>
<template>
  <div class="main-gridLayout-div">
    <GridLayout
      ref="gridLayout"
      :layout="layoutList"
      :on-resize="resizeEvent"
      :cols="12"
      :row-height="rowHeight"
      :is-draggable="true"
      :is-resizable="true"
      :margin="[8, 8]"
      :auto-size="true"
      draggable-handle=".item-head">
      <div 
        v-for="(item,index) in layoutList"
        :key="item.i"
        class="layout-item">
        <div
          class="item-head">
          <span></span>
        </div>
        <SimpleMap 
          :layer-index="index" 
          :history-layer-list="historyLayerList"/>
      </div>
    </GridLayout>
  </div>
</template>
