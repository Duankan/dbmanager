<script>
import RuleValidate from './rule-validate.js';
import DataDictionary from './data-dictionary.js';
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
      //已选标签
      keywordSelect: [],
      //全部标签名
      tags: [],
      //表单验证
      validates: RuleValidate,
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
          title: '标签',
          key: 'keyword',
          align: 'center',
        },
        // {
        //   title: '是否允许为空',
        //   key: 'allowNull',
        //   align: 'center',
        //   render: (h, params) => {
        //     const row = params.row;
        //     const color = row.allowNull === 1 ? 'green' : 'red';
        //     const text = row.allowNull === 1 ? '可用' : '不可用';
        //     return h(
        //       'Tag',
        //       {
        //         props: {
        //           type: 'dot',
        //           color: color,
        //         },
        //       },
        //       text
        //     );
        //   },
        // },
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
                      //替换标题
                      this.fieldOperat = '修改字段';
                      //打开修改模板
                      this.fieldDialog = true;
                      console.log(params.row);
                      //修改模板赋值
                      this.fieldData = JSON.parse(JSON.stringify(params.row));
                      this.oldFieldData = JSON.parse(JSON.stringify(params.row));
                      //标签字符串转数组
                      if (typeof this.fieldData.keyword === 'string') {
                        // this.fieldData.keywordArray = this.fieldData.keyword;
                        // this.fieldData.keywordArray = this.fieldData.keywordArray.split(',');
                      }
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
      fieldDialog: false,
      //对话框数据
      fieldData: {},
      //修改前对话框数据
      oldFieldData: {},
      // 字段类型下拉框
      fieldTypeSelect: DataDictionary.type,
    };
  },
  mounted() {
    //表格数据处理
    if (this.rowData.rescolumn) {
      this.tableData = JSON.parse(this.rowData.rescolumn);
    }
    //获取标签名
    this.queryTagData();
  },
  methods: {
    //打开新增字段模板
    openFieldDialog() {
      this.fieldDialog = true;
      this.fieldOperat = '新增字段';
      this.fieldData = {};
    },
    //字段修改模态框
    ok(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          //按钮判断
          if (this.fieldOperat === '新增字段') {
            //调用新增字段
            this.addFieldData();
            this.$Message.success('操作成功');
          } else if (this.fieldOperat === '修改字段') {
            this.modFieldData();
            this.$Message.success('操作成功');
          }
        } else {
          this.$Message.error('请完善表单');
        }
      });
    },
    cancel() {},
    // 新增字段
    async addFieldData() {
      //标签数据处理
      this.fieldData.keyword = this.fieldData.keywordArray.concat();
      this.fieldData.keyword = this.fieldData.keyword.join(',');
      await api.db
        .addFields({
          id: this.rowData.id,
          dto: this.fieldData,
        })
        .then(p => {
          this.tableData.push(this.fieldData);
        });
      this.fieldData = {};
      console.log(this.rowData);
    },
    //修改字段
    async modFieldData() {
      //标签数据处理
      this.fieldData.keyword = this.fieldData.keywordArray.concat();
      this.fieldData.keyword = this.fieldData.keyword.join(',');
      await api.db
        .updateFields({
          id: this.rowData.id,
          oldname: this.oldFieldData.name,
          dto: this.fieldData,
        })
        .then(p => {
          //替换表格数据
          this.tableData.splice(this.fieldData._index, 1, this.fieldData);
        });
    },
    // 获取标签数据
    async queryTagData() {
      await api.db.findallBusiness().then(p => {
        if (typeof p.data == 'string') {
          this.tags = p.data;
          this.tags = this.tags.split(',');
        } else {
          this.tags = p.data;
        }
      });
    },
    //点击复选框触发事件
    checked(event) {
      //已选标签名
      console.log('点击复选框EVENT数据为');
      console.log(event);
      // let copyKeyword = event.concat();
      this.fieldData.keywordArray = event.concat();
      // this.fieldData.keywordArray = [...copyKeyword];
      // this.fieldData.keywordArray = Array.from(new Set(this.fieldData.keywordArray));
      console.log('点击复选框更新表单数据为');
      console.log(this.fieldData.keywordArray);
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
        @click="openFieldDialog">
        新增字段</Button>
      <Modal
        v-model="fieldDialog"
        :title = "fieldOperat"
        width="500"
        @on-cancel="cancel"
        @on-ok="ok('fieldData')">
        <Form
          ref="fieldData"
          :rules="validates"
          :label-width="100"
          :model="fieldData">
          <Row>
            <Col span="22">
            <FormItem
              prop="name"
              label="字段名称：">
              <Input v-model="fieldData.name"/>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="22">
            <FormItem
              prop="type"
              label="字段类型：">
              <Select
                v-model="fieldData.type"
                filterable>
                <Option
                  v-for="item of fieldTypeSelect"
                  :key="item"
                  :value="item">{{ item }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="22">
            <FormItem
              label="字段描述：">
              <Input v-model="fieldData.describe"/>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="22">
            <FormItem
              label="标签：">
              <CheckboxGroup
                v-model="fieldData.keywordArray"
                @on-change="checked">
                <Checkbox
                  v-for="(item,index) of tags"
                  :key ="index"
                  :label="item.name">
                </Checkbox>
              </CheckboxGroup>
            </FormItem>
            </Col>
          </Row>
          <!--<Row>
            <Col span="22">
            <FormItem label="是否允许为空：">
              <Checkbox v-model="fieldData.allownull">是</Checkbox>
            </FormItem>
            </Col>
          </Row>-->
        </Form>
      </Modal>
    </div>
    <Table
      :columns="tableTitle"
      :data="tableData"
      height="480">
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
