<script>
export default {
  name: 'NoticeIcon',
  data() {
    return {
      title: ['通知', '任务'],
      messageList: [],
    };
  },
};
</script>

<template>
  <Poptip
    class="notice-icon"
    trigger="hover"
    placement="bottom-end">
    <Badge dot>
      <Icon
        type="ios-bell-outline"
        size="24"/>
    </Badge>
    <div
      slot="content"
      class="notice-panel">
      <Tabs size="small">
        <TabPane
          v-for="item in title"
          :label="item"
          :key="item"
          class="notice-list"
        >
          <ul v-if="messageList.length">
            <li
              v-for="item in messageList"
              :key="item.time"
              class="notice-list-item">
              <p>{{ item.message }}</p>
              <span>{{ item.time }}</span>
            </li>
          </ul>
          <div
            v-else
            class="notice-list-empty">
            <SvgIcon
              :size="128"
              icon-class="no-message"
          ></SvgIcon>暂无消息</div>
        </TabPane>
      </Tabs>
      <div class="notice-panel-footer">
        <span>全部标记为已读</span>
        <span>查看全部<Icon
          type="chevron-right"
          color="#495060"></Icon></span>
      </div>
    </div>
  </Poptip>
</template>

<style lang="less" scoped>
.notice-icon {
  margin-right: 30px;
  cursor: pointer;

  /deep/ .k-poptip-body {
    padding: 0;
  }

  .notice-panel {
    position: relative;
    width: 260px;

    .notice-list {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 240px;
      margin-bottom: 40px;
      overflow: auto;

      .notice-list-empty {
        text-align: center;
        color: #676d7a;
        .k-svgicon {
          display: block;
        }
      }

      .notice-list-item {
        padding: 12px 16px;
        p {
          white-space: normal;
        }

        span {
          margin-top: 6px;
          color: #80848f;
        }
        &:hover {
          background: #f6f8f8;
        }
      }
    }

    /deep/ .k-tabs-bar {
      margin-bottom: 0;
      margin: 0 20px;
    }

    &-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 40px;
      line-height: 20px;
      padding: 10px 16px;
      color: #358cf0;
      background: #f9f9fa;

      > span {
        cursor: pointer;

        .k-icon {
          margin-left: 8px;
        }

        &:first-child {
          color: #495060;
        }
        &:last-child {
          float: right;
        }

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
