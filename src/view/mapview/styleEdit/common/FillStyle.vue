//面（点）填充设置
<script>
export default {
  name: 'FillStyle',
  props: {
    layerType: {
      type: String,
      default: '',
    },
    styleType: {
      type: String,
      default: '',
    },
    fieldNumS: {
      type: Array,
      default: () => [],
    },
    fieldNoNumS: {
      type: Array,
      default: () => [],
    },
    defaultRule: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      FillStyleData: {
        isShow: true,
        transparent: 100, //透明度
        transparentField: '', //透明度字段
        fillType: '',
        color: 'black', //颜色值
        colorField: '', //颜色字段
        mark: '',
        fontSize: 14,
        fontStyle: '',
        fontWidth: 0,
        fontColor: '',
        fillWidth: 0, // 填充宽度
        fillSize: 0, // 填充大小
        fillColor: '#000000', // 填充颜色
      },
      // 常见标记的select填充字段
      markS: ['arrow', 'star', 'circle', 'triangle', 'hatch', 'square', 'X'],
      fonts: [], //获取所有字体样式
    };
  },
  computed: {
    initColor() {
      return this.defaultRule;
    },
  },
  created() {
    this.getfont();
    // 在不是面的情况默认选中选项为mark
    if (!(this.layerType == 'polygon')) {
      this.FillStyleData.fillType = 'mark';
    } else {
      this.FillStyleData.fillType = 'color';
    }
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
<template>
  <div
    slot="content"
    class="content-div" >
    <div style="margin-bottom:4px;">
      <Switch
        v-model="FillStyleData.isShow"
        size="small">
      </Switch>
      <span>是否填充</span>
    </div>
    <div v-show="FillStyleData.isShow">
      <Card
        :padding="4"
        dis-hover
        style="margin-top:8px;">
        <div style="font-size:12px;">
          <Row
            style="margin-top:8px;">
            <Col span="8" >透明度：</Col>
            <Col span="16" >
            <InputNumber
              :min="0"
              :max="100"
              :step="10"
              :disabled="!FillStyleData.transparentField==''"
              v-model="FillStyleData.transparent"
              style="width:143px;"
              size="small"></InputNumber>
        </Col>
          </Row>
          <Row
            style="margin-top:8px;">
            <Col span="8" >匹配字段：</Col>
            <Col span="16" >
            <Select
              v-model="FillStyleData.transparentField"
              clearable
              size="small"
              style="width:100%">
              <Option
                v-for="item in fieldNumS"
                :value="item.name"
                :key="item.name">{{ item.name }}</Option>
            </Select>
        </Col>
          </Row>
        </div>
      </Card>
      <RadioGroup
        v-model="FillStyleData.fillType"
        style="margin-top:8px;">
        <Radio
          v-if = "layerType == 'polygon'"
          label="color">颜色</Radio>
        <Radio label="mark">标注</Radio>
        <Radio label="font">文字</Radio>
      </RadioGroup>

      <Card
        v-if="FillStyleData.fillType=='color' && layerType == 'polygon'"
        :padding="4"
        dis-hover
        style="margin-top:8px;">
        <div style="font-size:12px;">
          <Row
            style="margin-top:8px;">
            <Col span="8" >颜色：</Col>
            <Col span="16" >
            <ColorPicker
              :disabled="true"
              v-model="FillStyleData.color"
              style="width:100%"
              size="small"/>
            <div
              v-if="FillStyleData.colorField!=''"
              class="color-disable-div" ></div>
        </Col>
          </Row>
          <Row
            style="margin-top:8px;">
            <Col span="8" >匹配字段：</Col>
            <Col span="16" >
            <Select
              v-model="FillStyleData.colorField"
              clearable
              size="small"
              style="width:100%">
              <Option
                v-for="item in fieldNoNumS"
                :value="item.name"
                :key="item.name">{{ item.name }}</Option>
            </Select>
        </Col>
          </Row>
        </div>
      </Card>
      <div v-if="FillStyleData.fillType=='mark'">
        <Row
          style="margin-top:8px;">
          <Col span="8" >常用标注：</Col>
          <Col span="16" >
          <Select
            v-model="FillStyleData.mark"
            size="small">
            <Option
              v-for="item in markS"
              :value="item"
              :key="item">{{ item }}</Option>
          </Select>
        </Col>
        </Row>
        <Row
          style="margin-top:8px;">
          <Col span="8" >填充颜色：</Col>
          <Col span="16" >
          <ColorPicker
            :disabled="true"
            v-model="FillStyleData.fillColor"
            style="width:100%"
            size="small"/>
          <div
            v-if="FillStyleData.colorField!=''"
            class="color-disable-div" ></div>
                </Col>
        </Row>
        <div v-if = "layerType == 'polygon'">
          <Row
            style="margin-top:8px;">
            <Col span="8" >填充宽度：</Col>
            <Col span="16" >
            <InputNumber
              v-model="FillStyleData.fillWidth"
              :min = "0"
              :max = "20"
              style="width:100%;"
              size="small"></InputNumber>
                </Col>
          </Row>
          <Row
            style="margin-top:8px;">
            <Col span="8" >填充大小：</Col>
            <Col span="16" >
            <InputNumber
              :min = "0"
              :max = "100"
              v-model="FillStyleData.fillSize"
              style="width:100%;"
              size="small"></InputNumber>
                </Col>
          </Row>
        </div>

      </div>
      <div v-if="FillStyleData.fillType=='font'">
        <Row
          style="margin-top:8px;">
          <Col span="8" >字体样式：</Col>
          <Col span="16" >
          <Select
            v-model="FillStyleData.fontStyle"
            size="small">
            <Option
              v-for="item in fonts"
              :value="item.fontAlias"
              :key="item.id">{{ item.fontAlias }}</Option>
          </Select>
        </Col>
        </Row>
        <Row
          style="margin-top:8px;">
          <Col span="8" >填充颜色：</Col>
          <Col span="16" >
          <ColorPicker
            :disabled="true"
            v-model="FillStyleData.fillColor"
            style="width:100%"
            size="small"/>
          <div
            v-if="FillStyleData.colorField!=''"
            class="color-disable-div" ></div>
                </Col>
        </Row>
        <div v-if = "layerType == 'polygon'">
          <Row
            style="margin-top:8px;">
            <Col span="8" >填充宽度：</Col>
            <Col span="16" >
            <InputNumber
              v-model="FillStyleData.fillWidth"
              style="width:100%;"
              size="small"></InputNumber>
                </Col>
          </Row>
          <Row
            style="margin-top:8px;">
            <Col span="8" >填充大小：</Col>
            <Col span="16" >
            <InputNumber
              v-model="FillStyleData.fillSize"
              style="width:100%;"
              size="small"></InputNumber>
                </Col>
          </Row>
        </div>

      </div>
    </div>
  </div>
</template>
