<script>
import config from 'config';
export default {
  name: 'AreaSelect',
  props: {
    isChangeLatLng: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      wfsUrl: config.projectConfig.wfsurl,
      dictionaryId: config.projectConfig.dictionaryId,
      currentType: config.projectConfig.currentType,
      field: config.projectConfig.field,
      cascader: [],
      areaData: [
        {
          value: config.projectConfig.dictionaryId,
          label: config.projectConfig.xzqName,
          code: config.projectConfig.xzqCode,
          children: [],
          loading: false,
        },
      ],
      selectCode: [],
    };
  },
  methods: {
    // 根据parentid查数据
    findDictionary(parentId) {
      const response = api.db.findDictionary({
        parentId,
        dictionartyLevel: 1,
        order: 'asc',
      });
      return response;
    },
    // 初始查询
    setSelectData() {
      this.areaData.forEach(async areaData => {
        const response = await this.findDictionary(areaData.value);
        // 处理城市数据
        response.data.forEach(city => {
          if (city.type === this.currentType) {
            this.areaData.forEach(area => {
              if (
                area.label === `${city.data1.split('·')[0]}市` ||
                area.label === city.data1.split('·')[0]
              ) {
                area.children.push({
                  value: city.code,
                  label: city.data,
                  children: [],
                });
              }
            });
          }
        });
      });
    },
    async loadData(item, callback) {
      debugger;
      item.loading = true;
      const response = await this.findDictionary(item.value);
      response.data.forEach(city => {
        if (
          item.label === `${city.data1.split('·')[0]}市` ||
          item.label === city.data1.split('·')[0]
        ) {
          item.children.push({
            value: city.id,
            label: city.data,
            code: city.code,
            children: [],
            loading: false,
          });
        }
      });
      item.loading = false;
      callback();
    },
    // 保存选择项
    finishSelect(value) {
      this.selectCode = value;
      if (value.length === 0) {
        this.$emit('on-get-arealayer', '');
      }
    },
    // 完成选择
    async closeSelect(isClose) {
      this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'always' });
      if (!isClose) {
        if (this.selectCode.length !== 0 && +this.selectCode[0] === config.projectConfig.xzqCode) {
          const response = await api.db.queryAdministrativeCode({
            code: [this.selectCode[this.selectCode.length - 1]],
            field: this.field,
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
        } else {
          this.$Message.warning(
            `目前只有行政区为“${config.projectConfig.xzqName}”内的数据可被选择！`
          );
        }
      }
    },
    // 服务返回数据为geojson，这里直接用了geojson返回值，下面这段代码是做wkt转化的，
    changeWkt(data, isChange) {
      const wktFormat = new L.Format.WKT();
      const reswkt = wktFormat.readToWKT(data, isChange);
      return reswkt;
    },
    // 重置
    resetCascader() {
      this.closeSelect(true);
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
    :load-data="loadData"
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
