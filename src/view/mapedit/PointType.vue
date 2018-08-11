//点样式的图层
<script>
export default {
  name: 'PointType',
  data() {
    return {
      single: false,
    };
  },
};
</script>

<template>
  <Radio v-model="single">点</Radio>
</template>

<style>
</style>
