<script>
import config from 'config';
export default {
  name: 'StyleTable',
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
            return h('div', { style: { width: '150px' } }, [
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  style: { marginRight: '5px' },
                  on: {
                    click: () => {
                      this.downloadPlan(params.row);
                    },
                  },
                },
                '下载'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  style: { marginRight: '5px' },
                  on: {
                    click: () => {
                      this.deletePlan(params.row);
                    },
                  },
                },
                '删除'
              ),
            ]);
          },
        },
      ],
      datas: [], //datas为查询出分页数据
      PageCount: 100,
      dataCondition: {
        objCondition: {
          // 查询条件
          orgId: this.$user.orgid, // 组织id
          start: '', // 样式上传时间 (可选)
          end: '', // 样式上传时间 (可选)
          alias: '', // 样式别名 (可选)
          type: '', // 样式类型(-1 全部 0 未知 1 点 2 线 3 面 4 dem类型) (可选)
          classify: '', // 样式分类(见styleTypes) (可选)
        },
        pageIndex: 1, // 分页索引
        pageSize: 5, // 分页大小
      },
      type: [
        //样式类型
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
      ],
      classify: [
        //样式分类
        {
          value: ' ',
          label: '全部分类',
        },
      ],
    };
  },
  async created() {
    //创建模板完成
    this.getData();
    this.setStyleTypes();
  },
  methods: {
    async changePage(evt) {
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
      this.PageCount = response.data.pageInfo.totalCount;
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
      this.dataCondition.objCondition.type = '';
      this.dataCondition.objCondition.alias = '';
      this.dataCondition.objCondition.classify = '';
      this.dataCondition.objCondition.start = '';
      this.dataCondition.objCondition.end = '';
      this.getData();
    },
  },
};
</script>

<template>
  <Form
    ref="formInline"
    inline>
    <FormItem class="ff" >
      <span >入库时间:</span>
      <DatePicker
        v-model="dataCondition.objCondition.start"
        type="date"
        placeholder="2018-06-13"
      ></DatePicker>
      <span>至:</span>
      <DatePicker
        v-model="dataCondition.objCondition.end"
        type="date"
        placeholder="2018-06-13"
      ></DatePicker>
      <span >样式别名:</span>
      <Input
        v-model="dataCondition.objCondition.alias"
        placeholder="default_point"
        clearable
      ></Input>
    </FormItem>
    <FormItem class="fo">
      <span class="Hdev-span" >样式类型:</span>
      <Select
        v-model="dataCondition.objCondition.type"
        style="width:200px">
        <Option
          v-for="item in type"
          :value="item.value"
          :key="item.value">{{ item.label }}</Option>
      </Select>
      <span class="Hdev-span">样式分类:</span>
      <Select
        v-model="dataCondition.objCondition.classify"
        style="width:200px">
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
        :total="PageCount"
        :page-size="dataCondition.pageSize"
        show-elevator
        @on-change="changePage"></Page>
    </FormItem>
  </Form>
</template>

<style lang="less" scoped>
@w: 200px;
@fw: 100%;
.ff {
  width: @fw;
  * {
    width: @w;
  }
}

.fo {
  width: @fw;
  button {
    float: right;
    margin: 0 10px 0 0;
  }
}
</style>
