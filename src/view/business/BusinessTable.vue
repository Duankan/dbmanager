<script>
export default {
  name: 'BusinessTable',
  data() {
    return {
      tableData: [],
      totalCount: '',
      tableHeight: 200,
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
          render: (h, params) => {
            return h('div');
          },
        },
        {
          title: '分类',
          key: 'restype',
          render: (h, params) => {
            return h('div');
          },
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
          key: 'update',
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
                      this.show(params.index);
                    },
                  },
                },
                '编辑'
              ),
            ]);
          },
        },
      ],
    };
  },
  mounted() {
    this.mocktableData();
    //自适应高度
    this.tableHeight = document.getElementsByClassName('table-content')[0].offsetHeight - 200;
    var that = this;
    window.onresize = function temp() {
      that.tableHeight = document.getElementsByClassName('table-content')[0].offsetHeight - 200;
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
          pageIndex: 2, //当前页
          pageSize: 10, //每页总数
          orderby: '', //排序字段
        },
      });
      debugger;
      this.tableData = response.data.dataSource;
      const totalCount = response.data.pageInfo.totalCount;
    },
    // let data = [];
    // for (let i = 0; i < 10; i++) {
    //   data.push({
    //     name: 'RT1924' + Math.floor(Math.random() * 100 + 1),
    //     status: Math.floor(Math.random() * 3 + 1),
    //     describe: '关于这个应用的描述',
    //     classify: [
    //       {
    //         n: 'People' + Math.floor(Math.random() * 100 + 1),
    //         c: Math.floor(Math.random() * 1000000 + 100000),
    //       },
    //       {
    //         n: 'People' + Math.floor(Math.random() * 100 + 1),
    //         c: Math.floor(Math.random() * 1000000 + 100000),
    //       },
    //       {
    //         n: 'People' + Math.floor(Math.random() * 100 + 1),
    //         c: Math.floor(Math.random() * 1000000 + 100000),
    //       },
    //     ],
    //     update: new Date(),
    //   });
    // }
    // return data;
    // },
    // formatDate(date) {
    //   const y = date.getFullYear();
    //   let m = date.getMonth() + 1;
    //   m = m < 10 ? '0' + m : m;
    //   let d = date.getDate();
    //   d = d < 10 ? '0' + d : d;
    //   return y + '-' + m + '-' + d;
    // },
    changePage() {
      this.mocktableData();
    },
  },
};
</script>

<template>
  <div class="table-content">
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
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page
          :total="totalCount"
          :current="1"
          @on-change="changePage"></Page>
      </div>
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
table > tr {
  height: 20px;
}

.table-content-btn {
  width: 100%;
  height: 45px;
}
.table-content-btn button {
  float: right;
}
</style>
