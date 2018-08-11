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
    <Tabs value="name1">
      <TabPane
        label="标签一"
        name="name1">标签一的内容</TabPane>
      <TabPane
        label="标签二"
        name="name2">标签二的内容</TabPane>
      <TabPane
        label="标签三"
        name="name3">标签三的内容</TabPane>
      <TabPane
        label="标签四"
        name="name4">标签四的内容</TabPane>
    </Tabs>
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
