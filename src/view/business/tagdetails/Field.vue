<script>
export default {
  name: 'ExtendField',
  props: {
    rowData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      //表格数据
      tableData: [],
      //表格标题
      tableTitle: [
        {
          type: 'selection',
          width: 60,
        },
        {
          title: '字段名称',
          key: 'name',
          align: 'center',
        },
        {
          title: '数据类型',
          key: 'type',
          align: 'center',
        },
        {
          title: '是否允许为空',
          key: 'allowNull',
          align: 'center',
          render: (h, params) => {
            const row = params.row;
            const color = row.status === 1 ? 'green' : 'red';
            const text = row.status === 1 ? '可用' : '不可用';
            return h(
              'Tag',
              {
                props: {
                  type: 'dot',
                  color: color,
                },
              },
              text
            );
          },
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
      //新增字段
      addField: false,
      //对话框数据
      addForm: {},
    };
  },
  mounted() {
    this.tableData = JSON.parse(this.rowData.rescolumn);
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
  <div
    :class="{shade:rowData.readonly}"
    class="details-content">
    <div class="details-menu">
      <div>
        <span class="table-content-title-icon"></span>
        <span class="table-content-title-content"><b>元数据管理</b></span>
      </div>
      <Button
        v-show="!rowData.readonly"
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
              <Input v-model="addForm.name"/>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="22">
            <FormItem label="字段类型：">
              <Input v-model="addForm.type"/>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="22">
            <FormItem label="字段长度：">
              <Input v-model="addForm.length"/>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="22">
            <FormItem label="是否允许为空：">
              <Input v-model="addForm.allownull"/>
              <Checkbox label="是"></Checkbox>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
    <Table
      :columns="tableTitle"
      :data="tableData">
    </Table>
  </div>
</template>

<style lang="less" scoped>
@import '../../../styles/components/common.less';
.details-content {
  padding: 1px;
  .details-menu {
    .flex-space-between();
    margin-bottom: 14px;
  }
}
</style>
