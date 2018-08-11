<script>
import { CitySelect } from '@ktw/kbus';

export default {
  name: 'MapSearch',
  components: {
    CitySelect,
  },
  data() {
    return {
      search: '',
      citySelect: '武汉',
    };
  },
};
</script>
<template>
  <div class="map-search">
    <CitySelect
      v-model="citySelect"
      class="city-select"
    />
    <Input
      v-model="search"
      placeholder="搜索行政区、地名地址"
      icon="ios-search-strong"/>
  </div>
</template>

<style lang="less" scoped>
.map-search {
  position: absolute;
  top: 28px;
  left: 10%;
  z-index: 801;

  .city-select {
    margin-right: -4px;
    background-color: #fff;
  }
  .k-input-wrapper {
    width: 240px;
    /deep/ .k-input-icon {
      color: #fff;
      font-size: 20px;
      font-weight: bold;
      background: #358cf0;
      cursor: pointer;
    }
  }
}
</style>
