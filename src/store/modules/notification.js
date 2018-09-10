import * as types from '../types';
import api from 'api';
import { date, uuid, cloneDeep } from '@ktw/ktools';
import * as TaskParsers from '@/components/noticeicon/task-parsers';

//轮询时间间隔
const REQUEST_TIMEOUT = 5000;

/**
 * 任务队列消息中心store模块
 */
const notification = {
  state: {
    //任务列表
    tasks: [],
    //消息列表
    messages: [],
  },
  getters: {
    //倒序的任务列表
    sortedTasks: state => {
      return cloneDeep(state.tasks).reverse();
    },
    //倒序的消息
    sortedMessages: state => {
      return cloneDeep(state.messages).reverse();
    },
  },
  mutations: {
    //增加轮询任务
    [types.ADD_POLL_TASK](state, task) {
      let pollTask = state.tasks.find(p => p.taskId == task.taskId);
      if (!pollTask) {
        pollTask = {
          ...task,
          progress: 0,
          successful: false,
          result: null,
        };
        state.tasks.push(pollTask);
      }
      this.commit(types.START_POLL_TASK, pollTask.taskId);
    },
    //启动轮询任务
    [types.START_POLL_TASK](state, taskId) {
      let pollTask = state.tasks.find(p => p.taskId == taskId);
      let pollHandler = async () => {
        let method = pollTask.method || 'getbyid';
        const response = await api.db[method]({
          id: taskId,
        });
        let data = response.data;
        let parser = pollTask.callback;
        if (parser && TaskParsers[parser]) {
          data = TaskParsers[parser](data, taskId);
        }
        let progress = 0;
        if (data.complete && !data.successful) {
          progress = 100;
        } else {
          progress = Math.round(parseFloat(data.progress * 100) * 100) / 100;
        }
        this.commit(types.UPDATE_POLL_TASK, {
          taskId: pollTask.taskId,
          progress: progress,
          complete: data.complete,
          successful: data.successful,
          result: data.result,
        });
        if (!data.complete) {
          setTimeout(pollHandler, REQUEST_TIMEOUT);
        }
      };
      pollHandler();
    },
    //更新轮询任务
    [types.UPDATE_POLL_TASK](state, task) {
      let target = state.tasks.find(p => p.taskId == task.taskId);
      if (target) {
        target.progress = task.progress;
        target.complete = task.complete;
        target.successful = task.successful;
        target.result = task.result;
      }
    },
    //完成轮询任务
    [types.COMPLETE_POLL_TASK](state, taskId) {
      let target = state.tasks.find(p => p.taskId == taskId);
      if (target) {
        let idx = state.tasks.indexOf(target);
        state.tasks.splice(idx, 1);
        let stateText = target.successful ? '成功！' : '失败！';
        let message = {
          content: `${target.taskName}${target.taskType}${stateText}`,
          result: target.result,
        };
        this.commit(types.ADD_NOTIFY_MESSAGE, message);
      }
    },
    //新增消息
    [types.ADD_NOTIFY_MESSAGE](state, message) {
      let msg = {
        ...message,
        id: uuid(),
        time: date.format(new Date(), 'YYYY-M-D HH:mm'),
        read: false,
      };
      state.messages.push(msg);
    },
    //消息标记为已读
    [types.READ_NOTIFY_MESSAGE](state, msgId) {
      let message = state.messages.find(p => p.id == msgId);
      if (message) {
        message.read = true;
      }
    },
    //标记所有消息为已读
    [types.READ_ALL_NOTIFY_MESSAGE](state) {
      state.messages.forEach(p => (p.read = true));
    },
    //清空所有消息
    [types.CLEAR_NOTIFY_MESSAGE](state) {
      state.messages.splice(0, state.messages.length);
    },
    //清扫消息，移除过量的消息
    [types.SWIP_NOTIFY_MESSAGE](state) {
      const maxCount = 50;
      let deleteIds = [];
      let messages = this.getters.sortedMessages;
      //先清理已读信息(时间倒序)，直到达到阈值
      if (messages.length > maxCount) {
        for (let i = messages.length - 1; i >= 0; i--) {
          if (messages.length <= maxCount) break;
          if (messages[i].read) {
            deleteIds.push(messages[i].id);
            messages.splice(i, 1);
          }
        }
      }
      //再清理未读消息(时间倒序)，直到达到阈值
      if (messages.length > maxCount) {
        for (let i = messages.length - 1; i >= 0; i--) {
          if (messages.length <= maxCount) break;
          deleteIds.push(messages[i].id);
          messages.splice(i, 1);
        }
      }
      //执行删除
      for (let i = state.messages.length - 1; i >= 0; i--) {
        let message = state.messages[i];
        if (deleteIds.indexOf(message.id) >= 0) {
          state.messages.splice(i, 1);
        }
      }
    },
  },
  actions: {},
};

export default notification;
