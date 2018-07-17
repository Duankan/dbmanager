
<script>
import Currency from './PolygonTypeS/Currency';
import Side from './PolygonTypeS/Side';
import Fill from './PolygonTypeS/Fill';
import Tagging from './PolygonTypeS/Tagging';
import LineSymbol from './PolygonTypeS/LineSymbol';
export default {
  name: 'PolygonType',
  components: {
    Currency,
    Side,
    Fill,
    Tagging,
    LineSymbol,
  },
  props: {
    msg: { type: Object, default: () => {} },
  },
  data() {
    return {
      tool: '通用',
      dataGroup: [
        {
          title: 'group',
          expand: true,
          children: [
            {
              title: 'parent 1-1',
              expand: true,
            },
          ],
        },
      ],
      stylename: '', //绑定的样式名称
      type: '',
    };
  },
  created() {
    this.judgeType();
    this.getStyleName();
  },
  methods: {
    //判断给的参数类型
    judgeType() {
      console.log(this.msg.data.resource.type);
      if (this.msg.data.resource.type == '面类型') {
        this.type = 3;
      }
      if (this.msg.data.resource.type == '点类型') {
        this.type = 1;
      }
      if (this.msg.data.resource.type == '线类型') {
        this.type = 2;
      }
    },
    //获取样式名称
    async getStyleName() {
      const params = {
        stylename: this.msg.data.styles, //
      };
      let slddata = await api.db.getsldbyname(params);
      this.stylename = slddata.data.nameLayers['0'].style['0'].name;
    },
    //另存方法
    async saveAs() {
      console.log(this.stylename);
      console.log(this.$refs.Currency.rulename);
      console.log(this.$refs.Currency.xSkewing);
      console.log(this.$refs.Currency.ySkewing);
      console.log(this.$refs.Currency.maxRatio);
      console.log(this.$refs.Currency.minRatio);
      const params = this.getParams();
      let SaveAs = await api.db.addbysld(params);
      console.log(SaveAs);
    },

    //另存的构造参数
    getParams() {
      console.log(this.msg.data);
      const params = {
        sld:
          '{"nameLayers":[{"name":' +
          this.msg.data.resource.name +
          ',"style":[{"name":' +
          this.msg.data.resource.name +
          ',"featureTypeStyle":[{"rule":[{"polygonSymbolizers":[{"stroke":null,"fill":{"graphicFill":null,"numOpacity":1,"strColor":"#fcb3c6"},"offset":{"offsetX":' +
          this.$refs.Currency.xSkewing +
          ',"offsetY":' +
          this.$refs.Currency.ySkewing +
          '}}],"textSymbolizers":null,"name":' +
          this.$refs.Currency.rulename +
          ',"cqlFilter":"","minScaleDenominator":' +
          this.$refs.Currency.minRatio +
          ',"maxScaleDenominator":' +
          this.$refs.Currency.maxRatio +
          '}],"semanticTypeIdentifier":["generic:geometry"]}]}]}],"userLayers":null}',
        resourceInfo: {
          alias: this.msg.data.resource.alias,
          name: this.msg.data.resource.name,
          typeId: this.msg.data.resource.typeId,
          TypeName: this.msg.data.resource.typeName,
          catalogId: this.msg.data.resource.catalogId,
          userId: this.msg.data.resource.userId,
          userName: this.msg.data.resource.userName,
          orgId: this.msg.data.resource.orgId,
          orgName: this.msg.data.resource.orgName,
        },
        styleType: this.type,
      };
      return params;
    },
    //添加组的方法
    addGroup() {
      let text = {
        title: '新规则',
        expand: true,
      };
      this.dataGroup['0'].children.push(text);
    },
  },
};
</script>

<template>
  <div class="outDiv">
    <div class="left">
      <RadioGroup
        v-model="tool"
        class="p">
        <Radio label="通用"></Radio>
        <Radio label="边"></Radio>
        <Radio label="面填充"></Radio>
        <Radio label="标注"></Radio>
        <Radio label="线符号"></Radio>
        <Radio label="过滤"></Radio>
      </radiogroup>
      <p class="p">
        <span>
          样式名称：
        </span>
        <Input
          v-model="stylename"
          style="width: 300px"></Input>
      </p>
      <Currency
        v-if="tool=='通用'"
        ref="Currency"
        :msg="msg"></Currency>
      <Side
        v-if="tool=='边'"
        ref="Side"
        :msg="msg"
      ></Side>
      <Fill v-if="tool=='面填充'"></Fill>
      <Tagging v-if="tool=='标注'"></Tagging>
      <LineSymbol v-if="tool=='线符号'"></LineSymbol>
    </div>

    <div
      class="right">
      <div class="right-top">
        <Tree
          :data="dataGroup"
        ></Tree>
      </div>
      <div class="right-bottom ">
        <span>添加规则</span>
        <Button
          type="ghost"
          icon="ios-plus-outline"
          @click="addGroup"></Button>
        <span> 删除规则</span>
        <Button
          type="ghost"
          icon="soup-can-outline"></Button>
    </ButtonGroup>
      </div>
    </div>

    <div class="bottom">
      <Button
        style="float: right;margin:2px;"
        type="primary"
        icon="ios-search"
        @click="saveAs">另存</Button>
      <Button
        style="float: right;margin:2px;"
        type="primary"
        icon="ios-search">保存</Button>
      <Button
        style="float: right;margin:2px;"
        type="primary"
        icon="ios-search">取消</Button>


    </div>
  </div>

</template>

<style lang="less" scoped>
.left {
  width: 67%;
  float: left;
  height: 450px;
}
.right {
  width: 33%;
  height: 80%;

  float: right;
  height: 450px;
}
.right-top {
  height: 90%;
  border: 1px solid rgb(245, 218, 169);
  margin: 0 0 1% 0;
}
.right-bottom {
  height: 9%;
  border: 1px solid rgb(245, 218, 169);
}
.bottom {
  width: 100%;

  float: left;
}
.p {
  margin: 16px 0 0 0;
}
</style>
