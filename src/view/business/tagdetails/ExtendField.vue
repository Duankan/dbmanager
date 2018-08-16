<script>
// 扩展字段标签名
export default {
  name: 'Field',
  props: {
    rowData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      //扩展字段列表
      extendFieldTable: {
        tableTitle: [
          {
            title: '扩展字段名称',
            key: 'name',
            align: 'center',
          },
          {
            title: '字段类型',
            key: 'dataType',
            align: 'center',
          },
          {
            title: '处理规则',
            key: 'processRule',
            align: 'center',
          },
          {
            title: '操作',
            key: 'operation',
            render: (h, params) => {
              return h('div', [
                h(
                  'a',
                  {
                    props: {},
                    style: {
                      marginRight: '5px',
                    },
                    on: {
                      click: () => {
                        this.remove(params.index);
                      },
                    },
                  },
                  '删除'
                ),
                h(
                  'a',
                  {
                    props: {},
                    style: {
                      marginRight: '5px',
                    },
                    on: {
                      click: () => {
                        this.show(params.index);
                      },
                    },
                  },
                  '修改'
                ),
              ]);
            },
          },
        ],
        extendFieldData: [
          {
            name: 'RT192476',
            dataType: 'string',
            processRule: 'where 1=1',
          },
          {
            name: 'RT192476',
            dataType: 'string',
            processRule: 'where 1=1',
          },
        ],
      },
      //内部字段关联
      innerFieldForm: {
        //扩展字段名称
        selectFieldName: [
          {
            value: 'beijing1',
            key: 'New York1',
          },
          {
            value: 'shanghai1',
            key: 'London1',
          },
        ],
        //字段类型
        selectFieldType: [
          {
            value: 'beijing2',
            key: 'New York2',
          },
          {
            value: 'shanghai2',
            key: 'London2',
          },
        ],
        //字段分类
        selectClassify: [
          {
            value: 'beijing3',
            key: 'New York3',
          },
          {
            value: 'shanghai3',
            key: 'London3',
          },
        ],
        //处理规则
        selectProcessRule: [
          {
            value: 'beijing4',
            key: 'New York4',
          },
          {
            value: 'shanghai4',
            key: 'London4',
          },
        ],
        //规则参数标题
        innerFieldTableTitle: [
          {
            title: '参数名称',
            key: 'paramName',
            align: 'center',
          },
          {
            title: '参数值',
            key: 'paramValue',
            align: 'center',
          },
        ],
        //规则参数数据
        innerFieldTableData: [
          {
            paramName: 'c1',
            paramValue: '',
          },
          {
            paramName: 'c1',
            paramValue: '',
          },
        ],
      },
      addField: false,
      //新增字段数据
      addForm: {},
    };
  },
  methods: {
    ok() {
      this.$Message.info('Clicked ok');
    },
    cancel() {
      this.$Message.info('Clicked cancel');
    },
  },
};
</script>

<template>
  <row :gutter="24">
    <!-- 扩展字段列表 -->
    <Col span="12">
    <div>
      <div class="details-menu">
        <span class="table-content-title-icon"></span>
        <span class="table-content-title-content"><b>扩展字段列表</b></span>
      </div>
      <div class="relevance-content">
        <Table
          :columns="extendFieldTable.tableTitle"
          :data="extendFieldTable.extendFieldData">
        </Table>
      </div>
    </div>
    </Col>
    <!-- 内部字段关联 -->
    <Col span="12">
    <div class="relevance-content">
      <div class="details-menu">
        <span class="table-content-title-icon"></span>
        <span class="table-content-title-content"><b>内部字段关联</b></span>
      </div>
      <Form
        :label-width="100"
        :model="innerFieldForm"
        label-position="left">
        <Row>
          <Col span="24">
          <FormItem label="扩展字段名称：">
            <Select v-model="innerFieldForm.selectFieldName.select">
              <Option
                v-for="item of innerFieldForm.selectFieldName"
                :key="item.value"
                :value="item.value">{{ item.key }}</Option>
            </Select>
          </FormItem>
            </Col>
        </Row>
        <Row>
          <Col span="24">
          <FormItem label="字段类型：">
            <Select v-model="innerFieldForm.selectFieldType.select">
              <Option
                v-for="item of innerFieldForm.selectFieldType"
                :key="item.value"
                :value="item.value">{{ item.key }}</Option>
            </Select>
          </FormItem>
            </Col>
        </Row>
        <Row>
          <Col span="24">
          <FormItem label="字段分类：">
            <Select v-model="innerFieldForm.selectClassify.select">
              <Option
                v-for="item of innerFieldForm.selectClassify"
                :key="item.value"
                :value="item.value">{{ item.key }}</Option>
            </Select>
          </FormItem>
            </Col>
        </Row>
        <Row>
          <Col span="24">
          <FormItem label="处理规则：">
            <Select v-model="innerFieldForm.selectProcessRule.select">
              <Option
                v-for="item of innerFieldForm.selectProcessRule"
                :key="item.value"
                :value="item.value">{{ item.key }}</Option>
            </Select>
          </FormItem>
            </Col>
        </Row>
        <Row>
          <Col span="24">
          <div class="table-transparent">
            <Table
              :columns="innerFieldForm.innerFieldTableTitle"
              :data="innerFieldForm.innerFieldTableData"
              border>
            </Table>
          </div>
            </Col>
        </Row>
      </Form>
    </div>
    <Col span="24">
    <Button
      class="btn-right"
      type="primary"
      @click="addField = true">
      新增字段</Button>
    <Modal
      v-model="addField"
      title="新增字段"
      @on-cancel="cancel"
      @on-ok="ok">
      <Form
        :label-width="100"
        :model="addForm">
        <Row>
          <Col span="22">
          <FormItem label="字段名称：">
            <Input/>
          </FormItem>
            </Col>
        </Row>
      </Form>
    </Modal>
      </Col>
    </div>
    </Col>
  </row>
</template>

<style lang="less" scoped>
@import '../../../styles/components/common.less';
.table-transparent {
  /deep/.k-table {
    th {
      background-color: @table-td;
    }
  }
}
.details-menu {
  margin-bottom: 14px;
}
.btn-right {
  float: right;
  margin: 18px 20px 0 0;
}
</style>
