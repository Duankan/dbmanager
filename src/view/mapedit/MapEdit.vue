<script>
export default {
  name: 'MapEdit',
  props: {
    value: { type: Object, default: () => {} },
  },
  data() {
    return {
      labelName: '',
    };
  },
  created() {
    if (this.value.msg.shapeType.toUpperCase() == 'POLYGON') {
      this.labelName = '面类型';
    }
    if (this.value.msg.shapeType.toUpperCase() == 'POINT') {
      this.labelName = '点类型';
    }
    if (this.value.msg.shapeType.toUpperCase() == 'LINESTRING') {
      this.labelName = '线类型';
    }
    if (this.value.msg.shapeType == 'polyline') {
      this.labelName = '线类型';
    }
  },
  methods: {
    text() {},
  },
};
</script>

<template>
  <div class="main">
    <div class="left">
      <Form
        :label-width="80"
        inline>
        <FormItem >


          <RadioGroup
            type="button">
            <Radio
              :label="labelName"
            ></Radio>
            <Radio label="高级"></Radio>
            <Radio label="选择样式"></Radio>
          </RadioGroup>

        </FormItem>



      </Form>
    </div>
    <div class="right">
      aaaaaa

    </div>

  </div>

</template>

<style lang="less" scoped>
.main {
  width: 100%;
}
.left {
  width: 70%;

  float: left;
  height: 100%;
}
.right {
  width: 30%;
  background-color: papayawhip;
  float: left;
  height: 100%;
}
</style>
