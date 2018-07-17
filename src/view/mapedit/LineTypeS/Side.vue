
<script>
export default {
  name: 'Side',
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
      <span>显示/不显示 边</span>
      <Switch
        v-model="showSide"
        @on-change="change"></Switch>
    </p>
    <p class="p">
      <span>宽度:</span>
      <InputNumber
        :max="100"
        :min="1"
        style="width: 120px"
      ></InputNumber>
      <span>依据字段：<span>
        <Select
          style="width:150px">
        </Select>
    </span></span></p>
    <p class="p">
      <span>透明度:</span>
      <InputNumber
        :max="100"
        :min="0"
        :step="10"
        :formatter="value => `${value}%`"
        :parser="value => value.replace('%', '')"
        style="width: 328px"
      ></InputNumber>
    </p>
    <p class="p">
      <span>颜色修改:</span>
      <ColorPicker
        v-model="colors"
        size="large"
        class="colorsStyle" />
      <span>依据字段：<span>
        <Select
          style="width:208px">
        </Select>
    </span></span></p>
    <p class="p">
      <span>虚线:</span>
      <InputNumber
        :max="1000"
        :min="-1000"
        style="width: 342px"></InputNumber>
    </p>
    <p class="p">
      <span>虚线偏移:</span>
      <InputNumber
        :max="1000"
        :min="-1000"
        style="width: 317px"
      ></InputNumber>
    </p>
    <p class="p">
      <span>线帽:</span>
      <Select
        style="width:342px">
      </Select>
    </p>
    <p class="p">
      <span>线连接:</span>
      <Select
        style="width:329px">
      </Select>
    </p>

  </div>
</template>

<style lang="less" scoped>
.p {
  margin: 12px 0 0 0;
}
</style>
