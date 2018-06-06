<script>
import config from 'config';
import PlanCreate from './PlanCreate';
import * as types from '@/store/types';

export default {
  name: 'PlanTable',
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      height: 240,
      columns: [
        { title: '方案名称', key: 'planName', width: 190 },
        { title: '资源类型', key: 'resType', width: 100 },
        { title: '提取方式', key: 'spaceType', width: 120 },
        { title: '描述信息', key: 'spaceRemark', width: 280 },
        { title: '空间关系', key: 'extract', width: 100 },
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
      data: {
        type: Object,
        default: () => {},
      },
      pageInfo: { pageIndex: 1, pageSize: 10 },
    };
  },
  computed: {
    planData() {
      return this.$store.state.bus.plandata;
    },
  },
  watch: {
    planData(newdatas) {
      if (newdatas && newdatas.dataSource) return this.getPlanData(newdatas);
      else return [];
    },
  },
  methods: {
    getPlanData(response) {
      return response.dataSource.map(item => {
        item.resType = this.formatRestype(item.resType);
        item.spaceType = this.formatExtractType(item.spaceType);
        item.extract = this.formatExtract(item.extract);
        item.updateTime = new Date(item.updateTime).toLocaleDateString();
        return item;
      });
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
    async changePage(index) {
      const response = await api.db.findResourcePlan({
        pageIndex: index,
        pageSize: 10,
        objCondition: { applyOrganization: this.$user.orgid },
      });
      this.value = response.data;
    },
    addPlan() {
      //this.$Modal.remove();
      this.$window({
        title: '方案搭建',
        footerHide: true,
        render: h => {
          return h(
            PlanCreate,
            {
              props: {
                value: {},
              },
            },
            [this.$scopedSlots.default]
          );
        },
        width: 960,
        height: 630,
      });
    },
    async showPlanInfo() {},
    async editPlan(row) {},
    async extractPlanSourse(row) {
      const response = await api.db.extractResourcePlan({
        id: row.id,
      });
      window.open(`${config.project.basicUrl}/data/download/tempfile?path=${response.data}`);
    },
    async deletePlan() {},
  },
};
</script>

<template>
  <div>
    <Table
      :columns="columns"
      :height="height"
      :data="planData.dataSource">
    </Table>
    <div class="foot-div">
      <Button
        type="primary"
        @click="addPlan">新新增方案</Button>
      <div class="foot-div-page">
        <Page
          :total="planData.pageInfo.totalCount"
          :current="1"
          :page-size="10"
          size="small"
          show-sizer
          show-elevator
          @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>

<style>
.foot-div {
  margin: 10px;
  overflow: hidden;
}
.foot-div-page {
  float: right;
}
</style>
