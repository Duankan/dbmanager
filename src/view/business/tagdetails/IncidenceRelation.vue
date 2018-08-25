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
      //取消按钮显示
      cancelBtnDisplay: false,
      //修改前内部关联
      oldInnerData: '',
      //修改前外部关联
      oldExternalData: '',
      //外部关联按钮显示
      externalBtnDisplay: true,
      //内部关联按钮显示
      innerBtnDisplay: true,
      // 源字段下拉框
      sourceField: [],
      //关联表名下拉框
      selectTableName: [],
      //外部关联字段下拉
      selectField: [],
      //外部关联表单
      externalData: {
        databasename: '',
        //关联关系
        relatedtype: 0,
      },
      //外部关联表格标题
      externalTableTitle: [
        // {
        //   title: '源表名',
        //   key: 'databasename',
        //   className: 'demo-table-info-column',
        //   align: 'center',
        // },
        {
          title: '源字段',
          key: 'columnsrc',
          align: 'center',
        },
        {
          title: '关联表名',
          key: 'tablename',
          align: 'center',
        },
        {
          title: '关联字段名',
          key: 'columndes',
          align: 'center',
          width: 98,
        },
        {
          title: '关联关系',
          key: 'relatedtype',
          align: 'center',
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 90,
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
                      //显示修改按钮
                      this.externalBtnDisplay = false;
                      //表格值赋给表单
                      this.externalData = JSON.parse(JSON.stringify(params.row));
                      this.oldExternalData = JSON.parse(JSON.stringify(params.row));
                      this.externalData.relatedtype += '';
                    },
                  },
                },
                '修改'
              ),
            ]);
          },
        },
      ],
      //外部关联表格数据
      externalTableData: [],
      //内部关联表单
      innerData: {
        //关联关系
        relatedtype: 0,
      },
      //内部关联表格标题
      innerTableTitle: [
        {
          title: '源字段',
          key: 'columnsrc',
          align: 'center',
        },
        {
          title: '关联字段名',
          key: 'columndes',
          align: 'center',
        },
        {
          title: '关联关系',
          key: 'relatedtype',
          align: 'center',
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 90,
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
                      //显示修改按钮
                      this.innerBtnDisplay = false;
                      //表格值赋给表单
                      this.innerData = JSON.parse(JSON.stringify(params.row));
                      this.oldInnerData = JSON.parse(JSON.stringify(params.row));
                      this.innerData.relatedtype += '';
                    },
                  },
                },
                '修改'
              ),
            ]);
          },
        },
      ],
      //内部关联表格数据
      innerTableData: [],
    };
  },
  mounted() {
    //源表名
    this.externalData.databasename = this.rowData.name;
    //获取源字段下拉框
    this.querysourceField();
    //获取关联表名
    this.queryTableName();
    //外部关联关系数组
    this.externalTableData = JSON.parse(this.rowData.outrelatedcolumn).concat();
    //内部关联关系数组
    this.innerTableData = JSON.parse(this.rowData.relatedcolumn).concat();
  },
  methods: {
    querysourceField() {
      this.sourceField = JSON.parse(this.rowData.rescolumn);
      //源字段初始值
      // this.externalData.columnsrc = this.sourceField[0].name;
    },
    // 获取关联表名
    async queryTableName() {
      await api.db.findTableName().then(p => {
        this.selectTableName = p.data;
      });
    },
    //根据关联表名获取关联字段
    async queryColumndes(tablename) {
      console.log(tablename);
      await api.db
        .findFieldsByTableName({
          name: tablename,
        })
        .then(p => {
          //外部关联字段
          this.selectField = p.data;
        });
    },
    //创建内部关联
    async addInnerRelate() {
      await api.db
        .addIncidenceRelation({
          id: this.rowData.id,
          dto: this.innerData,
        })
        .then(p => {
          let copyInnerData = JSON.parse(JSON.stringify(this.innerData));
          //更新内部关联表格
          this.innerTableData.push(copyInnerData);
          this.innerData = {};
        });
    },
    //修改内部关联
    async modInnerRelate() {
      //表格值深拷贝准备提交
      let oldInnerData = JSON.parse(JSON.stringify(this.innerData));
      await api.db
        .updateIncidenceRelation({
          id: this.rowData.id,
          oldcolumnsrc: this.oldInnerData.columnsrc, //修改之前的关联源字段名
          oldcolumndes: this.oldInnerData.columndes, //修改之前的关联目的字段名
          dto: this.innerData,
        })
        .then(p => {
          let copyInnerData = JSON.parse(JSON.stringify(this.innerData));
          //替换表格数据
          this.innerTableData.splice(copyInnerData._index, 1, copyInnerData);
          //清空表格数据
          this.innerData = {};
        });
    },
    //创建外部关联
    async addExternalRelate() {
      await api.db
        .addOutIncidenceRelation({
          id: this.rowData.id,
          dto: this.externalData,
        })
        .then(p => {
          let copyExternalData = JSON.parse(JSON.stringify(this.externalData));
          //更新外部关联表格
          this.externalTableData.push(copyExternalData);
        });
    },
    //修改外部关联
    async modExternalRelate() {
      await api.db
        .updateOutIncidenceRelation({
          id: this.rowData.id,
          oldcolumnsrc: this.oldExternalData.columnsrc, //修改之前的关联源字段名
          oldcolumndes: this.oldExternalData.columndes, //修改之前的关联目的字段名
          olddatabasename: this.oldExternalData.databasename, //修改之前的关联数据库名
          oldtablename: this.oldExternalData.tablename, //修改之前的关联表名
          dto: this.externalData,
        })
        .then(p => {
          let copyExternalData = JSON.parse(JSON.stringify(this.externalData));
          //替换表格数据
          this.externalTableData.splice(copyExternalData._index, 1, copyExternalData);
        });
    },
    //外部关联表单置空
    clearExternal() {},
    //取消外部修改按钮
    cancelExternalMod() {
      //外部创建关联按钮显示
      this.externalBtnDisplay = true;
    },
    //取消内部修改按钮
    cancelInnerMod() {
      //内部创建关联按钮显示
      this.innerBtnDisplay = true;
      this.innerData = {};
    },
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
                v-model="externalData.databasename"
                disabled
              />
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="源字段：">
              <Select v-model="externalData.columnsrc">
                <Option
                  v-for="item of sourceField"
                  :key="item.name"
                  :value="item.name">{{ item.name }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="关联表名：">
              <Select
                v-model="externalData.tablename"
                filterable
                @on-change="queryColumndes(externalData.tablename)"
              >
                <Option
                  v-for="item of selectTableName"
                  :key="item"
                  :value="item"
                >{{ item }}</Option>
              </Select>
            </FormItem>
              </Col>
            <Col span="12">
            <FormItem label="关联字段：">
              <Select v-model="externalData.columndes">
                <Option
                  v-for="item of selectField"
                  :key="item"
                  :value="item">{{ item }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row
            :class="{shade:rowData.readonly}"
            class="relevance-header">
            <Col span="12">
            <FormItem label="关联关系：">
              <RadioGroup v-model="externalData.relatedtype">
                <Radio label="0">强关联</Radio>
                <Radio label="1">弱关联</Radio>
              </RadioGroup>
            </FormItem>
              </Col>
            <Col span="12">
            <div class="flex-end">
              <Button
                v-if="externalBtnDisplay"
                v-show="!rowData.readonly"
                type="primary"
                @click="addExternalRelate"
              >创建关联
              </Button>
              <Button
                v-else
                v-show="!rowData.readonly"
                type="primary"
                @click="modExternalRelate"
              >修改关联
              </Button>
              <Button
                v-if="!externalBtnDisplay"
                v-show="!rowData.readonly"
                class= "btn-left"
                @click="cancelExternalMod"
              >取消修改
              </Button>
            </div>
            </Col>
          </Row>
        </Form>
        <Col span="24">
        <Table
          :class="{shade:rowData.readonly}"
          :columns="externalTableTitle"
          :data="externalTableData"
          height="350">
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
          :model="innerData"
          label-position="left">
          <Row>
            <Col span="24">
            <FormItem label="源字段：">
              <Select v-model="innerData.columnsrc">
                <Option
                  v-for="item of sourceField"
                  :key="item.name"
                  :value="item.name">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          </Row>
          <Row>
            <Col span="24">
            <FormItem label="关联字段：">
              <Select v-model=" innerData.columndes">
                <Option
                  v-for="item of sourceField"
                  :key="item.name"
                  :value="item.name">{{ item.name }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row class="relevance-header">
            <Col span="18">
            <FormItem label="关联关系：">
              <RadioGroup v-model="innerData.relatedtype">
                <Radio label="0">强关联</Radio>
                <Radio label="1">弱关联</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
            <Col span="6">
            <div class="flex-end">
              <Button
                v-if="innerBtnDisplay"
                v-show="!rowData.readonly"
                type="primary"
                @click="addInnerRelate"
              >创建关联
              </Button>
              <Button
                v-else
                v-show="!rowData.readonly"
                type="primary"
                @click="modInnerRelate"
              >修改关联
              </Button>
              <Button
                v-if="!innerBtnDisplay"
                v-show="!rowData.readonly"
                class= "btn-left"
                @click="cancelInnerMod"
              >取消修改
              </Button>
            </div>
            </Col>
          </Row>
        </Form>
        <Col span="24">
        <Table
          :class="{shade:rowData.readonly}"
          :columns="innerTableTitle"
          :data="innerTableData"
          height="350">
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
