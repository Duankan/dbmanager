<script>
import ServiceFilter from './ServiceFilter';
import ServiceList from './ServiceList';

export default {
  name: 'Service',
  components: {
    ServiceFilter,
    ServiceList,
  },
  data() {
    return {
      filterText: '',
    };
  },
};
</script>

<template>
  <div class="service">
    <Input
      v-model="filterText"
      placeholder="请输入检索服务资源"
      icon="ios-search-strong"
      clearable>
    </Input>
    <div class="service-title">
      <h4>服务资源</h4>
      <Poptip
        placement="right"
        transfer>
        <span class="service-filter">高级过滤</span>
        <ServiceFilter slot="content"></ServiceFilter>
      </Poptip>
    </div>
    <div class="service-list">
      <!-- <DataTree draggable></DataTree> -->
      <ServiceList></ServiceList>
    </div>
  </div>
</template>

<style lang="less" scoped>
.service {
  flex: 0 0 260px;
  position: relative;
  z-index: 1;
  padding: 10px 15px;

  .service-title {
    margin: 16px 0 8px 0;
    h4 {
      display: inline-block;
      text-indent: 8px;
      border-left: 2px solid #318cf0;
    }
    .k-poptip {
      float: right;
      cursor: pointer;
      color: #318cf0;
    }
  }
  .service-list {
    height: calc(~'100% - 80px');
    overflow: auto;
  }
}
</style>
