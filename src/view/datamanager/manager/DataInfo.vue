<script>
import { ALPN_ENABLED } from 'constants';
export default {
  name: 'DataInfo',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<template>
  <div class="data-info">
    <Breadcrumb>
      <BreadcrumbItem to="/">全部</BreadcrumbItem>
      <BreadcrumbItem to="/datamanager">数据目录</BreadcrumbItem>
    </Breadcrumb>
    <span class="total">已全部加载，共{{ value.length }}个</span>
  </div>

</template>

<style lang="less" scoped>
.data-info {
  margin: 16px 0;
  .k-breadcrumb {
    float: left;
  }
  .total {
    float: right;
  }
  &::before,
  &::after {
    content: '';
    display: table;
  }
  &::after {
    clear: both;
  }
}
</style>
