<script>
import api from '@ktw/api';

export default {
  name: 'ServiceList',
  props: {
    height: {
      type: Number,
      default: 800,
    },
    filter: {
      type: String,
      default: 'time',
    },
  },
  data() {
    return {
      serviceList: [],
    };
  },
  async beforeCreate() {
    let response = await api.public.findCatalog({
      owner: 1,
      ownerId: this.$user.orgid,
      access: 1,
      hasChild: false,
      orderby: 'sort_asc',
    });
    response = await api.public.findServiceList({
      objCondition: {
        catalogId: response.data[0].childId, // 目录id（必填）
        orgId: this.$user.orgId, // 上传人组织id（必填）
        ownerId: this.$user.id, // 拥有者id（必填）
        metadataLayer: '0,1', //资源类型（0-基础服务 1-元数据服务 2-普通服务 3--聚合服务）
        getall: 'all', // 递归查数据（必填）
        serviceType: '6,12', // 服务类型（选填）
      },
      pageIndex: 1, // 当前页索引（必填）
      pageSize: 50, // 每页显示条数（必填）
      orderby: 'createTime_desc', // 排序（选填）
    });
    this.serviceList = response.data.dataSource;
    // this.serviceList = {
    //   '今天': {
    //     [图层名]: [wms, wfs]
    //   }
    // };
  },
  methods: {
    transferData() {},
    handleBottomEdge(dir) {
      return new Promise(resolve => {
        resolve();
      });
    },
  },
};
</script>

<template>
  <Scroll
    :on-reach-bottom="handleBottomEdge"
    :height="height">
    <div>
      <div>今天</div>
      <div>
        <Card
          v-for="service in serviceList"
          :key="service.id">
          <h4>{{ service.title }}</h4>
          <span>{{ service.userName }}</span>
          <Icon type="information"></Icon>
          <Timeago :since="service.updateTime"></Timeago>
        </Card>
      </div>
    </div>
  </Scroll>
</template>

<style lang="less" scoped>
.k-card {
  margin-bottom: 8px;
  cursor: pointer;

  /deep/ .k-card-body {
    padding: 4px 12px;
  }
}
</style>
