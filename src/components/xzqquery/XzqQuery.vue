<script>
import config from 'config';
export default {
  name: 'XzqQuery',
  data() {
    return {
      xzqName: config.projectConfig.xzqName,
      code: config.projectConfig.xzqCode,
      dictionaryId: config.projectConfig.dictionaryId,
      currentType: config.projectConfig.currentType,
      field: config.projectConfig.field,
      wfsUrl: config.projectConfig.wfsurl,
      isShow: false,
      xzqList: [],
      dmdzList: [],
      xzqKey: '',
      breadcrumbList: [],
    };
  },

  mounted() {
    this.searchXZQ();
    this.breadcrumbListInit();
  },
  methods: {
    //查询该行政区下所有子行政区
    async searchXZQ() {
      const response = await api.db.findDictionary({
        parentId: this.dictionaryId,
        dictionartyLevel: 1,
        order: 'asc',
      });
      this.xzqList = response.data;
    },
    //点击单个行政区选项
    xzqPosition(item) {
      this.xzqName = item.data;
      this.dictionaryId = item.id;
      this.code = item.code;
      if (this.breadcrumbList.length > 0) {
        if (this.breadcrumbList[this.breadcrumbList.length - 1].type == item.type) {
          this.breadcrumbList[this.breadcrumbList.length - 1].name = item.data;
          this.breadcrumbList[this.breadcrumbList.length - 1].id = item.id;
        } else {
          this.breadcrumbList.push({
            name: item.data,
            id: item.id,
            code: item.code,
            type: item.type,
          });
        }
      }
      this.queryXZQ();
      if (item.type != this.currentType) {
        this.searchXZQ();
      }
    },
    breadcrumbListInit() {
      this.breadcrumbList.push({
        name: config.projectConfig.xzqName,
        id: config.projectConfig.dictionaryId,
        code: config.projectConfig.xzqCode,
        type: 'root',
      });
    },
    breadcrumbItemClick(item, index) {
      this.xzqName = item.name;
      this.dictionaryId = item.id;
      this.code = item.code;
      this.breadcrumbList = this.breadcrumbList.slice(0, index + 1);
      this.searchXZQ();
      this.queryXZQ();
    },
    //查询行政区划范围
    async queryXZQ() {
      this.$store.commit('SET_MAP_GEOJSON', { geojson: {}, type: 'always' });
      const response = await api.db.queryAdministrativeCode({
        code: [this.code],
        field: this.field,
        simpleFeatureFlag: true,
        tolerance: '0',
        wfsUrl: this.wfsUrl,
      });
      this.$nextTick(() => {
        this.$store.commit('SET_MAP_GEOJSON', { geojson: response.data, type: 'always' });
      });
    },
    async handleSearch(value) {
      const response = await api.db.xzqAndPoi({
        name: this.xzqKey,
        count: 5,
      });
      this.dmdzList = response.data;
    },
    handleSelect(value) {
      var temp = this.dmdzList.find(p => p.name == value);
      this.xzqName = temp.name;
      this.dictionaryId = temp.id;
      this.code = temp.pac;
      this.queryXZQ();
    },
  },
};
</script>
<template>
  <div>
    <Poptip
      slot="prepend"
      placement="bottom-start"
      width="350" >
      <Button
        type="ghost"
        @click="isShow=!isShow">
        <Icon
          v-if="isShow"
          type="ios-arrow-up"></Icon>
        <Icon
          v-else
          type="ios-arrow-down"></Icon>
        {{ xzqName }}</Button>
      <div
        slot="title"
        style="text-align: left;font-size:12px;">
        <Breadcrumb >
          <BreadcrumbItem
            v-for="(item,index) in breadcrumbList"
            :key="item.name"
            class="breadcrumbItem"
            @click.native="breadcrumbItemClick(item, index)">{{ item.name }}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div slot="content" >
        <a
          v-for="item in xzqList"
          :key="item.data"
          class="xzqItem"
          @click="xzqPosition(item)">{{ item.data }}</a>
      </div>
    </Poptip>
    <AutoComplete
      v-model="xzqKey"
      placeholder="输入行政区划名称、地名地址"
      style="width:300px"
      icon="ios-search"
      clearable
      @on-select="handleSelect"
      @on-search="handleSearch">
      <Option
        v-for="item in dmdzList"
        :value="item.name"
        :key="item.name">{{ item.name }}</Option>
    </AutoComplete>
  </div>
</template>
<style lang="less" scoped>
.breadcrumbItem {
  font-size: 12px;
  cursor: pointer;
}

.xzqItem {
  cursor: pointor;
  float: left;
  margin-left: 8px;
  font-size: 12px;
  display: inline-block;
}
</style>
