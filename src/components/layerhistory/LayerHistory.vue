<style scoped>
.main {
  margin: 8px;
  width: 100%;
  height: 100%;
}
.time {
  font-size: 14px;
  font-weight: bold;
  width: 100%;
}
.content {
  font-size: 14px;
  width: 230px;
  text-overflow: ellipsis; //让超出的用...实现
  white-space: nowrap; //禁止换行
  overflow: hidden; //超出的隐藏
  display: inline-block;
}
</style>
<template>
  <div class="main">
    <Timeline>
      <TimelineItem 
        v-for="item in layerData" 
        :key="item.id"> 
        <p class="time">{{ formatDate(item.createTime) }}</p>
        <p class="content">{{ '图层名称:'+item.layer.name }}</p>
        <SvgIcon 
          :size="18" 
          color="#1296db"
          icon-class="eye" 
          title="图层预览" 
          @click.native="layerView(item)"/>
        <SvgIcon 
          :size="18"
          color="#1296db"
          style="margin-left:4px;" 
          icon-class="search" 
          title="查询统计"/>
        <SvgIcon
          :size="16"
          style="margin-left:4px;"
          icon-class="contrast"
          color="#1296db"
          title="图层对比"
        />
      </svgicon></svgicon></TimelineItem>
    </Timeline>
  </div>

</template>
<script>
export default {
  name: 'LayerHistory',
  props: {
    layerData: {
      type: Array,
      default: () => [],
    },
    //原始图层名称
    originalLayerName: {
      type: String,
      default: '',
    },
  },
  methods: {
    formatDate(time) {
      var date = new Date(time);
      var year = date.getFullYear(),
        month = date.getMonth() + 1, //月份是从0开始的
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
      var newTime = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
      return newTime;
    },
    //图层预览
    layerView(item) {
      this.$store.getters.ogcLayers.forEach(layer => layer.setVisible(false));
      var layerUrl = this.$store.state.map.serviceList[
        this.originalLayerName
      ][0].servicesurl.replace(this.originalLayerName, item.layer.name);
      const url = new URL(layerUrl);
      const temporaryData = {
        [this.originalLayerName]: {
          url: url.origin + url.pathname,
          bbox:
            item.layer.latLonBox.minx +
            ',' +
            item.layer.latLonBox.miny +
            ',' +
            item.layer.latLonBox.maxx +
            ',' +
            item.layer.latLonBox.maxy,
          crs: item.layer.srs,
          layers: item.layer.name,
          styles: 'EditPointStyle',
        },
      };
      this.$store.commit('SET_MAP_TEMPORARYLAYERS', temporaryData);
    },
  },
};
</script>
