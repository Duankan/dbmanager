<script>
import DashBoardSidebarItem from './DashBoardSidebarItem';

export default {
  name: 'DashBoardSidebar',
  components: {
    DashBoardSidebarItem,
  },
  data() {
    return {
      siderBar: [
        {
          title: '数据管理',
          name: 'DataManager',
          icon: 'data-manager',
        },
        {
          title: '数据浏览',
          name: 'MapView',
          icon: 'map-view',
        },
        {
          title: '地图编辑',
          name: 'MapEdit',
          icon: 'map-edit',
        },
      ],
    };
  },
  methods: {
    click(item) {
      this.$router.push({ name: item.name });
    },
  },
};
</script>

<template>
  <aside>
    <DashBoardSidebarItem
      v-for="(item) in siderBar"
      :value="item"
      :key="item.title"
      @click.native="click(item)"/>
  </aside>
</template>

<style lang="less" scoped>
aside {
  float: left;
  width: 50px;
  height: 100%;
  background-color: #eeeff1;
}
</style>
