
<script>
export default {
  name: 'Tagging',
  data() {
    return {
      showSide: true,
      colors: 'black',
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
      <span>显示/不显示 标注</span>
      <Switch
        v-model="showSide"
        @on-change="change"></Switch>
    </p>
    <p class="p">
      <span>标注:</span>
      <Input
        placeholder="Enter something..."
        style="width: 170px"></Input>
      <Select
        style="width:165px">
      </Select>
    </p>
    <p class="p">
      <span>透明度:</span>
      <InputNumber
        :max="100"
        :min="0"
        :step="10"
        :formatter="value => `${value}%`"
        :parser="value => value.replace('%', '')"
        style="width: 326px"
      ></InputNumber>
    </p>
    <p class="p">
      <span>旋转:</span>
      <InputNumber
        :max="360"
        :min="-360"
        :step="45"
        style="width: 326px"
      ></InputNumber>
    </p>

  </div>
</template>

<style lang="less" scoped>
.p {
  margin: 8px 0 0 0;
}
</style>
