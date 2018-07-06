
<script>
export default {
  name: 'PolygonType',
  data() {
    return {
      tool: '通用',
    };
  },
};
</script>

<template>
  <RadioGroup v-model="tool">
    <Radio >通用</Radio>
    <Radio >边</Radio>
    <Radio>面填充</Radio>
    <Radio >标注</Radio>
    <Radio>线符号</Radio>
    <Radio >过滤</Radio>
  </radiogroup>

</template>

<style>
</style>
