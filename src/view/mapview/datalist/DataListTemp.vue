<script>
import * as types from '@/store/types';
export default {
  name: 'DataListTemp',
  data() {
    return {
      expand: false,
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
        height = 'calc(100% - 33px)';
      }
      return { height };
    },
    dataTable() {
      return this.$store.state.bus.currentDataTable;
    },
    paneState() {
      return this.$store.state.bus.bottomPaneState;
    },
    // queryState() {
    //   switch (this.dataTable) {
    //     case 'ExtractPlan':
    //       return this.$store.state.bus.plandata;
    //       break;
    //     case 'AttributeTable':
    //       return this.$store.state.bus.attribute.length;
    //       break;
    //     case 'StyleTable':
    //       return true;
    //       break;
    //     default:
    //       break;
    //   }
    // },
  },
  methods: {
    //关闭面板
    close() {
      this.$store.commit(types.CLOSE_BOTTOM_PANE);
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
            :type="expand ? 'chevron-down' : 'chevron-up'"
            @click.native="expand = !expand">
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
