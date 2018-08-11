<script>
import BasicInformation from './tagdetails/BasicInformation';
import ExtendField from './tagdetails/ExtendField';
import Field from './tagdetails/Field';
import IncidenceRelation from './tagdetails/IncidenceRelation';
export default {
  name: 'DataDetails',
  components: {
    BasicInformation,
    ExtendField,
    Field,
    IncidenceRelation,
  },
  data() {
    return {};
  },
};
</script>

<template>
  <div class="main">
    <div class="data-content">
      <Icon type="arrow-left-a"></Icon>
      <span class="data-content-title"><b>元数据详情</b></span>
    </div>
    <Tabs value="name1">
      <TabPane
        label="基本信息"
        name="name1">
        <div class="data-details">
          <BasicInformation></BasicInformation>
        </div>
      </TabPane>
      <TabPane
        label="字段"
        name="name2">
        <ExtendField></ExtendField>
      </TabPane>
      <TabPane
        label="关联信息"
        name="name3">标签三的内容</TabPane>
      <TabPane
        label="扩展字段"
        name="name4">标签四的内容</TabPane>
    </Tabs>
</div></template>

<style lang="less" scoped>
.main {
  width: 92%;
  margin: 0 auto;
}
.data-content {
  height: 60px;
  line-height: 60px;
}

.data-content-title {
  font-size: 14px;
  padding-left: 8px;
}
.data-details {
  margin-left: 30px;
}
</style>
