
<script>
import * as helps from '@/utils/helps';
export default {
  name: 'Fill',
  props: {
    msg: { type: Object, default: () => {} },
  },
  data() {
    return {
      selectType: '颜色', //默认一开始单选框在颜色这里
      showSide: true, //默认显示
      //下拉框填充颜色
      fieldNumS: [
        {
          name: '-none-',
        },
      ],
      //下拉框填充字段
      fieldNoNumS: [
        {
          name: '-none-',
        },
      ],
      //常见标记的select填充字段
      markS: [
        {
          name: 'arrow',
        },
        {
          name: 'star',
        },
        {
          name: 'circle',
        },
        {
          name: 'triangle',
        },
        {
          name: 'hatch',
        },
        {
          name: 'square',
        },
        {
          name: 'X',
        },
      ],
      fieldOpacity: true,
      colorOpacity: true,
      strColor: '#F67474', //填充颜色
      colorField: '-none-', //填充字段
      numOpacity: 100, //透明度
      opacityField: '-none-', //透明度字段
      mark: '', //常见标记
      numSize: 0, //尺寸
      numWidth: 0, //宽度
      markStrColor: '#827474', //标记的颜色和字体的颜色
      font: [], //绑定的字体
    };
  },
  computed: {
    Fills() {
      return this.getFill();
    },
  },
  watch: {
    opacityField: function() {
      if (this.opacityField == '-none-' || this.opacityField == null) {
        this.fieldOpacity = true;
        this.opacityField = null;
      } else {
        this.fieldOpacity = false;
        this.numOpacity = null;
      }
    },
    colorField: function() {
      if (this.colorField == '-none-' || this.colorField == null) {
        this.colorField = null;
        this.colorOpacity = true;
      } else {
        this.colorOpacity = false;
        this.strColor = null;
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
      this.font = font.data;
    },
    //填充的数据
    getFill() {
      let colorFieldCopy = this.colorField;
      let opacityField = this.opacityField;
      let numOpacity = this.numOpacity / 100;
      if (this.colorField == '-none-' || this.colorField == null) {
        colorFieldCopy = '';
      } else {
        this.strColor = '';
      }
      if (this.opacityField == '-none-' || this.opacityField == null) {
        opacityField = '';
      } else {
        numOpacity = '';
      }

      let Fill;
      if (this.selectType == '颜色') {
        Fill = {
          strColor: this.strColor,
          colorField: colorFieldCopy,
          numOpacity: numOpacity,
          opacityField: opacityField,
          graphicFill: null,
        };
      }
      if (this.selectType == '常见标记') {
        Fill = {
          graphicFill: {
            mark: [
              {
                stroke: { strColor: this.markStrColor, numWidth: '' + this.numWidth },
                strWellKnownName: this.mark,
              },
            ],
            numSize: '' + this.numSize,
          },
          numOpacity: numOpacity,
          opacityField: opacityField,
        };
      }

      ///---------------------------这个位子继续
      var strFill = JSON.stringify(Fill);

      return strFill;
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
    change(status) {
      this.$Message.info('开关状态：' + status);
    },
  },
};
</script>

<template>
  <div>
    <p class="p">
      <span>显示/不显示 填充</span>
      <Switch
        v-model="showSide"
        @on-change="change"></Switch>
    </p>
    <p class="p">
      <span v-if="fieldOpacity">透明度:</span>
      <InputNumber
        v-if="fieldOpacity"
        :disabled="!showSide"
        v-model="numOpacity"
        :max="100"
        :min="0"
        :step="10"
        :formatter="value => `${value}%`"
        :parser="value => value.replace('%', '')"
        style="width: 100px"
      ></InputNumber>
      <span>依据字段</span>
      <Select
        :disabled="!showSide"
        v-model="opacityField"
        placeholder="-none-"
        style="width:163px">
        <Option
          v-for="item in fieldNumS"
          :value="item.name"
          :key="item.name">{{ item.name }}</Option>
      </Select>
    </p>

    <p class="p">
      <RadioGroup
        v-model="selectType"
        :disabled="!showSide">
        <Radio label="颜色"></Radio>
        <Radio label="常见标记"></Radio>
        <Radio label="字体"></Radio>
      </RadioGroup>
    </p>

    <p
      v-show="selectType=='颜色'"
      class="p">
      <span v-if="colorOpacity">颜色修改:</span>
      <ColorPicker
        v-if="colorOpacity"
        v-model="strColor"
        size="large"
        class="colorsStyle" />
      <span>依据字段：<span>
        <Select
          v-model="colorField"
          :disabled="!showSide"
          placeholder="-none-"
          style="width:205px">
          <Option
            v-for="item in fieldNoNumS"
            :value="item.name"
            :key="item.name">{{ item.name }}</Option>
        </Select>
    </span></span></p>

    <p
      v-show="selectType=='常见标记'"
      class="p">
      <span>常见标记:</span>
      <Select
        v-model="mark"
        :disabled="!showSide"
        style="width:312px">
        <Option
          v-for="item in markS"
          :value="item.name"
          :key="item.name">{{ item.name }}</Option>
      </Select>

    </p>
    <p
      v-show="selectType=='常见标记'"
      class="p">
      <InputNumber
        v-model="numWidth"
        :disabled="!showSide"
        :max="100"
        :min="0"
        style="width: 165px"
      ></InputNumber>
      <InputNumber
        v-model="numSize"
        :disabled="!showSide"
        :max="100"
        :min="0"
        style="width: 165px"
      ></InputNumber>
      <ColorPicker
        :disabled="!showSide"
        v-model="markStrColor"
        size="large"
        class="colorsStyle" />
    </p>

    <p
      v-show="selectType=='字体'"
      class="p">
      <span>字体:</span>
      <Select
        :disabled="!showSide"
        style="width:338px">
        <Option
          v-for="item in font"
          :value="item.fontAlias"
          :key="item.id">{{ item.fontAlias }}</Option>
      </Select>
    </p>
    <p
      v-show="selectType=='字体'"
      class="p">
      <InputNumber
        v-model="numWidth"
        :disabled="!showSide"
        :max="100"
        :min="0"
        style="width: 165px"
      ></InputNumber>
      <InputNumber
        :disabled="!showSide"
        v-model="numSize"
        :max="100"
        :min="0"
        style="width: 165px"
      ></InputNumber>
      <ColorPicker
        :disabled="!showSide"
        v-model="markStrColor"
        size="large"
        class="colorsStyle" />
    </p>


  </div>
</template>

<style lang="less" scoped>
.p {
  margin: 12px 0 0 0;
}
</style>
