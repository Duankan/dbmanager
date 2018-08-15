//边
<script>
import * as helps from '@/utils/helps';
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
      //下拉框的数据数字型
      fieldNumS: [
        {
          name: '-none-',
        },
      ],
      //下拉框的数据非数字型
      fieldNoNumS: [
        {
          name: '-none-',
        },
      ],
      fieldOpacity: true,
      colorOpacity: true,
      showSide: false, //绑定的开关
      breadth: 1, //绑定的宽度
      fieldNum: null, //绑定宽度字段
      fieldColour: null, //绑定的颜色字段
      lucency: 100, //绑定的透明度
      colors: 'black', //绑定的颜色
      imaginary: 1, //绑定的虚线
      imaginaryExcursion: 0.0, //绑定的虚线偏移
      lineCap: null, //绑定的线帽
      lineConnect: null, //绑定的线连接
    };
  },
  computed: {
    dashs() {
      var dash = [];
      dash.push(this.imaginary);
      return dash;
    },
    Stroke() {
      const Stroke = {
        strColor: this.colors,
        colorField: this.fieldColour, //依据字段
        dashs: this.dashs,
        numDashOffset: this.imaginaryExcursion, //虚线便宜
        strLineCap: this.lineCap, //线毛
        strLineJoin: this.lineConnect, //线连接
        numOpacity: this.lucency / 透明100,
        numWidth: this.breadth, //宽度
        widthField: this.fieldNum, //依据字段
        graphicStroke: null, //   这个位子加线符号的？？？？？？
      };
      var strStroke = JSON.stringify(Stroke);
      return Stroke;
    },
  },
  watch: {
    fieldNum: function() {
      if (this.fieldNum == '-none-' || this.fieldNum == null) {
        this.fieldOpacity = true;
        this.fieldNum = null;
      } else {
        this.fieldOpacity = false;
        this.breadth = null;
      }
    },
    fieldColour: function() {
      if (this.fieldColour == '-none-' || this.fieldColour == null) {
        this.colorOpacity = true;
        this.fieldColour = null;
      } else {
        this.colorOpacity = false;
        this.strColor = null;
      }
    },
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
      // console.log(response.data[1].schema);
      // console.log(helps.schemaReservedFileds);
      for (let i = 0; i < response.data[1].schema.length; i++) {
        let all = helps.schemaReservedFileds.indexOf(response.data[1].schema[i].name);
        if (all == -1 && response.data[1].schema[i].type != 'String') {
          this.fieldNumS.push(response.data[1].schema[i]);
        }
        if (all == -1 && response.data[1].schema[i].type == 'String') {
          this.fieldNoNumS.push(response.data[1].schema[i]);
        }
      }
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
    <p
      class="p">
      <span v-if="fieldOpacity">宽度:</span>
      <InputNumber
        v-if="fieldOpacity"
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
      <span v-if="colorOpacity">颜色修改:</span>
      <ColorPicker
        v-if="colorOpacity"
        v-model="colors"
        size="large"
        class="colorsStyle" />
      <span>依据字段：<span>
        <Select
          v-model="fieldColour"
          :disabled="!showSide"
          style="width:208px">
          <Option
            v-for="item in fieldNoNumS"
            :value="item.name"
            :key="item.name">{{ item.name }}</Option>
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
