<script>
import QueryModules from '../mapview/query/QueryModules';
import * as types from '@/store/types';

export default {
  name: 'DashBoardMenu',
  components: {
    QueryModules,
  },
  data() {
    return {
      showWindow: false,
      type: 'composite',
      title: '复合查询',
      width: 420,
      height: 200,
    };
  },
  computed: {
    show() {
      return this.showWindow ? 'QueryModules' : '';
    },
  },
  methods: {
    async selectMenuItem(name) {
      this.$store.commit(types.CLOSE_BOTTOM_PANE);
      this.showWindow = false;
      this.type = name;
      switch (name) {
        case 'QueryAttrs':
          this.title = '属性查询';
          this.$store.commit(types.SET_APP_DATATABLE, 'AttributeTable');
          this.openWindow();
          this.height = 390;
          this.width = 420;
          break;
        case 'QuerySpace':
          this.title = '空间查询';
          this.$store.commit(types.SET_APP_DATATABLE, 'AttributeTable');
          this.openWindow();
          this.width = 451;
          this.height = 418;
          break;
        case 'QueryCompound':
          this.title = '复合查询';
          this.$store.commit(types.SET_APP_DATATABLE, 'AttributeTable');
          this.openWindow();
          this.width = 495;
          this.height = 460;
          break;
        case 'ManageStyle':
          this.title = '样式文件管理';
          this.$store.commit(types.SET_APP_DATATABLE, 'AttributeTable');
          this.openWindow();
          this.width = 660;
          this.height = 525;
          break;
        case 'ManageCRS':
          this.title = '空间参考管理';
          this.$store.commit(types.SET_APP_DATATABLE, 'AttributeTable');
          this.openWindow();
          this.width = 660;
          this.height = 615;
          break;
        case 'extra':
          this.$store.commit(types.SET_APP_DATATABLE, 'ExtractPlan');
          this.$store.commit(types.OPEN_BOTTOM_PANE);
          break;
        case 'Statistics':
          this.title = '基础统计';
          this.$store.commit(types.SET_APP_DATATABLE, 'AttributeTable');
          this.openWindow();
          this.width = 440;
          this.height = 435;
          break;
        case 'Overlay':
          this.title = '叠加分析';
          this.$store.commit(types.SET_APP_DATATABLE, 'AttributeTable');
          this.openWindow();
          this.width = 410;
          this.height = 500;
          break;
        default:
          break;
      }
    },
    openWindow() {
      this.showWindow = true;
    },
    changeVisible() {
      this.showWindow = false;
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
        <MenuItem name="QueryAttrs">属性查询</MenuItem>
        <MenuItem name="QuerySpace">空间查询</MenuItem>
        <MenuItem name="QueryCompound">复合查询</MenuItem>
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
        <MenuItem name="Overlay">叠加分析</MenuItem>
        <MenuItem name="Statistics">基础统计</MenuItem>
      </Submenu>
      <Submenu name="configure">
        <template slot="title">
          <Icon type="gear-a"></Icon>
          配置管理
        </template>
        <MenuItem name="ManageStyle">样式管理</MenuItem>
        <MenuItem name="ManageCRS">空间参考管理</MenuItem>
      </Submenu>
    </Menu>
    <keep-alive>
      <component
        :is="show"
        :is-visible.sync="showWindow"
        :modules-type="type"
        :modules-title="title"
        :width="width"
        :height="height"
        class="db-query"
        @on-change-visible="changeVisible"
      ></component>
    </keep-alive>
  </Row>
</template>

<style lang="less" scoped>
.k-row:hover {
  z-index: 1003;
}

.k-menu {
  display: inline-block;
}

.db-query {
  margin: 68px 0 0 320px;

  /deep/ .k-window {
    // top: 10px;
  }
}
</style>
