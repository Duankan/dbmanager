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
      //字段操作标题
      fieldOperat: '',
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
                    click: async e => {
                      //替换标题
                      this.fieldOperat = '修改字段';
                      //打开模板
                      this.addField = true;
                      this.addForm = params.row;
                      console.log(this.addForm);
                      const response = await api.db.updateFields({
                        id: this.rowData.id,
                        dto: this.addForm,
                      });
                    },
                  },
                },
                '修改'
              ),
            ]);
          },
        },
      ],
      //对话框模板显示
      addField: false,
      //对话框数据
      addForm: {},
    };
  },
  mounted() {
    //表格数据处理
    if (this.rowData.rescolumn) {
      this.tableData = JSON.parse(this.rowData.rescolumn);
      console.log(this.tableData);
    }
  },
  methods: {
    //打开新增字段模板
    openAddField() {
      this.addField = true;
      this.fieldOperat = '新增字段';
      this.addForm = {};
    },
    // 新增字段
    async addFieldData() {
      const response = await api.db
        .addFields({
          id: this.rowData.id,
          dto: this.addForm,
        })
        .then(p => {
          this.tableData.push(this.addForm);
        });
      this.addForm = {};
      console.log(this.rowData);
    },
    cancel() {},
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
        @click="openAddField">
        新增字段</Button>
      <Modal
        v-model="addField"
        :title = "fieldOperat"
        @on-cancel="cancel"
        @on-ok="addFieldData">
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
              <Checkbox v-model="addForm.allownull">是</Checkbox>
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
