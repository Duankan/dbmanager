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
      //标签页可点击
    };
  },
  methods: {
    /**修改基本信息 */
    async modBasicInformation() {
      this.copyRowData.enddate = date.format(new Date(this.copyRowData.enddate), 'YYYY-M-D');
      this.copyRowData.begdate = date.format(new Date(this.copyRowData.enddate), 'YYYY-M-D');
      if (this.copyRowData.add == true) {
        const response = await api.db.addbasicinfoBusiness(this.copyRowData);
        if (response.status === 200) {
          console.log(response);
          console.log(response.data);
          this.$emit('on-tagEvent', response.data);
        }
      } else {
        const response = await api.db.updatebasicinfoBusiness(this.copyRowData);
      }
    },
  },
};
</script>

<template>
  <Form
    :label-width="100"
    :class="{shade:copyRowData.readonly}"
    :model="copyRowData">
    <Row>
      <Col span="9">
      <FormItem label="业务资源标题：">
        <Input
          v-model="copyRowData.restitle"
          placeholder="给目标起个名字"/>
      </FormItem>
      </Col>
      <Col span="9">
      <FormItem label="资源分类：">
        <Input
          v-model="copyRowData.restype"
          placeholder="单选" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="9">
      <FormItem label="负责单位：">
        <Input
          v-model="copyRowData.rporgname"
          placeholder="负责单位" />
      </FormItem>
      </Col>
      <Col span="9">
      <FormItem label="负责单位地址：">
        <Input
          v-model="copyRowData.cndadd"
          placeholder="负责单位地址" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="18">
      <FormItem label="表名：">
        <Input
          v-model="copyRowData.name"
          placeholder="请选择" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <FormItem label="数据使用时间：">
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
      <FormItem label="标签关键字：">
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
      <FormItem label="摘要：">
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
