
//另存样式
<script>
import PolygonType from './PolygonType';
import LineType from './LineType';
import PointType from './PointType';
import High from './High';
import { url } from '@ktw/ktools';
import SelectType from './SelectType';
const SET_MAP_SERVICELIST = 'SET_MAP_SERVICELIST';
export default {
  name: 'MapEdit',
  components: {
    PolygonType,
    PointType,
    LineType,
    High,
    SelectType,
  },
  props: {
    value: { type: Object, default: () => {} },
  },
  data() {
    return {
      labelName: '', //3个按钮 的第一个按钮名字是叫点 线 面  什么的类型
      selectOut: '', //判断点击线类型，高级或者选择样式
    };
  },
  created() {
    if (this.value.data.resource.shapeType.toUpperCase() == 'POLYGON') {
      this.labelName = '面类型';
    }
    if (this.value.data.resource.shapeType.toUpperCase() == 'POINT') {
      this.labelName = '点类型';
    }
    if (this.value.data.resource.shapeType.toUpperCase() == 'LINESTRING') {
      this.labelName = '线类型';
    }
    if (this.value.data.resource.shapeType == 'polyline') {
      this.labelName = '线类型';
    }
    this.selectOut = this.labelName;
    //把是什么类型的也传过去因为这里做了判断
    this.value.data.resource.type = this.labelName;
  },
  methods: {
    async saveAs() {
      let Params;
      if (this.value.data.resource.type == '面类型') {
        Params = this.$refs.PolygonType.getParams();
      }
      if (this.value.data.resource.type == '线类型') {
        Params = this.$refs.LineType.getParams();
      }
      if (this.value.data.resource.type == '点类型') {
        Params = this.$refs.PolygonType.getParams();
      }
      console.log(Params);
      let SaveAs = await api.db.addbysld(Params);
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
      for (let item of this.value.sto.getters.ogcLayers) {
        if (item.options.layers == 'ktw:' + this.value.data.name) {
          item.setParams({ styles: name });
        }
      }
      // this.msg.sto.commit('SET_MAP_GOCLAYER_DELETE', ['ktw:line3']);

      const response = await api.db.findService({
        resourceId: this.value.data.resourceId, // 资源id
        serivestatus: 0, // 服务状态(0 开启 1 关闭)
        baseservicetype: 1, // 基础服务
        metadataLayer: this.value.data.metadataLayer, // 元数据图层
      });
      const search = url.parse(this.value.data.serviceUrl).search;
      const layers = search.layers ? search.layers : search.typeName;
      let wfsurlarr = response.data[0].wfsurl.split('&');
      wfsurlarr[7] = 'styles=' + name;
      let servicesurlString = '';
      for (let i = 0; i < wfsurlarr.length; i++) {
        servicesurlString += wfsurlarr[i] + '&';
      }
      response.data[0].servicesurl = servicesurlString;
      this.value.sto.commit(SET_MAP_SERVICELIST, {
        [layers]: [response.data[0], response.data[1]],
      });
    },
  },
};
</script>

<template>
  <div class="mapedit">
    <Form
      :label-width="8"
    >
      <FormItem
        class="mapedit-formItems"
      >
        <RadioGroup
          v-model="selectOut"
          type="button"
        >
          <Radio label="选择样式"></Radio>
          <Radio
            :label="labelName"
          ></Radio>
          <Radio label="高级"></Radio>
          <Button
            style="float: right;margin:2px;"
            type="primary"
            icon="ios-search"
            @click="saveAs">另存</Button>


        </RadioGroup>
      </FormItem>
      <FormItem >
        <PolygonType
          v-show="selectOut=='面类型'"
          ref="PolygonType"
          :msg="value"></PolygonType>
        <LineType
          v-show="selectOut=='线类型'"
          ref="LineType"
          :msg="value"></LineType>
        <PointType v-if="selectOut=='点类型'"></PointType>
        <High
          v-show="selectOut=='高级'"
          ref="High"
          :msg="value"></High>
        <SelectType
          v-show="selectOut=='选择样式'"
          :msg="value"></SelectType>
      </FormItem>

    </Form>



  </div>

</template>

<style lang="less" scoped>
.mapedit {
  width: 700px;
  float: left;
  height: 600px;
  border: 1px solid rgb(245, 218, 169);
}
.mapedit-formItems {
  margin: 8px 0 0 0;
}
</style>
