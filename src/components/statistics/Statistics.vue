<script>
import QueryBase from '../querybase/querybase.js';
import { CitySelect } from '@ktw/kbus';
import * as types from '@/store/types';
import config from 'config';

export default {
  name: 'Statistics',
  components: { CitySelect },
  mixins: [QueryBase],
  props: {},
  data() {
    return {
      serviseUrl: '',
      // 表单数值
      statisticsItem: {
        layers: '',
        place: '',
        crs: '',
        type: 'classify',
        classicField: '',
        classicFieldNum: 1,
      },
      // 表单验证
      ruleValidate: {
        layers: [{ required: true, message: '请选择一个或多个图层！', trigger: 'change' }],
        classicField: [{ required: true, message: '请选择分类字段！', trigger: 'change' }],
        classicFieldNum: [{ required: true, message: '请选择分段数！' }],
        type: [{ required: true, message: '请选择统计类型！', trigger: 'change' }],
        statisticsField: [{ required: true, message: '请选择统计字段！', trigger: 'change' }],
      },
      // 表单所需要的数据
      layerData: [],
      crsData: [],
      schema: [],

      layerCrs: null,
      queryItems: [
        {
          field: '',
          operate: '',
        },
      ],
      queryOperates: [],
      queryFields: [],
      // 功能参数
      disabledCrs: true,
      disabledDefault: true,
      crsplaceholder: '请先选择图层！',
    };
  },
  computed: {
    statisticsType() {
      if (this.statisticsItem.type === 'classify') {
        return '分类字段：';
      } else {
        return '分段字段：';
      }
    },
  },
  methods: {
    //新增查询项
    addQueryItem() {
      this.queryItems.push({
        field: '',
        operate: '',
      });
    },
    //删除查询项
    deleteQueryItem(index) {
      this.queryItems.splice(index, 1);
    },
    // 图层选择
    async selectLayer(layerData) {
      if (layerData.value !== '' && layerData.label !== '') {
        this.disabledDefault = false;
        this.serviseUrl = layerData.value;
        const url = new URL(this.serviseUrl);
        this.queryUrl = url.origin + '/master/ows';
        // 过滤字段,取参数
        if (this.layerData.length !== 0) {
          const totalParams = this.layerData.filter(item => item.label === layerData.label);
          this.fieldList = this.getColums(totalParams[0].schema);
          this.layerCrs = totalParams[0].crs;
          this.schema = totalParams[0].schema.filter(
            item => !this.commonParams.includes(item.name)
          );
          // 请求平面坐标
          this.crsplaceholder = '正在查询中...';
          const crs = this.layerCrs.split(':');
          const response = await api.db.getprocrs({ crs: crs[1] });
          this.disabledCrs = false;
          this.crsData = response.data;
          this.crsplaceholder = '请选择平面参考系！';
        }
      }
    },
    startQuery() {
      this.$refs['dbstatistics'].validate(valid => {
        if (valid) {
        } else {
          this.$Message.error('请按要求填写表单！');
        }
      });
    },
    reset() {
      this.$refs['dbstatistics'].resetFields();
    },
  },
};
</script>

<template>
  <Form
    ref="dbstatistics"
    :model="statisticsItem"
    :label-width="90"
    :label-position="'left'"
    :rules="ruleValidate"
  >
    <FormItem
      label="选择图层："
      prop="layers">
      <Select
        v-model="statisticsItem.layers"
        not-found-text="请添加一个图层！"
        label-in-value
        @on-change="selectLayer">
        <Option
          v-for="(item,index) in layerData"
          :value="item.servicesurl"
          :key="index">{{ item.label }}</Option>
      </Select>
    </FormItem>
    <FormItem label="选择行政区：">
      <CitySelect v-model="statisticsItem.place"></CitySelect>
    </FormItem>
    <FormItem
      label="选择参考系："
      class="db-choose-crs">
      <Select
        v-model="statisticsItem.crs"
        :disabled="disabledCrs"
        :placeholder="crsplaceholder"
        label-in-value
      >
        <Option
          v-for="(item,index) in crsData"
          :value="item.code"
          :key="index">{{ item.code }}</Option>
      </Select>
    </FormItem>
    <FormItem
      label="统计类型："
      prop="type">
      <RadioGroup v-model="statisticsItem.type">
        <Radio label="classify">分类</Radio>
        <Radio label="fields">分段</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem
      v-if="statisticsItem.type === 'fields'"
      label="分段数："
      prop="classicFieldNum">
      <InputNumber
        :min="1"
        v-model="statisticsItem.classicFieldNum"></InputNumber>
    </FormItem>
    <FormItem
      :label="statisticsType"
      prop="classicField">
      <Select
        v-model="statisticsItem.classicField"
        :disabled="disabledDefault"
        placeholder="请选择分类字段"
        transfer
      >
        <Option
          v-for="(item,index) in schema"
          :value="item.name"
          :key="index">{{ item.name }}</Option>
      </Select>
      </Select>
    </FormItem>
    <FormItem
      label="统计字段："
      class="db-statistics-field"
      prop="statisticsField">
      <div
        v-for="(item,index) in queryItems"
        :key="index"
        class="field-item">
        <div class="item-content">
          <Select
            v-model="item.field"
            :disabled="disabledDefault"
            size="small"
            placeholder="统计方式"
            transfer>
            <Option
              v-for="item in queryFields"
              :key="item.filename"
              :value="item.filename">{{ item.filename }}</Option>
          </Select>
          <Select
            v-model="item.operate"
            :disabled="disabledDefault"
            size="small"
            placeholder="统计字段"
            transfer
          >
            <Option
              v-for="item in queryOperates"
              :key="item.value"
              :value="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="item-operate">
          <Icon
            type="plus-round"
            title="新增"
            @click.native.stop="addQueryItem()" />
          <Icon
            v-show="index>0"
            type="close-circled"
            title="删除"
            @click.native.stop="deleteQueryItem(index)" />
        </div>
      </div>
    </FormItem>
    <FormItem>
      <Button
        type="primary"
        @click="startQuery">统计</Button>
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
}

/deep/.k-form-item-required .k-form-item-label:before {
  float: right;
}

.db-choose-crs {
  width: 80%;
}

.db-statistics-field {
  /deep/.k-form-item-content {
    height: auto;
    max-height: 115px;
    overflow-y: auto;
  }

  .field-item {
    margin-top: 8px;
    background-color: #eeeff1;
    border-radius: 3px;
    list-style: none;
    padding: 6px;
    position: relative;
    width: 98%;

    &.push-right {
      text-align: right;
    }

    .item-content {
      margin-right: 5px;
      .k-select:first-child {
        width: 48%;
      }

      .k-select:last-child {
        width: 38%;
        margin-left: 2%;
      }
    }

    .item-operate {
      position: absolute;
      top: 0;
      right: 0;
      text-align: right;

      .k-icon:first-child {
        display: block;
        font-size: 18px;
        margin: 13px 18px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
        .remain-top {
          margin-top: 15px;
        }
      }

      .k-icon:last-child {
        position: absolute;
        top: -22px;
        right: -14px;
        display: none;
        font-size: 18px;
        margin: 13px 8px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
        .remain-top {
          margin-top: 15px;
        }
      }
    }
    .k-btn-small {
      padding: 2px 10px;
      margin-left: 4px;
    }
  }

  .field-item:hover {
    .item-operate .k-icon:last-child {
      display: block;
    }
  }
}
</style>
