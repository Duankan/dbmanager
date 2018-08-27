//公共部分设置
<script>
export default {
  name: 'Public',
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
    selectRule: {
      type: Object,
      default: () => {},
    },
    // fieldNoNumS: {
    //   type: Array,
    //   default: () => [],
    // },
  },
  data() {
    return {
      publicData: {
        rulename: '', //绑定的规格名称的值
        pointSize: 0, //点大小
        pointSizeField: '', //点大小的设定字段
        pointOffset: 0, //点的偏移量
        pointOffsetField: '', //点的偏移量字段
        xSkewing: 0, //绑定x偏移值
        ySkewing: 0, //绑定y偏移值
        maxRatio: '',
        minRatio: '',
      },
      proportion: ['500', '1000', '2000', '2500', '5000', '10000', '20000', '50000', '100000'],
    };
  },
};
</script>
<style lang="less" scoped>
.content-div {
  font-size: 12px;
}
</style>
<template>
  <div 
    slot="content"
    class="content-div" >
    <Row v-if="styleType!='SingleSytle'">
      <Col span="8" >规则名称:</Col>
      <Col span="16" >
      <Input 
        v-model="publicData.rulename" 
        size="small"
        placeholder="样式别名"></Input>
                </Col>
    </Row>
    <Card 
      v-if="layerType=='point'"
      :padding="4" 
      dis-hover>
      <div style="font-size:12px;">
        <Row 
          style="margin-top:8px;">
          <Col span="8" >点大小：</Col>
          <Col span="16" >
          <InputNumber 
            :min="1" 
            :disabled="!publicData.pointSizeField==''"
            v-model="publicData.pointSize"
            style="width:143px;"
            size="small"></InputNumber>
        </Col>
        </Row>
        <Row 
          style="margin-top:8px;">
          <Col span="8" >匹配字段：</Col>
          <Col span="16" >
          <Select 
            v-model="publicData.pointSizeField"
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
      v-if="layerType=='point'"
      :padding="4" 
      dis-hover
      style="margin-top:8px;">
      <div style="font-size:12px;">
        <Row 
          style="margin-top:8px;">
          <Col span="8" >旋转：</Col>
          <Col span="16" >
          <InputNumber 
            :min="0" 
            :max="360"
            :disabled="!publicData.pointOffsetField==''" 
            v-model="publicData.pointOffset"
            style="width:143px;"
            size="small"></InputNumber>
        </Col>
        </Row>
        <Row 
          style="margin-top:8px;">
          <Col span="8" >匹配字段：</Col>
          <Col span="16" >
          <Select 
            v-model="publicData.pointOffsetField"
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
      <Col span="8" >xy偏移:</Col>
      <Col span="16" >
      <Row style="padding-right:0px;">
        <Col 
          span="12" 
          style="padding-left: 0px;">
        <InputNumber 
          v-model="publicData.xSkewing" 
          size="small"></InputNumber>
            </Col>
        <Col span="12">
        <div style="padding-left:4px;padding-right:14px;">  
          <InputNumber 
            v-model="publicData.xSkewing" 
            size="small">
          </InputNumber>
        </div>
            </Col>
      </Row>
        </Col>
    </Row>
    <Row 
      style="margin-top:8px;">
      <Col span="8" >最大比例尺:</Col>
      <Col span="16" >
      <Select 
        v-model="publicData.maxRatio" 
        size="small"
        style="width:100%">
        <Option 
          v-for="item in proportion" 
          :value="item" 
          :key="item">{{ item }}</Option>
      </Select>
        </Col>
    </Row>
    <Row 
      style="margin-top:8px;">
      <Col span="8" >最小比例尺:</Col>
      <Col span="16" >
      <Select 
        v-model="publicData.minRatio" 
        size="small"
        style="width:100%">
        <Option 
          v-for="item in proportion" 
          :value="item" 
          :key="item">{{ item }}</Option>
      </Select>
        </Col>
    </Row>
  </div>
</template>
