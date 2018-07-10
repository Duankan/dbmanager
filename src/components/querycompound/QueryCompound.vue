<script>
import QueryBase from '../querybase/querybase.js';
import DrawTools from '../drawtools/DrawTools';
import AreaSelect from '../areaselect/AreaSelect';
import config from 'config';
import * as filterConfig from '../statistics/utils.js';
import * as types from '@/store/types';

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
  name: 'QuerySpace',
  components: { DrawTools, AreaSelect },
  mixins: [QueryBase],
  props: {},
  data() {
    return {
      formDynamic: {
        items: [
          {
            field: '',
            fieldType: '',
            compare: '',
            compareList: [],
            value: '',
            logic: 'AND',
          },
        ],
      },
      fieldList2: [],
      logicList: [
        {
          value: 'AND',
          label: '且',
        },
        {
          value: 'OR',
          label: '或',
        },
      ],
      //空间的参数
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
      queryAreaUrl: '',
    };
  },
  computed: {
    setUnits() {
      const unit = [{ name: '米', value: 'meters' }, { name: '千米', value: 'kilometers' }];
      const getUnit = unit.filter(item => item.name === this.queryItem.bufferUnit);
      return getUnit[0].value;
    },
  },
  methods: {
    filterCommonField() {
      if (this.allschema) {
        this.fieldList2 = filterConfig.filterClassic(this.allschema, 'classify');
        this.fieldList2 = this.fieldList2.filter(item => !this.commonParams.includes(item.name));
      }
    },
    comparesymbol(data) {
      const type = data.slice(0, 6);
      this.compareList = [];
      if (type == 'String') {
        this.formDynamic.items.compareList = stringCompare;
      } else {
        this.formDynamic.items.compareList = numberCompare;
      }
    },
    compareChange(compare) {},
    logicChange(logic) {},
    //增加一组查询条件
    handleAdd(item) {
      if (this.formDynamic.items.length > 5) {
        this.$Message.info('属性查询最多指定6个字段！');
        return;
      }
      const index = this.formDynamic.items.findIndex(node => node === item);
      this.formDynamic.items.splice(index + 1, 0, {
        field: '',
        fieldType: '',
        compare: '',
        compareList: [],
        value: '',
        logic: 'AND',
      });
    },
    //删除一组查询条件
    handleRemove(item) {
      const index = this.formDynamic.items.findIndex(node => node === item);
      this.formDynamic.items.splice(index, 1);
    },
    //字段选择事件
    fieldChange(item) {
      const type = item.field.slice(0, 6);
      this.compareList = [];
      if (type == 'String') {
        item.compareList = stringCompare;
      } else {
        item.compareList = numberCompare;
      }
    },
    getCondition(items) {
      let cql = '';
      for (let i = 0; i < items.length; i++) {
        if (items[i].value || items[i].field || items[i].compare) {
          const fields = items[i].field.split(':');
          if (fields.length == 2) {
            items[i].field = fields[1];
          } else {
            items[i].field = fields[0];
          }
          if (items[i].field === '' || items[i].compare === '' || items[i].value === '') continue;
          cql += ` ${i >= 1 ? items[i - 1].logic : ''} "${items[i].field}" ${items[i].compare} ${
            items[i].compare === 'LIKE'
              ? "'%"
              : items[i].fieldType.toLowerCase() === 'double'
                ? ''
                : "'"
          }${items[i].value}${
            items[i].compare === 'LIKE'
              ? "%'"
              : items[i].fieldType.toLowerCase() === 'double'
                ? ''
                : "'"
          }`;
        } else {
          break;
        }
      }
      return cql.trim();
    },

    //下面是空间查询的方法
    getDrawLayer(layers, adverse) {
      this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'always' });
      this.queryItem.place = '';
      this.queryItem.geometry = layers;
      this.advWKT = adverse;
      this.$refs.areaSelect.resetCascader();
    },
    // 获取行政区
    getAreaLayer(wkt, adverse) {
      this.$refs.drawTools.clearToolLayer();
      this.queryItem.geometry = null;
      this.queryItem.place = wkt;
      this.advWKT = adverse;
      if (wkt === '') this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'always' });
    },
    selectLayer(layerData) {
      if (this.layerData.length !== 0) {
        const totalParams = this.layerData.filter(item => item.label === layerData.label);
        this.allschema = totalParams[0].schema;
        this.filterCommonField();
      }

      if (layerData.value !== '' && layerData.label !== '') {
        this.queryAreaUrl = layerData.value;
        this.serviseUrl = layerData.value;
        const url = new URL(this.serviseUrl);
        this.queryUrl = url.origin + '/hgis/ows';
        // 过滤字段
        if (this.layerData.length !== 0) {
          const totalParams = this.layerData.filter(item => item.label === layerData.label);
          this.fieldList = this.getColums(totalParams[0].schema);
          this.layerCrs = totalParams[0].crs;
          this.fieldList.forEach(item => {
            this.schema = this.schema + ',' + item.title;
          });
        }
        this.queryName = layerData.label;
      }
    },
    // 发起请求
    startQuery(name) {
      if (this.queryItem.layers === '') {
        this.$Message.error('请选择一个图层');
        return;
      }
      const params = this.getParams();
      this.showTable(this.fieldList, params, 'wfsQuery');
    },
    // 处理参数
    getParams() {
      let queryOptions;
      const options = {
        title: '复合查询',
        pageIndex: 1,
        pageSize: 10,
        url: this.serviseUrl,
      };
      const defaultOptions = {
        radius:
          this.queryItem.bufferUnit === '米'
            ? this.queryItem.buffer / 111194.872221777
            : this.queryItem.buffer / 111194.872221777,
        spatialRelationship: this.queryItem.relationship,
        type: 'POST',
      };

      const cql_filter = this.setCQLFilter(true);
      queryOptions = {
        ...defaultOptions,
        cql_filter,
      };
      return {
        options,
        queryOptions,
      };
    },
    // 合并cql_filter
    setCQLFilter(isGetCqlFilter) {
      let queryCQLFilter;
      const items = this.$refs['formDynamic'].model.items;
      let CQLFilter = this.getCondition(items);
      if (CQLFilter.substr(0, 3) == 'AND') CQLFilter = CQLFilter.slice(3);
      if (this.queryItem.place === '') {
        if (this.queryItem.geometry) {
          let geometrys = this.queryItem.geometry.toGeoJSON();
          let wktStr = L.Wkt.Wkt.prototype.fromObject(geometrys.geometry, false);
          wktStr = wktStr.write();
          wktStr = wktStr.replace(/undefined/g, ' ');
          queryCQLFilter = CQLFilter
            ? CQLFilter + 'and' + ' ' + this.queryItem.relationship + '(the_geom, ' + wktStr + ')'
            : '' + ' ' + this.queryItem.relationship + '(the_geom, ' + wktStr + ')';
        } else {
          if (CQLFilter) {
            queryCQLFilter = CQLFilter;
          }
        }
      } else {
        queryCQLFilter = CQLFilter
          ? CQLFilter + 'and' + ` ${this.queryItem.relationship}(the_geom,${this.queryItem.place})`
          : '' + ` ${this.queryItem.relationship}(the_geom,${this.queryItem.place})`;
      }
      if (!isGetCqlFilter) {
        return CQLFilter;
      } else {
        return queryCQLFilter;
      }
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
      this.formDynamic.items = [
        {
          field: '',
          fieldType: '',
          compare: '',
          compareList: [],
          value: '',
          logic: 'AND',
        },
      ];
      // 重置绘制操作
      this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'always' });
      this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'once' });
      this.queryItem.place = '';
      this.$refs.drawTools.clearToolLayer();
      this.queryItem.geometry = null;
      this.$refs.areaSelect.resetCascader();
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
      debugger;
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
      const cqlfilter = this.setCQLFilter(false);
      if (this.advWKT) {
        taskData.cql_filter = cqlfilter
          ? cqlfilter +
            'and' +
            ' ' +
            this.queryItem.relationship +
            '(the_geom, ' +
            this.advWKT +
            ')'
          : '' + ' ' + this.queryItem.relationship + '(the_geom, ' + this.advWKT + ')';
      }
      loadParams = {
        params: taskData,
        fileName: `${name[1]}.zip`,
        url: this.queryUrl,
      };
      return loadParams;
    },
  },
};
</script>

