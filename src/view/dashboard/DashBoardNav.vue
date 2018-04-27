<script>
/* mutation */
const USER_LOGOUT = 'USER_LOGOUT';

export default {
  name: 'DashBoardNav',
  methods: {
    click(name) {
      if (name === 'logout') {
        this.$store.dispatch(USER_LOGOUT).then(() => {
          this.$router.replace('/login');
        });
      }
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
  height: 60px;
  color: #fff;
  background-color: #318cf0;

  .left {
    float: left;
    font-size: 0;

    img {
      height: 35px;
      margin: 10px 14px;
    }
    span {
      float: right;
      line-height: 60px;
      font-size: 20px;
    }
  }
  .right {
    display: flex;
    align-items: center;
    float: right;
    height: 60px;

    .k-icon {
      cursor: pointer;
      margin-right: 36px;
    }
  }
}
</style>
