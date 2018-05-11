<script>
import api from 'api';

export default {
  name: 'DataBreadcrumb',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    rootNodeText: {
      type: String,
      default: '数据目录',
    },
  },
  data() {
    return {
      breadcrumb: [],
    };
  },
  computed: {
    current() {
      return this.$store.state.app.currentCatalog;
    },
  },
  watch: {
    async current(newVal, oldVal) {
      const response = await api.db.findCatalogPath({ id: newVal.id });
      const catalogArray = response.data.reverse().slice(1);
      catalogArray[0].name = this.rootNodeText;
      this.breadcrumb = catalogArray;
    },
  },
  methods: {
    select(node, index) {
      // 如果点击的不是当前目录节点 则提交节点对象 刷新列表
      if (index !== this.breadcrumb.length - 1) {
        this.$emit('on-select-node', node);
      }
    },
  },
};
</script>

<template>
  <div class="data-breadcrumb">
    <Breadcrumb>
      <BreadcrumbItem>全部</BreadcrumbItem>
      <BreadcrumbItem
        v-for="(item, index) in breadcrumb"
        :key="item.id"
        @click.native="select(item, index)">{{ item.name }}</BreadcrumbItem>
    </Breadcrumb>
    <span class="total">已全部加载，共 {{ value.length }} 个</span>
  </div>

</template>

<style lang="less" scoped>
.data-breadcrumb {
  margin: 16px 0;
  .k-breadcrumb {
    float: left;
    > span:not(:first-child) {
      cursor: pointer;
    }
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