<template>
  <Form
    ref="formDynamic"
    :model="formDynamic"
    :label-width="100"
    :label-position="'left'"
  >
    <FormItem
      label="选择图层：">
      <Select
        v-model="queryItem.layers"
        :not-found-text="'请添加一个图层！'"
        transfer
        label-in-value
        @on-change="selectLayer">
        <Option
          v-for="(item,index) in layerData"
          :value="item.servicesurl"
          :key="index">{{ item.label }}</Option>
      </Select>
    </FormItem>
    <FormItem label="查询条件：">
      <Row class="condition">
        <FormItem
          v-for="(item, index) in formDynamic.items"
          :key="index"
        >
          <Form
            ref="formInline"
            inline>
            <FormItem
              prop="user"
              style="width: 130px">
              <Select
                v-model="item.field"
                transfer
                class="left"
                size="small"
                placeholder="请选择字段"
                @on-change="fieldChange(item)"
              >
                <Option
                  v-for="item in fieldList2"
                  :value="item.type+':'+item.name"
                  :key="item.name"
                >{{ item.name }}
                </Option>
              </Select>
            </FormItem>
            <FormItem
              style="width: 80px"
            >
              <Select
                v-model="item.compare"
                transfer
                class="right"
                size="small"
                placeholder="比较符"
              >
                <Option
                  v-for="item in item.compareList"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <Icon
              type="ios-plus-outline"
              size="25"
              @click.native.stop="handleAdd(item)"></Icon>
          </Form>
          <Form
            ref="formInline"
            inline>
            <FormItem
              style="width: 130px"
            >
              <Input
                v-model="item.value"
                class="left"
                size="small"
                type="text"
                placeholder="比较值"></Input>
            </FormItem>
            <FormItem>
              <Select
                v-model="item.logic"
                transfer
                class="right"
                size="small"
                style="width: 80px"
                placeholder="逻辑符"
                @on-change="logicChange">
                <Option
                  v-for="item in logicList"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <Icon
              v-show="formDynamic.items.length > 1"
              type="ios-minus-outline"
              size="25"
              @click.native.stop="handleRemove(item)"></Icon>
          </Form>
      </formitem></Row>
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
      <AreaSelect
        ref="areaSelect"
        v-model="queryItem.place"
        :wfs-url="queryAreaUrl"
        @on-get-arealayer="getAreaLayer"
      ></AreaSelect>
    </FormItem>
    <FormItem label="绘制方式：">
      <DrawTools
        ref="drawTools"
        :layer-crs="layerCrs"
        :radius="queryItem.buffer"
        :units="setUnits"
        @on-get-drawlayer="getDrawLayer"></DrawTools>
    </FormItem>
    <FormItem label="提取方式：">
      <RadioGroup v-model="queryItem.relationship">
        <Radio label="Intersects">相交</Radio>
        <Radio label="Within">包含</Radio>
        <Radio label="Clip">裁切</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem>
      <Button
        type="primary"
        @click="startQuery('formDynamic')">查询</Button>
      <Button
        type="primary"
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
  margin-bottom: 10px;
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

.condition {
  height: auto;
  max-height: 155px;
  overflow-y: auto;
}
</style>
