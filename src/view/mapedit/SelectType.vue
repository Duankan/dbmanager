
//选择样式界面
<script>
import { url } from '@ktw/ktools';
const SET_MAP_SERVICELIST = 'SET_MAP_SERVICELIST';
export default {
  name: 'SelectType',
  props: {
    msg: { type: Object, default: () => {} },
  },
  data() {
    return {
      classify: [
        {
          value: ' ',
          label: '全部分类',
        },
      ],
      columns1: [
        {
          title: '样式别名',
          key: 'alias',
        },
        {
          title: '样式名称',
          key: 'name',
        },
        {
          title: '文件大小',
          key: 'size',
        },
      ],
      data: [], //获取的table的数据
      alias: '', //绑定inpt的别名值
      name: '', //绑定inpt的名字值
      classOne: '', //绑定选择的样式分类
      clickData: '', //绑定 点击table 选中的样式的值
      type: '', //给的参数的类型即选中的图层
    };
  },
  created() {
    this.judgeType();
    this.search();
    this.getStyleTypes();
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
    //查询方法
    async search() {
      const params = this.getParams(); //getParams将参数传给params
      const response = await api.db.findSyleByType(params);
      this.data = response.data;
    },
    //构造参数
    getParams() {
      const params = {
        orgId: this.msg.data.resource.orgId,
        type: this.type, //给的参数的类型
        alias: this.alias, //绑定inpt的别名值
        name: this.name, //绑定inpt的名字值
        classify: this.classOne, //绑定选择的样式分类
      };
      return params;
    },
    //查询样式分类下拉框的数据
    async getStyleTypes() {
      const styleTypes = await api.db.styleTypes();
      styleTypes.data.forEach(item => {
        this.classify.unshift({
          value: item.code,
          label: item.remark,
        });
      });
    },
    reset() {
      this.alias = '';
      this.name = '';
      // this.alias = '';
      this.search();
    },

    //应用样式
    async use() {
      //先判断如果没有点击选择的样式。
      if (this.clickData.name == null) {
        this.$Message.error('请至少选择一个样式!');
      } else {
        for (let item of this.msg.sto.getters.ogcLayers) {
          if (item.options.layers == 'ktw:' + this.msg.data.name) {
            item.setParams({ styles: this.clickData.name });
            break;
          }
        }

        const response = await api.db.findService({
          resourceId: this.msg.data.resourceId, // 资源id
          serivestatus: 0, // 服务状态(0 开启 1 关闭)
          baseservicetype: 1, // 基础服务
          metadataLayer: this.msg.data.metadataLayer, // 原数据图层
        });

        const search = url.parse(this.msg.data.serviceUrl).search;
        const layers = search.layers ? search.layers : search.typeName;

        let wfsurlarr = response.data[0].wfsurl.split('&');
        wfsurlarr[7] = 'styles=' + this.clickData.name;
        let servicesurlString = '';
        for (let i = 0; i < wfsurlarr.length; i++) {
          servicesurlString += wfsurlarr[i] + '&';
        }

        response.data[0].servicesurl = servicesurlString;

        this.msg.sto.commit(SET_MAP_SERVICELIST, {
          [layers]: [response.data[0], response.data[1]],
        });
      }
    },
    //default_polygon
    //点击获取点击的那条数据
    getData(currentRow) {
      this.clickData = currentRow;
    },
  },
};
</script>

<template>
  <div class="mapedit-Select-Type">
    <p class="Select-Type-p">
      <span >样式别名:</span>
      <Input
        v-model="alias"
        style="width: 148px"></Input>
      <span
        style=" margin: 0 0 0 19px">样式名称:</span>
      <Input
        v-model="name"
        style="width: 148px"></Input>
      <span
        style=" margin: 0 0 0 19px"
      >样式分类:</span>
      <Select
        v-model="classOne"
        style="width:148px">
        <Option
          v-for="item in classify"
          :value="item.value"
          :key="item.value">{{ item.label }}</Option>
      </Select>
    </p>
    <p class="Select-Type-p">

      <Button
        type="primary"
        icon="ios-search"
        @click="search">查询</Button>
      <Button
        type="error"
        icon="close"
        @click="reset">重置</Button>
    </p>
    <div class="divTable">
      <Table
        :columns="columns1"
        :data="data"
        highlight-row
        @on-current-change="getData"></Table>
    </div>
    <p>
      <Button
        type="success"
        @click="use"
      >应用</Button>
    </p>
</div></template>

<style lang="less" scoped>
.mapedit-Select-Type {
  .divTable {
    width: 680px;
    height: 380px;
    overflow-y: auto;
  }
  .Select-Type-p {
    margin: 8px 0 8px 0;
  }
}
</style>
