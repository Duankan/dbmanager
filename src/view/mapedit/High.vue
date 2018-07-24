
<script>
import { url } from '@ktw/ktools';
import * as helps from '@/utils/helps';
export default {
  name: 'High',
  props: {
    msg: { type: Object, default: () => {} },
  },
  data() {
    return {
      soleAndSection: '唯一值', //选择是单选还是分段数
      proportion: '', //颜色渐变的数组
      fieldS: [], //全部的字段
      FieldNoStr: [], //非str类型字段
      //当前过滤器
      currentFilter: {
        schemas: '',
        name: '',
        filter: '',
        style: '',
      },
    };
  },
  created() {
    this.getAllField();
  },
  methods: {
    //给过滤的组件添加字段
    async getAllField() {
      const response = await api.db.findService({
        resourceId: this.msg.data.resource.resourceId, // 资源id
        serivestatus: 0, // 服务状态(0 开启 1 关闭)
        baseservicetype: 1, // 基础服务
        metadataLayer: this.msg.data.resource.metadataLayer, // 元数据图层
      });

      for (let i = 0; i < response.data[1].schema.length; i++) {
        let all = helps.schemaReservedFileds.indexOf(response.data[1].schema[i].name);
        if (all == -1 && response.data[1].schema[i].type != 'String') {
          this.FieldNoStr.push(response.data[1].schema[i]);
        }
        if (all == -1) {
          this.fieldS.push(response.data[1].schema[i]);
        }
      }
    },
  },
};
</script>

<template>
  <div>
    <RadioGroup v-model="soleAndSection">
      <Radio label="唯一值"></Radio>
      <Radio label="分段数"></Radio>
    </RadioGroup>
    <p>
      <span>
        字段：
      </span>
      <Select
        v-if="soleAndSection=='唯一值'"
        style="width:150px">
        <Option
          v-for="item in fieldS"
          :value="item.name"
          :key="item.name">{{ item.name }}</Option>

      </Select>


      <Select
        v-if="soleAndSection=='分段数'"
        style="width:150px">
        <Option
          v-for="item in FieldNoStr"
          :value="item.name"
          :key="item.name">{{ item.name }}</Option>
      </Select>
      <span>
        颜色渐变：
      </span>
      <Select
        style="width:150px">
        <Option
          v-for="item in proportion"
          :value="item.value"
          :key="item.value">{{ item.label }}</Option>
      </Select>
    </p>
  </div>
</template>

<style>
</style>
