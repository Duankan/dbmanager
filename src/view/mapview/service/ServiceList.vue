<script>
import api from 'api';
import ServiceListItem from './ServiceListItem';

export default {
  name: 'ServiceList',
  components: {
    ServiceListItem,
  },
  props: {
    condition: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showMore: true, // 控制是否显示底部提示文字
      loadAll: false, // 是否已全部加载完成
      height: 0,
      pageIndex: 1,
      pageSize: 20,
      serviceList: [],
    };
  },
  watch: {
    condition: {
      async handler() {
        this.pageIndex = 1;
        this.loadAll = false;
        this.showMore = false;
        this.serviceList = await this.fetchData();
        this.showMore = true;
        if (this.serviceList.length < this.pageSize) {
          this.loadAll = true;
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.height = parseInt(this.$el.parentNode.offsetHeight);
  },
  methods: {
    async fetchData() {
      const response = await api.db.findSevicePageList({
        objCondition: Object.assign(
          {
            userId: this.$appUser.id,
            serviceType: '12,5',
          },
          this.condition
        ),
        pageIndex: this.pageIndex, // 当前页索引（必填）
        pageSize: this.pageSize, // 每页显示条数（必填）
      });
      return response.data.dataSource;
    },
    handleBottomEdge() {
      return new Promise(async resolve => {
        if (!this.loadAll) {
          this.showMore = false;
          this.pageIndex++;
          const serviceList = await this.fetchData();
          if (serviceList.length) {
            this.serviceList = this.serviceList.concat(serviceList);
          } else {
            this.loadAll = true;
          }
          this.showMore = true;
        }
        resolve();
      });
    },
    styleEditSelect(value) {
      this.$emit('style-edit-event', value);
    },
  },
};
</script>

<template>
  <Scroll
    :on-reach-bottom="handleBottomEdge"
    :distance-to-edge="[10,10]"
    :height="height">
    <ServiceListItem 
      v-for="service in serviceList"
      :key="service.serviceId"
      :node="service"
      @style-edit-event="styleEditSelect"
    ></ServiceListItem>
    <a
      v-show="showMore"
      class="more"
      @click="handleBottomEdge">{{ loadAll ? '没有更多数据' : '点击加载更多...' }}</a>
  </Scroll>
</template>

<style lang="less" scoped>
.more {
  display: inline-block;
  width: 100%;
  text-align: center;
  height: 24px;
  line-height: 24px;
}
</style>
