

//线样式
<script>
import Currency from './commontypes/Currency';
import Side from './commontypes/Side';
import Tagging from './linetypes/Tagging';
import LineSymbol from './commontypes/LineSymbol';
import AttributeFilter from '@/./components/extractplan/AttributeFilter';
import { url } from '@ktw/ktools';
import * as helps from '@/utils/helps';
const SET_MAP_SERVICELIST = 'SET_MAP_SERVICELIST';
export default {
  name: 'LineType',
  components: {
    Currency,
    Side,
    Tagging,
    LineSymbol,
    AttributeFilter, //过滤器
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
      Fields: [],
      //当前过滤器线的
      currentFilter: {
        schemas: '',
        name: '',
        filter: '',
        style: '',
      },
      stylename: '', //绑定的样式名称
      type: '',
    };
  },
  created() {
    this.getAllField();
    this.getStyleName();
  },
  methods: {
    //给过滤的组件添加字段
    async getAllField() {
      try {
        const response = await api.db.findService({
          resourceId: this.msg.data.resource.resourceId, // 资源id
          serivestatus: 0, // 服务状态(0 开启 1 关闭)
          baseservicetype: 1, // 基础服务
          metadataLayer: this.msg.data.resource.metadataLayer, // 原数据图层
        });
        if (!response.data) {
          for (let i = 0; i < response.data[1].schema.length; i++) {
            let Field = helps.schemaReservedFileds.indexOf(response.data[1].schema[i].name);
            if (Field == -1) {
              this.currentFilter.schemas += response.data[1].schema[i].name + ',';
            }
          }
          this.currentFilter.style = true;
        }
      } catch (e) {
        that.$Message.error('出错了');
      }
    },
    //获取样式名称
    async getStyleName() {
      const params = {
        stylename: this.msg.data.styles,
      };
      let slddata = await api.db.getsldbyname(params);
      this.stylename = slddata.data.nameLayers['0'].style['0'].name;
    },

    //另存的构造参数
    getParams() {
      let stroke = this.$refs.LineSide.showSide ? this.$refs.LineSide.Stroke : null;
      let Tagging = this.$refs.LineTagging.showSide ? this.$refs.LineTagging.Taggings : null;
      let LineSymbol = this.$refs.LineLineSymbol.showSide
        ? this.$refs.LineLineSymbol.LineSymbols
        : null;
      console.log(stroke);
      console.log(LineSymbol);
      try {
        if (LineSymbol != null && stroke == null) {
          stroke = {
            graphicStroke: LineSymbol,
          };
          stroke = JSON.stringify(stroke);
        }
        if (stroke != null && LineSymbol != null) {
          stroke.graphicStroke = LineSymbol;
          stroke = JSON.stringify(stroke);
        }
        if (stroke != null && LineSymbol == null) {
          stroke = JSON.stringify(stroke);
        }
      } catch (error) {}

      const params = {
        sld:
          '{"nameLayers":[{"name":"","style":[{"name":"' +
          this.stylename +
          '","featureTypeStyle":[{"rule":[{"lineSymbolizers":[{"stroke":' +
          stroke +
          ',"offset":{"offsetX":"' +
          this.$refs.LineCurrency.xSkewing +
          '","offsetY":"' +
          this.$refs.LineCurrency.ySkewing +
          '"}}],"textSymbolizers":' +
          Tagging +
          ',"name":"面样式4","cqlFilter":"","minScaleDenominator":"0","maxScaleDenominator":""}],"semanticTypeIdentifier":["generic:geometry"]}]}]}],"userLayers":null}',
        resourceInfo: {
          alias: '' + this.stylename + '',
          name: '',
          typeId: '20102',
          TypeName: 'sld',
          catalogId: '11111111-1111-1111-1111-111111111111',
          userId: '00000000-0000-0000-0000-000000000000',
          userName: '超级管理员',
          orgId: '00000000-0000-0000-0000-000000000000',
          orgName: '超级管理员组织',
        },
        styleType: 2,
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
        <Radio label="线"></Radio>
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
        v-show="tool=='通用'"
        ref="LineCurrency"
        :msg="msg"></Currency>
      <Side
        v-show="tool=='线'"
        ref="LineSide"
        :msg="msg"></Side>
      <Tagging
        v-show="tool=='标注'"
        ref="LineTagging"
        :msg="msg"></Tagging>
      <LineSymbol
        v-show="tool=='线符号'"
        ref="LineLineSymbol"
        :msg="msg"></LineSymbol>
      <AttributeFilter
        v-show="tool=='过滤'"
        ref="LinefilterEditor"
        :value="currentFilter"></AttributeFilter>
    </div>

    <div
      class="right">
      <div class="right-top">
        <Tree
          :data="dataGroup"
        ></Tree>
      </div>
      <div class="right-bottom">
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
