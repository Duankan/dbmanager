<script>
import DashBoardNav from './DashBoardNav';
import DashBoardSider from './DashBoardSider';

export default {
  name: 'DashBoard',
  components: {
    DashBoardNav,
    DashBoardSider,
  },
};
</script>

<template>
  <div>
    <DashBoardNav/>
    <main>
      <DashBoardSider/>
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
