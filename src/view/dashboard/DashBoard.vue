<script>
import DashBoardNav from './DashBoardNav';
import DashBoardSidebar from './DashBoardSidebar';

export default {
  name: 'DashBoard',
  components: {
    DashBoardNav,
    DashBoardSidebar,
  },
};
</script>

<template>
  <div>
    <DashBoardNav/>
    <main>
      <DashBoardSidebar/>
      <transition
        name="fade"
        mode="out-in">
        <router-view></router-view>
      </transition>
    </main>
  </div>
</template>

<style lang="less" scoped>
main {
  height: calc(~'100vh - 60px');
}
</style>
