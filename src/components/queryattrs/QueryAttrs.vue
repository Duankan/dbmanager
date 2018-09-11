<script>
import { debug, log } from 'util';
import * as types from '@/store/types';
import config from 'config';
import { validaForm } from '../../utils/assist.js';

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
const array = [
  'the_geom',
  'geom',
  'gid',
  'ID',
  'geometry',
  'x1',
  'x2',
  'y1',
  'y2',
  'Shape_Leng',
  'Shape_Area',
  'bbox',
];
export default {
  name: 'QueryAttrs',
  data() {
    return {
      layerList: [],
      fieldList: [],
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
      formDynamic: {
        layer: '',
        wfsUrl: '',
        layerTitle: '',
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
      schema: 'the_geom',
    };
  },
  computed: {
    //获取图层树的数据
    ogcLayers() {
      return this.$store.getters.ogcLayers;
    },
  },
  watch: {
    ogcLayers: {
      handler(nvalue, ovalue) {
        const layers = nvalue;
        this.layerList = [];
        for (let i = 0; i < layers.length; i++) {
          const layerData = layers[i].options;
          this.layerList.push({
            label: layerData.title
              ? layerData.title
              : layerData.layers
                ? layerData.layers
                : layerData.layer,
            value: layerData.layers ? layerData.layers : layerData.layer,
          });
        }
      },
      immediate: true, //组件挂载的时候会执行一次
    },
  },
  events: {
    'on-reset-query': 'reset',
  },
  methods: {
    //图层选择点击事件
    layerClick() {
      if (this.ogcLayers.length == 0) this.$Message.info('请添加图层！');
    },
    //图层选择事件
    layerChange(layer) {
      if (layer.label !== '' && layer.value !== '') {
        this.formDynamic.layerTitle = layer.label;
        const layers = this.$store.getters.wfsLayerData[layer.value];
        this.formDynamic.wfsUrl = layers.wfsurl;
        const url = new URL(this.formDynamic.wfsUrl);
        this.queryUrl = url.origin + '/hgis/ows';
        this.fieldList = [];
        for (let i = 0; i < layers.schema.length; i++) {
          if (array.indexOf(layers.schema[i].name) != -1) continue;
          this.fieldList.push({
            label: layers.schema[i].name,
            value: layers.schema[i].name,
          });
        }
        this.layerCrs = layers.csys;
        this.queryName = layer.value;
      }
    },
    //字段选择事件
    fieldChange(item) {
      if (this.formDynamic.layer !== '') {
        const layers = this.$store.getters.wfsLayerData[this.formDynamic.layer];
        for (let i = 0; i < layers.schema.length; i++) {
          if (layers.schema[i].name == item.field) {
            item.fieldType = layers.schema[i].type;
            break;
          }
        }
        switch (item.fieldType.toLowerCase()) {
          case 'timestamp':
          case 'datetime':
          case 'numeric':
          case 'double':
          case 'long':
            item.compareList = numberCompare;
            break;
          default:
            item.compareList = stringCompare;
            break;
        }
      }
    },
    compareChange(compare) {},
    logicChange(logic) {},
    //窗口关闭事件
    hidden() {
      this.$emit('update:visible', false);
    },
    //获取查询条件
    getCondition(items) {
      let cql = '';
      for (let i = 0; i < items.length; i++) {
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
      }
      return cql.trim();
    },
    //构建table里面的columns
    getColums() {
      const columns = [{ title: '序号', type: 'index', align: 'center', width: 100 }];
      let isSetWidth;
      this.fieldList.length > 9 ? (isSetWidth = true) : (isSetWidth = false);
      for (let i = 0; i < this.fieldList.length; i++) {
        if (isSetWidth) {
          columns.push({
            title: this.fieldList[i].label,
            key: this.fieldList[i].label,
            align: 'center',
            width: 100,
            maxWidth: 200,
          });
        } else {
          columns.push({
            title: this.fieldList[i].label,
            key: this.fieldList[i].label,
            align: 'center',
          });
        }
      }
      return columns;
    },
    //查询按钮提交事件
    handleSubmit(name) {
      this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'once' });
      if (this.formDynamic.wfsUrl == '') {
        this.$Message.info('请选择图层');
        return;
      }
      const items = this.$refs[name].model.items;
      // 效验表单
      const isValidate = validaForm(items);
      if (isValidate.length == 0) {
        const CQLFilter = this.getCondition(items);
        const options = { version: '1.0.0' };
        if (CQLFilter) options.cql_filter = CQLFilter;
        this.$store.commit(types.REMOVE_BUS_FIELD);
        this.$store.commit(types.REMOVE_BUS_ATTRIBUTE);
        this.$store.commit(types.SET_BUS_FIELD, this.getColums());
        this.$store.commit(types.SET_BUS_ATTRIBUTE, {
          options: {
            title: this.formDynamic.layerTitle,
            url: this.formDynamic.wfsUrl,
            pageIndex: 1,
            pageSize: 10,
          },
          queryOptions: options,
        });
      } else {
        let message = '';
        isValidate.forEach(key => (message += ` ${String(key + 1)} `));
        this.$Message.error(`查询条件中第${message}条包含特殊字符，请修改后再做查询！`);
      }
    },
    //重置查询页面
    reset() {
      this.$refs['formDynamic'].resetFields();
      this.formDynamic.layer = '';
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
      this.$nextTick(() => {
        this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'once' });
      });
    },
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
    // 数据提取
    async loadQueryData() {
      if (this.formDynamic.wfsUrl == '') {
        this.$Message.info('请选择图层');
        return;
      }
      const loadParams = this.setLoadPrams();
      // const response = await api.db.batchwebrequest([loadParams]);
      // window.open(`${config.project.basicUrl}/data/download/tempfile?path=${response.data}`);
      window.open(encodeURI(loadParams));
    },
    // 提取参数处理
    setLoadPrams() {
      let loadParams;
      this.fieldList.forEach(item => {
        this.schema = this.schema + ',' + item.value;
      });
      const name = this.queryName.split(':');
      const items = this.$refs['formDynamic'].model.items;
      const CQLFilter = this.getCondition(items);
      const options = { version: '1.0.0', maxFeatures: 2147483647 };
      if (CQLFilter) options.cql_filter = CQLFilter;
      const queryPram = new L.QueryParameter.WfsQueryParameter({
        propertyName: this.schema,
        typeName: this.queryName,
        outputFormat: 'shape-zip',
        srsName: this.layerCrs,
        ...options,
      });
      const queryTack = new L.QueryTask(queryPram);
      let taskData = queryTack._queryParameter.options;

      // 直接调gisserver，连接url
      loadParams = `${this.queryUrl}?service=wfs`;
      for (let key in taskData) {
        if (key !== 'service' && taskData[key]) loadParams += `&${key}=${taskData[key]}`;
      }
      return loadParams;
    },
  },
};
</script>

