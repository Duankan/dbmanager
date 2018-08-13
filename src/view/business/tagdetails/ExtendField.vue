<script>
export default {
  name: 'Field',
  data() {
    return {
      extendFieldTable: {
        tableTitle: [
          {
            title: '扩展字段名称',
            key: 'name',
          },
          {
            title: '字段类型',
            key: 'dataType',
          },
          {
            title: '处理规则',
            key: 'processRule',
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
      insideFieldForm: {
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
      },
    };
  },
};
</script>

<template>
  <row>
    <!-- 扩展字段列表 -->
    <Col span="12">
    <div>
      <div class="details-menu">
        <span class="table-content-title-icon"></span>
        <span class="table-content-title-content"><b>扩展字段列表</b></span>
      </div>
      <div class="left-content">
        <Table
          :columns="extendFieldTable.tableTitle"
          :data="extendFieldTable.extendFieldData">
        </Table>
      </div>
    </div>
    </Col>
    <!-- 内部字段关联 -->
    <Col span="12">
    <div class="right-content">
      <div class="details-menu">
        <span class="table-content-title-icon"></span>
        <span class="table-content-title-content"><b>内部字段关联</b></span>
      </div>
      <div>
        <Form
          :label-width="100"
          :model="externalFormItem">
          <Row>
            <Col span="24">
            <FormItem label="扩展字段名称：">
              <Select v-model="insideFieldForm.selectFieldName">
                <Option
                  v-for="item of insideFieldForm.selectFieldName"
                  :key="item.value"
                  :value="item.value">{{ item.key }}</Option>
              </Select>
            </FormItem>
          </Col>
          </Row>
          <Row>
            <Col span="24">
            <FormItem label="字段类型：">
              <Select v-model="insideFieldForm.selectFieldType">
                <Option
                  v-for="item of insideFieldForm.selectFieldType"
                  :key="item.value"
                  :value="item.value">{{ item.key }}</Option>
              </Select>
            </FormItem>
          </Col>
          </Row>
          <Row>
            <Col span="24">
            <FormItem label="字段分类：">
              <Select v-model="insideFieldForm.selectClassify">
                <Option
                  v-for="item of insideFieldForm.selectClassify"
                  :key="item.value"
                  :value="item.value">{{ item.key }}</Option>
              </Select>
            </FormItem>
          </Col>
          </Row>
          <Row>
            <Col span="24">
            <FormItem label="处理规则：">
              <Select v-model="insideFieldForm.selectProcessRule">
                <Option
                  v-for="item of insideFieldForm.selectProcessRule"
                  :key="item.value"
                  :value="item.value">{{ item.key }}</Option>
              </Select>
            </FormItem>
          </Col>
          </Row>
        </Form>
      </div>
    </div>
    </Col>
  </row>
</template>

<style lang="less" scoped>
@import '../../../styles/components/common.less';
.details-menu {
  margin-bottom: 14px;
}
.left-content {
  padding: 5px 20px 0px 1px;
}
.right-content {
  padding: 5px 20px 0px 1px;
}
</style>
