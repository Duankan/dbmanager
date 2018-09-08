//线（边）样式设置
<script>
export default {
  name: 'LineStyle',
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
      LineStyleData: {
        isShow: false,
        width: 0, //宽度
        widthField: '', //宽度字段
        transparent: 100, //透明度
        transparentField: '', //透明度字段
        color: '#000000', //颜色值
        colorField: '', //颜色字段
        imaginary: 1, //绑定的虚线
        imaginaryExcursion: 0.0, //绑定的虚线偏移
        lineCap: 'butt', //绑定的线帽
        lineConnect: 'bevel', //绑定的线连接
      },
      lineCapS: ['butt', 'round', 'square'],
      lineConnectS: ['bevel', 'miter', 'round'],
    };
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
        v-model="LineStyleData.isShow"
        size="small">
      </Switch>
      <span>是否显示边</span>
    </div>
    <div v-show="LineStyleData.isShow">
      <Card
        :padding="4"
        dis-hover>
        <div style="font-size:12px;">
          <Row
            style="margin-top:8px;">
            <Col span="8" >宽度：</Col>
            <Col span="16" >
            <InputNumber
              :min="1"
              :disabled="!LineStyleData.widthField==''"
              v-model="LineStyleData.width"
              style="width:143px;"
              size="small"></InputNumber>
        </Col>
          </Row>
          <Row
            style="margin-top:8px;">
            <Col span="8" >匹配字段：</Col>
            <Col span="16" >
            <Select
              v-model="LineStyleData.widthField"
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
            <Col span="8" >透明度：</Col>
            <Col span="16" >
            <InputNumber
              :min="0"
              :max="100"
              :step = "10"
              :disabled="!LineStyleData.transparentField==''"
              v-model="LineStyleData.transparent"
              style="width:143px;"
              size="small"></InputNumber>
              </Col>
          </Row>
          <Row
            v-if = "layerType == 'point'"
            style="margin-top:8px;">
            <Col span="8" >匹配字段：</Col>
            <Col span="16" >
            <Select
              v-model="LineStyleData.transparentField"
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
            <Col span="8" >颜色：</Col>
            <Col span="16" >
            <ColorPicker
              :disabled="true"
              v-model="LineStyleData.color"
              style="width:100%"
              size="small"/>
            <div
              v-if="LineStyleData.colorField!=''"
              class="color-disable-div" ></div>
        </Col>
          </Row>
          <Row
            v-if="layerType!='point'"
            style="margin-top:8px;">
            <Col span="8" >匹配字段：</Col>
            <Col span="16" >
            <Select
              v-model="LineStyleData.colorField"
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
      <Row
        v-if="layerType!='point'"
        style="margin-top:8px;">
        <Col span="8" >虚线:</Col>
        <Col span="16" >
        <InputNumber
          :max="1000"
          :min="-1000"
          v-model="LineStyleData.imaginary"
          size="small"
          style="width: 100%"></InputNumber>
        </Col>
      </Row>
      <Row
        v-if="layerType!='point'"
        style="margin-top:8px;">
        <Col span="8" >虚线偏移:</Col>
        <Col span="16" >
        <InputNumber
          v-model="LineStyleData.imaginaryExcursion"
          :max="1000"
          :min="-1000"
          size="small"
          style="width: 100%"></InputNumber>
        </Col>
      </Row>
      <Row
        v-if="layerType!='point'"
        style="margin-top:8px;">
        <Col span="8" >线帽:</Col>
        <Col span="16" >
        <Select
          v-model="LineStyleData.lineCap"
          size="small">
          <Option
            v-for="item in lineCapS"
            :value="item"
            :key="item">{{ item }}</Option>
        </Select>
        </Col>
      </Row>
      <Row
        v-if="layerType!='point'"
        style="margin-top:8px;">
        <Col span="8" >线连接:</Col>
        <Col span="16" >
        <Select
          v-model="LineStyleData.lineConnect"
          size="small">
          <Option
            v-for="item in lineConnectS"
            :value="item"
            :key="item">{{ item }}</Option>
        </Select>
        </Col>
      </Row>
    </div>
  </div>
</template>
