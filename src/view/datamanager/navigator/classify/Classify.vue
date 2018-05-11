<script>
export default {
  name: 'Classify',
  data() {
    return {
      classify: [
        {
          name: '最近',
          icon: 'map-edit',
        },
        {
          name: '全部',
          icon: 'map-edit',
        },
        {
          name: '矢量',
          icon: 'map-edit',
        },
        {
          name: '影像',
          icon: 'map-edit',
        },
        {
          name: '服务',
          icon: 'map-edit',
        },
        {
          name: '样式',
          icon: 'map-edit',
        },
        {
          name: '文档',
          icon: 'map-edit',
        },
        {
          name: '其他',
          icon: 'map-edit',
        },
      ],
    };
  },
};
</script>

<template>
  <ul class="classify">
    <li
      v-for="item in classify"
      :key="item.name">
      <SvgIcon
        :icon-class="item.icon"
        :size="18"></SvgIcon>
      {{ item.name }}
    </li>
  </ul>
</template>

<style lang="less" scoped>
.classify {
  list-style: none;
  font-size: 14px;
  padding-left: 16px;
  li {
    margin: 16px 0;
    cursor: pointer;
    &:first-child {
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
  }
}
</style>
