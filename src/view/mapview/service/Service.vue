<script>
import ServiceFilter from './ServiceFilter';
import ServiceList from './ServiceList';
import ServiceTree from './ServiceTree';

export default {
  name: 'Service',
  components: {
    ServiceFilter,
    ServiceList,
    ServiceTree,
  },
  data() {
    return {
      filterText: '',
      showList: true,
    };
  },
  computed: {
    componentId() {
      return this.showList ? 'ServiceList' : 'ServiceTree';
    },
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
    <div class="service-filter">
      <div class="filter-list">
        <Tag type="border">wms</Tag>
      </div>
      <Poptip
        v-show="showList"
        popper-class="filter-poptip"
        placement="right"
        transfer>
        <span class="advance-filter">高级过滤</span>
        <ServiceFilter slot="content"></ServiceFilter>
      </Poptip>
    </div>
    <div class="service-title">
      <h4>服务资源</h4>
      <Tooltip
        :content="showList ? '树形展示' : '列表展示'"
        placement="right"
        transfer>
        <Switch
          size="small"
          @on-change="(val) => showList = !val"></Switch>
      </Tooltip>
    </div>
    <div class="service-container">
      <keep-alive>
        <component
          :is="componentId"
          :condition="{title: filterText}"
          :filter-text="filterText"></component>
      </keep-alive>
    </div>
  </div>
</template>

<style lang="less" scoped>
.service {
  flex: 0 0 260px;
  position: relative;
  z-index: 1;
  padding: 10px 15px;

  .service-filter {
    display: flex;
    margin: 8px 0;
    .filter-list {
      flex: 1;
    }
    .k-poptip {
      cursor: pointer;
      color: #318cf0;
    }
  }

  .service-title {
    margin: 8px 0;
    h4 {
      display: inline-block;
      text-indent: 8px;
      border-left: 2px solid #318cf0;
    }
    .k-tooltip {
      float: right;
    }
  }
  .service-container {
    height: calc(~'100% - 100px');
    overflow: auto;
  }
}
</style>

<style lang="less">
.filter-poptip {
  .k-poptip-body {
    padding: 0;
  }
}
</style>
