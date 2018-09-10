<script>
import QueryBase from '../querybase/querybase.js';
import DrawTools from '../drawtools/DrawTools';

export default {
  name: 'Overlay',
  components: { DrawTools },
  mixins: [QueryBase],
  props: {},
  data() {
    return {
      layerDataConfig: ['layerData1', 'layerData2'],
      layerData1: [],
      layerData2: [],
      overlayItem: {
        layer1: '',
        layer2: '',
        analysType: 'clip',
        outputType: 'input',
        computedModules: 'fullload',
        geometry: null,
        spaceRelation: 'Intersects',
      },
      // 表单验证
      ruleValidate: {
        layer1: [{ required: true, message: '请选择输入图层！', trigger: 'change' }],
        layer2: [{ required: true, message: '请选择叠加图层！', trigger: 'change' }],
      },
      analysType: [{ value: 'differ', label: '相交' }, { value: 'clip', label: '裁剪' }],
      outputType: [{ value: 'input', label: 'Input' }],
      computedModules: [{ value: 'fullload', label: '全负载' }],
      analysLoading: false,
      queryUrl: '',
    };
  },
  computed: {
    hasLayer() {
      return this.overlayItem.layer1 !== '' && this.overlayItem.layer2 !== '';
    },
  },
  methods: {
    selectLayer(layers) {
      // 字段查询
      if (layers.label !== '' && layers.value !== '') {
        let layerData;
        layerData = this.layerData1.filter(item => item.title === layers.label);
        const url = new URL(layerData[0].servicesurl);
        this.baseUrl = layerData[0].servicesurl;
        this.queryUrl = url.origin + '/hgis/ows';
      }
    },
    setParams() {
      const options = {
        title: '叠加分析',
        baseUrl: this.baseUrl,
        url: this.queryUrl,
      };
      let layers = [];
      for (const key in this.overlayItem) {
        if (key === 'layer1' || key === 'layer2') {
          if (this.overlayItem.geometry) {
            layers.push({
              typename: this.overlayItem[key],
              filter: `${this.overlayItem.spaceRelation}(the_geom,${this.overlayItem.geometry})`,
            });
          } else {
            layers.push({
              typename: this.overlayItem[key],
            });
          }
        }
      }
      const queryOptions = {
        RELLAYERS: {
          usegrid: '1',
          optype: this.overlayItem.analysType,
          tolerance: '0.000001',
          geombuffer: '0.000001',
          layers,
          // wkt: this.overlayItem.geometry,
        },
      };
      return {
        options,
        queryOptions,
      };
    },
    overLapAnalys() {
      this.$refs['analysform'].validate(async valid => {
        if (valid) {
          // 验证成功
          const isSameType = this.isSameType();
          if (isSameType) {
            const params = this.setParams();
            this.showTable([], params, 'overlayQuery');
          } else {
            this.$Message.error('系统暂只支持面与面的叠加分析！');
          }
        } else {
          this.$Message.error('请按要求填写表单！');
        }
      });
    },
    reset() {
      this.$refs['analysform'].resetFields();
      this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'once' });
      this.$refs.drawTools.clearToolLayer();
      this.overlayItem.geometry = null;
    },
    getDrawLayer(layers, adverse, oppoAdverse) {
      this.overlayItem.geometry = oppoAdverse;
    },
    // 判断分析的两个图层是否是一个类型
    isSameType() {
      const layersData1 = this.wfsLayerData[this.overlayItem.layer1];
      const layersData2 = this.wfsLayerData[this.overlayItem.layer2];
      // 首先判断是不是一个类型
      if (
        layersData1.resource.shapeType.toLowerCase() === 'polygon' &&
        layersData2.resource.shapeType.toLowerCase() === 'polygon'
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<template>
  <Form
    ref="analysform"
    :model="overlayItem"
    :label-width="100"
    :rules="ruleValidate"
    label-position="left">
    <FormItem
      label="输入图层："
      prop="layer1">
      <Select
        v-model="overlayItem.layer1"
        label-in-value
        @on-change="selectLayer">
        <Option
          v-for="(item,index) in layerData1"
          :value="item.label"
          :key="index">{{ item.title }}</Option>
      </Select>
    </FormItem>
    <FormItem
      label="叠加图层："
      prop="layer2">
      <Select
        v-model="overlayItem.layer2"
        label-in-value>
        <Option
          v-for="(item,index) in layerData2"
          :value="item.label"
          :key="index">{{ item.title }}</Option>
      </Select>
    </FormItem>
    <FormItem
      label="分析方式："
      prop="analysType">
      <Select
        v-model="overlayItem.analysType">
        <Option
          v-for="(item,index) in analysType"
          :value="item.value"
          :key="index">{{ item.label }}</Option>
      </Select>
    </FormItem>
    <FormItem
      label="输出类型："
      prop="outputType">
      <Select
        v-model="overlayItem.outputType"
      >
        <Option
          v-for="(item,index) in outputType"
          :value="item.value"
          :key="index">{{ item.label }}</Option>
      </Select>
    </FormItem>
    <FormItem
      label="计算模式："
      prop="computedModules">
      <Select
        v-model="overlayItem.computedModules"
      >
        <Option
          v-for="(item,index) in computedModules"
          :value="item.value"
          :key="index">{{ item.label }}</Option>
      </Select>
    </FormItem>
    <FormItem label="绘制方式：">
      <DrawTools
        ref="drawTools"
        :layer-url="queryUrl"
        :disabled="!hasLayer"
        @on-get-drawlayer="getDrawLayer"></DrawTools>
    </FormItem>
    <FormItem
      label="空间关系："
      prop="spaceRelation">
      <RadioGroup v-model="overlayItem.spaceRelation">
        <Radio label="Intersects">相交</Radio>
        <Radio label="Within">包含</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem>
      <Button
        :loading="analysLoading"
        type="primary"
        @click.native="overLapAnalys">分析</Button>
      <Button
        type="ghost"
        @click="reset"
      >重置</Button>
    </FormItem>
  </Form>
</template>

<style lang="less" scoped>
.k-form-item {
  margin-bottom: 18px;

  /deep/.k-form-item-label {
    width: 100px;
  }
}
/deep/.k-form-item-required .k-form-item-label:before {
  float: right;
}
</style>
