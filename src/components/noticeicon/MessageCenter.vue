<script>
import * as types from '@/store/types';
import { mapGetters } from 'vuex';

/*
 * 消息中心显示模块
 */
export default {
  name: 'MessageCenter',
  computed: {
    ...mapGetters({
      messages: 'sortedMessages', //消息列表
    }),
  },
  mounted() {
    this.swipMessage();
  },
  methods: {
    //读消息
    readMessage(message) {
      this.$store.commit(types.READ_NOTIFY_MESSAGE, message.id);
    },
    //读所有消息
    readAllMessage() {
      this.$store.commit(types.READ_ALL_NOTIFY_MESSAGE);
    },
    //清扫消息
    swipMessage() {
      this.$store.commit(types.SWIP_NOTIFY_MESSAGE);
    },
  },
};
</script>

<template>
  <div class="message-center-wrapper">
    <ul
      v-if="messages.length>0"
      class="message-list">
      <li
        v-for="item in messages"
        :key="item.id"
        @click="readMessage(item)">
        <p
          :class="{unread:!item.read}"
          class="message-content">
          {{ item.content }}
        </p>
        <p class="message-date">{{ item.time }}</p>
      </li>
    </ul>
    <div
      v-else
      class="notice-list-empty">
      <SvgIcon
        :size="128"
        icon-class="no-message">
    </SvgIcon>暂无消息</div>
  </div>
</template>

<style lang="less">
.message-center-wrapper {
  width: 100%;
  align-self: flex-start;
  padding: 5px 15px;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .message-list > li {
    margin-bottom: 6px;
    border-radius: 2px;
    padding: 4px 8px;
    transition: all 0.3s ease;
    &:hover {
      background-color: #eeeeee;
    }
  }
  .message-content {
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
    &.unread {
      font-weight: bold;
      &::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 3px;
        background-color: #5182e4;
        position: relative;
        top: -1px;
        margin-right: 3px;
      }
    }
  }
  .message-date {
    color: #8f9299;
    margin-top: 3px;
  }
}
</style>
