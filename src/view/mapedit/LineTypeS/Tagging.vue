
<script>
import * as helps from '@/utils/helps';
export default {
  name: 'Tagging',
  props: {
    msg: { type: Object, default: () => {} },
  },
  data() {
    return {
      showSide: false,

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
      strLabelOpacity: true,
      angleOpacity: true,
      angle: 0, //旋转的角度
      strLabel: null, //标签
      labelField: null, //标签字段
      strColorY: '#127474', //光晕的颜色
      numRadius: null, //光晕的半径
      numOpacity: 100, //透明度
      strColorF: '#627474', //字体颜色,
      maxDisplacement: 1, //最大像素位移:
      autoWrap: 1, //自动换行的像素
      spaceAround: 1, //周围的像素距离:
      rotationField: null, //旋转后面的下拉框绑定数据
      fonts: [], //全部的字体
      font: '', //绑定的字体
    };
  },
  computed: {
    Taggings() {
      const Taggings = [
        {
          fill: { numOpacity: this.numOpacity / 100, strColor: this.strColorF },
          font: { strFamily: this.font, strSize: '12' },
          pointPlacement: { rotationField: this.rotationField },
          halo: { fill: { strColor: this.strColorY }, numRadius: '' + this.numRadius },
          options: {
            maxDisplacement: '' + this.maxDisplacement,
            autoWrap: '' + this.autoWrap,
            spaceAround: '' + this.spaceAround,
          },
          labelField: this.labelField,
          strLabel: this.strLabel,
        },
      ];
      var strTagging = JSON.stringify(Taggings);
      return strTagging;
    },
  },
  watch: {
    labelField: function() {
      if (this.labelField == '-none-' || this.labelField == null) {
        this.strLabelOpacity = true;
        this.labelField = null;
      } else {
        this.strLabelOpacity = false;
        this.strLabel = null;
      }
    },
    rotationField: function() {
      if (this.rotationField == '-none-' || this.rotationField == null) {
        this.angleOpacity = true;
        this.rotationField = null;
      } else {
        this.angleOpacity = false;
        this.angle = null;
      }
    },
  },
  created() {
    this.getfield();
    this.getfont();
  },
  methods: {
    //获得全部字体方法
    async getfont() {
      let font = await api.db.findFont();
      this.fonts = font.data;
    },
    change(status) {
      this.$Message.info('开关状态：' + status);
    },
    async getfield() {
      const response = await api.db.findService({
        resourceId: this.msg.data.resource.resourceId, // 资源id
        serivestatus: 0, // 服务状态(0 开启 1 关闭)
        baseservicetype: 1, // 基础服务
        metadataLayer: this.msg.data.resource.metadataLayer, // 元数据图层
      });

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
  },
};
</script>

<template>
  <div>
    <p class="p">
      <span>显示/不显示 标注</span>
      <Switch
        v-model="showSide"
        @on-change="change"></Switch>
    </p>
    <p class="p">
      <span v-if="strLabelOpacity">标注:</span>
      <Input
        v-if="strLabelOpacity"
        v-model="strLabel"
        :disabled="!showSide"
        style="width: 170px"></Input>
      <span v-if="!strLabelOpacity">标签字段:</span>
      <Select
        v-model="labelField"
        :disabled="!showSide"
        style="width:165px">
        <Option
          v-for="item in fieldNoNumS"
          :value="item.name"
          :key="item.name">{{ item.name }}</Option>
      </Select>
    </p>
    <p class="p">
      <span>透明度:</span>
      <InputNumber
        v-model="numOpacity"
        :disabled="!showSide"
        :max="100"
        :min="0"
        :step="10"
        :formatter="value => `${value}%`"
        :parser="value => value.replace('%', '')"
        style="width: 326px"
      ></InputNumber>
    </p>
    <p class="p">
      <span v-if="angleOpacity">旋转:</span>
      <InputNumber
        v-if="angleOpacity"
        :disabled="!showSide"
        :max="360"
        :min="-360"
        :step="45"
        v-model="angle"
        style="width: 170px"
      ></InputNumber>
      <span v-if="!angleOpacity">旋转字段:</span>
      <Select
        v-model="rotationField"
        :disabled="!showSide"
        style="width:165px">
        <Option
          v-for="item in fieldNumS"
          :value="item.name"
          :key="item.name">{{ item.name }}</Option>
      </Select>
    </p>
    <p class="p">
      <span>字体:</span>
      <ColorPicker
        v-model="strColorF"
        size="large"
        class="colorsStyle" />
      <Select
        v-model="font"
        :disabled="!showSide"
        style="width:300px">
        <Option
          v-for="item in fonts"
          :value="item.fontAlias"
          :key="item.id">{{ item.fontAlias }}</Option>
      </Select>
    </p>
    <p class="p">
      <span>晕轮:</span>
      <ColorPicker

        v-model="strColorY"
        size="large"
        class="colorsStyle" />
      <InputNumber
        v-model="numRadius"
        :disabled="!showSide"
        :max="20"
        :min="0"
        style="width: 300px"
      ></InputNumber>
    </p>

    <p class="p">
      <span>垂直偏移:</span>
      <InputNumber
        :max="2000"
        :min="0"
        style="width: 300px"
      ></InputNumber>
    </p>

    <p class="p">
      <span>初始间隔:</span>
      <InputNumber
        :max="2000"
        :min="0"
        style="width: 300px"
      ></InputNumber>
    </p>

    <div class="Tagging-bottom">

      <p >
        <span>最大像素位移:</span>  <Input
          v-model="maxDisplacement"
          :disabled="!showSide"
          style="width: 285px"
        ></Input>
      </p>
      <p >
        <span>自动换行的像素:</span>  <Input
          v-model="autoWrap"
          :disabled="!showSide"
          style="width: 272px"
        ></Input>
      </p>
      <p >
        <span>周围的像素距离:</span>
        <Input
          v-model="spaceAround"
          :disabled="!showSide"
          style="width: 272px"
        ></Input>
      </p>
    </div>

  </div>
</template>

<style lang="less" scoped>
.p {
  margin: 8px 0 0 0;
}
.Tagging-bottom {
  width: 380px;
  height: 110px;
  margin: 8px 0 0 0;
  border: 1px dashed #000;
}
</style>
