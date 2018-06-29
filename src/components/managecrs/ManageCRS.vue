<script>
import config from 'config';
export default {
  name: 'ManageCRS',
  data() {
    return {
      tableColumns: [
        {
          title: '空间参考名称',
          key: 'srName',
        },
        {
          title: '空间参考ID',
          key: 'id',
        },
      ],
      datas: [],
      dataCondition: {
        objCondition: {
          authSrId: '',
        },
        pageIndex: 1,
        pageSize: 5,
      },
      desc: '',
      pageCount: 0,
    };
  },
  created() {
    //创建模板完成
    this.getData();
  },
  methods: {
    // 输入id调用另外的方法
    async getData() {
      //查询后端table数据方法
      const response = await api.db.findSrs(this.dataCondition);
      this.datas = response.data.dataSource;
      this.pageCount = response.data.pageInfo.totalCount;
    },
    // 改变分页
    changePage(evt) {
      //跳转页面方法
      this.dataCondition.pageIndex = evt;
      this.getData();
    },
    getWKTInfo(info) {
      this.desc = info.srText;
    },

    // 根据输入的名称，查询空间参考信息
  },
};
</script>

<template>
  <Form
    ref="formValidate"
    :model="dataCondition"
    :label-width="125"
    label-position="left"
    class="db-manager-crs"
  >
    <FormItem
      label="空间参考系统："
    >
      <Input
        v-model="dataCondition.objCondition.authSrId"
        placeholder="请输入您需要查询的空间参考"
        @on-change="getData"></Input>
    </FormItem>
    <FormItem class="show-crs">
      <Table
        :columns="tableColumns"
        :data="datas"
        @on-row-click="getWKTInfo">
      </Table>
      <Page
        :total="pageCount"
        :page-size="10"
        :page-size-opts="[10, 20, 30, 40]"
        size="small"
        show-total
        show-elevator
        @on-change="changePage"></Page>
    </FormItem>
    <FormItem
      label="空间参考系统WKT："
    >
      <Input
        v-model="desc"
        :autosize="{minRows: 2,maxRows: 5}"
        type="textarea"
        placeholder="空间参考系统WKT."></Input>
    </FormItem>
  </Form>

</template>

<style lang="less" scoped>
.db-manager-crs {
  .show-crs /deep/.k-form-item-content {
    margin-left: 0 !important;
  }
  .k-page {
    margin-top: 10px;
  }

  /deep/textarea {
    height: 115px !important;
  }
}
</style>