<template>
  <Form
    ref="formDynamic"
    :model="formDynamic"
    :label-width="80"
    inline
    @submit.native.prevent>
    <FormItem
      label="选择图层：">
      <Select
        v-model="formDynamic.layer"
        class="layer"
        size="small"
        placeholder="请选择图层"
        label-in-value
        @on-change="layerChange"
        @click.native="layerClick">
        <Option
          v-for="item in layerList"
          :value="item.value"
          :key="item.value">{{ item.label }}</Option>
      </Select>
    </FormItem>

    <FormItem label="查询条件：">
      <Row class="condition">
        <FormItem
          v-for="(item, index) in formDynamic.items"
          :key="index"
        >
          <FormItem>
            <Select
              v-model="item.field"
              transfer
              class="left"
              size="small"
              style="width: 130px"
              placeholder="请选择字段"
              @on-change="fieldChange(item)">
              <Option
                v-for="item in fieldList"
                :value="item.value"
                :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Select
              v-model="item.compare"
              transfer
              class="right"
              size="small"
              placeholder="比较符"
              style="width: 80px"
              @on-change="compareChange">
              <Option
                v-for="item in item.compareList"
                :value="item.value"
                :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <Icon
            v-show="formDynamic.items.length > 1"
            type="ios-minus-outline"
            size="25"
            @click.native.stop="handleRemove(item)"></Icon>
          <FormItem
            :prop="'items.' + index + '.value'">
            <Input
              v-model="item.value"
              class="left"
              size="small"
              type="text"
              style="width: 130px"
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
            type="ios-plus-outline"
            size="25"
            @click.native.stop="handleAdd(item)"></Icon>
        </FormItem>
      </Row>
    </FormItem>

    <FormItem>
      <Button
        type="primary"
        @click="handleSubmit('formDynamic')">查询</Button>
      <Button
        type="success"
        @click="loadQueryData">数据提取</Button>
      <Button
        type="ghost"
        style="margin-left: 8px"
        @click="reset">重置</Button>
    </FormItem>
  </formitem></Form>
</template>

<style lang="less" scoped>
.layer {
  min-width: 260px;
  width: 100%;
}

.k-form-item {
  margin-bottom: 15px;
}
/*李兴成改之前
.condition {
  height: auto;
  width: 100%;
  overflow: auto;
  .k-form-item {
    /deep/.k-select-dropdown {
      max-height: 80px;
    }
    .left {
      width: 169px;
    }
    .right {
      min-width: 60px;
    }
  }
  .k-icon {
    cursor: pointer;
    margin-top: 5px;
  }
}*/
//改之后
.condition {
  height: auto;
  max-height: 205px;
  overflow-y: auto;
}
</style>
