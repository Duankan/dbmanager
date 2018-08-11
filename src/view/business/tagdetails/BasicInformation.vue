<script>
export default {
  name: 'BasicInformation',
  data() {
    return {
      formItem: {},
    };
  },
};
</script>

<template>
  <Form
    :label-width="100"
    :model="formItem">
    <Row>
      <Col span="9">
      <FormItem label="业务资源标题：">
        <Input
          placeholder="给目标起个名字" />
      </FormItem>
      </Col>
      <Col span="9">
      <FormItem label="资源分类：">
        <Input
          placeholder="单选" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="9">
      <FormItem label="负责单位：">
        <Input
          placeholder="负责单位" />
      </FormItem>
      </Col>
      <Col span="9">
      <FormItem label="负责单位地址：">
        <Input
          placeholder="负责单位地址" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="18">
      <FormItem label="表名：">
        <Input
          placeholder="请选择" />
      </FormItem>
      </Col>
    </Row>
    <FormItem label="数据使用时间：">
      <Row class="">
        <Col span="9">
        <DatePicker
          v-model="formItem.date"
          type="date"
          placeholder="Select date"></DatePicker>
        </Col>
        <Col span="1">至</Col>
        <Col span="8">
        <DatePicker
          v-model="formItem.date"
          type="date"
          placeholder="Select date"></DatePicker>
        </Col>
      </Row>
    </FormItem>
    <Row>
      <Col span="18">
      <FormItem label="表名：">
        <Input
          :rows="4"
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
          type="textarea"
          placeholder="请输入你的阶段性工作目标" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="18">
      <Button
        class="details-button-right"
        type="primary">
        保存</Button>
      </Col>
    </Row>
  </Form>
</template>

<style lang="less" scoped>
.k-form-item {
  margin-bottom: 18px;
  vertical-align: top;
  zoom: 1;
}
/deep/.k-input {
  background-color: transparent;
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
