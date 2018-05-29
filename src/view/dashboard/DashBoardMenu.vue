<script>
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
    selectMenuItem(name) {
      this.showWindow = false;
      this.type = name;
      switch (name) {
        case 'attribute':
          this.title = '属性查询';
          this.showWindow = true;
          break;
        case 'space':
          this.title = '空间查询';
          this.showWindow = true;
          break;
        case 'composite':
          this.title = '复合查询';
          this.showWindow = true;
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
      数据提取
    </MenuItem>
      <Submenu name="analysis">
        <template slot="title">
          <Icon type="stats-bars"></Icon>
          统计分析
        </template>
        <MenuItem name="overlay">叠加分析</MenuItem>
        <MenuItem name="statistics">基础统计</MenuItem>
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
