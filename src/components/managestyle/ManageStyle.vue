<script>
import config from 'config';
import { date } from '@ktw/ktools';
import { styleType, getStyleType } from '@/utils/helps';
import AddStyle from './AddStyle';
import DeleteStyle from './DeleteStyle';

export default {
  name: 'ManageStyle',
  components: { AddStyle, DeleteStyle },
  data() {
    return {
      //样式分类
      classify: [
        {
          value: ' ',
          label: '全部分类',
        },
      ],
      styleType,
      // 表单数据
      dataCondition: {
        time: '', //时间
        alias: '', // 样式别名
        type: ' ', // 样式类型(-1 全部 0 未知 1 点 2 线 3 面 4 dem类型)
        classify: ' ', // 样式分类(见styleTypes)
      },
      // 查询参数
      start: '',
      end: '',
      // 表列字段
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '样式别名',
          ellipsis: true,
          key: 'alias',
        },
        {
          title: '样式类型',
          ellipsis: true,
          key: 'type',
        },
        {
          title: '样式分类',
          ellipsis: true,
          key: 'classify',
        },
        {
          title: '入库时间',
          ellipsis: true,
          key: 'createTime',
        },
        {
          title: '操作',
          width: 180,
          align: 'center',
          render: (h, params) => {
            return (
              <div class="style-table-handler">
                <Button type="success" size="small">
                  预览
                </Button>
                <Button type="success" size="small" onClick={() => this.downloadPlan(params.row)}>
                  下载
                </Button>
                <Button type="error" size="small" onClick={() => this.deleteStyle(params.row)}>
                  删除
                </Button>
              </div>
            );
          },
        },
      ],
      tableData: [],
      pageCount: 0,
      tableLoading: false,
      isComputedStyle: false,
      modalTitle: '增加样式文件',
      modalName: '',
      deleteStyleData: [],
      deleteError: [],
      spinShow: false,
    };
  },
  created() {
    this.tableLoading = true;
    this.getStyleData(1);
    this.getStyleTypes();
  },
  methods: {
    // 查询样式
    async getStyleData(pageIndex) {
      const params = this.getParams(pageIndex);
      const response = await api.db.findStyle(params);
      this.tableLoading = false;
      this.tableData = response.data.dataSource;
      this.setCondition();
      this.pageCount = response.data.pageInfo.totalCount;
    },
    // 查询样式分类
    async getStyleTypes() {
      const styleTypes = await api.db.styleTypes();
      styleTypes.data.forEach(item => {
        this.classify.unshift({
          value: item.code,
          label: item.remark,
        });
      });
    },
    // 构造查询参数
    getParams(pageIndex) {
      const params = {
        objCondition: {
          orgId: this.$store.state.user.info.orgid,
          start: this.start,
          end: this.end,
          alias: this.dataCondition.alias,
          type: this.dataCondition.type,
          classify: this.dataCondition.classify,
        },
        pageIndex,
        pageSize: 10,
      };
      return params;
    },
    // 处理查询结果
    setCondition() {
      this.tableData.forEach(item => {
        item.createTime = date.format(new Date(item.createTime), 'YYYY-M-D HH:mm');
        item.type = getStyleType(!item.type || item.type === '' ? ' ' : item.type);
        this.classify.forEach(classItem => {
          if (item.classify === classItem.value) {
            item.classify = classItem.label;
          } else if (item.classify === '') {
            item.classify = '全部分类';
          }
        });
      });
    },
    // 得到入库起止时间
    getTime(time) {
      [this.start, this.end] = time;
    },
    //删除样式文件
    async deleteStyle(styleData) {
      const result = await api.db.deleteStyle({ id: styleData.id });
      if (result.data.statusCode == 200) {
        this.$Message.success('删除成功！');
        this.getStyleData(1);
      } else {
        this.$Message.error('删除失败！');
      }
    },
    //下载样式文件
    downloadPlan(row) {
      window.open(`${config.project.basicUrl}/resource/styles/download/${row.id}`);
    },
    // 重置表单
    reset() {
      this.getStyleData(1);
    },
    // 新增样式文件
    addNewStyle() {
      this.isComputedStyle = true;
      this.modalTitle = '增加样式文件';
      this.modalName = 'AddStyle';
    },
    // 批量删除样式文件
    async deleteBatchStyle() {
      if (this.deleteStyleData.length !== 0) {
        this.spinShow = true;
        this.deleteError = [];
        await Promise.all(
          this.deleteStyleData.map(styleData => api.db.deleteStyle({ id: styleData.id }))
        ).then(response => {
          this.spinShow = false;
          for (let i = 0; i < response.length; i++) {
            if (response[i].data.statusCode !== 200) {
              this.deleteStyleData[i]['errorCallback'] = response[i].data;
              this.deleteError.push(this.deleteStyleData[i]);
            }
          }
          if (this.deleteError.length !== 0) {
            this.isComputedStyle = true;
            this.modalTitle = '批量删除失败';
            this.modalName = 'DeleteStyle';
          } else {
            this.$Message.success('删除成功！');
            this.getStyleData(1);
          }
          this.deleteStyleData = [];
        });
      } else {
        this.$Message.info({
          top: 250,
          duration: 5,
          content: '请先选择表格中要被删除的样式信息，直接操作表格上的复选框即可',
        });
      }
    },
    // 保存批量删除信息
    batchDelete(selection) {
      this.deleteStyleData = selection;
    },
    // 关闭新增弹窗
    closeStyle(isClose) {
      this.isComputedStyle = isClose;
      this.getStyleData(1);
    },
  },
};
</script>

