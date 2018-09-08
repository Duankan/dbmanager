<script>
import config from 'config';
import ExtractWizard from './ExtractWizard';
import * as types from '@/store/types';

export default {
  name: 'ExtractPlan',
  comments: {
    ExtractWizard,
  },
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      height: 205,
      planData: [],
      total: 0,
      columns: [
        { title: '方案名称', key: 'planName', width: 190 },
        { title: '资源类型', key: 'resTypeName', width: 100 },
        { title: '提取方式', key: 'spaceTypeName', width: 120 },
        { title: '描述信息', key: 'spaceRemark' },
        { title: '空间关系', key: 'extractName', width: 100 },
        { title: '更新时间', key: 'updateTime', width: 130 },
        {
          title: '操作',
          key: 'action',
          width: 170,
          alian: 'center',
          render: (h, params) => {
            return h('div', { style: { width: '150px' } }, [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  style: { marginRight: '5px' },
                  on: {
                    click: () => {
                      this.editPlan(params.row);
                    },
                  },
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  style: { marginRight: '5px' },
                  on: {
                    click: () => {
                      this.extractPlanSourse(params.row);
                    },
                  },
                },
                '提取'
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
                      this.deleteConfirm(params.row);
                    },
                  },
                },
                '删除'
              ),
            ]);
          },
        },
      ],
      pageSize: 5,
      loading: false,
      planWindow: null,
      planName: '',
      startTime: null,
      endTime: null,
    };
  },
  events: {
    'close-plan-window': 'refreshPlanList',
  },
  created() {
    this.getPagedPlan();
  },
  destroyed() {
    this.closePlanWindow();
  },
  methods: {
    //关闭Window，并刷新列表
    refreshPlanList() {
      this.closePlanWindow();
      this.getPagedPlan();
    },
    //关闭Window
    closePlanWindow() {
      this.planWindow && this.planWindow.destroy();
      this.planWindow = null;
    },
    //获取分页方案数据
    async getPagedPlan(pageIdx = 1) {
      if (this.startTime && this.endTime && this.endTime <= this.startTime) {
        this.$Message.error('结束时间不能小于开始时间');
        return;
      }
      let where = {
        applyOrganization: this.$appUser.orgid,
      };
      if (this.planName.trim() != '') {
        where.planName = this.planName;
      }
      if (this.startTime) {
        where.start = this.startTime;
      }
      if (this.endTime) {
        where.end = this.endTime;
      }
      this.loading = false;
      const response = await api.db.findResourcePlan({
        pageIndex: pageIdx,
        pageSize: this.pageSize,
        objCondition: where,
      });
      let planList = response.data.dataSource;
      planList.map(item => {
        item.resTypeName = this.formatRestype(item.resType);
        item.spaceTypeName = this.formatExtractType(item.spaceType);
        item.extractName = this.formatExtract(item.extract);
        item.updateTime = new Date(item.updateTime).toLocaleDateString();
        return item;
      });
      this.planData = planList;
      this.total = response.data.pageInfo.totalCount;
      if (this.pageIdx == 1) {
        this.$refs.page.changePage(1);
      }
      this.loading = true;
    },
    //重置查询
    reset() {
      this.planName = '';
      this.startTime = null;
      this.endTime = null;
      this.getPagedPlan();
    },
    formatRestype(type) {
      switch (type) {
        case 0:
          return '资源';
        case 1:
          return '分类';
        default:
          return type;
      }
    },
    formatExtractType(type) {
      switch (type) {
        case -1:
          return '全图范围';
        case 0:
          return '行政区';
        case 1:
          return '图幅范围';
        case 2:
          return '坐标范围';
        default:
          return type;
      }
    },
    formatExtract(extract) {
      switch (extract) {
        case 0:
          return '裁剪';
        case 1:
          return '相交';
        case 2:
          return '包含';
        default:
          return extract;
      }
    },
    addVectorPlan() {
      this.$Modal.remove();
      this.closePlanWindow();
      this.planWindow = this.$window({
        title: '提取范围',
        footerHide: true,
        transfer: true,
        styles: {
          top: '50px',
          left: '27%',
        },
        render: h => {
          return h(
            ExtractWizard,
            {
              props: {
                extractMode: 0,
              },
            },
            [this.$scopedSlots.default]
          );
        },
        width: 840,
        height: 660,
      });
    },
    addRasterPlan() {
      this.$Modal.remove();
      this.closePlanWindow();
      this.planWindow = this.$window({
        title: '提取范围',
        footerHide: true,
        transfer: true,
        render: h => {
          return h(
            ExtractWizard,
            {
              props: {
                extractMode: 1,
              },
            },
            [this.$scopedSlots.default]
          );
        },
        width: 840,
        height: 660,
      });
    },
    async editPlan(row) {
      this.closePlanWindow();
      this.planWindow = this.$window({
        title: '提取范围',
        footerHide: true,
        transfer: true,
        styles: {
          top: '50px',
          left: '27%',
        },
        render: h => {
          return h(
            ExtractWizard,
            {
              props: {
                extractMode: row.resType,
                planId: row.id,
              },
            },
            [this.$scopedSlots.default]
          );
        },
        width: 840,
        height: 660,
      });
    },
    async extractPlanSourse(row) {
      const response = await api.db.extractResourcePlan({
        id: row.id,
      });
      if (response.status !== 200 || response.data == null) {
        this.$Message.error('方案提取失败！');
      } else if (row.resType === 0) {
        window.open(`${config.project.basicUrl}/data/download/tempfile?path=${response.data}`);
      } else {
        if (response.statusCode === 200) {
          window.open(`${config.project.basicUrl}/data/download/tempfile?path=${response.data}`);
        } else {
          this.$Message.error(response.data);
        }
      }
    },
    deleteConfirm(row) {
      this.$Modal.confirm({
        title: '提示信息',
        content: '<p>是否删除该方案？</p>',
        onOk: () => {
          this.deletePlan(row);
        },
      });
    },
    async deletePlan(row) {
      const result = await api.db.deleteResourcePlan({ id: row.id });
      if (result.data.statusCode == 200) {
        this.$Message.success('删除成功！');
        this.getPagedPlan();
      } else {
        this.$Message.error('删除失败，请稍后重试！');
      }
    },
    dispose() {
      this.closePlanWindow();
    },
  },
};
</script>

