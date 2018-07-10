
<script>
export default {
  name: 'SelectType',
  data() {
    return {};
  },
};
</script>

<template>
  <div>
    <p>
      <span>样式别名:</span>
      <Input
        style="width: 130px"></Input>
      <span>样式名称:</span>
      <Input
        style="width: 130px"></Input>
    </p>
    <p>
      <span>样式分类:</span>
      <Input
        style="width: 130px"></Input>
      <Button
        style=" margin: 0 20px 0 22px ;"
        type="primary"
        icon="ios-search">查询</Button>
      <Button
        style=" margin: 0 20px 0 0 ;"
        type="error"
        icon="close">重置</Button>
    </p>
  </div>
</template>

<style>
.a {
  margin: 0 5px 0 0;
}
</style>
