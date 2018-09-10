
<script>
import StyleTable from './StyleTable';
import Public from './common/Public';
import LineStyle from './common/LineStyle';
import FillStyle from './common/FillStyle';
import LineSymbol from './common/LineSymbol';
import MarkStyle from './common/MarkStyle';
import AttributeFilter from './common/AttributeFilter';
import RuleGroup from './common/RuleGroup';
import * as helps from '@/utils/helps';

export default {
  name: 'StyleEdit',
  components: {
    StyleTable,
    Public,
    LineStyle,
    FillStyle,
    LineSymbol,
    MarkStyle,
    AttributeFilter,
    RuleGroup,
  },
  props: {
    layerNode: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      tableHeight: 0,
      styleType: 'SingleSytle', //是否是单一样式
      isOpenStyleTable: false,
      isGroupRule: false,
      layerType: '',
      layerTypeText: '',
      styleName: '',
      styleAliasName: '',
      fieldNumS: [],
      fieldNoNumS: [],
      ruleList: [],
      selectRule: '',
      defaultRule: {}, // 根据id获取默认样式
    };
  },
  computed: {
    getLineStr: function() {
      var lineStr = '';
      if (this.layerType == 'polyline') {
        lineStr = '线';
      } else {
        lineStr = '边';
      }
      return lineStr;
    },
    getFileStr: function() {
      var lineStr = '';
      if (this.layerType == 'polygon') {
        lineStr = '面';
      } else if (this.layerType == 'point') {
        lineStr = '点';
      }
      return lineStr;
    },
    getRules: function() {
      return this.$refs.ruleGroup.tableData;
    },
    // styleType: function() {
    //   if()
    //   if (this.getRules.length == 0) {
    //     return 'SingleSytle';
    //   } else {
    //     return 'MultipleSytle';
    //   }
    // },
    // 获取public里面的数据
    getPublicData() {
      return this.$refs.public.publicData;
    },
    // 获取linestyle里面的数据
    getLineStyleData() {
      return this.$refs.lineStyle.LineStyleData;
    },
    // 获取面填充里面的数据
    getFillStyleData() {
      return this.$refs.fillStyle.FillStyleData;
    },
    // 获取线符号的数据
    getLineSymbolData() {
      return this.$refs.lineSymbol.LineSymbolData;
    },
    // 获取标注的数据
    getMarkStyleData() {
      return this.$refs.markStyle.MarkStyleData;
    },
    // 获取筛选过滤条件
    getFitterData() {
      return this.$refs.attributeFilter.filterStr;
    },
  },
  watch: {
    layerNode: {
      handler(val) {
        if (val.resource.shapeType.toUpperCase() == 'POLYGON') {
          this.layerType = 'polygon';
          this.layerTypeText = '面';
        } else if (val.resource.shapeType.toUpperCase() == 'POINT') {
          this.layerType = 'point';
          this.layerTypeText = '点';
        } else if (val.resource.shapeType.toUpperCase() == 'LINESTRING') {
          this.layerType = 'polyline';
          this.layerTypeText = '线';
        } else if (val.resource.shapeType == 'polyline') {
          this.layerType = 'polyline';
          this.layerTypeText = '线';
        }
        this.getLayerStyleName();
        this.getSldByName();
        this.getfield();
      },
      immediate: true,
    },
  },
  mounted() {
    //自适应高度
    this.tableHeight = document.getElementsByClassName('main')[0].offsetHeight - 220;
    window.onresize = temp => {
      this.tableHeight = document.getElementsByClassName('main')[0].offsetHeight - 220;
      if (document.getElementsByClassName('styleMainCollapse')[0]) {
        document.getElementsByClassName('styleMainCollapse')[0].style.height =
          this.tableHeight + 'px';
      }
      if (document.getElementsByClassName('groupRuleDiv')[0]) {
        document.getElementsByClassName('groupRuleDiv')[0].style.height = this.tableHeight + 'px';
      }
    };
    if (document.getElementsByClassName('styleMainCollapse')[0]) {
      document.getElementsByClassName('styleMainCollapse')[0].style.height =
        this.tableHeight + 'px';
    }
    if (document.getElementsByClassName('groupRuleDiv')[0]) {
      document.getElementsByClassName('groupRuleDiv')[0].style.height = this.tableHeight + 'px';
    }
  },
  methods: {
    //样式设置返回
    back() {
      this.$emit('back-event');
    },
    //单一样式和组合样式切换
    styleGroupChange() {
      if (this.styleType == 'SingleSytle') {
        this.tableHeight = document.getElementsByClassName('main')[0].offsetHeight - 220;
        document.getElementsByClassName('styleMainCollapse')[0].style.height =
          this.tableHeight + 'px';
      } else {
        this.tableHeight = document.getElementsByClassName('main')[0].offsetHeight - 400;
        document.getElementsByClassName('styleMainCollapse')[0].style.height =
          this.tableHeight + 'px';
      }
    },
    //打开样式高级设置
    openRuleByGroup() {
      this.isGroupRule = true;
    },
    // 获取样式名称
    getLayerStyleName() {
      this.styleName = new URL(this.layerNode.serviceUrl).searchParams.get('styles');
    },
    // 获取样式别名
    async getSldByName() {
      const response = await api.db.getSldByName({ style: this.styleName });
      // 获取默认样式
      this.defaultRule = response.data.nameLayers[0].style[0].featureTypeStyle[0].rule[0];
      this.styleAliasName = response.data.nameLayers[0].style[0].name.replace(/\ +/g, '');
    },
    // 获取图层所有字段信息
    async getfield() {
      const response = await api.db.findService({
        resourceId: this.layerNode.resourceId, // 资源id
        serivestatus: 0, // 服务状态(0 开启 1 关闭)
        baseservicetype: 1, // 基础服务
        metadataLayer: this.layerNode.resource.metadataLayer, // 元数据图层
      });
      if (response.data.length > 1) {
        for (let i = 0; i < response.data[1].schema.length; i++) {
          let all = helps.schemaReservedFileds.indexOf(response.data[1].schema[i].name);
          if (all == -1 && response.data[1].schema[i].type != 'String') {
            this.fieldNumS.push(response.data[1].schema[i]);
          }
          if (all == -1 && response.data[1].schema[i].type == 'String') {
            this.fieldNoNumS.push(response.data[1].schema[i]);
          }
        }
      }
    },
    groupRuleBack() {
      this.isGroupRule = false;
      if (this.getRules.length == 0) {
        this.styleType = 'SingleSytle';
      } else {
        this.styleType = 'MultipleSytle';
        this.ruleList = [];
        this.getRules.forEach((item, index) => {
          item.title = 'rule' + (index + 1);
          item.index = index;
          this.ruleList.push(item);
        });
        this.selectRule = this.ruleList[0].title;
      }
    },
    tagRemove(item) {
      const index = this.ruleList.indexOf(item);
      this.ruleList.splice(index, 1);
      if (this.ruleList.length > 0) {
        this.selectRule = this.ruleList[0].title;
      } else {
        this.styleType = 'SingleSytle';
      }
    },
    // 提交另存动态添加样式
    async submitStyleEdit(data) {
      let styleResponse = await api.db.addbysld(data);
      return styleResponse;
    },
    layerStyleUser() {
      // 通用里面的数据
      let publicData = this.getPublicData;
      // linestyle里面的数据
      let lineStyleData = this.getLineStyleData;
      // lineStyleData里面的宽度 颜色 和 它们对应的字段是只能传递一个
      var widthOption = lineStyleData.widthField
        ? `"widthField":"${lineStyleData.widthField}"`
        : `"numWidth":"${lineStyleData.width}"`;
      var colorOption = lineStyleData.colorField
        ? `"colorField":"${lineStyleData.colorField}"`
        : `"strColor":"${lineStyleData.color}"`;
      // 虚线和虚线偏移也可传可不传
      var dashs = lineStyleData.imaginary ? `"dashs":[${lineStyleData.imaginary}]` : '';
      var numDashOffset = lineStyleData.numDashOffset
        ? `"numDashOffset":${lineStyleData.imaginaryExcursion}`
        : '';
      // fillStyle里面的数据
      let fillStyleData = this.getFillStyleData;
      // 填充里面的数据处理
      var fillOpacity = fillStyleData.transparentField
        ? `"opacityField":"${fillStyleData.transparentField}"`
        : `"numOpacity":"${fillStyleData.transparent / 100}"`;
      var fillStyleColor = fillStyleData.colorField
        ? `"colorField":"${fillStyleData.colorField}"`
        : `"strColor":"${fillStyleData.color}"`;
      // 标注里面的数据
      let markStyleData = this.getMarkStyleData;
      // 处理标注里面可选参数
      var markTextField = markStyleData.markTextField
        ? `"labelField":"${markStyleData.markTextField}"`
        : `"strLabel":"${markStyleData.markText}"`;
      // 旋体样式的处理
      var pointPlacement = markStyleData.angleField
        ? `"rotationField":"${markStyleData.angleField}"`
        : `"numRotation":"${markStyleData.angle}"`;
      // 是否传递字体
      var markFont = markStyleData.fontStyle
        ? `"font":{
              strSize: '12',
              strFamily: markStyleData.fontStyle,
            }`
        : '';
      // 垂直距离的处理
      var linePlacement = markStyleData.offsetY
        ? `"linePlacement": { "perpendicular": "${markStyleData.offsetY}" }`
        : '';
      // option可选参数的处理
      var maxDisplacement = markStyleData.maxDisplacement
        ? `"maxDisplacement":"${markStyleData.maxDisplacement}"`
        : '';
      var autoWrap = markStyleData.autoWrap ? `"autoWrap":"${markStyleData.autoWrap},"` : '';
      var spaceAround = markStyleData.spaceAround
        ? `"spaceAround":"${markStyleData.spaceAround},"`
        : '';
      var repeat = markStyleData.repeatD ? `"repeat":"${markStyleData.repeatD},"` : '';
      var followLine = markStyleData.isFollowLine
        ? `"followLine":"${markStyleData.isFollowLine},"`
        : '';
      var maxAngleDelta = markStyleData.maxAngle ? `"followLine":"${markStyleData.maxAngle},"` : '';
      // 线符号里面的数据
      if (!this.layerType == 'point') {
        let lineSymbolData = this.getLineSymbolData;
        // 由于面和线的stroke传参一样可以共用
        if (!lineSymbolData.isShow && !lineStyleData.isShow) {
          var stroke = null;
        } else if (!lineSymbolData.isShow && lineStyleData.isShow) {
          var stroke = `{
                  "graphicStroke": null,
                  ${widthOption},
                  ${colorOption},
                  "numOpacity": ${lineStyleData.transparent / 100},
                  ${dashs} ,
                  ${numDashOffset},
                  "strLineCap": "${lineStyleData.lineCap}",
                  "strLineJoin": "${lineStyleData.lineConnect}"
                            }`;
        } else if (lineSymbolData.isShow && !lineStyleData.isShow) {
          // 在线符号传递的参数不同处理
          if (lineSymbolData.fillType == 'mark') {
            // 选择传递标注
            var stroke = `{
              "graphicStroke": {
                  "mark": [
                  {
                  "stroke": {
                  "strColor": "${lineSymbolData.markColor}",
                  "numWidth": "${lineSymbolData.markWidth}"
                            },
                  "strWellKnownName": "${lineSymbolData.selectedMark}"
                                  }
                             ],
                  "numSize": "${lineSymbolData.markSize}"
             }}`;
          } else if (lineSymbolData.fillType == 'font') {
            // 选择文字符号由于没有数据暂不处理
          }
        } else {
          var stroke = `{
            "graphicStroke": {
              "mark": [
                {
                  "stroke": {
                    "strColor": "${lineSymbolData.markColor}",
                    "numWidth": "${lineSymbolData.markWidth}"
                   },
                  "strWellKnownName": "${lineSymbolData.selectedMark}"
                }
              ],
              "numSize": "${lineSymbolData.markSize}"
            },
           ${widthOption},
           ${colorOption},
          "numOpacity": ${lineStyleData.transparent / 100},
           ${dashs},
           ${numDashOffset},
          "strLineCap": "${lineStyleData.lineCap}",
          "strLineJoin": "${lineStyleData.lineConnect}"
          }`;
        }
      }
      // 过滤条件数据
      let filterData = this.getFitterData;
      // fill填充的数据也一样,所有也可以一起处理
      // 判断fill里面填充数据
      if (!fillStyleData.isShow) {
        var fill = null;
      } else {
        // 如果选择颜色,标注以及字体的参数处理
        if (fillStyleData.fillType == 'color') {
          // 选择颜色
          var fill = `{
             "graphicFill": null,
             ${fillOpacity},
             ${fillStyleColor}`;
        } else if (fillStyleData.fillType == 'mark') {
          // 选择标记
          var fill = `{
              "graphicFill": {
                "mark": [
                  {
                    "stroke": {
                      "strColor":"${fillStyleData.fillColor}",
                      "numWidth":"${fillStyleData.fillWidth}"
                     },
                    "strWellKnowName": "${fillStyleData.mark}"
                  }
                ],
                "numSize": "${fillStyleData.fillSize}"
              },
              "numOpacity": "${fillStyleData.transparent / 100}"
            }`;
        } else if (fillStyleData.fillType == 'font') {
          // 选择字体传递参数
        }
      }
      // 如果是面处理传递参数
      if (this.layerType == 'polygon') {
        // 判断每个子组件里面的数据是否传递
        // 判断markStyleData是否传递数据
        if (!markStyleData.isShow) {
          var textSymbolizers = null;
        } else {
          // 如果选择的字体就必须传递字体数
          var textSymbolizers = `[{
                "fill": {
                  "numOpacity": ${markStyleData.transparent / 100},
                  "strColor": "${markStyleData.fontColor}"
                },
                ${markFont}
                ${pointPlacement},
                "halo": {
                  "fill": { "strColor": "${markStyleData.haloColor}" },
                  "numRadius": "${markStyleData.haloSize}"
                },
                "options": {
                  ${autoWrap}
                  ${spaceAround}
                  ${maxDisplacement}
                },
                ${markTextField}
              }]`;
        }
        var mockModel = `{
                "nameLayers": [
                  {
                    "name": "",
                    "style": [
                      {
                        "name": "${this.styleAliasName}",
                        "featureTypeStyle": [
                            {
                              "rule": [
                                {
                                  "polygonSymbolizers": [
                                    {
                                    "stroke": ${stroke},
                                    "fill": ${fill},
                                    "offset": {
                                      "offsetX": "${publicData.xSkewing}",
                                      "offsetY": "${publicData.ySkewing}"
                                      }
                                    }
                                  ],
                                  "textSymbolizers": ${textSymbolizers},
                                  "name": "${publicData.ruleName}",
                                  "cqlFilter": "${filterData}",
                                  "minScaleDenominator": "${publicData.maxRatio}",
                                  "maxScaleDenominator": "${publicData.minRatio}"
                                }
                              ],
                              "semanticTypeIdentifier": ["generic:geometry"]
                            }
                        ]
                      }
                    ]
                  }
                ],
                "userLayers": null
              }`;
      } else if (this.layerType == 'polyline') {
        // 如果是线传递参数,则需添加数据
        if (!markStyleData.isShow) {
          var textSymbolizers = null;
        } else {
          if (!markStyleData.isBackGroundShow) {
            var textSymbolizers = `[{
                "fill": {
                  "numOpacity": ${markStyleData.transparent / 100},
                  "strColor": "${markStyleData.fontColor}"
                },
                ${markFont},
                ${linePlacement},
                "halo": {
                  "fill": { "strColor": "${markStyleData.haloColor}" },
                  "numRadius": "${markStyleData.haloSize}"
                },
                "options": {
                  ${autoWrap}
                  ${spaceAround}
                  ${repeat}
                  ${followLine}
                  ${maxAngleDelta}
                  ${maxDisplacement}
                },
                "graphic": {},
                ${markTextField}
              }]`;
          } else {
            var textSymbolizers = `[{
                "fill": {
                  "numOpacity": ${markStyleData.transparent / 100},
                  "strColor": "${markStyleData.fontColor}"
                },
                ${markFont},
                ${linePlacement},
                "halo": {
                  "fill": { "strColor": "${markStyleData.haloColor}" },
                  "numRadius": "${markStyleData.haloSize}"
                },
                "options": {
                  ${autoWrap}
                  ${spaceAround}
                  ${repeat}
                  ${followLine}
                  ${maxAngleDelta}
                  ${maxDisplacement}
                },
                "graphic": {
                        "mark": [
                          { "fill": { "strColor": "${
                            markStyleData.backGroundColor
                          }" }, "stroke": { "strColor": "${markStyleData.backGroundBorderColor}" } }
                        ]
                      },
                ${markTextField}
              }]`;
          }
        }
        var mockModel = `{
              "nameLayers": [
                {
                  "name": "",
                  "style": [
                    {
                      "name": "${this.styleAliasName}",
                      "featureTypeStyle": [
                        {
                          "rule": [
                            {
                              "lineSymbolizers": [
                                {
                                  "stroke": ${stroke},
                                  "fill": ${fill},
                                  "offset": {
                                      "offsetX": "${publicData.xSkewing}",
                                      "offsetY": "${publicData.ySkewing}"
                                    }
                                }
                              ],
                              "textSymbolizers": ${textSymbolizers},
                              "name": "${publicData.ruleName}",
                              "cqlFilter": "${filterData}",
                              "minScaleDenominator": "${publicData.maxRatio}",
                              "maxScaleDenominator": "${publicData.minRatio}"
                            }
                          ],
                          "semanticTypeIdentifier": ["generic:geometry"]
                        }
                      ]
                    }
                  ]
                }
              ],
              "userLayers": null
            }`;
      } else if (this.layerType == 'point') {
        // 如果是点添加数据, 那么里面所有的数据都需要重新处理
        // 在店里面点大小和旋转需要处理
        var pointSize = publicData.pointSizeField
          ? `"sizeField":"${publicData.pointSizeField}"`
          : `"numSize":"${publicData.pointSize}"`;
        var pointRotation = publicData.pointOffsetField
          ? `"rotationField":"${publicData.pointOffsetField}"`
          : `"numRotation":"${publicData.pointOffset}"`;
        // 处理点里面边的数据
        var pointTransparent = lineStyleData.transparentField
          ? `"opacityField":"${lineStyleData.transparentField}"`
          : `"numOpacity":"${lineStyleData.transparent}"`;
        var pointWidth = lineStyleData.widthField
          ? `"widthField":"${lineStyleData.widthField}"`
          : `"numWidth":"${lineStyleData.width}"`;
        if (!lineStyleData.isShow) {
          var lineStroke = null;
        } else {
          var lineStroke = `{
            ${pointTransparent},
            ${pointWidth},
            "strColor":"${lineStyleData.color}"
          }`;
        }
        // 处理fillStyle里面的数据
        var fillOpacity = fillStyleData.transparentField
          ? `"opacityField":"${fillStyleData.transparentField}"`
          : `"numOpacity":"${fillStyleData.transparent}"`;
        var fillColor =
          fillStyleData.fillType == 'mark' ? `"strColor":"${fillStyleData.fillColor}"` : '';
        // 根据fillStyleData的fillType为font或mark应该显示不同的数据
        if (fillStyleData.fillType == 'mark') {
        } else if (fillStyleData.fillType == 'font') {
        }
        if (!fillStyleData.isShow) {
          var lineFill = null;
        } else {
          var lineFill = `{
            ${fillOpacity},
            ${fillColor}
          }`;
        }
        // 处理markStyle的数据
        if (!markStyleData.isShow) {
          var textSymbolizers = null;
        } else {
          // 跟据不同方位值得到对应的结果
          if (markStyleData.verticalType == 'top') {
            var yValue = 0.0;
          } else if (markStyleData.verticalType == 'middle') {
            var yValue = 0.5;
          } else if (markStyleData.verticalType == 'bottom') {
            var yValue = 1.0;
          } else {
            var yValue = 0;
          }
          if (markStyleData.horizontalType == 'left') {
            var xValue = 0.0;
          } else if (markStyleData.horizontalType == 'center') {
            var xValue = 0.5;
          } else if (markStyleData.horizontalType == 'right') {
            var xValue = 1.0;
          } else {
            var xValue = 0;
          }
          var textSymbolizers = `[{
                "fill": {
                  "numOpacity": ${markStyleData.transparent / 100},
                  "strColor": "${markStyleData.fontColor}"
                },
                ${markFont},
                "pointPlacement":{
                    "anchorPoint":{
                      "x":"${xValue}",
                      "y":"${yValue}"
                    },
                    "displacement":{
                      "x":"${markStyleData.displacementX}",
                      "y":"${markStyleData.displacementY}"
                    },
                    ${pointPlacement}
                },
                "halo": {
                  "fill": { "strColor": "${markStyleData.haloColor}" },
                  "numRadius": "${markStyleData.haloSize}"
                },
                "options": {
                  ${autoWrap}
                  ${spaceAround}
                  ${repeat}
                  ${followLine}
                  ${maxAngleDelta}
                  ${maxDisplacement}
                },
                ${markTextField}
            }]`;
        }
        var mockModel = `{
              "nameLayers":[
                  {
                    "name":"",
                    "style":[
                        {
                          "name":"${this.styleAliasName}",
                          "featureTypeStyle":[
                              {
                                "rule":[
                                    {
                                      "pointSymbolizers":[
                                          {
                                            "graphic":{
                                                "mark":[
                                                  {
                                                    "stroke":${lineStroke},
                                                    "fill":${lineFill},
                                                    "strWellKnownName":"${fillStyleData.mark}"
                                                  }
                                                ],
                                              ${pointSize},
                                              ${pointRotation}
                                            },
                                            "offset":{
                                                "offsetX":"${publicData.xSkewing}",
                                                "offsetY":"${publicData.ySkewing}"
                                            }
                                          }
                                      ],
                                      "textSymbolizers":${textSymbolizers},
                                      "name": "${publicData.ruleName}",
                                      "cqlFilter":"${filterData}",
                                      "minScaleDenominator":"${publicData.maxRatio}",
                                      "maxScaleDenominator":"${publicData.minRatio}"
                                    }
                                ],
                                "semanticTypeIdentifier":[
                                "generic:geometry"
                                ]
                              }
                          ]
                        }
                    ]
                  }
              ],
              "userLayers":null
            }`;
      }

      // 去除字符串拼接的空格
      var sld = mockModel.replace(/\ +/g, '').replace(/\n/g, '');
      // 提交保存数据
      let editParams = {
        sld: sld,
        resourceInfo: {
          alias: this.styleAliasName,
          name: '',
          typeId: '20102',
          TypeName: 'sld',
          catalogId: '11111111-1111-1111-1111-111111111111',
          userId: this.layerNode.resource.userId,
          userName: '超级管理员',
          orgId: this.layerNode.resource.orgId,
          orgName: this.layerNode.resource.orgName,
        },
        styleType: 3,
      };
      this.submitStyleEdit(editParams);
    },
  },
};
</script>

