<script>
import PolygonType from './PolygonType';
import LineType from './LineType';
import PointType from './PointType';
import High from './High';
import SelectType from './SelectType';
export default {
  name: 'MapEdit',
  components: {
    PolygonType,
    PointType,
    LineType,
    High,
    SelectType,
  },
  props: {
    value: { type: Object, default: () => {} },
  },
  data() {
    return {
      labelName: '', //3个按钮 的第一个按钮名字是叫点 线 面  什么的类型
      selectOut: '', //判断点击线类型，高级或者选择样式
    };
  },
  created() {
    if (this.value.data.resource.shapeType.toUpperCase() == 'POLYGON') {
      this.labelName = '面类型';
    }
    if (this.value.data.resource.shapeType.toUpperCase() == 'POINT') {
      this.labelName = '点类型';
    }
    if (this.value.data.resource.shapeType.toUpperCase() == 'LINESTRING') {
      this.labelName = '线类型';
    }
    if (this.value.data.resource.shapeType == 'polyline') {
      this.labelName = '线类型';
    }
    this.selectOut = this.labelName;
    //把是什么类型的也传过去因为这里做了判断
    this.value.data.resource.type = this.labelName;
  },
  methods: {
    leave() {
      alert('s');
    },
  },
};
</script>

<template>
  <div class="main">


    <Form
      :label-width="8"
    >
      <FormItem style="margin: 8px 0 0 0;" >
        <RadioGroup
          v-model="selectOut"
          type="button"
        >
          <Radio label="选择样式"></Radio>
          <Radio
            :label="labelName"
          ></Radio>
          <Radio label="高级"></Radio>

        </RadioGroup>
      </FormItem>
      <FormItem >
        <PolygonType
          v-if="selectOut=='面类型'"
          :msg="value"></PolygonType>
        <LineType v-if="selectOut=='线类型'"></LineType>
        <PointType v-if="selectOut=='点类型'"></PointType>
        <High
          v-if="selectOut=='高级'"
          :msg="value"></High>
        <SelectType
          v-if="selectOut=='选择样式'"
          :msg="value"></SelectType>
      </FormItem>
    </Form>



  </div>

</template>

<style lang="less" scoped>
.main {
  width: 700px;
  float: left;
  height: 600px;
  border: 1px solid rgb(245, 218, 169);
}
</style>
