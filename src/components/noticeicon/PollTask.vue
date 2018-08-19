<script>
import * as types from '@/store/types';
import { mapGetters } from 'vuex';

/*
 * 轮询任务显示模块
 */
export default {
  name: 'PollTask',
  computed: {
    ...mapGetters({
      tasks: 'sortedTasks', //轮询任务
    }),
  },
  watch: {
    tasks: {
      handler(tasks) {
        this.checkFinishTask(tasks);
      },
      deep: true,
    },
  },
  mounted() {
    this.startPollTasks();
  },
  methods: {
    //启动所有轮询任务
    startPollTasks() {
      this.tasks.forEach(p => {
        this.$store.commit(types.START_POLL_TASK, p.taskId);
      });
    },
    //检查任务完成并通知
    checkFinishTask(tasks) {
      let pollTasks = tasks || [];
      let completedTasks = pollTasks.filter(p => p.progress >= 100);
      completedTasks.forEach(p => {
        debugger;
        this.$events.emit(`on-poll-complete`, p);
        this.$Notice.success({
          title: p.taskType,
          desc: `${p.taskName}${p.taskType}已完成!`,
        });
        this.$store.commit(types.COMPLETE_POLL_TASK, p.taskId);
      });
    },
  },
};
</script>

<template>
  <div class="poll-task-wrapper">
    <ul
      v-if="tasks.length>0"
      class="poll-task-list">
      <li
        v-for="item in tasks"
        :key="item.taskId">
        <div class="poll-task-item">
          <div class="item-desc">
            <ul>
              <li><span>类型：</span>{{ item.taskType }}</li>
              <li><span>名称：</span>{{ item.taskName }}</li>
              <li><span>时间：</span>{{ item.taskTime }}</li>
            </ul>
          </div>
          <div class="item-progress">
            <Circle
              :percent="item.progress"
              :size="60">
              <span class="progress-text">{{ item.progress }}%</span>
            </Circle>
          </div>
        </div>
      </li>
    </ul>
    <div
      v-else
      class="notice-list-empty">
      <SvgIcon
        :size="128"
        icon-class="no-message">
    </SvgIcon>暂无任务</div>
  </div>
</template>

<style lang="less">
.poll-task-wrapper {
  width: 100%;
  align-self: flex-start;
  padding: 5px 15px;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .poll-task-list > li {
    margin-bottom: 5px;
    border-radius: 2px;
    transition: all 0.3s ease;
    &:hover {
      background-color: #eeeeee;
    }
  }
  .poll-task-item {
    display: flex;
    .item-desc {
      flex: 1;
      padding: 3px;
      li {
        padding: 0 5px;
        height: 22px;
        line-height: 22px;
        > span {
          color: #666666;
          font-weight: bold;
        }
      }
    }
    .item-progress {
      width: 72px;
      height: 72px;
      padding: 6px;
      .progress-text {
        font-size: 18px;
      }
    }
  }
}
</style>
