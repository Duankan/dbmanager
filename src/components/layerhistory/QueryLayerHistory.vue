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
    <ul class="his-list">
      <li
        v-for="(row,rowIdx) in listData"
        :key="rowIdx"
        class="his-list-item">
        <i>{{ rowIdx +1 }}</i>
        <ul
          v-for="(prop,proIdx) in Object.keys(row)"
          :key="proIdx"
          class="his-item-detail">
          <li>{{ prop }}：{{ row[prop] }}</li>

        </ul>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.db-query-his {
  .his-list {
    margin: 5px 10px;
  }
  .his-list-item {
    position: relative;
    cursor: pointer;
    border-radius: 2px;
    &:hover {
      background: #eeeeee;
    }
    > i {
      position: absolute;
      width: 18px;
      height: 18px;
      top: 2px;
      left: 2px;
      background-color: red;
      text-align: center;
      font-style: normal;
      color: #ffffff;
      border-radius: 2px;
    }
    .his-item-detail {
      margin-left: 30px;
    }
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
