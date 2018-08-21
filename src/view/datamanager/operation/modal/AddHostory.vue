<script>
import config from 'config';
import * as types from '@/store/types';
import { date } from '@ktw/ktools';
import { getServiceName } from '@/utils/helps';

/*
 * 增量包上传模块
 */
export default {
  name: 'AddPackage',
  props: {
    //对话框是否打开
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //是否正在处理
      loading: false,
      //起始时间
      startTime: null,
      //结束时间
      endTime: null,
    };
  },
  computed: {
    //当前选择节点
    node() {
      return this.$store.state.app.selectNodes[0];
    },
    //对话框标题
    title() {
      return this.node ? `生成${this.node.name}历史图层` : '生成历史图层';
    },
  },
  methods: {
    //对话框显示改变
    visibleChange(visible) {
      !visible && this.resetControl();
      this.$emit('input', visible);
    },
    //重置控件状态
    resetControl() {
      this.startTime = null;
      this.endTime = null;
      this.loading = false;
    },
    //格式化时间
    formatTime(time) {
      return time ? date.format(time, 'YYYY-MM-DD') : '';
    },
    //生成历史图层
    async addHistoryLayer() {
      let startTime = this.formatTime(this.startTime);
      let endTime = this.formatTime(this.endTime);
      let layerName = getServiceName(this.node.serviceList[0].servicesurl);
      this.loading = true;
      const response = await api.db
        .addhistory(
          {
            name: layerName,
            startTime,
            endTime,
          },
          {},
          {
            headers: { Authorization: 'Basic YWRtaW46Z2Vvc2VydmVy' },
          }
        )
        .catch(p => {
          this.loading = false;
        });
      if (response.data) {
        this.addPollTask(response.data);
        this.$Notice.info({
          title: `${this.node.name}任务已提交`,
          desc: `生成历史图层任务已进入后台队列，可在任务列表中查看进度！`,
        });
        this.visibleChange(false);
      } else {
        this.$Message.error('生成历史图层失败！');
      }
      this.loading = false;
    },
    //新增轮询任务
    addPollTask(taskId) {
      let task = {
        taskId,
        taskType: '生成历史图层',
        taskName: this.node.name,
        taskTime: date.format(new Date(), 'YYYY-M-D HH:mm'),
      };
      this.$store.commit(types.ADD_POLL_TASK, task);
    },
  },
};
</script>

<template>
  <Modal
    :value="value"
    :mask-closable="false"
    :title="title"
    width="380"
    @on-visible-change="visibleChange">
    <div class="add-history-wrapper">
      <Form :label-width="80">
        <FormItem
          label="起始时间"
          prop="startTime">
          <DatePicker
            v-model="startTime"
            type="date"
            confirm
            placeholder="选择起始时间"></DatePicker>
        </FormItem>
        <FormItem
          label="结束时间"
          prop="endTime">
          <DatePicker
            v-model="endTime"
            type="date"
            confirm
            placeholder="选择结束时间"></DatePicker>
        </FormItem>
        <FormItem>
          <Alert>
            <template slot="desc">起始时间和结束时间可以不选，不选时间则生成结束日期为当前日期的历史图层。</template>
          </Alert>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button
        type="success"
        size="large"
        long
        @click="addHistoryLayer">生成历史图层</Button>
    </div>
    <Spin
      v-if="loading"
      fix>
      <Icon
        type="load-c"
        size="18"
        class="circle-spin-icon-load"></Icon>
    <div>正在生成历史图层...</div></Spin>
  </Modal>
</template>

<style lang="less">
.add-history-wrapper {
  .k-date-picker {
    width: 250px;
  }
  .k-form-item:last-child {
    margin-bottom: 0;
    .k-form-item-content {
      margin: 0 15px !important;
    }
    .k-alert-with-desc {
      padding: 8px 16px;
      margin-bottom: 0;
    }
  }
}
</style>
