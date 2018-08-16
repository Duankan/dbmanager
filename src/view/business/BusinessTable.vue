<script>
import DataDetails from './DataDetails';
export default {
  name: 'BusinessTable',
  components: {
    DataDetails,
  },
  data() {
    return {
      display: true,
      tableData: [], //表格数据
      tableHeight: 200, //表格的高度
      totalCount: 1, //表格总页数
      pageIndex: 1, //表格当前页
      selectData: null,
      tableColumns1: [
        {
          type: 'selection',
          width: 60,
        },
        {
          title: '元素名称',
          key: 'name',
        },
        {
          title: '描述',
          key: 'describe',
          width: 300,
        },
        {
          title: '标签',
          key: 'keyword',
          // render: (h, params) => {
          //   return h('div');
          // },
        },
        {
          title: '分类',
          key: 'restype',
          // render: (h, params) => {
          //   return h('div');
          // },
        },

        {
          title: '状态',
          key: 'status',
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
          title: '创建时间',
          key: 'createtime',
          // render: (h, params) => {
          //   const row = params.row;
          //   return h('div', this.formatDate(row.update));
          // },
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
                      // 隐藏元数据管理页面
                      this.display = false;
                      this.selectData = params.row;
                      // debugger;
                      // this.show(params.index);
                    },
                  },
                },
                '编辑'
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
                      // 隐藏元数据管理页面
                      this.display = false;
                      this.selectData = params.row;
                      // debugger;
                      // this.show(params.index);
                    },
                  },
                },
                '预览'
              ),
            ]);
          },
        },
      ],
    };
  },
  mounted() {
    //调用获取表格数据的方法
    this.mocktableData();
    //自适应高度
    this.tableHeight = document.getElementsByClassName('table-content')[0].offsetHeight - 200;
    window.onresize = temp => {
      this.tableHeight = document.getElementsByClassName('table-content')[0].offsetHeight - 200;
    };
  },
  methods: {
    async mocktableData() {
      const response = await api.db.findpagelist({
        name: '', //表名
        restype: '', //资源分类
        keyword: '', //标签关键字
        orderfield: '', //排序字段
        sort: '', //排序方式
        pageinfo: {
          pageIndex: this.pageIndex, //当前页
          pageSize: 10, //每页总数
          orderby: '', //排序字段
        },
      });
      //获取表格数据
      this.tableData = response.data.dataSource;
      //获取表格总页数
      this.totalCount = response.data.pageInfo.totalCount;
      //获取当前页
      this.pageIndex = response.data.pageInfo.pageIndex;
    },
    changePage(currPage) {
      //获取点击后的页码
      this.pageIndex = currPage;
      //重新渲染跳转的页面
      this.mocktableData(this.pageIndex);
    },
    remove(index) {
      this.data6.splice(index, 1);
    },
    show(index) {
      this.$Modal.info({
        title: 'User Info',
        content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${
          this.data6[index].address
        }`,
      });
    },
  },
  // formatDate(date) {
  //   const y = date.getFullYear();
  //   let m = date.getMonth() + 1;
  //   m = m < 10 ? '0' + m : m;
  //   let d = date.getDate();
  //   d = d < 10 ? '0' + d : d;
  //   return y + '-' + m + '-' + d;
  // },
};
</script>

<template>
  <div class="table-content">
    <div
      v-if="display">
      <div class="table-content-title">
        <span class="table-content-title-icon"></span>
        <span class="table-content-title-content"><b>元数据管理</b></span>
      </div>
      <div class="table-content-btn"> <Button type="primary">新增</Button></div>
      <Table
        :data="tableData"
        :height="tableHeight"
        :columns="tableColumns1"
      ></Table>
      <div class="page">
        <div class="page-item">
          <Page
            :total="totalCount"
            :current="pageIndex"
            @on-change="changePage"
          ></Page>
        </div>
      </div>
    </div>
    <div
      v-else>
      <DataDetails
        :business-data="selectData"
        @backEvent="display=true"></DataDetails>
    </div>
  </div>
</template>

<style lang="less" scoped>
.table-content {
  width: 92%;
  margin: 0 auto;
  height: 100%;
}
.table-content-title {
  height: 60px;
  line-height: 60px;
}
.table-content-title-icon {
  width: 3px;
  height: 5px;
  border: 1px solid #2d8cf0;
}
.table-content-title-content {
  font-size: 14px;
  padding-left: 8px;
}
.table-content-btn {
  width: 100%;
  height: 45px;
  button {
    float: right;
  }
}
.page {
  margin: 10px;
  overflow: hidden;
  .page-item {
    float: right;
  }
}
</style>
