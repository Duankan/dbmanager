<script>
export default {
  name: 'MapEdit',
  props: {
    layerS: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      style: '', //看下拉框选择的图层是点线面那个类型的图层
      labelName: '', //label 根据下拉框选择的类型来指定是面样式，点样式等
      select: '', //看选择的是 面样式 高级 还是选择样式
      showhead: '',
    };
  },
  watch: {
    style(newVal) {
      let style = newVal.split(',');
      console.log(newVal);

      if (style[1] == 'polygon' || style[1] == 'jyuy') {
        this.labelName = '面样式';
      }
      if (style[1] == 'point') {
        this.labelName = '点样式';
      }
      if (style[1] == 'line') {
        this.labelName = '线样式';
      }

      this.showhead = 'true';
    },
  },
  created() {
    console.log(this.layerS);
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
        <FormItem label="选择图层:" >
          <Select
            v-model="style"
            style="width:200px">
            <Option
              v-for="item in layerS"
              :value="item.name+','+item.styles"
              :key="item.name">{{ item.name }}</Option>
          </Select>

          <RadioGroup
            v-show="showhead"
            v-model="select"
            type="button">
            <Radio
              :label="labelName"
            ></Radio>
            <Radio label="高级"></Radio>
            <Radio label="选择样式"></Radio>
          </RadioGroup>

        </FormItem>
        <Button @click="text">Default</Button>


      </Form>
    </div>
    <div class="right">
      aaaaaa

    </div>

  </div>

</template>

<style lang="less" scoped>
.main {
  width: 50%;
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
