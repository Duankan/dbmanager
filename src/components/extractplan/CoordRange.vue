<script>
import config from 'config';

/*
 * 坐标范围提取模块
 */
export default {
  name: 'CoordRange',
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
      //提取模型
      range: { ...this.model },
      //是否是编辑模式
      isEdit: false,
      //坐标文件名
      shapeFileName: '',
      //上传服务地址
      uploadUrl: `${config.project.basicUrl}/service/gisserver/getwktsbyshpzip?count=1`,
      //提取方式
      extractTypes: [
        { key: '相交', value: 1 },
        { key: '裁剪', value: 0 },
        { key: '包含', value: 2 },
      ],
      //加载状态
      loading: false,
    };
  },
  created() {
    this.isEdit = !!this.range.planid;
    //新增模式下设置默认值
    if (!this.isEdit) {
      this.range.extract = 1;
      return;
    }
    if (this.range.splacetype == 2) {
      this.shapeFileName = '存在坐标文件';
    }
  },
  methods: {
    //上传文件前
    beforeUpload(file) {
      this.loading = true;
      this.shapeFileName = file.name;
      return true;
    },
    //上传坐标文件成功
    uploadSuccess(response) {
      if (!response.data) {
        this.$Message.error(response.message);
        this.shapeFileName = '';
      } else {
        this.range.coordinate = response.data[0];
      }
      this.loading = false;
    },
    //上传坐标文件失败
    uploadError() {
      this.$Message.error('上传坐标文件失败!');
      this.loading = false;
      this.shapeFileName = '';
    },
    //数据格式错误
    formatError() {
      this.$Message.error('数据格式错误!');
      this.shapeFileName = '';
    },
    //校验提取范围
    validateRange() {
      if (!this.range.coordinate && !this.isEdit) {
        this.$Message.info('请选择坐标文件！');
        return false;
      }
      return true;
    },
    //获取提取范围
    getExtractRange() {
      return {
        splacetype: 2,
        splacelist: [],
        splaceremark: `根据坐标文件${this.shapeFileName}范围提取`,
        extractlevel: 0,
        extract: this.range.extract,
        coordinate: this.range.coordinate,
      };
    },
  },
};
</script>

<template>
  <div>
    <div class="form-row">
      <label class="form-label">导入坐标文件：</label>
      <Input
        v-model="shapeFileName"
        readonly
        style="width:240px"
        placeholder="导入Shape坐标文件"></Input>
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
    <Spin
      v-if="loading"
      fix>
      <Icon
        type="load-c"
        size="18"
        class="circle-spin-icon-load"></Icon>
    <div>正在解析坐标文件...</div></Spin>
  </div>
</template>

<style lang="less" scoped>
</style>
