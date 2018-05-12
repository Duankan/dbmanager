<script>
import api from 'api';

export default {
  name: 'ServiceList',
  props: {
    filter: {
      type: String,
      default: 'time',
    },
  },
  data() {
    return {
      height: 0,
      serviceList: [],
    };
  },
  async beforeCreate() {
    const response = await api.db.findSevicePageList({
      objCondition: {
        userId: this.$user.id,
      },
      pageIndex: 1, // 当前页索引（必填）
      pageSize: 20, // 每页显示条数（必填）
      orderby: 'createTime_desc', // 排序（选填）
    });
    // 聚合查询
    // console.log(response.data.dataSource);
    this.serviceList = response.data.dataSource;
    // this.serviceList = {
    //   '今天': {
    //     [图层名]: [wms, wfs]
    //   }
    // };
  },
  mounted() {
    this.height = parseInt(this.$el.parentNode.offsetHeight);
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
