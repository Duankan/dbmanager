<script>
import config from 'config';
export default {
  name: 'App',
  props: {
    layerType: {
      type: String,
      default: '',
    },
    styleType: {
      type: String,
      default: '',
    },
    fieldNumS: {
      type: Array,
      default: () => [],
    },
    fieldNoNumS: {
      type: Array,
      default: () => [],
    },
    layerNode: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      radioView: '唯一值',
      field: '',
      tableHeight: 0,
      columns: [
        {
          title: '规则',
          key: 'name',
          width: 70,
        },
        {
          title: '颜色',
          key: 'color',
          width: 60,
          render: (h, params) => {
            return h('div', [
              h('div', {
                style: {
                  background: params.row.polygonSymbolizers[0].fill.strColor,
                  width: '100px',
                  height: '20px',
                },
              }),
            ]);
          },
        },
        {
          title: '值',
          key: 'cqlFilter',
          align: 'center',
        },
      ],
      section: 2,
      tableData: [],
      colorRibbonValue: -1,
    };
  },
  computed: {
    allFields: function() {
      return this.fieldNumS.concat(this.fieldNoNumS);
    },
  },
  mounted() {
    //自适应高度
    this.tableHeight = document.getElementsByClassName('groupRuleDiv')[0].offsetHeight - 180;
    window.onresize = temp => {
      this.tableHeight = document.getElementsByClassName('groupRuleDiv')[0].offsetHeight - 180;
    };
  },
  methods: {
    getColor() {
      var url = new URL(this.layerNode.serviceUrl);
      if (this.field == '') {
        this.$Message.error('请选择一个字段值!');
        return;
      }
      if (this.colorRibbonValue == -1) {
        this.$Message.error('请选择一个颜色带!');
        return;
      }
      var param = null;
      if (this.radioView == '唯一值') {
        param = {
          groupFields: this.field,
          statisticsFields: [{ field: 'gid', operate: 'count' }],
          typename: url.searchParams.get('layers'),
        };
      } else {
        param = {
          typename: url.searchParams.get('layers'),
          sub: { subField: this.field, section: this.section },
          sort: 'RANGE',
          statisticsFields: [{ field: this.field, operate: 'max' }],
        };
      }
      L.ajax({
        url: `${config.project.highgisUrl}/hgis/ows?service=wps&request=aggregate`,
        success: this.statisticsSuccess,
        dataType: 'json',
        type: 'POST',
        data: L.Util.getPostParams({ statistics: param }),
      });
    },
    statisticsSuccess(data) {
      var jsonObj = JSON.parse(data);
      let colors = this.$refs.ColorRibbon.getRibbon(jsonObj.length > 500 ? 500 : jsonObj.length);
      this.tableData = [];
      if (this.radioView == '唯一值') {
        jsonObj.forEach((item, index) => {
          if (index <= 500) {
            var rule = {
              polygonSymbolizers: [
                {
                  stroke: null,
                  fill: {
                    graphicFill: null, //图像填充
                    numOpacity: 1, //透明度
                    strColor: colors[index], //填充颜色
                  },
                  offset: {
                    offsetX: '0.0',
                    offsetY: '0.0',
                  },
                },
              ],
              textSymbolizers: null,
              name: 'rule' + (index + 1),
              cqlFilter: this.field + "='" + item[this.field] + "'",
              minScaleDenominator: '',
              maxScaleDenominator: '',
            };
            this.tableData.push(rule);
          } else {
            return;
          }
        });
      } else {
        jsonObj.forEach((item, index) => {
          if (index < 500) {
            this.tableData.push({
              index: index,
              color: colors[index],
              value: item['RANGE_' + this.field],
            });
          } else {
            return;
          }
        });
      }
    },
    radioChange(value) {
      if (value == '唯一值') {
        this.tableHeight = document.getElementsByClassName('groupRuleDiv')[0].offsetHeight - 210;
      } else {
        this.tableHeight = document.getElementsByClassName('groupRuleDiv')[0].offsetHeight - 250;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.app {
  font-size: 12px;
  height: 100%;
}
/deep/ .k-table td {
  height: 18px;
}
</style>
<template>
  <div class="app">
    <RadioGroup 
      v-model="radioView" 
      @on-change="radioChange">
      <Radio label="唯一值"></Radio>
      <Radio label="分段数"></Radio>
    </RadioGroup>
    <Row 
      style="margin-top:8px;font-size: 12px;">
      <Col span="8" > 字段：</Col>
      <Col span="16" >
      <Select
        v-model="field"
        size="small"
        style="width:100%">
        <Option
          v-for="item in (radioView=='唯一值'?allFields:fieldNumS)"
          :value="item.name"
          :key="item.name">{{ item.name }}</Option>
      </Select>
        </Col>
    </Row>
    <Row 
      style="margin-top:8px;font-size: 12px;">
      <Col span="8" >颜色渐变:</Col>
      <Col span="16" >
      <ColorRibbon
        ref="ColorRibbon"
        v-model="colorRibbonValue"
        size="small"
        style="width:100%"></ColorRibbon>
        </Col>
    </Row>
    <Row 
      v-if="radioView=='分段数'"
      style="margin-top:18px;font-size: 12px;">
      <Col span="8" >分段数:</Col>
      <Col span="16" >
      <InputNumber 
        :min="2"
        v-model="section"
        style="width:100%"
        size="small"></InputNumber>
        </Col>
    </Row>
    <Button 
      style="margin-top:12px;"
      type="primary" 
      icon="navicon"
      long
      @click="getColor">分类生成</Button>
    <Table 
      :columns="columns"
      :data="tableData"
      :height="tableHeight"
      style="margin-top:8px;"></Table>
  </div>
</template>
