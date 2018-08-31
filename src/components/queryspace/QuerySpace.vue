<script>
import QueryBase from '../querybase/querybase.js';
import DrawTools from '../drawtools/DrawTools';
import AreaSelect from '../areaselect/AreaSelect';
import config from 'config';

export default {
  name: 'QuerySpace',
  components: { DrawTools, AreaSelect },
  mixins: [QueryBase],
  props: {},
  data() {
    return {
      // 表单参数
      serviseUrl: '',
      queryItem: {
        layers: '',
        buffer: 0,
        bufferUnit: '米',
        place: '',
        relationship: 'Intersects',
        geometry: null,
      },
      // 表单验证
      ruleValidate: {
        layers: [{ required: true, message: '请选择一个图层！', trigger: 'change' }],
      },
      // 功能参数
      layerData: [],
      layerCrs: null,
      schema: 'the_geom',
      queryAreaUrl: '',
      drawType: 'normal',
      queryUrl: '',
    };
  },
  computed: {
    setUnits() {
      const unit = [{ name: '米', value: 'meters' }, { name: '千米', value: 'kilometers' }];
      const getUnit = unit.filter(item => item.name === this.queryItem.bufferUnit);
      return getUnit[0].value;
    },
    hasLayer() {
      return this.queryItem.layers !== '';
    },
  },
  methods: {
    //拿到绘制的图形
    getDrawLayer(layers, adverse, oppoAdverse) {
      this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'always' });
      this.queryItem.place = '';
      this.queryItem.geometry = layers;
      this.advWKT = adverse;
      this.oppoAdvWKT = oppoAdverse;
      this.$refs.areaSelect.resetCascader();
    },
    getAreaLayer(wkt, adverse) {
      this.$refs.drawTools.clearToolLayer();
      this.queryItem.geometry = null;
      this.queryItem.place = wkt;
      this.advWKT = adverse;
      if (wkt === '') this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'always' });
    },
    selectLayer(layerData) {
      if (layerData.value !== '' && layerData.label !== '') {
        this.serviseUrl = layerData.value;
        const url = new URL(this.serviseUrl);
        this.queryUrl = url.origin + '/hgis/ows';
        // 过滤字段
        if (this.layerData.length !== 0) {
          const totalParams = this.layerData.filter(item => item.title === layerData.label);
          this.fieldList = this.getColums(totalParams[0].schema);
          this.layerCrs = totalParams[0].crs;
          this.fieldList.forEach(item => {
            this.schema = this.schema + ',' + item.title;
          });
          this.queryAreaUrl = layerData.value;
          this.queryName = totalParams[0].label;
        }
      }
    },
    // 发起请求
    startQuery() {
      if (this.queryItem.layers === '') {
        this.$Message.error('请选择一个图层');
        return;
      }
      this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'once' });
      const params = this.getParams();
      this.showTable(this.fieldList, params, 'wfsQuery');
    },
    // 处理参数
    getParams() {
      let queryOptions;
      const options = {
        title: `${this.queryName}`,
        pageIndex: 1,
        pageSize: 10,
        url: this.serviseUrl,
      };
      // 计算radius的值
      const radius = this.setRadius();

      const defaultOptions = {
        radius,
        spatialRelationship: this.queryItem.relationship,
        type: 'POST',
      };
      queryOptions = this.setRelationship();
      queryOptions = {
        ...defaultOptions,
        ...queryOptions,
      };

      return {
        options,
        queryOptions,
      };
    },
    // 计算半径
    setRadius() {
      let radius;
      if (this.queryItem.bufferUnit === '米') {
        radius = this.queryItem.buffer / 111194.872221777;
      }
      return radius;
    },
    // 计算提取方式
    setRelationship() {
      let queryOptions;
      if (this.queryItem.relationship === 'Clip') {
        if (this.queryItem.place === '') {
          queryOptions = {
            clipGeometry: this.queryItem.geometry,
            clip: true,
          };
        } else {
          queryOptions = {
            clipGeometry: this.queryItem.place,
            clip: true,
          };
        }
      } else {
        if (this.queryItem.place === '') {
          queryOptions = {
            geometry: this.queryItem.geometry,
            clip: false,
          };
        } else {
          queryOptions = {
            geometry: this.queryItem.place,
            clip: false,
          };
        }
      }
      return { ...queryOptions };
    },
    // 数据提取
    async loadQueryData() {
      if (this.queryItem.layers === '') {
        this.$Message.error('请选择一个图层！');
        return;
      }
      // if (!this.queryItem.geometry) {
      //   this.$Message.error('请绘制一个范围！');
      //   return;
      // }
      const loadParams = this.setLoadPrams();
      const response = await api.db.batchwebrequest([loadParams]);
      window.open(`${config.project.basicUrl}/data/download/tempfile?path=${response.data}`);
    },
    // 参数处理
    setLoadPrams() {
      let loadParams;
      const params = this.getParams();
      const name = this.queryName.split(':');
      const queryPram = new L.QueryParameter.WfsQueryParameter({
        ...params.options,
        ...params.queryOptions,
        propertyName: this.schema,
        typeName: this.queryName,
        outputFormat: 'shape-zip',
        srsName: this.layerCrs,
      });
      const queryTack = new L.QueryTask(queryPram);
      let taskData = queryTack._queryParameter.options.data;
      delete taskData.pageIndex;
      delete taskData.pageSize;
      taskData.version = '1.0.0';
      if (this.advWKT && this.queryItem.relationship != 'Clip') {
        taskData.cql_filter = `${this.queryItem.relationship}(the_geom,${this.advWKT})`;
      } else {
        taskData.geometry = this.advWKT;
      }

      loadParams = {
        params: taskData,
        fileName: `${name[1]}.zip`,
        url: this.queryUrl,
      };
      return loadParams;
    },
    reset() {
      this.serviseUrl = '';
      this.$refs['dbqueryspace'].resetFields();
      this.queryItem.bufferUnit = '米';
      // 重置绘制操作
      this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'always' });
      this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'once' });
      this.queryItem.place = '';
      this.$refs.drawTools.clearToolLayer();
      this.queryItem.geometry = null;
      this.$refs.areaSelect.resetCascader();
    },
  },
};
</script>

