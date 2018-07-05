<script>
import Service from './service/Service';
import MapEdit from '../mapedit/MapEdit';
import DataListTemp from './datalist/DataListTemp';
import Map from './map/Map';

export default {
  name: 'MapView',
  components: {
    Service,
    DataListTemp,
    Map,
    MapEdit,
  },

  data() {
    return {
      LayerS: [],
      serviceShow: 'true',
      editBack: '',
    };
  },
  events: {
    //接收 点击显示图层的信息，
    lxc: function(Layer) {
      if (!Layer.ok) {
        this.LayerS.push(Layer);
      }
      console.log(this.LayerS);
      Layer.ok = 'true';
    },
  },
  methods: {
    edit() {
      this.serviceShow = !this.serviceShow;
      if (this.editBack == '50%') {
        this.editBack = '';
      } else {
        this.editBack = '50%';
      }
    },
  },
};
</script>

<template>
  <div class="map-view">
    <Service v-show="serviceShow"/>
    <MapEdit
      v-if="!serviceShow"
      :layer-s="LayerS"
    />
    <div
      :style="{ width:editBack }"
      class="map-container"
    >

      <Map/>
      <DataListTemp/>
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