<template>
  <div class="extract-plan-wrapper">
    <div class="head-div">
      <Form
        :label-width="80"
        inline>
        <FormItem label="方案名称：">
          <Input
            v-model="planName"
            placeholder="输入方案名称..."
            size="small"></Input>
        </FormItem>
        <FormItem label="起始时间：">
          <DatePicker
            :value="startTime"
            type="date"
            placeholder="选择起始时间"
            size="small"
            @on-change="(e)=>{startTime=e;}"></DatePicker>
        </FormItem>
        <FormItem label="终止时间：">
          <DatePicker
            :value="endTime"
            type="date"
            placeholder="选择终止时间"
            size="small"
            @on-change="(e)=>{endTime=e;}"></DatePicker>
        </FormItem>
        <FormItem class="search-item">
          <Button
            type="primary"
            size="small"
            @click="getPagedPlan()">查询方案</Button>
          <Button
            type="primary"
            size="small"
            @click="reset()">重置</Button>
        </FormItem>
      </Form>
    </div>
    <Table
      :columns="columns"
      :height="height"
      :data="planData"
      class="plan-table">
    </Table>
    <div class="foot-div">
      <Button
        type="primary"
        icon="plus-round"
        @click="addVectorPlan">矢量提取方案</Button>
      <Button
        type="primary"
        icon="plus-round"
        @click="addRasterPlan">影像提取方案</Button>
      <div class="foot-div-page">
        <Page
          ref="page"
          :total="total"
          :current="1"
          :page-size="pageSize"
          size="small"
          show-total
          show-elevator
          @on-change="getPagedPlan"></Page>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.extract-plan-wrapper {
  .k-form-item {
    margin-bottom: 3px;
  }
  .plan-table th,
  .plan-table td {
    height: 34px !important;
  }
  .search-item {
    .k-form-item-content {
      margin-left: 0 !important;
    }
  }
  .foot-div {
    margin: 10px;
    overflow: hidden;
    .k-btn {
      padding: 5px 10px;
    }
  }
  .foot-div-page {
    float: right;
  }
}
</style>
