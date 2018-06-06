<script>
import ExtractPlan from './ExtractPlan';

export default {
  name: 'PlanExtract',
  components: { ExtractPlan },
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      current: 0,
      btnContent: '新增方案',
      catalog: [],
    };
  },
  methods: {
    async next() {
      if (this.current == 1) {
        this.current = 0;
        this.btnContent = '新增方案';
      } else if (this.current < 1) {
        this.current++;
        this.btnContent = '返回';
        const response = await api.db.findCatalog({
          owner: 1,
          ownerId: this.$user.orgid,
          access: 1,
          hasChild: false,
          orderby: 'sort_asc',
        });
        this.catalog = response.data;
      }
    },
  },
};
</script>
<template>
  <transition name="slide">
    <div
      v-show="queryOptions.length"
      class="attribute-table" >
      <Card dis-hover>
        <p slot="title">自定义提取方案</p>
        <div slot="extra">
          <Icon
            :type="expand ? 'chevron-down' : 'chevron-up'"
            @click.native="expand = !expand"></Icon>
          <Icon
            type="close"
            @click.native="close"></Icon>
        </div>
        <ExtractPlan
          :value="value"></ExtractPlan>
      </Card>
    </div>
  </transition>
</template>
<style lang="less" scoped>
.attribute-table {
  z-index: 1000;

  .k-card {
    height: 100%;
  }
  /deep/ .k-card-head {
    padding: 4px 16px;
    background-color: #358cf0;
    p {
      color: #fff;
    }
  }
  /deep/ .k-card-extra {
    right: 16px;
    top: 6px;
    cursor: pointer;
    .k-icon {
      color: #fff;
      margin-left: 6px;
    }
  }
  /deep/ .k-card-body {
    padding: 0 16px;
  }
}
.btnclass {
  margin-top: 10px;
}
</style>
