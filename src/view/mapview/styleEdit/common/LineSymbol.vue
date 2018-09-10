<template>
  <div
    slot = "content"
    class="content-div">
    <div style="margin-bottom:4px;">
      <Switch
        v-model="LineSymbolData.isShow"
        size="small">
      </Switch>
      <span>是否显示线符号</span>
    </div>
    <div v-show = "LineSymbolData.isShow">

      <RadioGroup
        v-model = "LineSymbolData.fillType"
        style="margin-top:8px;">
        <Radio label="mark">标注</Radio>
        <Radio label="font">文字</Radio>
      </RadioGroup>
      <Card
        v-if="LineSymbolData.fillType=='mark'"
        :padding="4"
        dis-hover
        style="margin-top:8px;">
        <div style="font-size:12px;">
          <Row
            style="margin-top:8px;">
            <Col span="8" >常用标注：</Col>
            <Col span="16" >
            <Select
              v-model = "LineSymbolData.selectedMark"
              clearable
              size="small"
              style="width:100%">
              <Option
                v-for="item in markS"
                :value="item"
                :key="item">{{ item }}</Option>
            </Select>
        </Col>
          </Row>
        </div>
      </Card>
      <div v-else-if="LineSymbolData.fillType=='font'">
        <Row
          style="margin-top:8px;">
          <Col span="8" >字体：</Col>
          <Col span="16" >
          <Select
            v-model = "LineSymbolData.selectedFont"
            size="small">
            <Option
              v-for="item in fonts"
              :value="item.fontAlias"
              :key="item.id">{{ item.fontAlias }}</Option>
          </Select>
        </Col>
        </Row>

      </div>
      <Card
        :padding="4"
        dis-hover
        style="margin-top:8px;">
        <div style="font-size:12px;">
          <Row
            style="margin-top:8px;">
            <Col span="9" >线符号颜色：</Col>
            <Col span="15" >
            <ColorPicker
              :disabled="true"
              v-model="LineSymbolData.markColor"
              style="width:100%"
              size="small"/>
            <div
              v-if="LineSymbolData.colorField!=''"
              class="color-disable-div" ></div>
            </Col>
          </Row>
          <Row
            style="margin-top:8px;">
            <Col span="9" >线符号宽度：</Col>
            <Col span="15" >
            <InputNumber
              :max = "20"
              :min = "0"
              v-model="LineSymbolData.markWidth"
              style="width:100%;"
              size="small"></InputNumber>
          </Col>
          </Row>
          <Row
            style="margin-top:8px;">
            <Col span="9" >线符号大小：</Col>
            <Col span="15" >
            <InputNumber
              :max = "100"
              :min = "0"
              v-model="LineSymbolData.markSize"
              style="width:100%;"
              size="small"></InputNumber>
          </Col>
          </Row>
        </div>
      </Card>

    </div>
  </div>
</template>


<script>
export default {
  name: 'LineSymbol',
  data() {
    return {
      LineSymbolData: {
        isShow: false, // 是否显示线符号
        fillType: 'mark',
        selectedFont: '', // 选中字体
        selectedMark: '', // 选中标注
        markColor: '#000000', // 颜色值
        colorField: '', // 颜色字段
        markWidth: 0, // 线符号宽度
        markSize: 0, // 线符号大小
      },
      // 常见标记的select填充字段
      markS: ['arrow', 'star', 'circle', 'triangle', 'hatch', 'square', 'X'],
      fonts: [], // 获取所有的字体样式
    };
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
  },
};
</script>
<style lang="less" scoped>
.content-div {
  font-size: 12px;
}
.color-disable-div {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 144px;
  height: 24px;
  background: #f3f3f3;
}
</style>
