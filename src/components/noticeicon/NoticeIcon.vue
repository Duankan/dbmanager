<script>
import PollTask from './PollTask';
import MessageCenter from './MessageCenter';

/*
 * 通知中心模块
 */
export default {
  name: 'NoticeIcon',
  components: {
    PollTask,
    MessageCenter,
  },
  data() {
    return {
      //模块列表
      modules: [
        {
          title: '任务',
          component: 'PollTask',
        },
        {
          title: '通知',
          component: 'MessageCenter',
        },
      ],
    };
  },
  methods: {
    //Tab渲染函数
    labelRender: (h, ctx) => {
      return h('div', [
        h('span', '标签一'),
        h('Badge', {
          props: {
            count: 2,
            overflowCount: 100,
          },
        }),
      ]);
    },
  },
};
</script>

<template>
  <Poptip
    :width="280"
    class="notice-icon"
    trigger="click"
    placement="bottom-end">
    <Badge dot>
      <Icon
        type="ios-bell-outline"
        size="24"/>
    </Badge>
    <div
      slot="content"
      class="notice-panel">
      <Tabs
        size="small">
        <TabPane
          v-for="(item,index) in modules"
          :label="item.title"
          :key="index"
          class="notice-list">
          <component :is="item.component"></component>
        </TabPane>
      </Tabs>
      <div class="notice-panel-footer">
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
    width: 100%;

    .notice-list {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 240px;
      margin-bottom: 40px;
      overflow: auto;

      /deep/ .notice-list-empty {
        text-align: center;
        color: #676d7a;
        .k-svgicon {
          display: block;
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
