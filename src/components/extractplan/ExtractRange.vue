<script>
import BlockRange from './BlockRange';
import SheetRange from './SheetRange';
import CoordRange from './CoordRange';

/*
 * 选择提取范围模块
 */
export default {
  name: 'ExtractRange',
  components: {
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
  },
  data() {
    return {
      //范围类型，-1：默认全图；0:代表行政区；1:代表图幅范围；2:代表坐标范围；
      splaceType: '0',
      model: null,
    };
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
          <RadioGroup v-model="splaceType">
            <Radio label="-1">
              <span>默认</span>
            </Radio>
            <Radio label="0">
              <span>行政区</span>
            </Radio>
            <Radio label="1">
              <span>图幅范围</span>
            </Radio>
            <Radio label="2">
              <span>坐标文件</span>
            </Radio>
          </RadioGroup>
        </div>
        <div class="range-content">
          <div
            v-show="splaceType=='-1'"
            class="range-item">
          </div>
          <div
            v-show="splaceType=='0'"
            class="range-item">
            <BlockRange
              :extract-mode="extractMode"
              :model="model">
            </BlockRange>
          </div>
          <div
            v-show="splaceType=='1'"
            class="range-item">
            <SheetRange
              :extract-mode="extractMode"
              :model="model">
            </SheetRange>
          </div>
          <div
            v-show="splaceType=='2'"
            class="range-item">
            <CoordRange
              :extract-mode="extractMode"
              :model="model">
            </CoordRange>
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
