<script>
import { UserLogin } from '@ktw/kbus';

/* action */
const PERMISSION_PERMIT_FETCH = 'PERMISSION_PERMIT_FETCH';
const MESSAGE_LIST_FETCH = 'MESSAGE_LIST_FETCH';
const MESSAGE_WS_CONNECT = 'MESSAGE_WS_CONNECT';

export default {
  name: 'Login',
  components: {
    UserLogin,
  },
  data: () => {
    return {};
  },
  beforeDestroy() {
    this.$store.dispatch(PERMISSION_PERMIT_FETCH);
    this.$store.dispatch(MESSAGE_LIST_FETCH);
    // this.$store.dispatch(MESSAGE_WS_CONNECT);
  },
};
</script>

<template>
  <div class="user-login">
    <header>
      <div>
        <img
          src="~assets/user/brand.jpg"
          alt="产品图标">
        <span>K-TopHighGIS</span>
      </div>
      <p> K-TopHighGIS高性能云GIS平台是湖北金拓维信息技术有限公司开发的，具有完全自主知识产权的GIS平台产品.</p>
    </header>
    <UserLogin/>
    <footer>
      Copyright &copy; 2018 湖北金拓维信息技术有限公司
    </footer>
  </div>
</template>

<style lang="less" scoped>
.user-login {
  background: url('~assets/user/user-bg.svg');
  background-color: #f0f2f5;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  height: 100vh;
  padding: 140px 0 144px 0;

  header {
    text-align: center;

    div {
      line-height: 60px;

      img {
        height: 60px;
        border-radius: 50%;
        margin-right: 14px;
        vertical-align: middle;
      }
      span {
        font-size: 34px;
        vertical-align: middle;
      }
    }

    p {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      margin: 20px 0 80px 0;
    }
  }

  .k-user-login {
    width: 360px;
    margin: 0 auto;
  }

  footer {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 14px;
  }
}
</style>
