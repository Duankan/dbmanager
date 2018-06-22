<script>
import config from 'config';
//样式类型
const styleType = [
  {
    value: ' ',
    label: '全部类型',
  },
  {
    value: '1',
    label: '点类型',
  },
  {
    value: '2',
    label: '线类型',
  },
  {
    value: '3',
    label: '面类型',
  },
  {
    value: '0',
    label: '未知类型',
  },
];

export default {
  name: 'ManageStyle',
  data() {
    return {
      tableColumns: [
        //表头
        {
          title: '样式别名',
          key: 'alias',
        },
        {
          title: '样式类型',
          key: 'type',
        },
        {
          title: '样式分类',
          key: 'classify',
        },
        {
          title: '入库时间',
          key: 'createTime',
        },
        {
          title: '操作',
          width: 170,
          align: 'center',
          render: (h, params) => {
            return (
              <div class="db-style-table-handler">
                <Button type="success" size="small">
                  预览
                </Button>
                <Button type="success" size="small" on-click={downloadPlan(params.row)}>
                  下载
                </Button>
                <Button type="error" size="small" on-click={deletePlan(params.row)}>
                  删除
                </Button>
              </div>
            );
          },
        },
      ],
      datas: [], //datas为查询出分页数据
      pageCount: 0,
      alltime: '',
      // 查询条件
      dataCondition: {
        orgId: this.$user.orgid, // 组织id
        start: '', // 样式上传时间 (可选)
        end: '', // 样式上传时间 (可选)
        alias: '', // 样式别名 (可选)
        type: '', // 样式类型(-1 全部 0 未知 1 点 2 线 3 面 4 dem类型) (可选)
        classify: '', // 样式分类(见styleTypes) (可选)
        // pageIndex: 1, // 分页索引
        // pageSize: 5, // 分页大小
      },
      styleType,
      classify: [
        //样式分类
        {
          value: ' ',
          label: '全部分类',
        },
      ],
      // 表单验证
      ruleValidate: {
        time: [{ required: true, message: '请选择一个或多个图层！', trigger: 'change' }],
        classicField: [{ required: true, message: '请选择分类字段！', trigger: 'change' }],
        classicFieldNum: [{ required: true, message: '请选择分段数！' }],
        type: [{ required: true, message: '请选择统计类型！', trigger: 'change' }],
      },
    };
  },
  created() {
    //创建模板完成
    this.getData();
    this.setStyleTypes();
  },
  methods: {
    allocationTime() {
      this.dataCondition.start = this.alltime[0];
      this.dataCondition.end = this.alltime[1];
    },
    changePage(evt) {
      //跳转页面方法
      this.dataCondition.pageIndex = evt;
      this.getData();
    },
    async getData() {
      //查询后端table数据方法
      const response = await api.db.findStyle(this.dataCondition);
      this.datas = response.data.dataSource;
      this.changeTime(this.datas);
      this.changeType(this.datas);
      this.changeStyleType(this.datas);
      this.pageCount = response.data.pageInfo.totalCount;
    },
    async setStyleTypes() {
      //查询后端数据设置样式分类的下拉框
      const styleTypes = await api.db.styleTypes();
      for (let item of styleTypes.data) {
        //alert(item.remark);
        let Type = {
          value: item.code,
          label: item.remark,
        };
        this.classify.push(Type);
      }
      this.classify.push({
        value: '其他类型',
        label: '其他类型',
      });
    },
    changeTime(datas) {
      //转换时间方法
      for (let item of datas) {
        item.createTime = new Date(item.createTime).toLocaleDateString();
      }
    },
    changeType(datas) {
      //把后端查询到的数据 类型int转换成中文方法
      for (let item of datas) {
        switch (item.type) {
          case 0:
            item.type = '未知类型';
            break;
          case 1:
            item.type = '点类型';
            break;
          case 2:
            item.type = '线类型';
            break;
          case 3:
            item.type = '面类型';
            break;
        }
      }
    },
    changeStyleType(datas) {
      //把后端查询到的数据 样式类型转换成中文方法
      for (let item of datas) {
        for (let item2 of this.classify) {
          if (item.classify == item2.value) {
            item.classify = item2.label;
          }
        }
      }
    },
    async deletePlan(evt) {
      //删除方法接口   deleteStyle
      const result = await api.db.deleteStyle({ id: evt.id });
      if (result.data.statusCode == 200) {
        this.$Message.success('删除成功！');
        this.getData();
      } else this.$Message.error('删除失败，请稍后重试！');
    },
    downloadPlan(evt) {
      //下载方法接口   deleteStyle
      window.open(`${config.project.basicUrl}/resource/styles/download/${evt.id}`);
    },
    search() {
      //查询功能
      this.dataCondition.pageIndex = 1;
      this.getData();
    },
    reset() {
      //重置功能
      // this.dataCondition.objCondition.type = '';
      // this.dataCondition.objCondition.alias = '';
      // this.dataCondition.objCondition.classify = '';
      // this.dataCondition.objCondition.start = '';
      // this.dataCondition.objCondition.end = '';
      this.getData();
    },
  },
};
</script>

<template>
  <Form
  >
    <FormItem class="style-time" >
      <span >入库时间:</span>
      <DatePicker
        v-model="alltime"
        type="daterange"
        split-panels
        placeholder="请选择入库时间"
        @on-change="allocationTime" ></DatePicker>
      <span >样式别名:</span>
      <Input
        v-model="dataCondition.alias"
        placeholder="default_point"
        clearable
      ></Input>
    </FormItem>
    <FormItem class="fo">
      <span>样式类型:</span>
      <Select
        v-model="dataCondition.type"
      >
        <Option
          v-for="item in styleType"
          :value="item.value"
          :key="item.value">{{ item.label }}</Option>
      </Select>
      <span>样式分类:</span>
      <Select
        v-model="dataCondition.classify"
      >
        <Option
          v-for="item in classify"
          :value="item.value"
          :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button
        type="primary"
        icon="ios-search"
        @click="search">查询</Button>
      <Button
        type="primary"
        @click="reset">重置</Button>
    </FormItem>
    <FormItem>
      <Table
        :columns="tableColumns"
        :data="datas"
      >
      </Table>
    </FormItem>
    <FormItem>
      <Page
        :total="pageCount"
        :page-size="10"
        :page-size-opts="[10, 20, 30, 40]"
        size="small"
        show-total
        show-elevator
        @on-change="changePage"></Page>
    </FormItem>
  </Form>
</template>

<style lang="less" scoped>
@w: 250px;
@fw: 100%;
.style-time {
  width: @fw;
  * {
    width: @w;
  }
}

.fo {
  width: @fw;
  * {
    width: @w;
  }
  button {
    width: 70px;

    margin: 0 30px 0 30px;
  }
}
</style>
