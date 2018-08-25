<script>
import { date } from '@ktw/ktools';
// 基本信息详情页
export default {
  name: 'BasicInformation',
  props: {
    rowData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      formItem: {},
      copyRowData: this.rowData,
      ruleValidate: {
        requireds: [{ required: true, message: '该值不能为空' }],
      },
    };
  },
  methods: {
    //修改基本信息
    async modBasicInformation() {
      this.copyRowData.enddate = date.format(new Date(this.copyRowData.enddate), 'YYYY-M-D');
      this.copyRowData.begdate = date.format(new Date(this.copyRowData.enddate), 'YYYY-M-D');
      //判断按钮请求
      if (this.copyRowData.add == true) {
        await api.db.addbasicinfoBusiness(this.copyRowData).then(p => {
          this.$emit('on-tagEvent', p.data);
        });
      } else {
        await api.db.updatebasicinfoBusiness(this.copyRowData);
      }
    },
  },
};
</script>

<template>
  <!--基本信息表单-->
  <Form
    :rules="ruleValidate"
    :label-width="120"
    :class="{shade:copyRowData.readonly}"
    :model="copyRowData">
    <Row>
      <Col span="9">
      <FormItem
        prop="requireds"
        label="业务资源标题：">
        <Input
          v-model="copyRowData.restitle"
          placeholder="给目标起个名字"/>
      </FormItem>
      </Col>
      <Col span="9">
      <FormItem
        prop="requireds"
        label="资源分类：">
        <Input
          v-model="copyRowData.restype"
          placeholder="单选" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="9">
      <FormItem
        prop="requireds"
        label="负责单位：">
        <Input
          v-model="copyRowData.rporgname"
          placeholder="负责单位" />
      </FormItem>
      </Col>
      <Col span="9">
      <FormItem
        prop="requireds"
        label="负责单位地址：">
        <Input
          v-model="copyRowData.cndadd"
          placeholder="负责单位地址" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="18">
      <FormItem
        prop="requireds"
        label="表名：">
        <Input
          v-model="copyRowData.name"
          placeholder="请选择" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <FormItem
        prop="requireds"
        label="数据使用时间：">
        <Col span="9">
        <DatePicker
          v-model="copyRowData.begdate"
          type="date"
          format="yyyy-MM-dd"
          placeholder="选择起始时间"></DatePicker>
        </Col>
        <Col span="1">至</Col>
        <Col span="8">
        <DatePicker
          v-model="copyRowData.enddate"
          type="date"
          format="yyyy-MM-dd"
          placeholder="选择结束时间"></DatePicker>
        </Col>
      </FormItem>
    </Row>
    <Row>
      <Col span="18">
      <FormItem
        prop="requireds"
        label="标签关键字：">
        <Input
          :rows="4"
          v-model="copyRowData.keyword"
          type="textarea"
          placeholder="请选择多个标签管理里面的标签" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="18">
      <FormItem
        prop="requireds"
        label="摘要：">
        <Input
          :rows="4"
          v-model="copyRowData.abstract_"
          type="textarea"
          placeholder="请输入你的阶段性工作目标" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="18">
      <Button
        v-show="!copyRowData.readonly"
        class="details-button-right"
        type="primary"
        @click="modBasicInformation">
        保存</Button>
      </Col>
    </Row>
  </Form>
</template>

<style lang="less" scoped>
@import '../../../styles/components/common.less';
.k-form-item {
  margin-bottom: 18px;
  vertical-align: top;
  zoom: 1;
}
.k-date-picker {
  display: inline-block;
  line-height: normal;
  width: 92%;
}
.details-button-right {
  float: right;
}
.details-date-between {
}
</style>
