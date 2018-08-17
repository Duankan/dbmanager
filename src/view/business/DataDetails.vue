<script>
import BasicInformation from './tagdetails/BasicInformation';
import ExtendField from './tagdetails/ExtendField';
import Field from './tagdetails/Field';
import IncidenceRelation from './tagdetails/IncidenceRelation';
import BusinessTable from './BusinessTable';
export default {
  name: 'DataDetails',
  components: {
    BasicInformation,
    ExtendField,
    Field,
    IncidenceRelation,
    BusinessTable,
  },
  props: {
    businessData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      // 显示隐藏DataDetails
      display: true,
      //对话框显示
      goBack: false,
    };
  },
  methods: {
    ok() {
      this.$emit('backEvent');
    },
  },
};
</script>

<template>
  <div>
    <div
      v-if="display"
      class="main">
      <div
        v-if="businessData.readonly"
        class="data-content"
        @click="ok()">
        <Icon type="arrow-left-a"></Icon>
        <span class="data-content-title"><b>元数据详情</b></span>
      </div>
      <div
        v-else
        class="data-content"
        @click="goBack = true">
        <Icon type="arrow-left-a"></Icon>
        <span class="data-content-title"><b>元数据详情</b></span>
      </div>
      <modal
        v-model="goBack"
        title="返回"
        @on-ok="ok">
        <p>我已保存更改项，点击确认按钮返回元数据管理页面</p>
      </modal>
      <Tabs value="name1">
        <TabPane
          label="基本信息"
          name="name1">
          <div class="data-details">
            <BasicInformation :row-data="businessData"></BasicInformation>
          </div>
        </TabPane>
        <TabPane
          label="字段"
          name="name2">
          <Field :row-data="businessData"></Field>
        </TabPane>
        <TabPane
          label="关联关系"
          name="name3">
          <IncidenceRelation :row-data="businessData"></IncidenceRelation>
        </TabPane>
        <TabPane
          label="扩展字段"
          name="name4">
          <ExtendField :row-data="businessData"></ExtendField>
        </TabPane>
      </Tabs>
    </div>
    <div
      v-else>
      <BusinessTable></BusinessTable>
    </div>
  </div>
</template>

<style lang="less" scoped>
.main {
  width: 100%;
  margin: 0 auto;
}
.data-content {
  cursor: pointer;
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
</div></template>
