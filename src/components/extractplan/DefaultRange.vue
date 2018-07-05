<script>
/*
 * 默认提取范围
 */
export default {
  name: 'DefaultRange',
  props: {
    //提取模式：0：矢量提取，1：影像提取
    extractMode: {
      type: Number,
      default: 0,
    },
    //绑定数据
    model: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  methods: {
    //校验提取范围
    validateRange() {
      return true;
    },
    //获取提取范围
    getExtractRange() {
      return {
        splacetype: -1,
        splacelist: [],
        splaceremark: '根据全图范围提取',
        extractlevel: 'City',
        extract: 0,
        coordinate: null,
        projid: null,
      };
    },
  },
};
</script>
<template>
  <div></div>
</template>
<style lang="less" scoped>
</style>
