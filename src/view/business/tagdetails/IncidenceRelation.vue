<script>
export default {
  name: 'IncidenceRelation',
  props: {
    rowData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      //外部关联字段
      externalData: {
        sourceName: '',
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
      },
      radio: '0',
      //外部关联表格
      externalTable: {
        title: [
          {
            title: '源表名',
            key: 'databaseName',
            className: 'demo-table-info-column',
            align: 'center',
          },
          {
            title: '源字段',
            key: 'columnSrc',
            align: 'center',
          },
          {
            title: '关联表名',
            key: 'tableName',
            align: 'center',
          },
          {
            title: '关联字段名',
            key: 'columnDes',
            align: 'center',
            width: 98,
          },
          {
            title: '关联关系',
            key: 'relatedType ',
            align: 'center',
          },
        ],
        //外部关联表格数据
        data: [
          // {
          //   databaseName: 18,
          //   columnSrc: 'New',
          //   tableName: 'table',
          //   columnDes: 'table',
          //   relatedType: 'table',
          // },
          // {
          //   databaseName: 18,
          //   columnSrc: 'New',
          //   tableName: 'table',
          //   columnDes: 'table',
          //   relatedType: 'table',
          // },
        ],
      },
      //内部关联表单
      innerFormItem: {
        // 源字段下拉框
        selectcolumnsrc: [
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
      },
      //内部关联表格
      innerTable: {
        title: [
          {
            title: '源字段',
            key: 'columnSrc',
            align: 'center',
          },
          {
            title: '关联字段名',
            key: 'columnDes',
            align: 'center',
          },
          {
            title: '关联关系',
            key: 'relatedType',
            align: 'center',
          },
        ],
        //内部关联表格数据
        data: [],
      },
    };
  },
  mounted() {
    //源表名
    this.externalData.sourceName = this.rowData.name;
    //源字段下拉框数据
    this.externalData.columnsrcData = JSON.parse(this.rowData.rescolumn);
    //源字段初始值
    this.externalData.columnsrc = this.externalData.columnsrcData[0].name;
    //获取关联表名
    // async queryTableName() {
    //   const response = await api.db.findFieldsByTableName()
    //   .then(p => {
    //     console.log(response);
    //   });
    // },
  },
};
</script>

<template>
  <Row :gutter="24">
    <!-- 外部字段关联 -->
    <Col span="12">
    <div
      :class="{shade:rowData.readonly}"
      class="relevance-content">
      <div class="details-menu">
        <span class="table-content-title-icon"></span>
        <span class="table-content-title-content"><b>外部关联字段</b></span>
      </div>
      <div class="left-content">
        <Form
          :label-width="70"
          :model="externalData"
          label-position="left">
          <Row>
            <Col span="12">
            <FormItem label="源表名：">
              <Input
                v-model="externalData.sourceName"
                disabled
              />
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="源字段：">
              <Select v-model="externalData.columnsrc">
                <Option
                  v-for="item of externalData.columnsrcData"
                  :key="item.name"
                  :value="item.name">{{ item.name }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="关联表名：">
              <Select v-model="externalData.tablename">
                <Option
                  v-for="item of externalData.selectTableName"
                  :key="item.value"
                  :value="item.value">{{ item.value }}</Option>
              </Select>
            </FormItem>
              </Col>
            <Col span="12">
            <FormItem label="关联字段：">
              <Select v-model="externalData.columndes">
                <Option
                  v-for="item of externalData.selectField"
                  :key="item.value"
                  :value="item.value">{{ item.value }}</Option>
              </Select>
            </FormItem>
              </Col>
          </Row>
          <Row class="relevance-header">
            <Col span="18">
            <FormItem label="关联关系：">
              <RadioGroup v-model="externalData.relatedtype">
                <Radio label="0">强关联</Radio>
                <Radio label="1">弱关联</Radio>
              </RadioGroup>
            </FormItem>
              </Col>
            <Col span="6">
            <Button
              v-show="!rowData.readonly"
              type="primary">创建关联
            </Button>
              </Col>
          </Row>
        </Form>
        <Col span="24">
        <Table
          :columns="externalTable.title"
          :data="externalTable.data">
        </Table>
          </Col>
      </div>
    </div>
    </Col>
    <!-- 内部字段关联 -->
    <Col span="12">
    <div
      :class="{shade:rowData.readonly}"
      class="relevance-content">
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
              <Select v-model="externalData.columnsrc">
                <Option
                  v-for="item of externalData.columnsrcData"
                  :key="item.name"
                  :value="item.name">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          </Row>
          <Row>
            <Col span="24">
            <FormItem label="关联字段：">
              <Select v-model=" innerFormItem.selectField">
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
                <Radio label="0">强关联</Radio>
                <Radio label="1">弱关联</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
            <Col span="6">
            <Button
              v-show="!rowData.readonly"
              type="primary">
              创建关联</Button>
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
/deep/.k-table td.demo-table-info-column {
  background-color: #dcdee2;
  border: 1px solid #dcdee2;
}
/deep/.k-form-item-label {
  padding: 10px 0px;
}
</style>
