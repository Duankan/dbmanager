<script>
import * as types from '@/store/types';

export default {
  name: 'DashBoardMenu',
  data() {
    return {
      showWindow: false,
      type: 'composite',
      title: '复合查询',
      styleObject: {
        margin: '60px 0 0 310px',
      },
    };
  },
  computed: {
    show() {
      return this.showWindow ? 'Query' : '';
    },
  },
  methods: {
    async selectMenuItem(name) {
      this.showWindow = false;
      this.type = name;
      switch (name) {
        case 'attribute':
          this.title = '属性查询';
          this.$store.commit(types.SET_APP_DATATABLE, 'AttributeTable');
          this.showWindow = true;
          break;
        case 'space':
          this.title = '空间查询';
          this.$store.commit(types.SET_APP_DATATABLE, 'AttributeTable');
          this.showWindow = true;
          break;
        case 'composite':
          this.title = '复合查询';
          this.$store.commit(types.SET_APP_DATATABLE, 'AttributeTable');
          this.showWindow = true;
          break;
        case 'extra':
          this.$store.commit(types.SET_APP_DATATABLE, 'ExtractPlan');
          this.$store.dispatch(types.SET_BUS_SELECT_PLANDATA, {
            pageIndex: 1, // 分页索引
            pageSize: 5, // 分页大小
            objCondition: {
              applyOrganization: this.$user.orgid, // 组织id
            },
          });
          break;
        default:
          break;
      }
    },
  },
};
</script>

<template>
  <Row>
    <Menu
      v-show="$route.name === 'MapView'"
      mode="horizontal"
      theme="primary"
      @on-select="selectMenuItem">
      <Submenu name="query">
        <template slot="title">
          <Icon type="ios-search"></Icon>
          查询检索
        </template>
        <MenuItem name="attribute">属性查询</MenuItem>
        <MenuItem name="space">空间查询</MenuItem>
        <MenuItem name="composite">复合查询</MenuItem>
      </Submenu>
      <MenuItem name="extra">
      <Icon type="archive"></Icon>
      自定义方案提取
    </MenuItem>
      <Submenu name="analysis">
        <template slot="title">
          <Icon type="stats-bars"></Icon>
          统计分析
        </template>
        <MenuItem name="overlay">叠加分析</MenuItem>
        <MenuItem name="statistics">基础统计</MenuItem>
      </Submenu>
      <Submenu name="configure">
        <template slot="title">
          <Icon type="gear-a"></Icon>
          配置管理
        </template>
        <MenuItem name="stylecfg">样式配置</MenuItem>
      </Submenu>
    </Menu>
    <keep-alive>
      <component
        :is="show"
        :visible.sync="showWindow"
        :type="type"
        :title="title"
        :styles="styleObject"></component>
    </keep-alive>
  </Row>
</template>

<style lang="less" scoped>
.k-menu {
  display: inline-block;
}
</style>
