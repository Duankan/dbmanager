<script>
import QueryBase from '../querybase/querybase.js';
import DrawTools from '../drawtools/DrawTools';
import { CitySelect } from '@ktw/kbus';
import config from 'config';
import * as filterConfig from '../statistics/utils.js';

const stringCompare = [
  {
    value: '=',
    label: '等于',
  },
  {
    value: '<>',
    label: '不等于',
  },
  {
    value: 'LIKE',
    label: '包含',
  },
];
const numberCompare = [
  {
    value: '=',
    label: '等于',
  },
  {
    value: '<>',
    label: '不等于',
  },
  {
    value: '>',
    label: '大于',
  },
  {
    value: '<',
    label: '小于',
  },
];
export default {
  name: 'QueryCompound',
  components: { DrawTools, CitySelect },
  mixins: [QueryBase],
  props: {},
  data() {
    return {
      serviseUrl: '',
      queryItem: {
        layers: '',
        buffer: 0,
        bufferUnit: '米',
        place: '',
        relationship: 'Intersects',
        geometry: null,
      },
      layerData: [],
      layerCrs: null,
      schema: 'the_geom',
      //这个是属性查询需要的参数
      schema2: [],
      field: '',
      compareList: [],
      condition: '"长度" > 70000', //这个是属性查询拼的字符串
    };
  },
  methods: {
    getDrawLayer(layers) {
      this.queryItem.geometry = layers;
    },
    //这个是给选择字段赋值
    filterCommonField() {
      if (this.allschema) {
        this.schema2 = filterConfig.filterClassic(this.allschema, 'classify');
        this.schema2 = this.schema2.filter(item => !this.commonParams.includes(item.name));
      }
    },
    //这个是给比较符号辅助赋值   console.log(this.field);
    comparesymbol(data) {
      const type = data.slice(0, 6);
      this.compareList = [];
      if (type == 'String') {
        this.compareList = stringCompare;
      } else {
        this.compareList = numberCompare;
      }
    },

    selectLayer(layerData) {
      if (this.layerData.length !== 0) {
        const totalParams = this.layerData.filter(item => item.label === layerData.label);
        this.allschema = totalParams[0].schema;
        this.filterCommonField();
      }

      if (layerData.value !== '' && layerData.label !== '') {
        this.serviseUrl = layerData.value;
        const url = new URL(this.serviseUrl);
        this.queryUrl = url.origin + '/master/ows';
        // 过滤字段
        if (this.layerData.length !== 0) {
          const totalParams = this.layerData.filter(item => item.label === layerData.label);
          this.fieldList = this.getColums(totalParams[0].schema);
          this.layerCrs = totalParams[0].crs;
          totalParams[0].schema.forEach(item => {
            this.schema = this.schema + ',' + item.name;
          });
        }
      }
    },
    // 发起请求
    startQuery() {
      if (this.queryItem.layers === '') {
        this.$Message.error('请选择一个图层');
        return;
      }
      const params = this.getParams();

      //params.queryOptions.cql_filter = this.condition;
      console.log(params);
      this.showTable(this.fieldList, params);
    },
    // 处理参数
    getParams() {
      const options = {
        title: '空间查询',
        pageIndex: 1,
        pageSize: 10,
        url: this.serviseUrl,
      };
      const queryOptions = {
        radius:
          this.queryItem.bufferUnit === '米'
            ? this.queryItem.buffer / 111194.872221777
            : this.queryItem.buffer / 111194.872221777,
        spatialRelationship: this.queryItem.relationship,
        geometry: this.queryItem.geometry,
        cql_filter: '"AREA" > 70000',
      };
      //设置属性的参数传递
      return {
        options,
        queryOptions,
      };
    },
    reset() {
      this.serviseUrl = '';
      this.queryItem = {
        layers: '',
        buffer: 0,
        bufferUnit: '米',
        place: '',
        relationship: 'Intersects',
        geometry: null,
      };
    },
    // 数据提取
    async loadQueryData() {
      if (this.queryItem.layers === '') {
        this.$Message.error('请选择一个图层！');
        return;
      }
      if (!this.queryItem.geometry) {
        this.$Message.error('请绘制一个范围！');
        return;
      }
      const loadParams = this.setLoadPrams();

      const response = await api.db.batchwebrequest([loadParams]);
      window.open(`${config.project.basicUrl}/data/download/tempfile?path=${response.data}`);
    },
    // 参数处理
    setLoadPrams() {
      let loadParams;
      const params = this.getParams();
      const queryPram = new L.QueryParameter.WfsQueryParameter({
        ...params.options,
        ...params.queryOptions,
        propertyName: this.schema,
      });
      const queryTack = new L.QueryTask(queryPram);
      loadParams = {
        params: queryTack._queryParameter.options.data,
        fileName: 'datamanager.zip',
        url: this.queryUrl,
      };
      return loadParams;
    },
  },
};
</script>

