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
        fontColor: '', //字体颜色
        fontStyle: '', //字体样式
        haloColor: '', //晕轮颜色
        haloSize: 0,
        verticalType: '', //垂直停靠
        horizontalType: '', //水平停靠
        backGroundColor: '',
        backGroundBorderColor: '',
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
              v-model="MarkStyleData.angle"
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
  </div>
</template>
