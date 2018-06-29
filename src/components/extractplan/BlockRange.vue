<script>
/*
 * 行政区范围提取模块
 */
export default {
  name: 'BlockRange',
  props: {
    //提取模式：0：矢量提取，1：影像提取
    extractMode: {
      type: Number,
      default: 0,
    },
    //绑定数据
    model: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  data() {
    return {
      //城市列表
      cities: [],
      //区县列表
      coutries: [],
      //选择的城市
      selectCities: [],
      //选择的区县
      selectCoutries: [],
      //选择的区域
      selectBlocks: [],
      //提取方式
      extract: '0',
      //影像输出颜色
      outputColor: '#ffffffff',
    };
  },
  async created() {
    //初始化城市区县列表
    const cityRes = await api.db.findDictionary({
      dictionartyLevel: 1,
      order: 'asc',
    });
    this.cities = cityRes.data;
    this.selectCities.push(this.cities[0].id);
    this.getCityCounties(this.cities[0].id);
  },
  methods: {
    //获取城市下的区县
    async getCityCounties(cityId) {
      const countryRes = await api.db.findDictionary({
        parentId: cityId,
        dictionartyLevel: 1,
        order: 'asc',
      });
      this.coutries = countryRes.data;
    },
    //切换城市列表
    async changeCity(cityIds) {
      if (cityIds.length == 1) {
        this.getCityCounties(cityIds[0]);
      } else {
        this.coutries = [];
      }
      this.selectCoutries = [];
      this.getSelectBlocks();
    },
    //获取选择的区域
    getSelectBlocks() {
      let blocks = [];
      if (this.selectCoutries.length > 0) {
        blocks = this.coutries.filter(p => this.selectCoutries.indexOf(p.id) >= 0);
      } else {
        blocks = this.cities.filter(p => this.selectCities.indexOf(p.id) >= 0);
      }
      this.selectBlocks = blocks;
    },
  },
};
</script>
<template>
  <div>
    <div class="form-row">
      <label class="form-label">所选行政区：</label>
      <span>
        <Tag
          v-for="block in selectBlocks"
          :key="block.id">{{ block.data }}</Tag>
      </span>
    </div>
    <div
      class="form-row">
      <label class="form-label">市：</label>
      <Select
        v-model="selectCities"
        multiple
        style="width:180px"
        @on-change="changeCity">
        <Option
          v-for="city in cities"
          :value="city.id"
          :key="city.id">{{ city.data }}</Option>
      </Select>
      <span v-show="selectCities.length<=1">
        <label class="form-label">县：</label>
        <Select
          v-model="selectCoutries"
          multiple
          style="width:200px"
          @on-change="getSelectBlocks">
          <Option
            v-for="country in coutries"
            :value="country.id"
            :key="country.id">{{ country.data }}</Option>
        </Select>
      </span>
    </div>
    <div class="form-row">
      <label class="form-label">提取方式：</label>
      <RadioGroup v-model="extract">
        <Radio label="0">
          <span>相交</span>
        </Radio>
        <Radio label="1">
          <span>裁剪</span>
        </Radio>
        <Radio label="2">
          <span>包含</span>
        </Radio>
      </RadioGroup>
    </div>
    <div
      v-if="extractMode==1"
      class="form-row">
      <label class="form-label">提取参数：</label>
      <label class="form-label">影像输出：</label>
      <Input
        v-model="outputColor"
        style="width:100px"
        placeholder="输入颜色参数"></Input>
    </div>
  </div>
</template>
<style lang="less" scoped>
</style>
