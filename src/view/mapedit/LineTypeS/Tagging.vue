
<script>
export default {
  name: 'Tagging',
  data() {
    return {
      showSide: true,
      colors: 'black',
      angle: 0,
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
      <span>字体:</span>
      <ColorPicker
        v-model="colors"
        size="large"
        class="colorsStyle" />
      <Select
        style="width:300px">
      </Select>
    </p>
    <p class="p">
      <span>晕轮:</span>
      <ColorPicker
        v-model="colors"
        size="large"
        class="colorsStyle" />
      <InputNumber
        :max="20"
        :min="0"
        style="width: 300px"
      ></InputNumber>
    </p>

    <p class="p">
      <span>垂直偏移:</span>
      <InputNumber
        :max="2000"
        :min="0"
        style="width: 300px"
      ></InputNumber>
    </p>

    <p class="p">
      <span>初始间隔:</span>
      <InputNumber
        :max="2000"
        :min="0"
        style="width: 300px"
      ></InputNumber>
    </p>

    <div class="Tagging-bottom">
      <p class="p">
        提供的选项:
      </p>
      <p >
        <span>最大像素位移:</span>  <Input
          style="width: 285px"
        ></Input>
      </p>
      <p >
        <span>自动换行的像素:</span>  <Input
          style="width: 272px"
        ></Input>
      </p>
      <p >
        <span>周围的像素距离:</span>
        <Input
          style="width: 272px"
        ></Input>
      </p>
    </div>

  </div>
</template>

<style lang="less" scoped>
.p {
  margin: 8px 0 0 0;
}
.Tagging-bottom {
  width: 380px;
  height: 150px;
  margin: 8px 0 0 0;
  border: 1px dashed #000;
}
</style>
