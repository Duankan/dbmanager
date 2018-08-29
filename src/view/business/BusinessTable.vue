<script>
import { date } from '@ktw/ktools';
import { Ellipsis } from '@ktw/kcore';
import DataDetails from './DataDetails';
export default {
  name: 'BusinessTable',
  components: {
    DataDetails,
  },
  props: {
    tableDatas: {
      type: Object,
      default: () => {},
    },
    treeData: {
      type: Array,
      default: () => [],
    },
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
        },
        {
          title: '元素名称',
          key: 'name',
        },
        {
          title: '描述',
          key: 'describe',
        },
        {
          title: '标签',
          key: 'keyword',
          ellipsis: true,
          render: (h, params) => {
            const row = params.row;
            return h('Tag', params.row.keyword);
            // return <Ellipsis length="14">{row.keyword}</Ellipsis>;
          },
        },
        {
          title: '分类',
          key: 'restype',
          // render: (h, params) => {
          //   return h('div');
          // },
        },

        // {
        //   title: '状态',
        //   key: 'status',
        //   render: (h, params) => {
        //     const row = params.row;
        //     const color = row.status === 1 ? 'green' : 'red';
        //     const text = row.status === 1 ? '可用' : '不可用';
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
          title: '创建时间',
          key: 'createdate',
          render: (h, params) => {
            const row = params.row;
            const datas = row.createdate;
            return h('div', this.formatDate(datas));
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
                      this.remove(params);
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
                      // 日期格式化
                      this.selectData.enddate = date.format(
                        new Date(this.selectData.enddate),
                        'YYYY-M-D'
                      );
                      this.selectData.begdate = date.format(
                        new Date(this.selectData.enddate),
                        'YYYY-M-D'
                      );
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
                      //预览flag
                      this.selectData.readonly = true;
                      // 日期格式化
                      this.selectData.enddate = date.format(
                        new Date(this.selectData.enddate),
                        'YYYY-M-D'
                      );
                      this.selectData.begdate = date.format(
                        new Date(this.selectData.enddate),
                        'YYYY-M-D'
                      );
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
  watch: {
    tableDatas: {
      handler(newVals) {
        this.tableData = newVals.dataSource;
        // this.tableData = newVals.dataSource;
        //向父组抛传事件
        // this.$emit('dataChangeEvnet', newVals);
      },
      immediate: true,
    },
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
      const response = await api.db.findpagelistbusiness({
        name: '', //表名
        restype: '', //资源分类
        keyword: '', //标签关键字
        orderfield: '', //排序字段
        sort: '', //排序方式
        pageinfo: {
          pageIndex: this.pageIndex, //当前页
          pageSize: 10, //每页总数
          totalCount: this.totalCount,
          pageCount: this.pageCount,
          orderby: '', //排序字段
        },
      });

      //获取表格数据
      this.tableData = response.data.dataSource;
      //获取表格总页数
      this.totalCount = response.data.pageInfo.totalCount;
      this.pageCount = response.data.pageInfo.pageCount;
      //获取当前页
      this.pageIndex = response.data.pageInfo.pageIndex;
    },
    //页码
    changePage(currPage) {
      //获取点击后的页码
      this.pageIndex = currPage;
      //重新渲染跳转的页面
      this.mocktableData(this.pageIndex);
    },
    //删除元数据
    remove(params) {
      const id = params.row.id;
      this.$Modal.confirm({
        title: '删除数据',
        content: '<p>确定删除该数据？</p>',
        onOk: async () => {
          const response = await api.db.deleteBusiness({ id: id });
          this.tableData.splice(params.index, 1);
          this.$Message.info('已删除');
          this.mocktableData();
        },
        onCancel: () => {
          this.$Message.info('取消');
        },
      });
    },
    //返回元数据页面更新数据
    queryData() {
      this.display = true;
      this.mocktableData();
    },
    //新增元数据
    addData() {
      // 显示TAB页
      this.display = false;
      // 表单清空
      this.selectData = {};
      // 新增/修改标记
      this.selectData.add = true;
      // 新增是否提交基本信息标记
      this.selectData.pointer = true;
    },

    //时间格式化
    formatDate(datas) {
      if (datas) {
        datas = new Date(new Date(datas).getTime());
        const y = datas.getFullYear();
        let m = datas.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d = datas.getDate();
        d = d < 10 ? '0' + d : d;
        return y + '-' + m + '-' + d;
      }
    },
  },
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
      <div class="table-content-btn">
        <Button
          type="primary"
          @click="addData">
          新增
        </Button>
      </div>
      <Table
        :data="tableData"
        :height="tableHeight"
        :columns="tableColumns1"
        class="table"
      ></Table>
      <div class="page">
        <div class="page-item">
          <Page
            :total="totalCount"
            :current="pageIndex"
            show-elevator
            @on-change="changePage"
          ></Page>
        </div>
      </div>
    </div>
    <div
      v-else>
      <DataDetails
        :business-data="selectData"
        :tree-data="treeData"
        @backEvent="queryData"></DataDetails>
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
/deep/.table td {
  background: #f1f3f7;
}
/deep/.table th {
  background: #dcdee2;
}
/deep/.k-table-body {
  background: #f1f3f7;
}
</style>
