<script>
export default {
  name: 'IncidenceRelation',
  data() {
    return {
      //外部关联表单
      externalFormItem: {
        //源表名
        sourceTableName: 'table1',
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
        radio: '2',
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
            width: 98,
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
        radio: '1',
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
  <Row :gutter="24">
    <!-- 外部字段关联 -->
    <Col span="12">
    <div class="relevance-content">
      <div class="details-menu">
        <span class="table-content-title-icon"></span>
        <span class="table-content-title-content"><b>外部关联字段</b></span>
      </div>
      <div class="left-content">
        <Form
          :label-width="70"
          :model="externalFormItem"
          label-position="left">
          <Row>
            <Col span="12">
            <FormItem label="源表名：">
              <Input v-model="externalFormItem.sourceTableName"></Input>
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
          </Row>
          <Row>
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
          </Row>
          <Row class="relevance-header">
            <Col span="18">
            <FormItem label="关联关系：">
              <RadioGroup v-model="externalFormItem.radio">
                <Radio label="1">强关联</Radio>
                <Radio label="2">强关联</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
            <Col span="6">
            <Button type="primary">创建关联</Button>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col span="24">
          <Table
            :columns="externalTable.title"
            :data="externalTable.data">
          </Table>
        </Col>
        </Row>
      </div>
    </div>
    </Col>
    <div><Divider type="vertical" /></div>
    <!-- 内部字段关联 -->
    <Col span="12">
    <div class="relevance-content">
      <div class="details-menu">
        <span class="table-content-title-icon"></span>
        <span class="table-content-title-content"><b>内部关联字段</b></span>
      </div>
      <div class="right-content">
        <Form
          :label-width="70"
          :model="innerFormItem"
          label-position="left">
          <Row>
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
          </Row>
          <Row>
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
          </Row>
          <Row class="relevance-header">
            <Col span="18">
            <FormItem label="关联关系：">
              <RadioGroup v-model="innerFormItem.radio">
                <Radio label="1">强关联</Radio>
                <Radio label="2">强关联</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
            <Col span="6">
            <Button type="primary">创建关联</Button>
            </Col>
          </Row>
        </Form>
        <Col span="24">
        <Table
          :columns="innerTable.title"
          :data="innerTable.data">
        </Table>
        </Col>
      </div>
    </div>
    </Col>
  </Row>
</template>

<style lang="less" scoped>
@import '../../../styles/components/common.less';
.details-menu {
  margin-bottom: 14px;
}
.relevance-header {
  .k-Row {
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
/deep/.k-form-item-label {
  padding: 10px 0px;
}
</style>
