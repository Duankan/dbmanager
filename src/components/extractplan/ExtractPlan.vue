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
      height: 240,
      planData: [],
      total: 0,
      columns: [
        { title: '方案名称', key: 'planName', width: 190 },
        { title: '资源类型', key: 'resTypeName', width: 100 },
        { title: '提取方式', key: 'spaceTypeName', width: 120 },
        { title: '描述信息', key: 'spaceRemark', width: 280 },
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
      pageSize: 10,
      loading: false,
    };
  },
  created() {
    this.getPagedPlan();
  },
  methods: {
    //获取分页方案数据
    async getPagedPlan(pageIdx = 1) {
      this.loading = false;
      const response = await api.db.findResourcePlan({
        pageIndex: pageIdx,
        pageSize: 10,
        objCondition: {
          applyOrganization: this.$user.orgid,
        },
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
      this.loading = true;
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
      this.$window({
        title: '提取范围',
        footerHide: true,
        transfer: true,
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
      this.$window({
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
    async showPlanInfo() {},
    async editPlan(row) {
      let id = row.id;
    },
    async extractPlanSourse(row) {
      const response = await api.db.extractResourcePlan({
        id: row.id,
      });
      if (response.statusCode !== 200 || response.data == null) {
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
        this.$store.dispatch(types.SET_BUS_SELECT_PLANDATA, {
          pageIndex: 1, // 分页索引
          pageSize: 5, // 分页大小
          objCondition: {
            applyOrganization: this.$user.orgid, // 组织id
          },
        });
      } else this.$Message.error('删除失败，请稍后重试！');
    },
  },
};
</script>

<template>
  <div>
    <Table
      :columns="columns"
      :height="height"
      :data="planData">
    </Table>
    <div class="foot-div">
      <Button
        type="primary"
        icon="plus-round"
        @click="addVectorPlan">矢量提取案</Button>
      <Button
        type="primary"
        icon="plus-round"
        @click="addRasterPlan">影像提取方案</Button>
      <div class="foot-div-page">
        <Page
          :total="total"
          :current="1"
          :page-size="pageSize"
          size="small"
          show-sizer
          show-elevator
          @on-change="getPagedPlan"></Page>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.foot-div {
  margin: 10px;
  overflow: hidden;
}
.foot-div-page {
  float: right;
}
</style>
