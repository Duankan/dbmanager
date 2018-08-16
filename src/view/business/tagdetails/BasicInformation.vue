<script>
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
      // readonly: false,
    };
  },
  methods: {
    async modBasicInformation() {
      console.log(this.rowData.begdate);
      if (this.rowData.add == true) {
        const response = await api.db.addbasicinfoBusiness(this.rowData);
      } else {
        const response = await api.db.updatebasicinfoBusiness(this.rowData);
      }
    },
  },
};
</script>

<template>
  <Form
    :label-width="100"
    :class="{shade:rowData.readonly}"
    :model="rowData">
    <Row>
      <Col span="9">
      <FormItem label="业务资源标题：">
        <Input
          v-model="rowData.restitle"
          placeholder="给目标起个名字"/>
      </FormItem>
      </Col>
      <Col span="9">
      <FormItem label="资源分类：">
        <Input
          v-model="rowData.restype"
          placeholder="单选" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="9">
      <FormItem label="负责单位：">
        <Input
          v-model="rowData.rporgname"
          placeholder="负责单位" />
      </FormItem>
      </Col>
      <Col span="9">
      <FormItem label="负责单位地址：">
        <Input
          v-model="rowData.cndadd"
          placeholder="负责单位地址" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="18">
      <FormItem label="表名：">
        <Input
          v-model="rowData.name"
          placeholder="请选择" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <FormItem label="数据使用时间：">
        <Col span="9">
        <DatePicker
          v-model="rowData.begdate"
          type="date"
          format="yyyy-MM-dd"
          placeholder="选择起始时间"></DatePicker>
        </Col>
        <Col span="1">至</Col>
        <Col span="8">
        <DatePicker
          v-model="rowData.enddate"
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
          v-model="rowData.keyword"
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
          v-model="rowData.abstract"
          type="textarea"
          placeholder="请输入你的阶段性工作目标" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="18">
      <Button
        v-show="!rowData.readonly"
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
