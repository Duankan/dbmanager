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
        return {};
      },
    },
  },
  data() {
    return {
      //提取模型
      range: { ...this.model },
      //是否是编辑模式
      isEdit: false,
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
      extractTypes: [
        { key: '相交', value: 1 },
        { key: '裁剪', value: 0 },
        { key: '包含', value: 2 },
      ],
    };
  },
  async created() {
    this.isEdit = !!this.range.planid;
    //初始化城市区县列表
    const cityRes = await api.db.findDictionary({
      dictionartyLevel: 1,
      order: 'asc',
    });
    this.cities = cityRes.data;
    //新增模式下设置默认值
    if (!this.isEdit) {
      this.range.extract = 1;
      this.selectCities.push(this.cities[0].id);
      this.getCityCounties(this.cities[0].id);
      return;
    }
    //编辑模式下绑定值
    if (this.range.splacetype == 0) {
      let cities = this.range.rangeInfo.childrens[0].childrens;
      let countries = this.getCountries(cities);
      if (countries.length > 0) {
        this.range.extractlevel == 'County';
        this.selectCities = cities.map(p => p.id);
        await this.getCityCounties(this.selectCities[0]);
        setTimeout(p => {
          //下拉控件BUG,nextTick中调用都无效
          this.selectCoutries = countries.map(p => p.id);
        }, 100);
      } else {
        this.range.extractlevel == 'City';
        this.selectCities = cities.map(p => p.id);
      }
    }
  },
  methods: {
    //获取所有选择区县
    getCountries(cities) {
      let coutries = [];
      cities.forEach(p => {
        if (p.childrens) {
          coutries.push(...p.childrens);
        }
      });
      return coutries;
    },
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
    //校验提取范围
    validateRange() {
      if (this.selectBlocks.length == 0) {
        this.$Message.info('请选择提取行政区！');
        return false;
      }
      return true;
    },
    //获取提取范围
    getExtractRange() {
      let codes = this.selectBlocks.map(p => p.code);
      let names = this.selectBlocks.map(p => p.data).join(',');
      let level = this.selectBlocks.some(p => p.type == 'County') ? 'County' : 'City';
      return {
        splacetype: 0,
        splacelist: codes,
        splaceremark: `根据行政区范围提取，提取范围：${names}`,
        extractlevel: level,
        extract: this.range.extract,
        coordinate: null,
        projid: null,
      };
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
      <RadioGroup v-model="range.extract">
        <Radio
          v-for="item in extractTypes"
          :key="item.value"
          :label="item.value">
          <span>{{ item.key }}</span>
        </Radio>
      </RadioGroup>
    </div>
    <div
      v-if="extractMode==1"
      class="form-row">
      <label class="form-label">提取参数：</label>
      <label class="form-label">影像输出：</label>
      <Input
        v-model="range.outputColor"
        style="width:100px"
        placeholder="输入颜色参数"></Input>
    </div>
  </div>
</template>
<style lang="less" scoped>
</style>
