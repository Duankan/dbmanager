<script>
import FeatureHistory from './FeatureHistory';
export default {
  name: 'QueryLayerHistory',
  components: {
    FeatureHistory,
  },
  props: {
    layerData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      features: [],
      listData: [],
      totalPages: 0,
      pageIndex: 1,
      changeType: '1=1',
      featureHistoryVisible: false,
      currentFeature: null,
    };
  },
  watch: {
    layerData: {
      handler(newVal) {
        if (Object.keys(newVal).length !== 0) {
          this.queryLayer();
        }
      },
      immediate: true,
    },
  },
  methods: {
    queryLayer() {
      this.$store
        .dispatch('MAP_WFS_QUERY', {
          url: `${this.layerData.baseUrl}?typeName=${this.layerData.layer.name}`,
          pageIndex: this.pageIndex,
          pageSize: 10,
          options: { cql_filter: this.changeType },
        })
        .then(response => {
          this.listData = [];
          this.features = response.features;
          if (response.features) {
            response.features.forEach(feature => {
              this.$set(feature.properties, 'isMore', false);
              this.listData.push(feature.properties);
            });
            this.totalPages = response.totalFeatures;
          }
        });
    },
    titleClass(type) {
      return {
        'list-original': type === '0',
        'list-add': type === '1',
        'list-edit': type === '2',
        'list-delete': type === '3',
      };
    },
    setListTitle(item) {
      const layerPro = Object.values(item);
      return layerPro[layerPro.length - 1];
    },
    changeQuery() {
      this.pageIndex = 1;
      this.queryLayer();
    },
    changePage(pageIdx) {
      this.pageIndex = pageIdx;
      this.queryLayer();
    },
    highlight(item, index) {
      const row = this.features[index];
      this.$store.commit('SET_MAP_GEOJSON', { geojson: row, type: 'once' });
    },
    clear() {
      this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'once' });
    },
    moreView(row, rowIdx) {
      this.listData[rowIdx].isMore = true;
      for (var i = 0; i < this.listData.length; i++) {
        if (i != rowIdx) {
          this.listData[i].isMore = false;
        }
      }
    },
    isMoreView: function(row, prop, proIdx) {
      var isShow = false;
      if (prop != 'optype' && prop != 'isMore') {
        if (!row.isMore) {
          if (proIdx < 6) {
            isShow = true;
          }
        } else {
          isShow = true;
        }
      }
      return isShow;
    },
    showFeatureHistory(row) {
      this.currentFeature = row;
      this.featureHistoryVisible = true;
    },
    goTimeline() {
      this.$emit('go-back');
    },
    goBack() {
      this.featureHistoryVisible = false;
    },
  },
};
</script>

<template>
  <div class="history-query-wrapper">
    <div v-if="!featureHistoryVisible">
      <div class="history-title">
        <Icon
          :size="18"
          type="arrow-left-a"
          title="返回时间轴"
          @click.native="goTimeline"></Icon>
        <span>历史图层数据列表</span>
      </div>
      <div class="history-content">
        <ul class="his-list">
          <li
            v-for="(row,rowIdx) in listData"
            :key="rowIdx"
            class="his-list-item"
            @click="highlight(row,rowIdx)">
            <i :class="titleClass(row.optype)">{{ rowIdx +1 }}</i>
            <ul
              class="his-item-detail">
              <li
                v-for="(prop,proIdx) in Object.keys(row)"
                v-show="isMoreView(row,prop,proIdx)"
                :key="proIdx">
                <span
                class="detail-label">{{ prop }}：</span>{{ row[prop] }}</li>
              <li>
                <span
                  class="item-button"
                  @click.stop="moreView(row,rowIdx)">查看详情</span>
                <span
                  class="item-button"
                  @click.stop="showFeatureHistory(row,rowIdx)">历史查看</span>
              </li>
            </ul>
          </li>
        </ul>
        <RadioGroup
          v-model="changeType"
          class="radioGroup"
          type="button"
          size="small"
          @on-change="changeQuery">
          <Radio label="1=1">全部</Radio>
          <Radio label="optype=1">新增</Radio>
          <Radio label="optype=2">编辑</Radio>
          <Radio label="optype=3">删除</Radio>
        </RadioGroup>
        <Page
          :current="pageIndex"
          :total="totalPages"
          :show-total="true"
          style="width:100%"
          size="small"
          @on-change="changePage"
        ></Page>
      </div>
    </div>
    <FeatureHistory
      v-if="featureHistoryVisible"
      :feature="currentFeature"
      :layer-data="layerData"
      @go-back="goBack"></FeatureHistory>
  </div>
</template>

<style lang="less">
.history-query-wrapper {
  position: relative;
  height: 100%;
  .his-list {
    margin: 35px 7px 40px 7px;
  }
  .his-list-item {
    position: relative;
    cursor: pointer;
    border-radius: 2px;
    margin-top: 5px;
    padding: 2px;
    &:hover {
      background: #eeeeee;
    }
    > i {
      position: absolute;
      width: 18px;
      height: 18px;
      top: 10px;
      left: 7px;
      background-color: #2b85e4;
      text-align: center;
      font-style: normal;
      color: #ffffff;
      border-radius: 2px;
    }
    .his-item-detail {
      margin-left: 30px;
      margin-top: 5px;
      color: #333333;
      > li {
        margin: 2px;
      }
    }
    .detail-label {
      font-weight: bold;
      color: #3385ff;
    }
    .item-button {
      display: inline-block;
      border: 1px solid #cccccc;
      padding: 2px 7px;
      border-radius: 2px;
      color: #333333;
      margin: 2px 0;
      &:hover {
        border: 1px solid #318cf0;
        color: #000000;
      }
    }
  }
  .his-page {
    margin: 10px;
  }
  .list-original {
    background: #459aee !important;
  }
  .list-add {
    background: #19be6b !important;
  }
  .list-delete {
    background: #ff9900 !important;
  }
  .list-edit {
    background: #ed3f14 !important;
  }
  .k-page {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 35px;
    line-height: 35px;
    text-align: center;
    background-color: #fff;
    width: 100%;
  }
  .k-page-total {
    margin-right: 0;
  }
}
.history-title {
  position: absolute;
  top: 0;
  left: 0;
  height: 26px;
  line-height: 26px;
  font-size: 14px;
  font-weight: bold;
  color: #666666;
  padding: 0 10px;
  .k-icon {
    font-size: 18px;
    position: relative;
    top: 2px;
    margin-right: 3px;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
}
.history-content {
  position: absolute;
  top: 26px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
.radioGroup {
  position: fixed;
  background-color: #fff;
  top: 55px;
  left: 0;
  width: 100%;
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: center;
}
</style>
