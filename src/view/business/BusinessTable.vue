<script>
export default {
  name: 'BusinessTable',
  data() {
    return {
      tableData1: this.mockTableData1(),
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
          render: (h, params) => {
            return h('div', '这是一段描述，' + params.row.describe);
          },
        },
        {
          title: '标签',
          key: 'classify',
          render: (h, params) => {
            return h('div');
          },
        },
        {
          title: '分类',
          key: 'describe',
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
          render: (h, params) => {
            return h('div', this.formatDate(this.tableData1[params.index].update));
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
                '编辑'
              ),
            ]);
          },
        },
      ],
    };
  },
  methods: {
    mockTableData1() {
      let data = [];
      for (let i = 0; i < 10; i++) {
        data.push({
          name: 'RT1924' + Math.floor(Math.random() * 100 + 1),
          status: Math.floor(Math.random() * 3 + 1),
          describe: '关于这个应用的描述',
          classify: [
            {
              n: 'People' + Math.floor(Math.random() * 100 + 1),
              c: Math.floor(Math.random() * 1000000 + 100000),
            },
            {
              n: 'People' + Math.floor(Math.random() * 100 + 1),
              c: Math.floor(Math.random() * 1000000 + 100000),
            },
            {
              n: 'People' + Math.floor(Math.random() * 100 + 1),
              c: Math.floor(Math.random() * 1000000 + 100000),
            },
          ],
          // time: Math.floor(Math.random() * 7 + 1),
          update: new Date(),
        });
      }
      return data;
    },
    formatDate(date) {
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      let d = date.getDate();
      d = d < 10 ? '0' + d : d;
      return y + '-' + m + '-' + d;
    },
    changePage() {
      this.tableData1 = this.mockTableData1();
    },
  },
};
</script>

<template>
  <div class="table-content">
    <div class="table-content-title">
      <span class="table-content-title-icon"></span>
    <span class="table-content-title-content"><b>元数据管理</b></span></div>
    <Table
      :data="tableData1"
      :columns="tableColumns1"
    ></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page
          :total="100"
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
.k-table-row {
  height: 20px;
}
</style>
