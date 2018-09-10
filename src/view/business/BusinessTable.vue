<script>
import { date } from '@ktw/ktools';
import { Ellipsis, Tag, Poptip, div } from '@ktw/kcore';
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
      tableData: {}, //表格数据
      // tableHeight: 200, //表格的高度
      totalCount: 1, //表格总页数
      pageIndex: 1, //表格当前页
      lengths: 24,
      tagLength: 5,
      selectData: null,
      tableColumns1: [
        {
          type: 'selection',
          width: 60,
        },
        {
          title: '元数据名称',
          key: 'name',
          render: (h, params) => {
            const row = params.row;
            return h(
              'a',
              {
                props: {},
                style: {},
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
              row.name
            );
          },
        },
        {
          title: '描述',
          key: 'description',
          width: 300,
          render: (h, params) => {
            const row = params.row;
            const description = row.description;
            return (
              <Poptip trigger="hover" placement="bottom" content={description}>
                <Ellipsis length={this.lengths}>{description}</Ellipsis>
              </Poptip>
            );
          },
        },
        {
          title: '标签',
          key: 'keyword',
          render: (h, params) => {
            const row = params.row;
            const keyword = row.keyword;
            return (
              <Poptip trigger="hover" placement="bottom" content={row.keyword}>
                <Tag
                  nativeOnClick={e => {
                    this.tagData(keyword);
                  }}
                >
                  <Ellipsis length={this.tagLength} style={{ color: '#2D8cF0' }}>
                    {row.keyword}
                  </Ellipsis>
                </Tag>
              </Poptip>
            );
          },
        },
        // render: (h, params) => {
        //   const row = params.row;
        //   return h(
        //     'Poptip',
        //     {
        //       props: {
        //         trigger: 'hover',
        //         content: row.keyword,
        //         placement: 'bottom',
        //       },
        //     },
        //     [
        //       <Tag nativeOnClick={this.tagData}>
        //         <Ellipsis length="10">{row.keyword}</Ellipsis>
        //       </Tag>,
        //     ]
        //   );
        // },
        // },
        {
          title: '分类',
          key: 'classificationname',
          render: (h, params) => {
            const row = params.row;
            const classificationname = row.classificationname;
            const restype = row.restype;
            return h(
              'a',
              {
                props: {},
                style: {},
                on: {
                  click: () => {
                    this.classifyDatas(restype);
                  },
                },
              },
              classificationname
            );
          },
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
              // h(
              //   'a',
              //   {
              //     props: {},
              //     style: {
              //       marginRight: '5px',
              //     },
              //     on: {
              //       click: () => {
              //         // 隐藏元数据管理页面
              //         this.display = false;
              //         this.selectData = params.row;
              //         //预览flag
              //         this.selectData.readonly = true;
              //         // 日期格式化
              //         this.selectData.enddate = date.format(
              //           new Date(this.selectData.enddate),
              //           'YYYY-M-D'
              //         );
              //         this.selectData.begdate = date.format(
              //           new Date(this.selectData.enddate),
              //           'YYYY-M-D'
              //         );
              //       },
              //     },
              //   },
              //   '预览'
              // ),
            ]);
          },
        },
      ],
    };
  },
  watch: {
    tableDatas: {
      handler(newVals) {
        this.tableData = newVals;
      },
      immediate: true,
    },
  },
  mounted() {
    //调用获取表格数据的方法
    this.mocktableData();
    // //自适应高度
    // this.tableHeight = document.getElementsByClassName('table-main')[0].offsetHeight - 200;
    // debugger;
    // window.onresize = temp => {
    //   this.tableHeight = document.getElementsByClassName('table-main')[0].offsetHeight - 200;
    //   debugger;
    // };
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
          // pageCount: this.pageCount,
          orderby: '', //排序字段
        },
      });
      this.tableData = response.data;
      this.totalCount = response.data.pageInfo.totalCount;
      this.pageIndex = response.data.pageInfo.pageIndex;
    },
    //表格的分类
    async classifyDatas(restype) {
      const response = await api.db.findpagelistbusiness({
        restype: restype,
        pageinfo: {
          pageIndex: 1, //当前页
          pageSize: 10, //每页总数
          orderby: '', //排序字段
        },
      });
      this.tableData = response.data;
      //获取表格总页数
      this.totalCount = response.data.pageInfo.totalCount;
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
          this.tableData.dataSource.splice(params.index, 1);
          this.mocktableData();
          this.$Message.info('已删除');
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
        var data = new Date(new Date(datas));
        var y = data.getFullYear();
        var m = data.getMonth() + 1;
        var d = data.getDate();
        m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;
        return y + '-' + m + '-' + d;
      }
    },

    //表格标签
    async tagData(keyword) {
      const response = await api.db.findpagelistbusiness({
        keyword: keyword,
        pageinfo: {
          pageIndex: 1, //当前页
          pageSize: 10, //每页总数
          orderby: '', //排序字段
        },
      });
      this.tableData = response.data;
      //获取表格总页数
      this.totalCount = response.data.pageInfo.totalCount;
    },
    refresh() {
      this.mocktableData();
    },
  },
};
</script>

<template>
  <div class="table-content">
    <div
      v-if="display"
      class="table-item">
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
      <!--:height="tableHeight"-->
      <Table
        :data="tableData.dataSource"

        :columns="tableColumns1"
        class="table">
      </Table>
      <div class="page">
        <div class="page-item">
          <Page
            :total="tableData.pageInfo.totalCount"
            :current="pageIndex"
            show-elevator
            @on-change="changePage">
          </Page>
        </div>
      </div>
    </div>
    <div v-else>
      <DataDetails
        :business-data="selectData"
        :tree-data="treeData"
        @backEvent="queryData"></DataDetails>
    </div>
  </div>
</template>

<style lang="less" scoped>
table {
  overflow-x: auto;
}
.table-content {
  width: 92%;
  margin: 0 auto;
  height: 100%;
  .table-item {
    height: 100%;
  }
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
/deep/.k-table {
  overflow-x: auto;
  // overflow-y: auto;
}
/deep/.k-table-body {
  background: #f1f3f7;
  height: 100% !important;
  overflow-y: auto;
}
/deep/.k-table-wrapper {
  height: 69% !important;
}
</style>
