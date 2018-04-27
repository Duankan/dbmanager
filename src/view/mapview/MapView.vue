<script>
import Service from './service/Service';
import AttributeTable from './attribute/Attribute';
import Map from './map/Map';

export default {
  name: 'MapView',
  components: {
    Service,
    AttributeTable,
    Map,
  },
};
</script>

<template>
  <div class="map-view">
    <Service/>
    <div class="map-container">
      <Map/>
      <AttributeTable/>
    </div>
  </div>
</template>

<style lang="less" scoped>
.map-view {
  display: flex;
  height: 100%;

  .map-container {
    display: flex;
    flex-direction: column;
    width: calc(~'100% - 260px');
  }
}
</style>
