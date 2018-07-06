<script>
import PolygonType from './PolygonType';
import LineType from './LineType';
import PointType from './PointType';
export default {
  name: 'MapEdit',
  components: {
    PolygonType,
    PointType,
    LineType,
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
    if (this.value.data.shapeType.toUpperCase() == 'POLYGON') {
      this.labelName = '面类型';
    }
    if (this.value.data.shapeType.toUpperCase() == 'POINT') {
      this.labelName = '点类型';
    }
    if (this.value.data.shapeType.toUpperCase() == 'LINESTRING') {
      this.labelName = '线类型';
    }
    if (this.value.data.shapeType == 'polyline') {
      this.labelName = '线类型';
    }
    this.selectOut = this.labelName;
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

    <div class="left">
      <Form
        :label-width="80"
      >
        <FormItem >
          <RadioGroup
            v-model="selectOut"
            type="button"
          >
            <Radio
              :label="labelName"
            ></Radio>
            <Radio label="高级"></Radio>
            <Radio label="选择样式"></Radio>
          </RadioGroup>
        </FormItem>

        <PolygonType v-if="selectOut=='面类型'"></PolygonType>
        <LineType v-if="selectOut=='线类型'"></LineType>
        <PointType v-if="selectOut=='点类型'"></PointType>

      </Form>
    </div>
    <div class="right">
      <div class="right-top"></div>
      <div class="right-bottom ">
        <Button
          type="ghost"
          icon="ios-plus"

        ></Button>
        <Button
          type="ghost"
          icon="ios-plus-outline"></Button>
        <Button
          type="ghost"
          icon="soup-can"></Button>
        <Button
          type="ghost"
          icon="soup-can-outline"></Button>
    </ButtonGroup>
      </div>
    </div>

    <div class="bottom">
      <Button
        style="float: right;margin:2px;"
        type="primary "
        icon="ios-search">另存</Button>
      <Button
        style="float: right;margin:2px;"
        type="primary "
        icon="ios-search">保存</Button>
      <Button
        style="float: right;margin:2px;"
        type="primary"
        icon="ios-search">取消</Button>


    </div>

  </div>

</template>

<style lang="less" scoped>
.main {
  width: 100%;
  float: left;
}
.left {
  width: 70%;
  float: left;
  height: 550px;
  border: 1px solid rgb(245, 218, 169);
}
.right {
  width: 30%;
  height: 80%;

  float: left;
  height: 550px;
}
.right-top {
  height: 92%;
  border: 1px solid rgb(245, 218, 169);
  margin: 0 0 1% 0;
}
.right-bottom {
  height: 7%;
  border: 1px solid rgb(245, 218, 169);
}
.bottom {
  width: 100%;
  height: 60px;
  border: 1px solid rgb(245, 218, 169);
  float: left;
}
</style>
