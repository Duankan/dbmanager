<script>
export default {
  name: 'DataDetails',
  data() {
    return {};
  },
};
</script>

<template>
  <div class="main">
    <div class="data-content">
      <Icon type="arrow-left-a"></Icon>
      <span class="data-content-title"><b>元数据详情</b></span>
    </div>
</div></template>

<style lang="less" scoped>
.main {
  width: 92%;
  margin: 0 auto;
}
.data-content {
  height: 60px;
  line-height: 60px;
}

.data-content-title {
  font-size: 14px;
  padding-left: 8px;
}
</style>
