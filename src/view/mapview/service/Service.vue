<script>
import ServiceFilter from './ServiceFilter';
import ServiceList from './ServiceList';
import ServiceTree from './ServiceTree';
import StyleEdit from '../styleEdit/StyleEdit';

export default {
  name: 'Service',
  components: {
    ServiceFilter,
    ServiceList,
    ServiceTree,
    StyleEdit,
  },
  data() {
    return {
      filterText: '',
      showList: true,
      total: 0,
      isTree: true,
      layerNode: null,
    };
  },
  computed: {
    componentId() {
      return this.showList ? 'ServiceList' : 'ServiceTree';
    },
  },
  mounted() {
    this.getServiceCount();
  },
  methods: {
    //获取服务数量
    async getServiceCount() {
      const response = await api.db.findSevicePageList({
        objCondition: {
          userId: this.$appUser.id,
          serviceType: '12,5',
          title: this.filterText,
        },
        pageIndex: 1,
        pageSize: 10,
      });
      this.total = response.data.pageInfo.totalCount;
    },
    mapLayerEditStyle(value) {
      this.isTree = false;
      this.layerNode = value;
    },
  },
};
</script>

<template>
  <div class="main">
    <div 
      v-if="isTree" 
      class="service">
      <Input
        v-model="filterText"
        placeholder="请输入检索服务资源"
        icon="ios-search-strong"
        clearable
        @on-change="getServiceCount">
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
        <h4>服务资源({{ total }}条)</h4>
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
        <ServiceList 
          v-if="showList" 
          @style-edit-event="mapLayerEditStyle"
        />
        <ServiceTree v-else />
        <!--<keep-alive>
          <component
            :is="componentId"
            :condition="{title: filterText}"
            :filter-text="filterText"></component>
        </keep-alive>-->
      </div>
    </div>
    <div 
      v-else 
      class="mapStyle">
      <StyleEdit 
        :layer-node="layerNode" 
        @back-event="(event)=>isTree = true"/>
    </div>
  </div>
</template>

<style lang="less" scoped>
.main {
  height: 100%;
}
.service {
  // flex: 0 0 260px;
  width: 300px;
  position: relative;
  z-index: 1;
  padding: 10px 15px;
  height: 100%;
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

.mapStyle {
  width: 300px;
  height: 100%;
}
</style>

<style lang="less">
.filter-poptip {
  .k-poptip-body {
    padding: 0;
  }
}
</style>
