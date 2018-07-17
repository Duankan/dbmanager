
<script>
export default {
  name: 'Fill',
  data() {
    return {
      showSide: true,
      colors: 'black',
      selectType: '颜色',
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
      <span>显示/不显示 填充</span>
      <Switch
        v-model="showSide"
        @on-change="change"></Switch>
    </p>
    <p class="p">
      <span>透明度:</span>
      <InputNumber
        :max="100"
        :min="0"
        :step="10"
        :formatter="value => `${value}%`"
        :parser="value => value.replace('%', '')"
        style="width: 100px"
      ></InputNumber>
      <span>依据字段</span>
      <Select
        style="width:163px">
      </Select>
    </p>

    <p class="p">
      <RadioGroup v-model="selectType">
        <Radio label="颜色"></Radio>
        <Radio label="常见标记"></Radio>
        <Radio label="字体"></Radio>
      </RadioGroup>
    </p>

    <p
      v-show="selectType=='颜色'"
      class="p">
      <span>颜色修改:</span>
      <ColorPicker
        v-model="colors"
        size="large"
        class="colorsStyle" />
      <span>依据字段：<span>
        <Select
          style="width:205px">
        </Select>
    </span></span></p>

    <p
      v-show="selectType=='常见标记'"
      class="p">
      <span>常见标记:</span>
      <Select
        style="width:312px">
      </Select>
    </p>
    <p
      v-show="selectType=='常见标记'"
      class="p">
      <InputNumber
        :max="100"
        :min="0"
        style="width: 165px"
      ></InputNumber>
      <InputNumber
        :max="100"
        :min="0"
        style="width: 165px"
      ></InputNumber>
      <ColorPicker
        v-model="colors"
        size="large"
        class="colorsStyle" />
    </p>

    <p
      v-show="selectType=='字体'"
      class="p">
      <span>字体:</span>
      <Select
        style="width:338px">
      </Select>
    </p>
    <p
      v-show="selectType=='字体'"
      class="p">
      <InputNumber
        :max="100"
        :min="0"
        style="width: 165px"
      ></InputNumber>
      <InputNumber
        :max="100"
        :min="0"
        style="width: 165px"
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
