<script>
export default {
  name: 'DashBoardMenu',
  methods: {
    selectMenuItem(name) {},
  },
};
</script>

<template>
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
</template>

<style lang="less" scoped>
.k-menu {
  display: inline-block;
}
</style>
