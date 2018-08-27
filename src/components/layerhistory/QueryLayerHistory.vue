<script>
export default {
  name: 'QueryLayerHistory',
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
    };
  },
  computed: {},
  watch: {
    layerData: {
      handler(newVal) {
        if (Object.keys(newVal).length !== 0) {
          this.queryLayer(1);
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
        'list-delete': type === '2',
        'list-edit': type === '3',
      };
    },
    setListTitle(item) {
      const layerPro = Object.values(item);
      return layerPro[layerPro.length - 1];
    },
    changePage(pageIdx) {
      this.queryLayer(pageIdx);
    },
    highLight(item, index) {
      const row = JSON.parse(JSON.stringify(this.features[index]));
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
  },
};
</script>

<template>
  <div class="db-query-his">
    <RadioGroup
      v-model="changeType"
      style="width:100%;text-align: center;"
      type="button"
      @on-change="queryLayer">
      <Radio label="1=1">全部</Radio>
      <Radio label="optype=1">新增</Radio>
      <Radio label="optype=2">编辑</Radio>
      <Radio label="optype=3">删除</Radio>
    </RadioGroup>
    <ul class="his-list">
      <li
        v-for="(row,rowIdx) in listData"
        :key="rowIdx"
        class="his-list-item"
        @click="highLight(row,rowIdx)">
        <i :class="titleClass(row.optype)">{{ rowIdx +1 }}</i>
        <ul
          class="his-item-detail">
          <li
            v-for="(prop,proIdx) in Object.keys(row)"
            v-show="isMoreView(row,prop,proIdx)"
            :key="proIdx">
            <span
            class="detail-label">{{ prop }}：</span>{{ row[prop] }}</li>
          <li><span @click="moreView(row,rowIdx)">查看详情</span></li>
        </ul>
      </li>
    </ul>
    <Page
      :current="pageIndex"
      :total="totalPages"
      style="width:100%"
      size="small"
      show-total
      @on-change="changePage"
    ></Page>
  </div>
</template>

<style lang="less">
.db-query-his {
  .his-list {
    margin: 5px 10px 40px 5px;
  }
  .his-list-item {
    position: relative;
    cursor: pointer;
    border-radius: 2px;
    margin-top: 5px;
    &:hover {
      background: #eeeeee;
    }
    > i {
      position: absolute;
      width: 18px;
      height: 18px;
      top: 5px;
      left: 5px;
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
  }
  .his-page {
    margin: 10px;
  }
  .list-original {
    background: #0000ff !important;
  }
  .list-add {
    background: #00ff00 !important;
  }
  .list-delete {
    background: #ff0000 !important;
  }
  .list-edit {
    background: #ffff00 !important;
  }

  .k-page {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 35px;
    line-height: 35px;
    padding-left: 8px;
    padding-right: 8px;
    text-align: center;
    background-color: #fff;
    width: 100%;
  }
}
</style>
