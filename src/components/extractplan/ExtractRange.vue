<script>
import DefaultRange from './DefaultRange';
import BlockRange from './BlockRange';
import SheetRange from './SheetRange';
import CoordRange from './CoordRange';

//范围类型
const SPLACE_TYPES = [
  {
    name: 'defaultCtrl',
    title: '默认',
    value: -1,
    component: 'DefaultRange',
  },
  {
    name: 'blockCtrl',
    title: '行政区',
    value: 0,
    component: 'BlockRange',
  },
  {
    name: 'sheetCtrl',
    title: '图幅范围',
    value: 1,
    component: 'SheetRange',
  },
  {
    name: 'coordCtrl',
    title: '坐标文件',
    value: 2,
    component: 'CoordRange',
  },
];

/*
 * 选择提取范围模块
 */
export default {
  name: 'ExtractRange',
  components: {
    DefaultRange,
    BlockRange,
    SheetRange,
    CoordRange,
  },
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
      //范围类型
      splaceTypes: [],
    };
  },
  created() {
    //影像没有默认范围
    if (this.extractMode == 1) {
      this.splaceTypes = SPLACE_TYPES.filter(p => p.component != 'DefaultRange');
    } else {
      this.splaceTypes = [...SPLACE_TYPES];
    }
  },
  methods: {
    //获取当前选择的部件
    getCurPart() {
      let part = this.splaceTypes.find(p => p.value == this.model.splacetype);
      return this.$refs[part.name][0];
    },
    //校验步骤
    async validateStep() {
      let partCtrl = this.getCurPart();
      return partCtrl.validateRange();
    },
    //获取步骤数据
    getStepData() {
      let partCtrl = this.getCurPart();
      let rangeData = partCtrl.getExtractRange();
      rangeData.updateType = !!this.model.planid ? 1 : 0;
      return rangeData;
    },
  },
};
</script>

<template>
  <div class="extract-range-wrapper">
    <div class="region-wrapper">
      <div class="region-header">
        <h4 class="region-title">提取范围</h4>
      </div>
      <div class="region-content">
        <div class="range-selectors">
          <RadioGroup v-model="model.splacetype">
            <Radio
              v-for="item in splaceTypes"
              :key="item.name"
              :label="item.value">
              <span>{{ item.title }}</span>
            </Radio>
          </RadioGroup>
        </div>
        <div class="range-content">
          <div
            v-for="item in splaceTypes"
            v-show="item.value==model.splacetype"
            :key="item.key"
            class="range-item">
            <component
              :is="item.component"
              :ref="item.name"
              :extract-mode="item.extractMode"
              :model="model">
            </component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.extract-range-wrapper {
  .range-content {
    margin-top: 13px;
    border-top: 1px dashed #eeeeee;
  }
  .range-item {
    padding: 5px 0;
  }
  .form-row {
    line-height: 36px;
    margin-bottom: 10px;
  }
  .form-label {
    margin-left: 10px;
  }
  .inline-upload {
    display: inline;
  }
  .range-selectors {
    margin: 5px 0 0 10px;
  }
}
</style>
