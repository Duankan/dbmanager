
<script>
export default {
  name: 'LineSymbol',
  data() {
    return {
      showSide: false,
      //常见标记的select填充字段
      markS: [
        {
          name: 'arrow',
        },
        {
          name: 'star',
        },
        {
          name: 'circle',
        },
        {
          name: 'triangle',
        },
        {
          name: 'hatch',
        },
        {
          name: 'square',
        },
        {
          name: 'X',
        },
      ],
      labelName: '常见的标记',
      numWidth: null, //宽度
      numSize: null, //尺寸
      colors: '#266674', //颜色
      mark: null,
      fonts: [], //全部的字体
      font: '宋体', //绑定的字体
    };
  },
  computed: {
    LineSymbols() {
      let LineSymbols;
      if (this.labelName == '常见的标记') {
        LineSymbols = {
          mark: [
            {
              stroke: { strColor: this.colors, numWidth: this.numWidth },
              strWellKnownName: this.mark,
            },
          ],
          numSize: this.numSize,
        };
      } else {
        LineSymbols = null;
      }

      var strLineSymbols = JSON.stringify(LineSymbols);
      return LineSymbols;
    },
  },
  created() {
    this.getfont();
  },
  methods: {
    //获得全部字体方法
    async getfont() {
      let font = await api.db.findFont();
      this.fonts = font.data;
    },
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

    <RadioGroup
      v-model="labelName"
    >
      <Radio label="常见的标记"></Radio>
      <Radio label="字体"></Radio>
    </RadioGroup>
    <p class="p">
      <Select
        v-if="labelName=='常见的标记'"
        v-model="mark"
        :disabled="!showSide"
        style="width:200px">
        <Option
          v-for="item in markS"
          :value="item.name"
          :key="item.name">{{ item.name }}</Option>
      </Select>
    </p>
    <p class="p">
      <Select
        v-if="labelName=='字体'"
        v-model="font"
        :disabled="!showSide"
        style="width:165px">
        <Option
          v-for="item in fonts"
          :value="item.fontAlias"
          :key="item.id">{{ item.fontAlias }}</Option>
      </Select>
    </p>
    <p class="p">
      <InputNumber
        :disabled="!showSide"
        v-model="numWidth"
        :max="20"
        :min="0"
        style="width: 150px"
      ></InputNumber>
      <InputNumber
        v-model="numSize"
        :disabled="!showSide"
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
