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
    };
  },
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
    queryLayer(pageIndex) {
      this.$store
        .dispatch('MAP_WFS_QUERY', {
          url: `${this.layerData.baseUrl}?typeName=${this.layerData.layer.name}`,
          pageIndex,
          pageSize: 10,
          options: {},
        })
        .then(response => {
          this.listData = [];
          this.features = response.features;
          response.features.forEach(feature => {
            this.listData.push(feature.properties);
          });
          this.totalPages = response.totalFeatures;
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
  },
};
</script>

<template>
  <div class="db-query-his">
    <ul class="his-list">
      <li
        v-for="(row,rowIdx) in listData"
        :key="rowIdx"
        class="his-list-item">
        <i :class="titleClass(row.optype)">{{ rowIdx +1 }}</i>
        <ul
          class="his-item-detail">
          <li
            v-for="(prop,proIdx) in Object.keys(row)"
            :key="proIdx">
          <span class="detail-label">{{ prop }}：</span>{{ row[prop] }}</li>
        </ul>
      </li>
    </ul>
    <Page
      :current="pageIndex"
      :total="totalPages"
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
    background: #f3f3f3;
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
      color: #e96900;
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
    text-align: center;
    background-color: #fff;
  }
}
</style>
