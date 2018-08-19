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
  font-weight: bold;
  width: 130px;
  text-overflow: ellipsis; //让超出的用...实现
  white-space: nowrap; //禁止换行
  overflow: hidden; //超出的隐藏
  display: inline-block;
}
.layername {
  color: #007acc;
  font-size: 14px;
  font-weight: bold;
  width: 130px;
  text-overflow: ellipsis; //让超出的用...实现
  white-space: nowrap; //禁止换行
  overflow: hidden; //超出的隐藏
  display: inline-block;
  vertical-align: middle;
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
      </TimelineItem>
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
  },
};
</script>
