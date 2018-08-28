<script>
import { date } from '@ktw/ktools';

//操作类型
const OP_TYPES = ['原始数据', '新增要素', '编辑要素', '删除要素'];
//操作样式
const OP_STYLES = ['item-original', 'item-add', 'item-edit', 'item-delete'];

/**
 * 要素历史查看
 */
export default {
  name: 'FeatureHistory',
  props: {
    //要素信息
    feature: {
      type: Object,
      default: null,
    },
    //图层信息
    layerData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      historyData: [],
    };
  },
  mounted() {
    this.getHistory();
  },
  methods: {
    //获取要素历史信息
    getHistory() {
      let sqlFilter = `gid='${this.feature.gid}'`;
      this.$store
        .dispatch('MAP_WFS_QUERY', {
          url: `${this.layerData.baseUrl}?typeName=${this.layerData.layer.name}`,
          pageIndex: this.pageIndex,
          pageSize: 10,
          options: { cql_filter: sqlFilter },
        })
        .then(response => {
          this.historyData = response.features.sort((m, n) => {
            return m.properties.optime < n.properties.optime;
          });
        });
    },
    //格式化时间
    formatDate(item) {
      return date.format(new Date(item.properties.optime), 'YYYY-M-D HH:mm');
    },
    //格式化操作类型
    formatOpType(item) {
      return OP_TYPES[parseInt(item.properties.optype)];
    },
    //格式化操作样式
    formatOpStyle(item) {
      return OP_STYLES[parseInt(item.properties.optype)];
    },
    //定位
    highlight(item) {
      this.$store.commit('SET_MAP_GEOJSON', { geojson: item, type: 'once' });
    },
    //返回历史数据列表
    goBack() {
      this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'once' });
      this.$emit('go-back');
    },
  },
};
</script>
<template>
  <div class="feature-history-wrapper">
    <div class="history-title">
      <Icon
        :size="18"
        type="arrow-left-a"
        title="返回数据列表"
        @click.native="goBack"></Icon>
      <span>要素历史查看</span>
    </div>
    <div class="history-content">
      <Timeline>
        <TimelineItem
          v-for="(item,index) in historyData"
          :key="index"
          :class="formatOpStyle(item)"
          @click.native.stop="highlight(item)">
          <p class="item-time">{{ formatDate(item) }}</p>
          <p class="item-content">{{ formatOpType(item) }}</p>
        </TimelineItem>
      </Timeline>
    </div>
  </div>
</template>

<style lang="less">
.feature-history-wrapper {
  .k-timeline {
    margin: 10px 15px;
  }
  .k-timeline-item {
    cursor: pointer;
  }
  .item-time {
    font-size: 14px;
    font-weight: bold;
  }
  .item-content {
    font-weight: bold;
  }
  .item-original {
    .k-timeline-item-head {
      background-color: #459aee !important;
      border: none !important;
    }
  }
  .k-timeline-item-head {
    border: none !important;
  }
  .k-timeline-item-content {
    margin-left: 20px;
    padding-left: 5px;
    border-radius: 1px;
    &:hover {
      background-color: #eeeeee;
    }
  }
  .item-add {
    .k-timeline-item-head {
      background-color: #19be6b !important;
    }
  }
  .item-edit {
    .k-timeline-item-head {
      background-color: #ff9900 !important;
    }
  }
  .item-delete {
    .k-timeline-item-head {
      background-color: #ed3f14 !important;
    }
  }
}
</style>
