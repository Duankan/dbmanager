<script>
import config from 'config';
import axios from 'axios';

/*
 * 分幅提取模块
 */
export default {
  name: 'SheetRange',
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
      //比例尺
      scales: [],
      //城市列表
      cities: [],
      //区县列表
      coutries: [],
      //选择比例尺
      selectScale: null,
      //选择的城市
      selectCities: [],
      //选择的区县
      selectCoutries: [],
      //图幅号自动完成数据源
      autoSheets: [],
      //自动完成选择图幅号
      selectAutoSheet: '',
      //已选择图幅号
      selectSheetNos: [],
      //提取方式
      extractTypes: ['单个文件', '多个文件'],
      //选择的提取方式
      coordsType: 0,
      //上传服务地址
      uploadUrl: `${config.project.basicUrl}/service/gisserver/getwktsbyshpzip?count=1`,
      //图幅shape文件名
      shapeFileName: '',
      //是否正在加载
      loading: false,
      //是否正在查找图幅
      sheetLoading: false,
    };
  },
  async created() {
    this.isEdit = !!this.range.planid;
    //初始化比例尺
    const scaleRes = await api.db.findSpecialLayer({ type: 2 });
    this.scales = scaleRes.data;
    //初始化城市区县列表
    const cityRes = await api.db.findDictionary({
      dictionartyLevel: 1,
      order: 'asc',
    });
    this.cities = cityRes.data;
    this.selectCities.push(this.cities[0].id);
    this.getCityCounties(this.cities[0].id);
    if (this.isEdit && this.range.splacetype == 1) {
      this.selectScale = this.range.extractlevel;
      this.selectSheetNos = this.range.rangeInfo.mapnames;
      this.coordsType = this.range.rangeInfo.coordstype;
    } else {
      this.selectScale = this.scales.length > 0 ? this.scales[0].code : null;
    }
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
    //查询图幅号(模糊匹配)
    async autoSearchSheet(keyword) {
      if (!keyword) return;
      this.sheetLoading = true;
      api.db
        .findMapUnit({
          unit: keyword,
          scale: this.selectScale,
        })
        .then(p => {
          this.autoSheets = p.data.map(p => p.tfName);
          this.sheetLoading = false;
        })
        .catch(p => {
          this.sheetLoading = false;
        });
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
      return blocks;
    },
    //查询行政区图幅号，并添加到图幅号列表
    async addBlockSheet() {
      let blocks = this.getSelectBlocks();
      if (blocks.length == 0) {
        this.$Message.info('请选择行政区！');
        return;
      }
      //查找行政区范围
      this.loading = true;
      const blockRes = await api.db.findXZQ({
        layerCode: blocks[0].type,
        pacCodes: blocks.map(p => p.code),
      });
      let blockSheets = blockRes.data;
      if (blockSheets.length == 0) {
        this.$Message.info('没有查询到行政区范围！');
        this.loading = false;
        return;
      }
      //查询图幅
      let strWkt = blockSheets
        .map(function(val) {
          return 'INTERSECTS(the_geom, ' + val.wkt + ')';
        })
        .join(' OR ');
      await this.getWTKSheets(strWkt);
      this.loading = false;
    },
    //获取指定范围(WKT)内的图幅号
    async getWTKSheets(strWkt) {
      const wktRes = await axios.post(
        `/service/gisserver/query/tf/${this.selectScale}?count=-1`,
        strWkt,
        {
          headers: { 'Content-Type': 'text/plain' },
        }
      );
      let wktSheet = wktRes.data.data;
      if (wktSheet.length == 0) {
        this.$Message.info('没有查询到图幅数据！');
        return;
      }
      if (wktSheet.length > 100) {
        this.$Message.info('图幅号信息不能超过100条上限！');
        return;
      }
      wktSheet.forEach(p => this.addToSheets(p.tfName, false));
    },
    //添加自动完成选择图幅
    addAutoSheet() {
      this.addToSheets(this.selectAutoSheet);
      this.selectAutoSheet = '';
    },
    //上传文件前
    beforeUpload(file) {
      this.shapeFileName = file.name;
      return true;
    },
    //上传图幅文件成功
    async uploadSuccess(response) {
      if (!response.data) {
        this.$Message.error('文件格式错误!');
        return;
      }
      let strWkt = response.data
        .map(function(val) {
          return 'INTERSECTS(the_geom, ' + val + ')';
        })
        .join(' OR ');
      this.loading = true;
      await this.getWTKSheets(strWkt);
      this.loading = false;
    },
    //上传图幅文件失败
    uploadError() {
      this.$Message.error('上传文件失败!');
    },
    //上传文件格式不正确
    formatError() {
      this.$Message.error('上传文件格式不正确!');
    },
    //去重，增加到图幅选择列表
    addToSheets(sheetNo, repeatWarn = true) {
      if (!sheetNo) {
        this.$Message.info('请选择要添加的图幅号！');
        return;
      }
      if (this.selectSheetNos.indexOf(sheetNo) >= 0) {
        repeatWarn && this.$Message.info('图幅号已添加，不能重复添加！');
        return;
      }
      this.selectSheetNos.push(sheetNo);
    },
    //从图幅列表中删除项
    deleteFromSheets(sheetNo) {
      let sheetIdx = this.selectSheetNos.indexOf(sheetNo);
      this.selectSheetNos.splice(sheetIdx, 1);
    },
    //校验提取范围
    validateRange() {
      if (this.selectSheetNos.length == 0) {
        this.$Message.error('请选择提取图幅！');
        return false;
      }
      return true;
    },
    //获取提取范围
    getExtractRange() {
      let names = this.selectSheetNos.join(',');
      this.range.schemalist.forEach(p => {
        p.coordsType = this.coordsType;
      });
      return {
        splacetype: 1,
        splacelist: this.selectSheetNos,
        splaceremark: `根据图幅范围提取，提取图幅号：${names}`,
        extractlevel: this.selectScale,
        extract: this.range.extract,
        coordinate: null,
        projid: null,
        schemalist: this.range.schemalist,
      };
    },
  },
};
</script>
<template>
  <div class="sheet-range-wrapper clearfix">
    <div class="sheet-part">
      <div class="form-row">
        <label class="form-label">选择比例尺：</label>
        <Select
          v-model="selectScale"
          style="width:250px">
          <Option
            v-for="scale in scales"
            :value="scale.code"
            :key="scale.id">{{ scale.code }}</Option>
        </Select>
      </div>
      <div class="form-row">
        <label class="form-label">输入图幅号：</label>
        <Select
          v-model="selectAutoSheet"
          :remote-method="autoSearchSheet"
          :loading="sheetLoading"
          filterable
          remote
          style="width:250px">
          <Option
            v-for="sheet in autoSheets"
            :value="sheet"
            :key="sheet">{{ sheet }}</Option>
        </Select>
        <Button
          type="primary"
          @click="addAutoSheet">添加</Button>
      </div>
      <div class="form-row">
        <label class="form-label">选择行政区：</label>
        <Select
          v-model="selectCities"
          multiple
          style="width:110px"
          @on-change="changeCity">
          <Option
            v-for="city in cities"
            :value="city.id"
            :key="city.id">{{ city.data }}</Option>
        </Select>
        <span v-show="selectCities.length<=1">
          <label>县：</label>
          <Select
            v-model="selectCoutries"
            multiple
            style="width:110px"
            @on-change="getSelectBlocks">
            <Option
              v-for="country in coutries"
              :value="country.id"
              :key="country.id">{{ country.data }}</Option>
          </Select>
        </span>
        <span
          v-show="selectCities.length>1"
          class="remain-block"></span>
        <Button
          type="primary"
          @click="addBlockSheet">添加</Button>
      </div>
      <div class="form-row">
        <label class="form-label">导入提取图幅：</label>
        <Input
          v-model="shapeFileName"
          readonly
          style="width:240px"
          placeholder="导入Shape文件提取图幅"></Input>
        <Upload
          :show-upload-list="false"
          :action="uploadUrl"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :on-format-error="formatError"
          accept="application/zip"
          name="shapefile"
          class="inline-upload">
          <Button
            type="primary"
          >上传</Button>
        </Upload>
      </div>
      <div class="form-row">
        <label class="form-label">提取方式：</label>
        <RadioGroup v-model="coordsType">
          <Radio
            v-for="(item,index) in extractTypes"
            :key="index"
            :label="index">
            <span>{{ item }}</span>
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
    <div class="sheet-part sheet-result">
      <ul>
        <li
          v-for="(sheetNo,index) in selectSheetNos"
          :key="index"
          class="sheet-item">
          <span class="item-index">{{ index+1 }}</span>
          <span class="item-text">{{ sheetNo }}</span>
          <Icon
            class="item-close"
            type="close"
            title="删除"
            @click.native="deleteFromSheets(sheetNo)" />
        </li>
      </ul>
    </div>
    <Spin
      v-if="loading"
      fix>
      <Icon
        type="load-c"
        size="18"
        class="circle-spin-icon-load"></Icon>
    <div>正在查询图幅...</div></Spin>
  </div>
</template>
<style lang="less" scoped>
.sheet-range-wrapper {
  .sheet-part {
    float: left;
  }
  .sheet-result {
    margin: 7px 0 0 45px;
    height: 230px;
    overflow-y: auto;
    > ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .sheet-item {
      width: 250px;
      height: 26px;
      line-height: 26px;
      margin-bottom: 4px;
      background-color: #dddddd;
      padding: 0 4px;
      border-radius: 2px;
      position: relative;
      .item-index {
        padding: 2px 6px;
        color: #ffffff;
        background-color: #999999;
        font-size: 12px;
        border-radius: 2px;
      }
      .item-text {
        margin-left: 5px;
      }
      .item-close {
        position: absolute;
        right: 10px;
        top: 8px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
  .remain-block {
    margin-right: 140px;
  }
}
</style>