<template>
  <div class="main">
    <div class="tilte-div">
      <Button
        type="dashed"
        icon="arrow-left-a"
        @click="back">返回</Button>
      <span class="title">编辑图层:</span>
      <span class="layername">{{ layerNode.resource.alias }}</span>
    </div>
    <Card class="context-card">
      <p slot="title">
        <SvgIcon
          :size="18"
          :icon-class="'style-'+layerType"></SvgIcon>
        <span class="title">{{ layerTypeText+'样式' }}</span>
      </p>
      <Tooltip
        slot="extra"
        :content="!isOpenStyleTable?'所有'+layerTypeText+'样式列表':'返回'"
        placement="right">
        <a
          href="javascript:void(0);"
          @click="isOpenStyleTable=!isOpenStyleTable"><SvgIcon
            :size="18"
            :icon-class="isOpenStyleTable?'style-back':'style-table'"></SvgIcon></a>
      </Tooltip>
      <div v-if="!isOpenStyleTable">
        <div style="margin-bottom:8px;">
          <span>当前样式名称：</span>
          <span
            class="style-name">{{ styleName }}</span>
        </div>
        <Row>
          <Col span="9">当前样式别名：</Col>
          <Col span="13"> <Input
            v-model="styleAliasName"
            size="small"
            placeholder="样式别名"></Input></Col>
          <Col span="2">
          <Tooltip
            style="margin-left:4px;"
            content="样式另存并应用图层"
            placement="right">
            <a
              href="javascript:void(0);"
              @click="layerStyleUser">
              <SvgIcon
                :size="24"
                color="#2D8CF0"
                icon-class="layer-style-user">
              </SvgIcon>
            </a>
          </Tooltip>
          </Col>
        </Row>
        <div
          v-show="!isGroupRule"
          style="margin-top:8px;vertical-align:middle;height:20px;"
        >
          <RadioGroup
            v-model="styleType"
            style="line-height:19px;"
            @on-change="styleGroupChange">
            <Radio label="SingleSytle">单一样式</Radio>
            <Radio label="MultipleSytle">组合样式</Radio>
          </RadioGroup>
          <a
            class="open-rule-group"
            href="javascript:void(0);"
            @click="openRuleByGroup">高级设置</a>
        </div>
        <Card
          v-show="styleType=='MultipleSytle'&&!isGroupRule"
          class="group-card">
          <div class="group-card-context-div">
            <div class="ruleTitle">
              <span class="title">所有规则</span>
              <Button
                icon="plus"
                type="primary"
                size="small"
                class="addRule">创建规则</Button>
            </div>
            <RadioGroup v-model="selectRule">
              <div
                v-for="item in ruleList"
                :key="item.title"
                class="tag-border">
                <Radio
                  :label="item.title">
                </Radio>
                <Icon
                  :size="24"
                  type="ios-close-empty"
                  style="vertical-align: middle;line-height: 35px;"
                  @click.native="tagRemove(item)">
                </Icon>
              </div>
            </RadioGroup>
          </div>
        </Card>
        <div
          v-show="!isGroupRule"
          class="styleMainCollapse">
          <Collapse
            value="1"
            simple>
            <Panel name="1"> 通用<Public
              ref = "public"
              slot="content"
              :layer-type="layerType"
              :field-num-s="fieldNumS"
              :style-type="styleType"/></Panel>
            <Panel name="2">
              {{ getLineStr+'样式' }}
              <LineStyle
                ref = "lineStyle"
                slot="content"
                :layer-type="layerType"
                :field-num-s="fieldNumS"
                :field-no-num-s="fieldNoNumS"
                :style-type="styleType"/>
            </Panel>
            <Panel
              v-show="layerType == 'point'||layerType == 'polygon'"
              name="3">
              {{ getFileStr+'填充' }}
              <FillStyle
                ref = "fillStyle"
                slot="content"
                :default-rule ="defaultRule"
                :layer-type="layerType"
                :field-num-s="fieldNumS"
                :field-no-num-s="fieldNoNumS"
                :style-type="styleType"/>
            </Panel>

            <Panel name="4">
              标注
              <MarkStyle
                ref = "markStyle"
                slot="content"
                :layer-type="layerType"
                :field-num-s="fieldNumS"
                :field-no-num-s="fieldNoNumS"
                :style-type="styleType"/>
            </Panel>
            <Panel
              v-if = "layerType != 'point'"
              name = "5">
              线符号
              <LineSymbol
                slot = "content"
                ref = "lineSymbol"
              />
            </Panel>
            <Panel name="6">
              筛选条件过滤
              <AttributeFilter
                ref = "attributeFilter"
                slot="content"
                :layer-type="layerType"
                :field-num-s="fieldNumS"
                :field-no-num-s="fieldNoNumS"
                :style-type="styleType"/>
            </Panel>
          </linesym></line></panel></Collapse>
        </div>
        <div
          v-show="isGroupRule"
          class="groupRuleDiv" >
          <Card
            v-show="isGroupRule"
            class="group-rule-card"
          >
            <p slot="title">
              高级设置
            </p>
            <Tooltip
              slot="extra"
              style="float: right;"
              content="返回"
              placement="right">
              <a
                href="javascript:void(0);"
                @click="groupRuleBack"><SvgIcon
                  :size="18"
                  icon-class="style-back"></SvgIcon></a>
            </Tooltip>
            <RuleGroup
              ref="ruleGroup"
              :layer-type="layerType"
              :field-num-s="fieldNumS"
              :field-no-num-s="fieldNoNumS"
              :layer-node="layerNode"
              :style-type="styleType"/>
          </Card>
        </div>
      </div>
      <div
        v-else ><StyleTable
          :layer-type="layerType"
          :layer-node="layerNode"/>
      </div>
    </Card>
  </div>
