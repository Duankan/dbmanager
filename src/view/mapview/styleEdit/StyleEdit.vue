<script>
import StyleTable from './StyleTable';
import Public from './common/Public';
import LineStyle from './common/LineStyle';
import FillStyle from './common/FillStyle';
import MarkStyle from './common/MarkStyle';
import AttributeFilter from './common/AttributeFilter';
import RuleGroup from './common/RuleGroup';
import * as helps from '@/utils/helps';

export default {
  name: 'StyleEdit',
  components: { StyleTable, Public, LineStyle, FillStyle, MarkStyle, AttributeFilter, RuleGroup },
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
    //获取样式名称
    getLayerStyleName() {
      this.styleName = new URL(this.layerNode.serviceUrl).searchParams.get('styles');
    },
    //获取样式别名
    async getSldByName() {
      const response = await api.db.getSldByName({ style: this.styleName });
      this.styleAliasName = response.data.nameLayers[0].style[0].name;
    },
    //获取图层所有字段信息
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
    layerStyleUser() {
      if (this.getRules.length == 0) {
      }
      var styleModel = {
        nameLayers: [
          {
            name: '',
            style: [
              {
                name: this.styleAliasName,
                featureTypeStyle: [
                  {
                    rule: this.getRules,
                    semanticTypeIdentifier: [
                      'generic:geometry',
                      'colorbrewer:unique:color1:' + this.$refs.ruleGroup.field,
                    ],
                  },
                ],
              },
            ],
          },
        ],
        userLayers: null,
      };
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
              slot="content"
              :layer-type="layerType"
              :field-num-s="fieldNumS"
              :style-type="styleType"/></Panel>
            <Panel name="2">
              {{ getLineStr+'样式' }}
              <LineStyle
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
                slot="content"
                :layer-type="layerType"
                :field-num-s="fieldNumS"
                :field-no-num-s="fieldNoNumS"
                :style-type="styleType"/>
            </Panel>
            <Panel name="4">
              标注
              <MarkStyle
                slot="content"
                :layer-type="layerType"
                :field-num-s="fieldNumS"
                :field-no-num-s="fieldNoNumS"
                :style-type="styleType"/>
            </Panel>
            <Panel name="5">
              筛选条件过滤
              <AttributeFilter
                slot="content"
                :layer-type="layerType"
                :field-num-s="fieldNumS"
                :field-no-num-s="fieldNoNumS"
                :style-type="styleType"/>
            </Panel>
          </Collapse>
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
  .tilte-div {
  }

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
