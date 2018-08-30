<script>
import DashBoardMenu from './DashBoardMenu';

/* mutation */
const USER_LOGOUT = 'USER_LOGOUT';

export default {
  name: 'DashBoardNav',
  components: { DashBoardMenu },
  methods: {
    click() {
      this.$Modal.comfirm({
        title: '退出',
        content: '<p>确定退出系统吗?</P>',
        onOK: () => {
          this.$store.dispatch(USER_LOGOUT).then(() => {
            this.$router.replace('/login');
          });
        },
      });
    },
  },
};
</script>

<template>
  <header>
    <div class="left">
      <img
        src="~assets/dashboard/logo.png"
        alt="logo">
      <span>
        大数据中心管理系统
      </span>
      <DashBoardMenu/>
    </div>
    <div class="right">
      <UserInfo/>
      <NoticeIcon/>
      <Icon
        type="log-out"
        size="22"
        @click.native="click"></Icon>
    </div>
  </header>
</template>

<style lang="less" scoped>
header {
  display: flex;
  height: 60px;
  color: #fff;
  background-color: #318cf0;

  .left {
    display: flex;
    flex: 1;

    img {
      height: 35px;
      margin: 10px 14px;
    }
    span {
      line-height: 60px;
      font-size: 24px;
      margin: 0 60px 0 6px;
    }
  }
  .right {
    display: flex;
    align-items: center;

    .k-icon {
      cursor: pointer;
      margin-right: 36px;
    }
  }
}
</style>
