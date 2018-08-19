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
          pageIndex: 1,
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
          console.log(this);
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
  },
};
</script>

<template>
  <div class="db-query-his">
    <h5>查看数据</h5>
    <div class="history-list">
      <Card
        v-for="(item,index) in listData"
        :key="index"
        dis-hover >
        <p
          slot="title"
          :class="titleClass(item.optype)">{{ setListTitle(item) }}</p>
        <p>Content of card</p>
      </Card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.db-query-his {
  > h5 {
    margin-left: 10px;
    height: 20px;
    line-height: 20px;
  }

  .history-list {
    height: calc(~'100vh');
    width: 100%;
  }
  .list-original {
    color: #0000ff;
  }
  .list-add {
    color: #00ff00;
  }
  .list-delete {
    color: #ff0000;
  }
  .list-edit {
    color: #ffff00;
  }
}
</style>
