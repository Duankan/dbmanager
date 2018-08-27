<script>
/*
 * 提取格式
 */
export default {
  name: 'ExtractFormat',
  props: {
    //提取模式：0：矢量提取，1：影像提取
    extractMode: {
      type: Number,
      default: 0,
    },
    //绑定数据
    model: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      //输出格式
      formats: [
        {
          name: 'Shape格式',
          value: 'SHAPE-ZIP',
        },
        {
          name: 'GDB格式',
          value: 'GDB',
        },
      ],
    };
  },
  methods: {
    //步骤校验
    async validateStep() {
      return true;
    },
    //获取步骤数据
    getStepData() {
      return {};
    },
  },
};
</script>
<template>
  <div class="extract-format-wrapper">
    <div class="region-wrapper">
      <div class="region-header">
        <h4 class="region-title">提取格式</h4>
      </div>
      <div class="region-content">
        <RadioGroup v-model="model.outputformat">
          <Radio
            v-for="item in formats"
            :key="item.name"
            :label="item.value">
            <span>{{ item.name }}</span>
          </Radio>
        </RadioGroup>
      </div>
    </div>
  </div>
</template>
<style lang="less">
.extract-format-wrapper {
  .k-radio-group {
    margin: 5px 10px;
  }
  .k-radio-wrapper {
    margin-left: 8px;
  }
}
</style>
