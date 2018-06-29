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
      //坐标文件名
      shapeFileName: '',
      //坐标文件
      coordinate: '',
      //上传服务地址
      uploadUrl: `${config.project.basicUrl}/service/gisserver/getwktsbyshpzip?count=1`,
      //提取方式
      extract: '0',
    };
  },
  methods: {
    //上传文件前
    beforeUpload(file) {
      this.shapeFileName = file.name;
      return true;
    },
    //上传坐标文件成功
    uploadSuccess(response) {
      this.coordinate = response.data[0];
    },
    //上传坐标文件失败
    uploadError() {
      this.$Message.error('上传坐标文件失败!');
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
        :format="['zip']"
        :action="uploadUrl"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        name="shapefile"
        class="inline-upload">
        <Button
          type="primary"
        >上传</Button>
      </Upload>
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
