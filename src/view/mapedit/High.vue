
<script>
import { url } from '@ktw/ktools';
import config from 'config';
import * as helps from '@/utils/helps';
import ColorRibbon from '@/components/colorribbon/ColorRibbon';
const SET_MAP_SERVICELIST = 'SET_MAP_SERVICELIST';
export default {
  name: 'High',
  components: {
    ColorRibbon,
  },
  props: {
    msg: { type: Object, default: () => {} },
  },
  data() {
    return {
      value1: 2,
      columns: [
        {
          title: '编号',
          key: '编号',
        },
        {
          title: 'color',
          key: 'color',
          render: (h, params) => {
            return h('div', [
              h(
                'div',
                {
                  style: {
                    background: params.row.颜色,
                    width: '100px',
                  },
                },
                '颜色 '
              ),
            ]);
          },
        },
        {
          title: '值',
          key: '值',
        },
      ],
      showTable: false,
      TableData: [
        {
          编号: 'John Brown',
          颜色: 18,
          值: 'New York No. 1 Lake Park',
        },
      ],
      soleAndSection: 'uniquex', //选择是单选还是quantilex
      proportion: '', //颜色渐变的数组
      fieldS: [], //全部的字段
      FieldNoStr: [], //非str类型字段
      field: '', //绑定的字段
      //当前过滤器
      currentFilter: {
        schemas: '',
        name: '',
        filter: '',
        style: '',
      },
    };
  },
  created() {
    this.getAllField();
  },
  methods: {
    //另存的方法
    async saveAs() {
      // sid
      const params = this.getParams();
      let SaveAs = await api.db.addbysld(params);
      if (SaveAs.data.message) {
        this.$Message.error(SaveAs.data.message);
      }
      if (SaveAs.data.statusCode != 400) {
        alert('另存成功');
        await this.show(SaveAs.data.name);
      }
    },
    //显示图层方法
    async show(name) {
      alert(this.msg.data.name);
      this.msg.sto.commit('SET_MAP_GOCLAYER_DELETE', ['ktw:' + this.msg.data.name]);
      const response = await api.db.findService({
        resourceId: this.msg.data.resourceId, // 资源id
        serivestatus: 0, // 服务状态(0 开启 1 关闭)
        baseservicetype: 1, // 基础服务
        metadataLayer: this.msg.data.metadataLayer, // 元数据图层
      });
      const search = url.parse(this.msg.data.serviceUrl).search;
      const layers = search.layers ? search.layers : search.typeName;
      let wfsurlarr = response.data[0].wfsurl.split('&');
      wfsurlarr[7] = 'styles=' + name;
      let servicesurlString = '';
      for (let i = 0; i < wfsurlarr.length; i++) {
        servicesurlString += wfsurlarr[i] + '&';
      }
      response.data[0].servicesurl = servicesurlString;
      this.msg.sto.commit(SET_MAP_SERVICELIST, {
        [layers]: [response.data[0], response.data[1]],
      });
    },
    //这块需要改
    getParams() {
      let sdlfen =
        '{"name":"rule2","cqlFilter":"\\"面积\\"=\'2.04791747862E9\'","polygonSymbolizers":[{"fill":{"strColor":"#3286d8","numOpacity":1},"offset":{"offsetX":0,"offsetY":0}}]},{"name":"rule3","cqlFilter":"\\"面积\\"=\'8.30523447197E7\'","polygonSymbolizers":[{"fill":{"strColor":"#37d4fb","numOpacity":1},"offset":{"offsetX":0,"offsetY":0}}]},{"name":"rule4","cqlFilter":"\\"面积\\"=\'1.1183282E8\'","polygonSymbolizers":[{"fill":{"strColor":"#3389ae","numOpacity":1},"offset":{"offsetX":0,"offsetY":0}}]},{"name":"rule5","cqlFilter":"\\"面积\\"=\'9.3493826E8\'","polygonSymbolizers":[{"fill":{"strColor":"#bfeaee","numOpacity":1},"offset":{"offsetX":0,"offsetY":0}}]},{"name":"rule6","cqlFilter":"\\"面积\\"=\'1.8711695E9\'","polygonSymbolizers":[{"fill":{"strColor":"#7ed5f0","numOpacity":1},"offset":{"offsetX":0,"offsetY":0}}]},{"name":"rule7","cqlFilter":"\\"面积\\"=\'2.6483768E9\'","polygonSymbolizers":[{"fill":{"strColor":"#58a8b3","numOpacity":1},"offset":{"offsetX":0,"offsetY":0}}]},{"name":"rule8","cqlFilter":"\\"面积\\"=\'2.5586462E9\'","polygonSymbolizers":[{"fill":{"strColor":"#5ea4db","numOpacity":1},"offset":{"offsetX":0,"offsetY":0}}]},{"name":"rule9","cqlFilter":"\\"面积\\"=\'2.1864788E8\'","polygonSymbolizers":[{"fill":{"strColor":"#5e89b0","numOpacity":1},"offset":{"offsetX":0,"offsetY":0}}]},{"name":"rule10","cqlFilter":"\\"面积\\"=\'2.6142383E9\'","polygonSymbolizers":[{"fill":{"strColor":"#87a3a7","numOpacity":1},"offset":{"offsetX":0,"offsetY":0}}]},{"name":"rule11","cqlFilter":"\\"面积\\"=\'1.0477484E8\'","polygonSymbolizers":[{"fill":{"strColor":"#40bbfb","numOpacity":1},"offset":{"offsetX":0,"offsetY":0}}]},{"name":"rule12","cqlFilter":"\\"面积\\"=\'1.9268961E9\'","polygonSymbolizers":[{"fill":{"strColor":"#246ea5","numOpacity":1},"offset":{"offsetX":0,"offsetY":0}}]}';
      let sdl =
        '{"nameLayers":[{"name":"","style":[{"name":"Style1lxc205","featureTypeStyle":[{"rule":[{"polygonSymbolizers":[{"stroke":null,"fill":{"graphicFill":null,"numOpacity":1,"strColor":"#87b7d6"},"offset":{"offsetX":"0.0","offsetY":"0.0"}}],"textSymbolizers":null,"name":"rule1","cqlFilter":"\\"面积\\"=\'1.7927942E8\'","minScaleDenominator":"","maxScaleDenominator":""},' +
        sdlfen +
        '],"semanticTypeIdentifier":["generic:geometry","colorbrewer:unique:color3:面积"]}]}]}],"userLayers":null}';

      let paramH = {
        sld: sdl,
        resourceInfo: {
          alias: 'Style1lxc205',
          name: '',
          typeId: '20102',
          TypeName: 'sld',
          catalogId: '11111111-1111-1111-1111-111111111111',
          userId: '00000000-0000-0000-0000-000000000000',
          userName: '超级管理员',
          orgId: '00000000-0000-0000-0000-000000000000',
          orgName: '超级管理员组织',
        },
        styleType: 3,
      };

      return paramH;
    },

    statisticsSuccess(data) {
      this.showTable = true;

      let dataarr = data.split('},');
      console.log(dataarr);
      let colors = this.$refs.ColorRibbon.getRibbon(dataarr.length);
      console.log(colors);
      this.TableData = [];
      for (let i = 0; i < dataarr.length; i++) {
        let value = dataarr[i].split('"' + this.field + '":');
        if (i == dataarr.length - 1) {
          value[1] = value[1].slice(0, value[1].length - 2);
        }
        this.TableData.push({
          编号: i,
          颜色: colors[i],
          值: value[1],
        });
      }
      debugger;
    },
    getColor() {
      var param = {
        groupFields: this.field,
        statisticsFields: [{ field: 'gid', operate: 'count' }],
        typename: 'ktw:' + this.msg.data.name,
      };
      L.ajax({
        url: `${config.project.highgisUrl}/hgis/ows?service=wps&request=aggregate`,
        success: this.statisticsSuccess,
        dataType: 'json',
        type: 'POST',
        data: L.Util.getPostParams({ statistics: param }),
      });
    },
    //给过滤的组件添加字段
    async getAllField() {
      const response = await api.db.findService({
        resourceId: this.msg.data.resource.resourceId, // 资源id
        serivestatus: 0, // 服务状态(0 开启 1 关闭)
        baseservicetype: 1, // 基础服务
        metadataLayer: this.msg.data.resource.metadataLayer, // 元数据图层
      });

      for (let i = 0; i < response.data[1].schema.length; i++) {
        let all = helps.schemaReservedFileds.indexOf(response.data[1].schema[i].name);
        if (all == -1 && response.data[1].schema[i].type != 'String') {
          this.FieldNoStr.push(response.data[1].schema[i]);
        }
        if (all == -1) {
          this.fieldS.push(response.data[1].schema[i]);
        }
      }
    },
    ch() {
      if (tag == 'yes') {
      } else {
      }
    },
  },
};
</script>

