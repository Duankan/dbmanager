
<script>
export default {
  name: 'LineSymbol',
  data() {
    return {
      showSide: true,
      colors: 'black',
      selectType: '颜色',
      labelName: '',
    };
  },
  methods: {
    change(status) {
      this.$Message.info('开关状态：' + status);
    },
  },
};
</script>

<template>
  <div>
    <p class="p">
      <span>显示/不显示 线符号</span>
      <Switch
        v-model="showSide"
        @on-change="change"></Switch>
    </p>

    <RadioGroup v-model="labelName">
      <Radio label="常见的标记"></Radio>
      <Radio label="字体"></Radio>
    </RadioGroup>
    <p class="p">
      <Select
        v-if="labelName=='常见的标记'"
        style="width:200px">
      </Select>
    </p>
    <p class="p">
      <Select
        v-if="labelName=='字体'"
        style="width:165px">
      </Select>
    </p>
    <p class="p">
      <InputNumber
        :max="20"
        :min="0"
        style="width: 150px"
      ></InputNumber>
      <InputNumber
        :max="20"
        :min="0"
        style="width: 150px"
      ></InputNumber>
      <ColorPicker
        v-model="colors"
        size="large"
        class="colorsStyle" />
    </p>


  </div>
</template>

<style lang="less" scoped>
.p {
  margin: 12px 0 0 0;
}
</style>