<template>
  <div class="db-manage-style">
    <Spin
      v-if="spinShow"
      fix>
      <loading type="ball-grid-pulse" />
    </Spin>
    <Form
      ref="managestyle"
      :model="dataCondition"
      :label-width="90"
      inline
    >
      <FormItem
        label="入库时间："
      >
        <DatePicker
          v-model="dataCondition.time"
          type="daterange"
          split-panels
          transfer
          placeholder="请选择入库时间"
          @on-change="getTime" ></DatePicker>
      </FormItem>
      <FormItem label="样式别名：">
        <Input
          v-model="dataCondition.alias"
          placeholder="请输入样式别名"
          clearable
        ></Input>
      </FormItem>
      <FormItem
        label="样式类型："
      >
        <Select
          v-model="dataCondition.type"
          transfer
        >
          <Option
            v-for="item in styleType"
            :value="item.value"
            :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem
        label="样式分类："
      >
        <Select
          v-model="dataCondition.classify"
          transfer
        >
          <Option
            v-for="item in classify"
            :value="item.value"
            :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem
      >
        <Button
          type="primary"
          icon="ios-search"
          @click="getStyleData(1)">查询</Button>
        <Button
          type="primary"
          @click="reset">重置</Button>
        <Button
          type="info"
          icon="plus-round"
          @click="addNewStyle">新增样式</Button>
        <Button
          type="info"
          icon="close-round"
          @click="deleteBatchStyle">批量删除</Button>
      </FormItem>
    </Form>
    <div class="style-table">
      <Table
        :columns="tableColumns"
        :data="tableData"
        :loading="tableLoading"
        height="250"
        stripe
        border
        highlight-row
        size="small"
        @on-selection-change="batchDelete"
      >
      </Table>
      <Page
        :total="pageCount"
        :page-size="10"
        :page-size-opts="[10, 20, 30, 40]"
        size="small"
        show-total
        show-elevator
        @on-change="getStyleData"></Page>
    </div>
    <Modal
      v-model="isComputedStyle"
      :title="modalTitle"
      @on-cancel="getStyleData(1)"
    >
      <component
        :is="modalName"
        :classify="classify"
        :error-data="deleteError"
        @on-close-style="closeStyle"
      ></component>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<style lang="less" scoped>
.db-manage-style {
  position: reletive;
  /deep/.k-form-item {
    min-width: 277px;
    margin-bottom: 15px;
    margin-right: 15px;
  }

  .style-table {
    /deep/.k-table {
      width: 100%;
    }
    .k-page {
      margin-top: 15px;
    }
    /deep/.style-table-handler {
      width: 150px;

      .k-btn {
        margin-right: 5px;
      }
    }
  }
}
/deep/.k-modal-wrap,
/deep/.k-modal-mask {
  z-index: 1002;
}

.k-spin-fix {
  background-color: rgba(28, 36, 56, 0.5);
}
</style>
