<script>
export default {
  name: 'DataDisplay',
  data() {
    return {
      formItem: {},
    };
  },
};
</script>

<template>
  <Form
    :model="formItem"
    :label-width="60"
    label-position="left">
    <div
      class="top"><Icon
        type="ios-square"
        class="bg-icon"
        size="20"/>
      <span>查询</span>
    </div>
    <FormItem label="名称：" >
      <Select v-model="formItem.name">
      </Select>
    </FormItem>
    <FormItem label="标签：" >
      <Select v-model="formItem.select">
      </Select>
    </FormItem>
    <FormItem label="分类：" >
      <Select v-model="formItem.select">
      </Select>
    </FormItem>
    <FormItem label="关键字：">
      <Input
        v-model="formItem.input"
        placeholder="请输入关键字">
      </Input>
    </FormItem>
    <FormItem>
      <Button type="primary" >查询</Button>
      <Button style="margin-left: 8px">清空</Button>
    </FormItem>
  </Form>

</template>

<style lang="less" scoped>
form {
  padding-left: 25px;
  padding-right: 22px;
  border: 1px solid #e8eaec;
  padding: 0px 22px 5px 25px;
  border-top: 0px;
  height: 234px;
}
.k-form-item {
  margin-bottom: 3px !important;
  padding-top: 5px !important;
}

.top {
  width: 100%;
  height: 20px;
  padding-bottom: 27px;
}
.bg-icon {
  width: 8px;
  height: 8px;
  line-height: 8px;
  background-color: #2d8cf0;
  margin-right: 5px;
}
.k-btn {
  padding: 3px 15px;
}
</style>
