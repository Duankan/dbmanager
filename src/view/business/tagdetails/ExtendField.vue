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
      //新增按钮显示
      addBtn: true,
      //单条扩展字段数据
      extendFieldData: {},
      //修改前扩展字段数据
      oldExtendField: {},
      //扩展字段列表数据
      tableData: [],
      //扩展字段列表标题
      tableTitle: [
        {
          title: '扩展字段名称',
          key: 'name',
          align: 'center',
        },
        {
          title: '字段类型',
          key: 'type',
          align: 'center',
        },
        {
          title: '处理规则',
          key: 'extendMethod',
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
                      //显示修改字段按钮
                      this.addBtn = false;
                      //修改前扩展字段数据
                      this.oldExtendField = JSON.parse(JSON.stringify(params.row));
                      //修改扩展字段初始值
                      this.extendFieldData = JSON.parse(JSON.stringify(this.oldExtendField));
                    },
                  },
                },
                '修改'
              ),
            ]);
          },
        },
      ],
      //内部字段关联下拉框
      extendFieldSelect: {
        type: [
          {
            value: 'int',
            key: 'int',
          },
          {
            value: 'char',
            key: 'char',
          },
        ],
        classfiy: [
          {
            value: '字段分类1',
            key: '字段分类1',
          },
          {
            value: '字段分类2',
            key: '字段分类2',
          },
        ],
      },
      //规则参数
      innerFieldForm: {
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
    };
  },
  mounted() {
    //表格数据处理
    if (this.rowData.extendmeta) {
      this.tableData = JSON.parse(this.rowData.extendmeta);
    }
  },
  methods: {
    //新增字段
    async addFieldData() {
      await api.db
        .addExtendedFields({
          id: this.rowData.id,
          dto: this.extendFieldData,
        })
        .then(p => {
          this.tableData.push(this.extendFieldData);
          this.extendFieldData = {};
        });
    },
    //修改字段
    async modFieldData() {
      await api.db
        .updateExtendedFields({
          id: this.rowData.id,
          oldname: this.oldExtendField.name,
          dto: this.extendFieldData,
        })
        .then(p => {
          //替换字段更新到表格
          this.tableData.splice(this.extendFieldData._index, 1, this.extendFieldData);
          //显示新增按钮
          this.addBtn = true;
          //清空表格数据
          this.extendFieldData = {};
        });
    },
    //取消内部修改按钮
    cancelInnerMod() {
      //内部创建关联按钮显示
      this.addBtn = true;
      this.extendFieldData = {};
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
      <div
        :class="{shade:rowData.readonly}"
        class="relevance-content">
        <Table
          :columns="tableTitle"
          :data="tableData">
        </Table>
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
        <span class="table-content-title-content"><b>内部字段关联</b></span>
      </div>
      <Form
        :label-width="100"
        :model="extendFieldData"
        label-position="left">
        <Row>
          <Col span="24">
          <FormItem label="扩展字段名称：">
            <Input
              v-model="extendFieldData.name"
              placeholder="扩展字段名称" />
          </FormItem>
            </Col>
        </Row>
        <Row>
          <Col span="24">
          <FormItem label="字段类型：">
            <Select v-model="extendFieldData.type">
              <Option
                v-for="item of extendFieldSelect.type"
                :key="item.value"
                :value="item.value">{{ item.key }}
              </Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <FormItem label="字段分类：">
            <Select v-model="extendFieldData.classfiy">
              <Option
                v-for="item of extendFieldSelect.classfiy"
                :key="item.value"
                :value="item.value">{{ item.key }}
              </Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <FormItem label="处理规则：">
            <Input
              :rows="4"
              v-model="extendFieldData.extendmethod"
              type="textarea"
              placeholder="请选择多个标签管理里面的标签" />
          </FormItem>
            </Col>
        </Row>
        <Row>
          <Col span="24">
          <FormItem label="是否允许为空：">
            <Checkbox v-model="extendFieldData.allownull">是</Checkbox>
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
    <div class="flex-end">
      <Button
        v-if ="addBtn"
        v-show="!rowData.readonly"
        class="btn-right"
        type="primary"
        @click="addFieldData">新增字段
      </Button>
      <Button
        v-else
        v-show="!rowData.readonly"
        class="btn-right"
        type="primary"
        @click="modFieldData">修改字段
      </Button>
      <Button
        v-if="!addBtn"
        v-show="!rowData.readonly"
        class= "btn-right"
        @click="cancelInnerMod"
      >取消修改
      </Button>
    </div>
    </Col>
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
