<script>
export default {
  name: 'BatchPublish',
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '服务标题',
          key: 'title',
        },
        {
          title: '服务名称',
          key: 'name',
        },
        {
          title: '空间参考',
          key: 'crs',
        },
        {
          title: '渲染样式',
          key: 'style',
        },
        {
          title: '服务类型',
          key: 'serviceType',
        },
      ],
    };
  },
};
</script>

<template>
  <Table
    :columns="columns"
    :data="value"
    size="small"
  ></Table>
</template>

<style lang="less" scoped>
</style>
