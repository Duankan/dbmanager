<script>
export default {
  name: 'IncidenceRelation',
  data() {
    return {
      //外部关联表单
      externalFormItem: {
        // 源字段下拉框
        selectSourceField: [
          {
            value: 'beijing',
            key: 'New York',
          },
          {
            value: 'shanghai',
            key: 'London',
          },
        ],
        // 关联表名下拉
        selectTableName: [
          {
            value: 'beijing1',
            key: 'New York1',
          },
          {
            value: 'shanghai1',
            key: 'London1',
          },
        ],
        // 关联字段下拉
        selectField: [
          {
            value: 'beijing2',
            key: 'New York2',
          },
          {
            value: 'shanghai2',
            key: 'London2',
          },
        ],
        radio: {},
      },
      //外部关联表格
      externalTable: {
        title: [
          {
            title: '源表名',
            key: 'name',
            className: 'demo-table-info-column',
          },

          {
            title: '源字段',
            key: 'field',
          },
          {
            title: '关联表名',
            key: 'relevanceName',
          },
          {
            title: '关联字段名',
            key: 'relevanceField',
          },
          {
            title: '关联关系',
            key: 'incidenceRelation',
          },
        ],
        data: [
          {
            name: 'table1',
            field: 'column1',
            relevanceName: 'table2',
            relevanceField: 'column1',
            incidenceRelation: '强关联',
          },
          {
            name: 'table1',
            field: 'column1',
            relevanceName: 'table2',
            relevanceField: 'column1',
            incidenceRelation: '强关联',
          },
        ],
      },
      //内部关联表单
      innerFormItem: {
        // 源字段下拉框
        selectSourceField: [
          {
            value: 'beijing',
            key: 'New York',
          },
          {
            value: 'shanghai',
            key: 'London',
          },
        ],
        // 关联字段下拉
        selectField: [
          {
            value: 'beijing2',
            key: 'New York2',
          },
          {
            value: 'shanghai2',
            key: 'London2',
          },
        ],
        radio: {},
      },
      //内部关联表格
      innerTable: {
        title: [
          {
            title: '源字段',
            key: 'field',
          },
          {
            title: '关联字段名',
            key: 'relevanceName',
          },
          {
            title: '关联关系',
            key: 'incidenceRelation',
          },
        ],
        data: [
          {
            field: 'column1',
            relevanceName: 'table2',
            incidenceRelation: '强关联',
          },
          {
            field: 'column1',
            relevanceName: 'table2',
            incidenceRelation: '强关联',
          },
        ],
      },
    };
  },
};
</script>

<template>
  <row>
    <!-- 外部字段关联 -->
    <Col span="12">
    <div class="relevance-content">
      <div class="details-menu">
        <span class="table-content-title-icon"></span>
        <span class="table-content-title-content"><b>外部关联字段</b></span>
      </div>
      <Form
        :label-width="100"
        :model="externalFormItem">
        <row>
          <Col span="12">
          <FormItem label="原表名：">
            <Input/>
          </FormItem>
        </Col>
          <Col span="12">
          <FormItem label="源字段：">
            <Select v-model="externalFormItem.selectSourceField.select">
              <Option
                v-for="item of externalFormItem.selectSourceField"
                :key="item.value"
                :value="item.value">{{ item.key }}</Option>
            </Select>
          </FormItem>
        </Col>
        </row>
        <row>
          <Col span="12">
          <FormItem label="关联表名：">
            <Select v-model="externalFormItem.selectTableName.select">
              <Option
                v-for="item of externalFormItem.selectTableName"
                :key="item.value"
                :value="item.value">{{ item.key }}</Option>
            </Select>
          </FormItem>
        </Col>
          <Col span="12">
          <FormItem label="关联字段：">
            <Select v-model="externalFormItem.selectField.select">
              <Option
                v-for="item of externalFormItem.selectField"
                :key="item.value"
                :value="item.value">{{ item.key }}</Option>
            </Select>
          </FormItem>
        </Col>
        </row>
        <row class="relevance-header">
          <Col span="18">
          <FormItem label="关联关系：">
            <RadioGroup v-model="externalFormItem.radio">
              <Radio label="male">强关联</Radio>
              <Radio label="female">强关联</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
          <Col span="6">
          <Button type="primary">创建关联</Button>
        </Col>
        </row>
      </Form>
      <Table
        :columns="externalTable.title"
        :data="externalTable.data">
      </Table>
    </div>
    </Col>
    <Divider type="vertical" />
    <!-- 内部字段关联 -->
    <Col span="12">
    <div class="relevance-content">
      <div class="details-menu">
        <span class="table-content-title-icon"></span>
        <span class="table-content-title-content"><b>内部关联字段</b></span>
      </div>
      <Form
        :label-width="100"
        :model="innerFormItem">
        <row>
          <Col span="24">
          <FormItem label="源字段：">
            <Select v-model=" innerFormItem.selectSourceField.select">
              <Option
                v-for="item of innerFormItem.selectSourceField"
                :key="item.value"
                :value="item.value">{{ item.key }}</Option>
            </Select>
          </FormItem>
        </Col>
        </row>
        <row>
          <Col span="24">
          <FormItem label="关联字段：">
            <Select v-model=" innerFormItem.selectField.select">
              <Option
                v-for="item of innerFormItem.selectField"
                :key="item.value"
                :value="item.value">{{ item.key }}</Option>
            </Select>
          </FormItem>
        </Col>
        </row>
        <row class="relevance-header">
          <Col span="18">
          <FormItem label="关联关系：">
            <RadioGroup v-model="innerFormItem.radio">
              <Radio label="male">强关联</Radio>
              <Radio label="female">强关联</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
          <Col span="6">
          <Button type="primary">创建关联</Button>
        </Col>
        </row>
      </Form>
      <Table
        :columns="innerTable.title"
        :data="innerTable.data">
      </Table>
    </div>
    </Col>
  </row>
</template>

<style lang="less" scoped>
@import '../../../styles/components/common.less';
.details-menu {
  margin-bottom: 14px;
}
.relevance-header {
  .k-row {
    .flex-space-between();
  }
  .k-btn-primary {
    float: right;
  }
}
.ivu-table td.demo-table-info-column {
  background-color: #2db7f5;
  color: #fff;
}
.relevance-content {
  padding: 5px 20px 0px 1px;
}
</style>