<template>
  <Form
    :model="queryItem"
    :label-width="100"
    :label-position="'left'"
  >
    <FormItem
      label="选择图层：">
      <Select
        v-model="queryItem.layers"
        :not-found-text="'请添加一个图层！'"
        label-in-value
        @on-change="selectLayer">
        <Option
          v-for="(item,index) in layerData"
          :value="item.servicesurl"
          :key="index">{{ item.label }}</Option>
      </Select>
    </FormItem>

    <FormItem
      label="选择条件："
      style="    height: 90px;">

      <div style="width: 100%;">

        <div style=" width: 50%;">
          <Select
            v-model="field"
            size="small"
            placeholder="请选择字段"
            @on-change="comparesymbol(field)">
            <Option
              v-for="(item,index) in schema2"
              :value="item.type+index"
              :key="index"
            >{{ item.name }}</Option>
          </Select>
        </div>
        <div
          style=" width: 35%;
           position: absolute;
           top: 0%;
           right: 0%;">
          <Select
            size="small"

            placeholder="比较符">
            <Option
              v-for="item in compareList"
              :value="item.value"
              :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>

        <div
          style="width: 50%;
    position: absolute;
    top: 50px;
    left: 0%;">
          <Input
            size="small"
            type="text"
            placeholder="比较值"></Input>
        </div>

        <div
          style="width: 30%;
    position: absolute;
    top: 50px;
    left: 55%;">
          <Select
            size="small"
            placeholder="逻辑符"
          >
            <Option
              selected = "selected"
              value="且">且</Option>
            <Option
              value="或">或</Option>
          </Select>
        </div>

        <div
          style="
    position: absolute;
    top: 50px;
    right: 0%;">
          <Icon
            type="ios-plus-outline"
            size="29"
          ></Icon>
        </div>



      </div>





    </FormItem>


    <FormItem
      label="设置缓冲范围："
      class="db-query-buffer">
      <Slider v-model="queryItem.buffer"></Slider>
      <Select v-model="queryItem.bufferUnit">
        <Option value="米">米</Option>
        <Option value="千米">千米</Option>
      </Select>
    </FormItem>
    <FormItem label="选择行政区：">
      <CitySelect v-model="queryItem.place"></CitySelect>
    </FormItem>
    <FormItem label="绘制方式：">
      <DrawTools
        :layer-crs="layerCrs"
        @on-get-drawlayer="getDrawLayer"></DrawTools>
    </FormItem>
    <FormItem label="提取方式：">
      <RadioGroup v-model="queryItem.relationship">
        <Radio label="Intersects">相交</Radio>
        <Radio label="Contains">包含</Radio>
        <Radio label="female">裁切</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem>
      <Button
        type="primary"
        @click="startQuery">查询</Button>
      <Button
        type="primary"
        @click="loadQueryData">数据提取</Button>
      <Button
        type="ghost"
        @click="reset"
      >重置</Button>
    </FormItem>
  </select></formitem></Form>
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
