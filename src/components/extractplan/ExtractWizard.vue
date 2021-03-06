<script>
import SelectResource from './SelectResource';
import FilterResource from './FilterResource';
import ExtractRange from './ExtractRange';
import ExtractFormat from './ExtractFormat';

//向导步骤列表
const WIZARD_STEPS = [
  {
    name: 'selectCtrl',
    title: '选择资源',
    component: 'SelectResource',
  },
  {
    name: 'filterCtrl',
    title: '提取过滤',
    component: 'FilterResource',
  },
  {
    name: 'rangeCtrl',
    title: '提取范围',
    component: 'ExtractRange',
  },
  {
    name: 'formatCtrl',
    title: '提取格式',
    component: 'ExtractFormat',
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
    ExtractFormat,
  },
  props: {
    //提取模式：0：矢量提取，1：影像提取
    extractMode: {
      type: Number,
      default: 0,
    },
    //方案ID，设置此值则为编辑模式
    planId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      //向导步骤列表
      steps: [],
      //当前步骤
      current: 0,
      //是否是编辑模式
      isEdit: false,
      //方案数据绑定
      model: {
        //方案方式： 0为矢量数据提取；1为影像数据提取
        restype: this.extractMode,
        //方案名称
        planname: '',
        //输出格式,SHAPE-ZIP或GDB
        outputformat: 'SHAPE-ZIP',
        //方案创建者
        createperson: this.$appUser.id,
        //创建组织
        createorganization: this.$appUser.orgid,
        //方案指定组织
        applyorganization: this.$appUser.orgid,
        //提取资源列表
        schemalist: [],
        //范围类型，-1：默认全图；0:代表行政区；1:代表图幅范围；2:代表坐标范围
        splacetype: this.extractMode == 0 ? -1 : 0,
        //行政编码集合，或者图幅集合
        splacelist: [],
        //空间描述
        splaceremark: '',
        //与splacetype组合使用，如果是按行政区就填写行政级别，如果是图幅就填写比例尺
        extractlevel: 'City',
        //空间关系，0:代表裁剪；1代表相交；2:代表包含
        extract: 0,
        //坐标范围
        coordinate: null,
        //投影编号
        projid: null,
        //更新类型，0:更新时不更新空间范围及相关字段；1:根据参数条件重新生成空间范围
        updateType: 0,
      },
    };
  },
  created() {
    //影像没有过滤步骤和格式选择
    const filters = ['FilterResource', 'ExtractFormat'];
    if (this.extractMode == 1) {
      this.steps = WIZARD_STEPS.filter(p => filters.indexOf(p.component) < 0);
    } else {
      this.steps = [...WIZARD_STEPS];
    }
    this.initWizard();
  },
  methods: {
    //初始化步骤
    async initWizard() {
      this.isEdit = !!this.planId;
      if (!this.isEdit) return;
      const response = await api.db.findResourcePlanById({ id: this.planId });
      let planData = response.data;
      let schemaList = [];
      this.getResources(planData.openCatalog, schemaList);
      this.model.planid = this.planId;
      this.model.planname = planData.planname;
      this.model.schemalist = schemaList;
      this.model.extract = planData.spatialRange.extract;
      this.model.splacetype = planData.spatialRange.splacetype;
      this.model.splaceremark = planData.spatialRange.splacemark;
      this.model.rangeInfo = JSON.parse(planData.spatialRange.rangeInfo);
      this.model.outputformat = planData.outputFormat;
      this.model = { ...this.model };
    },
    //递归获取资源
    getResources(catalog, resources) {
      if (catalog.hasResources) {
        resources.push(...catalog.resources);
      }
      if (catalog.childs) {
        catalog.childs.forEach(item => {
          this.getResources(item, resources);
        });
      }
    },
    //步骤跳转
    async gotoStep(offset = 0) {
      let step = this.steps[this.current];
      let stepCtrl = this.$refs[step.name][0];
      //校验步骤
      let valid = await stepCtrl.validateStep();
      //应用步骤更改
      if (valid) {
        let data = stepCtrl.getStepData();
        Object.assign(this.model, data);
        this.current += offset;
      }
      return valid;
    },
    //新增或更新提取方案
    async completeExtractPlan() {
      const valid = await this.gotoStep();
      if (!valid) return;
      let saveResourceFun = api.db.addResourcePlan;
      if (this.isEdit) {
        delete this.model.rangeInfo;
        saveResourceFun = api.db.updateResourcePlan;
      }
      saveResourceFun(this.model).then(p => {
        this.$Message.success('保存提取方案成功！');
        this.$events.emit('close-plan-window');
      });
    },
    //关闭步骤控件
    closeWizard() {
      this.$events.emit('close-plan-window');
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
          :key="item.title"
          :title="item.title"></Step>
      </Steps>
    </div>
    <div class="step-content">
      <div
        v-for="(item,index) in steps"
        v-if="index==current"
        :key="item.name">
        <component
          :is="item.component"
          :extract-mode="extractMode"
          :model="model"
          :ref="item.name"></component>
      </div>
    </div>
    <div class="step-footer">
      <Button
        v-show="current>0"
        type="primary"
        @click="gotoStep(-1)">上一步</Button>
      <Button
        v-show="current<steps.length-1"
        type="primary"
        @click="gotoStep(1)">下一步</Button>
      <Button
        v-show="current==steps.length-1"
        type="success"
        @click="completeExtractPlan">完成</Button>
      <Button
        type="ghost"
        @click="closeWizard">取消</Button>
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
