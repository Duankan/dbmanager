<script>
import config from 'config';
export default {
  name: 'AreaSelect',
  props: {
    wfsUrl: {
      type: String,
      default: '',
    },
    isChangeLatLng: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cascader: [],
      areaData: [],
      selectCode: [],
    };
  },
  mounted() {
    this.startQuery();
  },
  methods: {
    // 初始查询
    async startQuery() {
      const response = await api.db.findDictionary({
        parentId: config.projectConfig.dictionaryId,
        dictionartyLevel: 2,
        order: 'asc',
        containParent: false,
      });
      // 处理城市数据
      response.data.forEach(city => {
        if (city.type === 'City') {
          this.areaData.push({
            value: city.code,
            label: city.data,
            children: [],
          });
        }
      });
      // 处理区域数据
      response.data.forEach(city => {
        if (city.type === 'County') {
          this.areaData.forEach(area => {
            if (
              area.label === `${city.data1.split('·')[0]}市` ||
              area.label === city.data1.split('·')[0]
            ) {
              area.children.push({
                value: city.code,
                label: city.data,
              });
            }
          });
        }
      });
    },
    finishSelect(value) {
      this.selectCode = value;
      if (value.length === 0) {
        this.$emit('on-get-arealayer', '');
      }
    },
    async closeSelect(isClose) {
      this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'always' });
      if (!isClose) {
        if (this.selectCode.length !== 0) {
          const response = await api.db.queryAdministrativeCode({
            code: [this.selectCode[this.selectCode.length - 1]],
            field: 'DMDZDM',
            simpleFeatureFlag: true,
            tolerance: '0',
            wfsUrl: this.wfsUrl,
          });
          this.$nextTick(() => {
            this.$store.commit('SET_MAP_GEOJSON', { geojson: response.data, type: 'always' });
          });
          const wktStr = response.data.features[0];
          const devWktStr = this.changeWkt(response.data.features[0], true);
          this.$emit('on-get-arealayer', wktStr, devWktStr);
        }
      }
    },
    // 服务返回数据为geojson，这里直接用了geojson返回值，下面这段代码是做wkt转化的，
    changeWkt(data, isChange) {
      const wktFormat = new L.Format.WKT();
      const reswkt = wktFormat.readToWKT(data, isChange);
      return reswkt;
    },
    resetCascader() {
      this.cascader = [];
    },
  },
};
</script>

<template>
  <Cascader
    v-model="cascader"
    :data="areaData"
    :disabled="wfsUrl===''"
    placeholder="选择区域前，请先选择一个图层"
    change-on-select
    filterable
    transfer
    @on-change="finishSelect"
    @on-visible-change="closeSelect"
  >
  </Cascader>
</template>

<style lang="less" scoped>
</style>
