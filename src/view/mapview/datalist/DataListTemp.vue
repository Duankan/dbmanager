<script>
import * as types from '@/store/types';
import DataTable from '@/components/datatable/DataTable';
import PlanExtract from '@/components/extractplan/PlanExtract';
export default {
  name: 'DataListTemp',
  components: {
    DataTable,
    PlanExtract,
  },
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
    title() {
      return this.$store.state.bus.bottomPaneTitle;
    },
    paneState() {
      return this.$store.state.bus.bottomPaneState;
    },
  },
  watch: {
    paneState(val) {
      if (!val) {
        let content = this.$refs.content;
        content.dispose && content.dispose();
      }
    },
  },
  methods: {
    //关闭面板
    close() {
      this.$store.commit(types.CLOSE_BOTTOM_PANE);
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'));
      });
      this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'once' });
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
        <p slot="title">{{ title }}</p>
        <div slot="extra">
          <Icon
            :type="arrowStyle"
            @click.native="toggle">
          </Icon>
          <Icon
            type="close"
            @click.native="close"></Icon>
        </div>
        <component
          ref="content"
          :is="dataTable"></component>
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
