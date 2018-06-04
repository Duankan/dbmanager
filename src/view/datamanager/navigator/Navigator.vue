<script>
import * as types from '@/store/types';
import CommonTree from './CommonTree';
import NavTree from './NavTree';
import Classify from './classify/Classify';

export default {
  name: 'Navigator',
  components: {
    CommonTree,
    NavTree,
    Classify,
  },
  methods: {
    select(node) {
      this.$store.dispatch(types.APP_NODES_FETCH, node);
    },
  },
};
</script>

<template>
  <div class="navigator">
    <div>
      <h4>收藏夹</h4>
      <CommonTree
        ref="common-tree"
        @on-current-select="select"></CommonTree>
    </div>
    <div>
      <h4>我的数据</h4>
      <NavTree @on-current-select="select">></NavTree>
    </div>
    <div>
      <h4>分类</h4>
      <Classify></Classify>
    </div>
  </div>
</template>

<style lang="less" scoped>
.navigator {
  width: 260px;
  height: 100%;
  padding: 10px 15px;
  border-right: 1px solid #eee;
  overflow-y: auto;

  h4 {
    margin: 16px 0 8px 0;
    text-indent: 8px;
    border-left: 2px solid #318cf0;
    &:first-child {
      margin-top: 8px;
    }
  }
}
</style>
