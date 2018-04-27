<script>
export default {
  name: 'Permenu',
  methods: {
    select() {},
  },
};
</script>

<template>
  <Menu
    theme="primary"
    mode="horizontal"
    @on-select="select">
    <Submenu name="查询检索">
      <template slot="title">
        查询检索
      </template>
      <MenuItem name="属性查询">属性查询</MenuItem>
      <MenuItem name="空间查询">空间查询</MenuItem>
      <MenuItem name="复合查询">复合查询</MenuItem>
    </Submenu>
    <MenuItem name="数据提取">
    数据提取
    </MenuItem>
    <Submenu name="分析统计">
      <template slot="title">
        分析统计
      </template>
      <MenuItem name="叠加分析">叠加分析</MenuItem>
      <MenuItem name="基础统计">基础统计</MenuItem>
    </Submenu>
    <Submenu name="配置管理">
      <template slot="title">
        配置管理
      </template>
      <MenuItem name="样式文件管理">样式文件</MenuItem>
      <MenuItem name="空间参考管理">空间参考</MenuItem>
    </Submenu>
  </Menu>
</template>

<style lang="less" scoped>
.k-menu {
  background-color: transparent;
  li {
    padding: 0 15px;
  }
}
</style>
