<script>
export default {
  name: 'StyleEdit',
  components: {},
  props: {
    layerNode: {
      type: Object,
      default: null,
    },
  },
  methods: {
    back() {
      this.$emit('back-event');
    },
  },
};
</script>

<template>
  <div class="main">
    <div class="tilte-div">
      <Button 
        type="dashed" 
        icon="arrow-left-a"
        @click="back">返回</Button>
      <span class="title">编辑图层:</span>
      <span class="layername">{{ layerNode.resource.alias }}</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.main {
  margin: 8px;
  .tilte-div {
  }

  .title {
    font-weight: bold;
    margin-left: 8px;
    font-size: 14px;
  }

  .layername {
    color: #007acc;
    font-size: 14px;
    font-weight: bold;
    width: 130px;
    text-overflow: ellipsis; //让超出的用...实现
    white-space: nowrap; //禁止换行
    overflow: hidden; //超出的隐藏
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
