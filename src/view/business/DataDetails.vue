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
    treeData: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      // 显示隐藏DataDetails
      display: true,
      //行数据
      copyBusinessData: this.businessData,
      //tabValue
      // tabValue: 'name1',
    };
  },
  computed: {
    //Table页可切换
    setTabClasses() {
      return this.copyBusinessData.pointer;
    },
  },
  methods: {
    //提示返回
    verifyGoBack() {
      this.$Modal.confirm({
        title: '返回',
        content: '<p>已保存当前更改，返回元数据管理页面</p>',
        onOk: () => {
          this.goBack();
        },
      });
    },
    goBack() {
      this.$emit('backEvent');
    },
    pointer(id) {
      console.log(id);
      this.copyBusinessData.id = id;
      this.copyBusinessData.pointer = false;
      this.copyBusinessData = { ...this.copyBusinessData };
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
        v-if="copyBusinessData.readonly"
        class="data-content"
        @click="goBack()">
        <Icon type="arrow-left-a"></Icon>
        <span class="data-content-title">
          <b>元数据详情</b>
        </span>
      </div>
      <div
        v-else
        class="data-content"
        @click="verifyGoBack()">
        <Icon type="arrow-left-a"></Icon>
        <span class="data-content-title">
          <b>元数据详情</b>
        </span>
      </div>
      <Tabs>
        <TabPane
          :disabled="setTabClasses"
          label="基本信息"
          name="name1">
          <div class="data-details">
            <BasicInformation
              :row-data="copyBusinessData"
              :tree-data="treeData"
              @on-tagEvent="pointer"
            >
            </BasicInformation>
          </div>
        </TabPane>
        <TabPane
          :disabled="setTabClasses"
          label="字段"
          name="name2">
          <Field :row-data="copyBusinessData"></Field>
        </TabPane>
        <!--<TabPane
          :disabled="setTabClasses"
          label="关联关系"
          name="name3">
          <IncidenceRelation :row-data="copyBusinessData"></IncidenceRelation>
        </TabPane>-->
        <TabPane
          :disabled="setTabClasses"
          label="扩展字段"
          name="name4">
          <ExtendField :row-data="copyBusinessData"></ExtendField>
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
  width: 95px;
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
/deep/.active {
  pointer-events: none;
  cursor: default;
  color: #ccc;
}
</style>
