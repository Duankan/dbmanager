
<script>
export default {
  name: 'Side',
  props: {
    msg: { type: Object, default: () => {} },
  },
  data() {
    return {
      lineCapS: [
        {
          value: 'butt',
          label: 'butt',
        },
        {
          value: 'round',
          label: 'round',
        },
        {
          value: 'square',
          label: 'square',
        },
      ],
      lineConnectS: [
        {
          value: 'bevel',
          label: 'bevel',
        },
        {
          value: 'miter',
          label: 'miter',
        },
        {
          value: 'round',
          label: 'round',
        },
      ],
      fieldNumS: '', //下拉框的数据数字型
      fieldNoNumS: '', //下拉框的数据非数字型
      showSide: false, //绑定的开关
      breadth: 1, //绑定的宽度
      fieldNum: '', //绑定的第一个依据字段
      fieldNoNum: '', //绑定的第一个依据字段
      lucency: 10, //绑定的透明度
      colors: 'black', //绑定的颜色
      imaginary: 0, //绑定的虚线
      imaginaryExcursion: 0, //绑定的虚线偏移
      lineCap: 0, //绑定的线帽
      lineConnect: 0, //绑定的线连接
    };
  },
  created() {
    this.getfield();
  },
  methods: {
    //查询依据字段
    async getfield() {
      const response = await api.db.findService({
        resourceId: this.msg.data.resource.resourceId, // 资源id
        serivestatus: 0, // 服务状态(0 开启 1 关闭)
        baseservicetype: 1, // 基础服务
        metadataLayer: this.msg.data.resource.metadataLayer, // 元数据图层
      });
      console.log(response.data[1].schema);
      this.fieldNumS = response.data[1].schema;
    },
    //开关方法
    change(status) {
      this.$Message.info('开关状态：' + status);
    },
  },
};
</script>

<template>
  <div>
    <p class="p">
      <span>显示/不显示 边</span>
      <Switch
        v-model="showSide"
        @on-change="change"></Switch>
    </p>
    <p class="p">
      <span>宽度:</span>
      <InputNumber
        :max="100"
        :min="1"
        :disabled="!showSide"
        v-model="breadth"
        style="width: 120px"
      ></InputNumber>
      <span>依据字段：<span>
        <Select
          v-model="fieldNum"
          :disabled="!showSide"
          style="width:150px">
          <Option
            v-for="item in fieldNumS"
            :value="item.name"
            :key="item.name">{{ item.name }}</Option>
        </Select>
    </span></span></p>
    <p class="p">
      <span>透明度:</span>
      <InputNumber
        v-model="lucency"
        :disabled="!showSide"
        :max="100"
        :min="0"
        :step="10"
        :formatter="value => `${value}%`"
        :parser="value => value.replace('%', '')"
        style="width: 328px"
      ></InputNumber>
    </p>
    <p class="p">
      <span>颜色修改:</span>
      <ColorPicker
        v-model="colors"
        size="large"
        class="colorsStyle" />
      <span>依据字段：<span>
        <Select
          v-model="fieldNoNum"
          :disabled="!showSide"
          style="width:208px">
        </Select>
    </span></span></p>
    <p class="p">
      <span>虚线:</span>
      <InputNumber
        v-model="imaginary"
        :disabled="!showSide"
        :max="1000"
        :min="-1000"
        style="width: 342px"></InputNumber>
    </p>
    <p class="p">
      <span>虚线偏移:</span>
      <InputNumber
        v-model="imaginaryExcursion"
        :disabled="!showSide"
        :max="1000"
        :min="-1000"
        style="width: 317px"
      ></InputNumber>
    </p>
    <p class="p">
      <span>线帽:</span>
      <Select
        v-model="lineCap"
        :disabled="!showSide"
        style="width:342px">
        <Option
          v-for="item in lineCapS"
          :value="item.value"
          :key="item.value">{{ item.label }}</Option>
      </Select>
    </p>
    <p class="p">
      <span>线连接:</span>
      <Select
        v-model="lineConnect"
        :disabled="!showSide"
        style="width:329px">
        <Option
          v-for="item in lineConnectS"
          :value="item.value"
          :key="item.value">{{ item.label }}</Option>
      </Select>
    </p>

  </div>
</template>

<style lang="less" scoped>
.p {
  margin: 12px 0 0 0;
}
</style>
