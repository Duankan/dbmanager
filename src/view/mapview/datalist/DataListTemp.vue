<script>
import * as types from '@/store/types';
export default {
  name: 'DataListTemp',
  data() {
    return {
      arrowStyle: 'chevron-down',
    };
  },
  computed: {
    style() {
      let paneState = this.$store.state.bus.bottomPaneState;
      let height = 0;
      if (paneState == 0) {
        height = 0;
      } else if (paneState == 1) {
        height = '320px';
      } else {
        height = '28px';
      }
      return { height };
    },
    dataTable() {
      return this.$store.state.bus.currentDataTable;
    },
    paneState() {
      return this.$store.state.bus.bottomPaneState;
    },
  },
  methods: {
    //关闭面板
    close() {
      this.$store.commit(types.CLOSE_BOTTOM_PANE);
    },
    //展开折叠面板
    toggle() {
      if (this.paneState == 1) {
        this.$store.commit(types.COLLAPSE_BOTTOM_PANE);
        this.arrowStyle = 'chevron-up';
      } else {
        this.$store.commit(types.OPEN_BOTTOM_PANE);
        this.arrowStyle = 'chevron-down';
      }
    },
  },
};
</script>

<template>
  <transition name="slide">
    <div
      :style="style"
      class="attribute-table" >
      <Card dis-hover>
        <p slot="title">数据属性</p>
        <div slot="extra">
          <Icon
            :type="arrowStyle"
            @click.native="toggle">
          </Icon>
          <Icon
            type="close"
            @click.native="close"></Icon>
        </div>
        <ExtractPlan v-if = "dataTable==='ExtractPlan'"/>
        <DataTable v-if = "dataTable==='AttributeTable'"/>
      </Card>
    </div>
  </transition>
</template>

<style lang="less" scoped>
.attribute-table {
  z-index: 1000;

  .k-card {
    height: 100%;
  }
  /deep/ .k-card-head {
    padding: 4px 16px;
    background-color: #358cf0;
    p {
      color: #fff;
    }
  }
  /deep/ .k-card-extra {
    right: 16px;
    top: 6px;
    cursor: pointer;
    .k-icon {
      color: #fff;
      margin-left: 6px;
    }
  }
  /deep/ .k-card-body {
    padding: 0 16px;
  }
}
</style>