<template>
  <div>
    <RadioGroup v-model="soleAndSection">
      <radio label="uniquex">
      <span>唯一值</span> </radio>
      <radio
        label="quantilex" >
      <span>分段数</span></radio>
    </RadioGroup>
    <p>
      <span>
        字段：
      </span>
      <Select
        v-if="soleAndSection=='uniquex'"
        v-model="field"
        style="width:150px">
        <Option
          v-for="item in fieldS"
          :value="item.name"
          :key="item.name">{{ item.name }}</Option>

      </Select>


      <Select
        v-if="soleAndSection=='quantilex'"
        style="width:150px">
        <Option
          v-for="item in FieldNoStr"
          :value="item.name"
          :key="item.name">{{ item.name }}</Option>
      </Select>
      <span>
        颜色渐变：
      </span>
      <ColorRibbon
        ref="ColorRibbon"
        style="width:150px"></ColorRibbon>

      <span
        v-show="soleAndSection=='quantilex'">
        <span>分类：</span>
        <InputNumber
          :min="2"
          v-model="value1"
        ></InputNumber>
        <Button @click="getColor">确定</Button>
      </span>
      <span
        v-show="soleAndSection=='uniquex'">
        <Button @click="getColor">确定</Button>
      </span>
    </p>

    <div class="MapEdit-High-Body">
      <Table
        v-if="showTable"
        :columns="columns"
        :data="TableData"></Table>
    </div>


    <!-- <div class="MapEdit-High-Bottom">
      <Button
        style="float: right;margin:2px;"
        type="primary"
        icon="ios-search"
        @click="saveAs">另存</Button>
    </div> -->



  </div>
</template>

<style>
.MapEdit-High-Body {
  width: 100%;
  height: 400px;
  margin: 10px 0 0 0;
  overflow-y: auto;
}
.MapEdit-High-Bottom {
  margin: 10px 0 0 0;
  width: 100%;
  height: 70px;
}
</style>
