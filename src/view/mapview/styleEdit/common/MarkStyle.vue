//标注设置
<script>
export default {
  name: 'MarkStyle',
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
  },
  data() {
    return {
      MarkStyleData: {
        isShow: false,
        isBackGroundShow: false, //是否显示背景
        markText: '', //标注文字
        markTextField: '', //标注文字字段
        transparent: 100, //透明度
        transparentField: '', //透明度字段
        angle: 0, //旋转角度
        angleField: '', //旋转角度字段
        fontColor: '#000000', //字体颜色
        fontStyle: '', //字体样式
        haloColor: '#000000', //晕轮颜色
        haloSize: 0,
        verticalType: '', //垂直停靠
        horizontalType: '', //水平停靠
        backGroundColor: '',
        backGroundBorderColor: '',
        displacementX: null, // 水平位移
        displacementY: null, // 垂直位移
        maxDisplacement: 0, // 最大像素位移
        autoWrap: 0, // 自动换行像素
        spaceAround: 0, // 周围像素距离
        offsetY: '', // 垂直偏移
        initGap: '', // 初始间距
        repeatD: '', // 重复像素距离
        isFollowLine: '', // 是否沿线
        maxAngle: '', // 允许的最大角度
      },
      //常见标记的select填充字段
      markS: ['arrow', 'star', 'circle', 'triangle', 'hatch', 'square', 'X'],
      fonts: [], //获取所有字体样式
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
<template>
  <div
    slot="content"
    class="content-div" >
    <div style="margin-bottom:4px;">
      <Switch
        v-model="MarkStyleData.isShow"
        size="small">
      </Switch>
      <span>是否显示标注</span>
    </div>
    <div v-show="MarkStyleData.isShow">
      <Card
        :padding="4"
        dis-hover
        style="margin-top:8px;">
        <div style="font-size:12px;">
          <Row
            style="margin-top:8px;">
            <Col span="8" > 标注：</Col>
            <Col span="16" >
            <Input
              :disabled="!MarkStyleData.markTextField==''"
              v-model="MarkStyleData.markText"
              size="small"></Input>
        </Col>
          </Row>
          <Row
            style="margin-top:8px;">
            <Col span="8" >匹配字段：</Col>
            <Col span="16" >
            <Select
              v-model="MarkStyleData.markTextField"
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
              :disabled="!MarkStyleData.transparentField==''"
              v-model="MarkStyleData.transparent"
              style="width:143px;"
              size="small"></InputNumber>
        </Col>
          </Row>
          <Row
            v-if = "layerType == 'polygon'"
            style="margin-top:8px;">
            <Col span="8" >匹配字段：</Col>
            <Col span="16" >
            <Select
              v-model="MarkStyleData.transparentField"
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
      <Card
        v-if = "layerType != 'polyline'"
        :padding="4"
        dis-hover
        style="margin-top:8px;">
        <div style="font-size:12px;">
          <Row
            style="margin-top:8px;">
            <Col span="8" >旋转角度：</Col>
            <Col span="16" >
            <InputNumber
              :min="0"
              :max="360"
              :disabled="!MarkStyleData.angleField==''"
              v-model="MarkStyleData.angle"
              style="width:143px;"
              size="small"></InputNumber>
        </Col>
          </Row>
          <Row
            style="margin-top:8px;">
            <Col span="8" >匹配字段：</Col>
            <Col span="16" >
            <Select
              v-model="MarkStyleData.angleField"
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
      <Row
        style="margin-top:8px;">
        <Col span="8" >文字颜色：</Col>
        <Col span="16" >
        <ColorPicker
          :disabled="true"
          v-model="MarkStyleData.fontColor"
          style="width:100%"
          size="small"/>
        </Col>
      </Row>
      <Row
        style="margin-top:8px;">
        <Col span="8" >字体样式：</Col>
        <Col span="16" >
        <Select
          v-model="MarkStyleData.fontStyle"
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
        <Col span="8" >晕轮颜色：</Col>
        <Col span="16" >
        <ColorPicker
          :disabled="true"
          v-model="MarkStyleData.haloColor"
          style="width:100%"
          size="small"/>
        </Col>
      </Row>
      <Row
        style="margin-top:8px;">
        <Col span="8" >晕轮大小：</Col>
        <Col span="16" >
        <InputNumber
          :min="0"
          :max="20"
          v-model="MarkStyleData.haloSize"
          style="width:143px;"
          size="small"></InputNumber>
        </Col>
      </Row>
      <div v-if = "layerType == 'polyline'">
        <Row
          style="margin-top:8px;">
          <Col span="8" > 垂直偏移：</Col>
          <Col span="16" >
          <Input
            v-model="MarkStyleData.offsetY"
            size="small"></Input>
        </Col>
        </Row>
        <Row
          style="margin-top:8px;">
          <Col span="8" > 初始间距：</Col>
          <Col span="16" >
          <Input
            v-model="MarkStyleData.initGap"
            size="small"></Input>
        </Col>
        </Row>
      </div>
      <div v-if = "layerType == 'point'">
        <Row
          style="margin-top:8px;">
          <Col span="8" >垂直停靠：</Col>
          <Col span="16" >
          <Select
            v-model="MarkStyleData.verticalType"
            size="small">
            <Option
              value="top"
              label="top"/>
            <Option
              value="middle"
              label="middle"/>
            <Option
              value="bottom"
              label="bottom"/>
          </Select>
        </Col>
        </Row>
        <Row
          style="margin-top:8px;">
          <Col span="8" >水平停靠：</Col>
          <Col span="16" >
          <Select
            v-model="MarkStyleData.horizontalType"
            size="small">
            <Option
              value="right"
              label="right"/>
            <Option
              value="center"
              label="center"/>
            <Option
              value="left"
              label="left"/>
          </Select>
        </Col>
        </Row>
        <Row
          style="margin-top:8px;">
          <Col span="8" >水平位移：</Col>
          <Col span="16" >
          <InputNumber
            v-model="MarkStyleData.displacementX"
            style="width:143px;"
            size="small"></InputNumber>
        </Col>
        </Row>
        <Row
          style="margin-top:8px;">
          <Col span="8" >垂直位移：</Col>
          <Col span="16" >
          <InputNumber
            v-model="MarkStyleData.displacementY"
            style="width:143px;"
            size="small"></InputNumber>
        </Col>
        </Row>
      </div>
      <div v-if = "layerType == 'polyline'">
        <div style="margin-bottom:4px;margin-top:4px;">
          <Switch
            v-model="MarkStyleData.isBackGroundShow"
            size="small">
          </Switch>
          <span>是否显示背景</span>
        </div>
        <Row
          v-show="MarkStyleData.isBackGroundShow"
          style="margin-top:8px;">
          <Col span="8" >背景颜色：</Col>
          <Col span="16" >
          <ColorPicker
            :disabled="true"
            v-model="MarkStyleData.backGroundColor"
            style="width:100%"
            size="small"/>
        </Col>
        </Row>
        <Row
          v-show="MarkStyleData.isBackGroundShow"
          style="margin-top:8px;">
          <Col span="8" >背景边框：</Col>
          <Col span="16" >
          <ColorPicker
            :disabled="true"
            v-model="MarkStyleData.backGroundBorderColor"
            style="width:100%"
            size="small"/>
        </Col>
        </Row>
      </div>

      <Row
        style="margin-top:8px;">
        <Col span="8" >最大位移：</Col>
        <Col span="16" >
        <InputNumber
          v-model="MarkStyleData.maxDisplacement"
          style="width:143px;"
          size="small"></InputNumber>
        </Col>
      </Row>
      <Row
        style="margin-top:8px;">
        <Col span="8" >换行像素：</Col>
        <Col span="16" >
        <InputNumber
          v-model="MarkStyleData.autoWrap"
          style="width:143px;"
          size="small"></InputNumber>
        </Col>
      </Row>
      <Row
        style="margin-top:8px;">
        <Col span="8" >周围距离：</Col>
        <Col span="16" >
        <InputNumber
          v-model="MarkStyleData.spaceAround"
          style="width:143px;"
          size="small"></InputNumber>
        </Col>
      </Row>
      <div v-if = "layerType == 'polyline'">
        <Row
          style="margin-top:8px;">
          <Col span="8" >重复像素：</Col>
          <Col span="16" >
          <Input
            v-model="MarkStyleData.repeatD"
            style="width:143px;"
            size="small"></Input>
        </Col>
        </Row>
        <Row
          style="margin-top:8px;">
          <Col span="8" >是否沿线：</Col>
          <Col span="16" >
          <Select
            v-model="MarkStyleData.isFollowLine"
            size="small">
            <Option
              value="true"
              label="true"/>
            <Option
              value="false"
              label="false"/>
          </Select>
        </Col>
        </Row>
        <Row
          style="margin-top:8px;">
          <Col span="8" >最大角度：</Col>
          <Col span="16" >
          <Input
            v-model="MarkStyleData.maxAngle"
            style="width:143px;"
            size="small"></Input>
        </Col>
        </Row>

      </div>
    </div>
  </div>
</template>
