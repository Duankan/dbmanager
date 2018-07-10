
<script>
import Currency from './PolygonTypeS/Currency';
import Side from './PolygonTypeS/Side';
import Fill from './PolygonTypeS/Fill';
import Tagging from './PolygonTypeS/Tagging';
export default {
  name: 'PolygonType',
  components: {
    Currency,
    Side,
    Fill,
    Tagging,
  },
  data() {
    return {
      tool: '通用',
    };
  },
};
</script>

<template>
  <div class="outDiv">
    <RadioGroup v-model="tool">
      <Radio label="通用"></Radio>
      <Radio label="边"></Radio>
      <Radio label="面填充"></Radio>
      <Radio label="标注"></Radio>
      <Radio label="线符号"></Radio>
      <Radio label="过滤"></Radio>
    </radiogroup>
    <p class="p">
      <span>
        样式名称：
      </span>
      <Input
        placeholder="Enter something..."
        style="width: 300px"></Input>
    </p>
    <Currency v-if="tool=='通用'"></Currency>
    <Side v-if="tool=='边'"></Side>
    <Fill v-if="tool=='面填充'"></Fill>
    <Tagging v-if="tool=='标注'"></Tagging>
  </div>

</template>

<style lang="less" scoped>
</style>
