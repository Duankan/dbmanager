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
          title: 'GIS数据管理',
          name: 'DataManager',
          icon: 'data-manager',
        },
        {
          title: 'GIS数据浏览',
          name: 'MapView',
          icon: 'map-view',
        },
        {
          title: '业务数据',
          name: 'Business',
          icon: 'map-edit',
        },
      ],
    };
  },
  methods: {
    click(item) {
      if (item.title == '地图编辑') {
      } else {
        this.$router.push({ name: item.name });
      }
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
  background-color: #393d49;
}
</style>
