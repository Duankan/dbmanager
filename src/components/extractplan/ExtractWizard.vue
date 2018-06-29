<script>
import SelectResource from './SelectResource';
import FilterResource from './FilterResource';
import ExtractRange from './ExtractRange';

//向导步骤列表
const WIZARD_STEPS = [
  {
    name: '选择资源',
    component: 'SelectResource',
  },
  {
    name: '提取过滤',
    component: 'FilterResource',
  },
  {
    name: '提取范围',
    component: 'ExtractRange',
  },
];

/*
 * 自定义方案提取向导
 */
export default {
  name: 'ExtractWizard',
  components: {
    SelectResource,
    FilterResource,
    ExtractRange,
  },
  props: {
    //提取模式：0：矢量提取，1：影像提取
    extractMode: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      //向导步骤列表
      steps: [],
      //当前步骤
      current: 0,
    };
  },
  created() {
    //影像没有过滤步骤
    if (this.extractMode == 1) {
      this.steps = WIZARD_STEPS.filter(p => p.component != 'FilterResource');
    } else {
      this.steps = [...WIZARD_STEPS];
    }
  },
  methods: {
    nextStep() {
      this.current++;
    },
    prevStep() {
      this.current--;
    },
  },
};
</script>
<template>
  <div class="extract-wizard-wrapper">
    <div class="step-header">
      <Steps
        :current="current">
        <Step
          v-for="item in steps"
          :key="item.name"
          :title="item.name"></Step>
      </Steps>
    </div>
    <div class="step-content">
      <div
        v-for="(item,index) in steps"
        v-if="index==current"
        :key="item.name">
        <component
          :is="item.component"
          :extract-mode="extractMode"></component>
      </div>
    </div>
    <div class="step-footer">
      <Button
        v-show="current>0"
        type="primary"
        @click="prevStep">上一步</Button>
      <Button
        v-show="current<steps.length-1"
        type="primary"
        @click="nextStep">下一步</Button>
      <Button
        v-show="current==steps.length-1"
        type="success">完成</Button>
      <Button type="ghost">取消</Button>
    </div>
  </div>
</template>

<style lang="less">
.extract-wizard-wrapper {
  .region-wrapper {
    margin-bottom: 10px;
    border: 1px solid #eeeeee;
    border-radius: 2px;
  }
  .region-header {
    padding: 6px 12px;
    border-bottom: 1px solid #eeeeee;
  }
  .region-title {
    color: #666666;
  }
  .region-content {
    padding: 5px;
  }
  .step-header {
    padding: 5px 10px 5px 40px;
  }
  .step-content {
    margin-top: 10px;
  }
  .step-footer {
    text-align: right;
  }
}
</style>
