<script>
/**
 * 要素历史查看
 */
export default {
  name: 'FeatureHistory',
  props: {
    //要素信息
    feature: {
      type: Object,
      default: null,
    },
    //图层信息
    layerData: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    this.getHistory();
  },
  methods: {
    //获取要素历史信息
    getHistory() {
      let sqlFilter = `gid='${this.feature.gid}'`;
      this.$store
        .dispatch('MAP_WFS_QUERY', {
          url: `${this.layerData.baseUrl}?typeName=${this.layerData.layer.name}`,
          pageIndex: this.pageIndex,
          pageSize: 10,
          options: { cql_filter: sqlFilter },
        })
        .then(response => {
          debugger;
        });
    },
    //返回历史数据列表
    goBack() {
      this.$emit('go-back');
    },
  },
};
</script>
<template>
  <div class="feature-history-wrapper">
    <div class="history-title">
      <Icon
        :size="18"
        type="arrow-left-a"
        title="返回数据列表"
        @click.native="goBack"></Icon>
      <span>要素历史查看</span>
    </div>
    <div class="history-content">
    </div>
  </div>
</template>

<style lang="less" scoped>
.feature-history-wrapper {
}
</style>