<template>
  <Form
    ref="dbqueryspace"
    :model="queryItem"
    :label-width="100"
    :label-position="'left'"
    :rules="ruleValidate">
    <FormItem
      label="选择图层："
      prop="layers">
      <Select
        v-model="queryItem.layers"
        :not-found-text="'请添加一个图层！'"
        label-in-value
        @on-change="selectLayer">
        <Option
          v-for="(item,index) in layerData"
          :value="item.servicesurl"
          :key="index">{{ item.title }}</Option>
      </Select>
    </FormItem>
    <FormItem
      label="设置缓冲范围："
      class="db-query-buffer"
      prop="buffer"
    >
      <Slider v-model="queryItem.buffer"></Slider>
      <Select v-model="queryItem.bufferUnit">
        <Option value="米">米</Option>
        <Option value="千米">千米</Option>
      </Select>
    </FormItem>
    <FormItem
      label="选择行政区："
      prop="place">
      <AreaSelect
        ref="areaSelect"
        v-model="queryItem.place"
        :wfs-url="queryAreaUrl"
        @on-get-arealayer="getAreaLayer"
      ></AreaSelect>
    </FormItem>
    <FormItem
      label="绘制方式：">
      <DrawTools
        ref="drawTools"
        :layer-url="queryUrl"
        :layer-crs="layerCrs"
        :radius="queryItem.buffer"
        :units="setUnits"
        :disabled="!hasLayer"
        @on-get-drawlayer="getDrawLayer"></DrawTools>
    </FormItem>
    <FormItem
      label="提取方式："
      prop="relationship">
      <RadioGroup v-model="queryItem.relationship">
        <Radio label="Intersects">相交</Radio>
        <Radio label="Within">包含</Radio>
        <Radio label="Clip">裁切</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem>
      <Button
        type="primary"
        @click="startQuery">查询</Button>
      <Button
        type="success"
        @click="loadQueryData">数据提取</Button>
      <Button
        type="ghost"
        @click="reset"
      >重置</Button>
    </FormItem>
  </Form>
</template>

<style lang="less" scoped>
.k-form-item {
  margin-bottom: 15px;

  /deep/.k-form-item-label {
    width: 100px;
  }
}

.k-form {
  .db-query-buffer {
    .k-slider {
      margin-right: 5%;
      width: 60%;
      float: left;
    }
    .k-select {
      width: 35%;
      float: left;
    }
  }
}
</style>