</template>

<style lang="less" scoped>
.main {
  margin: 8px;
  .title {
    font-weight: bold;
    margin-left: 8px;
    font-size: 14px;
  }

  .layername {
    color: #007acc;
    font-size: 14px;
    font-weight: bold;
    width: 130px;
    text-overflow: ellipsis; //让超出的用...实现
    white-space: nowrap; //禁止换行
    overflow: hidden; //超出的隐藏
    display: inline-block;
    vertical-align: middle;
  }

  .context-card {
    width: 100%;
    height: calc(~'100% - 60px');
    margin-top: 8px;
  }

  .group-card {
    width: 100%;
    height: 166px;
    margin-top: 8px;
    .group-card-context-div {
      text-align: center;
      height: 150px;
      overflow-y: auto;
    }
  }

  .ruleTitle {
    text-align: left;
    height: 30px;
  }

  .styleMainCollapse {
    width: 100%;
    margin-top: 8px;
    overflow-y: auto;
  }

  .addRule {
    float: right;
    margin-right: 8px;
  }

  .style-name {
    color: #2d8cf0;
    font-weight: bold;
  }

  .open-rule-group {
    font-size: 12px;
    float: right;
    line-height: 20px;
    color: #2d8cf0;
  }

  /deep/.k-card-body {
    padding: 8px;
  }

  /deep/.k-collapse-header {
    padding-left: 16px;
  }

  .grouprulediv {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 8px, 4px, 8px, 4px;
    overflow-y: auto;
  }
  .group-rule-card {
    margin-top: 8px;
    height: calc(~'100vh - 250px');
  }
  .tag-border {
    height: 35px;
    line-height: 35px;
    margin: 4px;
    border: 1px solid #e9eaec;
    color: #2d8cf0;
    text-align: center;
    vertical-align: middle;
    font-weight: bold;
    /* float: right; */
    width: 100px;
    display: inline-block;
    border-radius: 6px;
  }
}
</style>
