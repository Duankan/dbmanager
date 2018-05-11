<script>
import api from 'api';

export default {
  name: 'NavTree',
  methods: {
    select(node) {
      this.$emit('on-current-select', node);
    },
    async favor(nodeData) {
      await api.db.addCommonCatalog({
        favoriteId: nodeData.id, //目录id
        name: nodeData.name, //目录名称（可自定）
        type: '1001', // 1001:目录 1002:服务 1003:数据
        userId: this.$user.id, //用户id
      });
      this.$parent.$refs['common-tree'].update();
    },
  },
};
</script>

<template>
  <DataTree
    :click-node-expand="false"
    directory
    accordion
    @on-current-select="select">
    <Icon
      slot-scope="{ nodeData }"
      :size="16"
      color="red"
      type="android-favorite"
      @click.native.stop="favor(nodeData)"></Icon>
  </DataTree>
</template>

<style lang="less" scoped>
</style>
