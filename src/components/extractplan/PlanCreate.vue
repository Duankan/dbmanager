<script>
import TreeGrid from './TreeGrid';
import AttributeFilter from './AttributeFilter';

export default {
  name: 'PlanCreate',
  components: { TreeGrid, AttributeFilter },
  props: {
    value: {
      type: Object,
      default: () => {},
    },
    // 只显示目录
    directory: {
      type: Boolean,
      default: false,
    },
    // 过滤节点类型 ['sld', 'vector', 'raster', 'file']
    filterType: {
      type: [Array, String],
      validator(val) {
        const filter = ['sld', 'vector', 'raster', 'file'];
        if (!Array.isArray(val)) {
          val = [val];
        }
        return val.every(item => filter.includes(item));
      },
      default: () => ['sld'],
    },
  },
  data() {
    return {
      rootNode: '数据目录',
      planname: '方案',
      current: 0,
      treedata: 'display',
      extent: 'hide',
      resdata: [], //过滤查询字段信息
      checkList: [], //勾选资源列表
      scaleArray: [], //保存查询到的图幅比例尺数组
      attribute: {
        stripe: true,
        border: true,
        showHeader: true,
        showSummary: false,
        showRowHover: true,
        showIndex: true,
        treeType: true,
        isFold: true,
        expandType: true,
        selectionType: false,
      },
      columns: [
        { width: '10px', align: 'center', type: 'selection' },
        { title: '名称', key: 'name', width: '120px', align: 'center' },
        { title: '别名', key: 'text', width: '120px', align: 'center', type: 'text' },
        {
          title: '字段过滤',
          key: 'value',
          width: '120px',
          align: 'center',
          type: 'combbox',
        },
        {
          title: '属性过滤',
          key: 'formatFilter',
          width: '40px',
          align: 'center',
          type: 'caction',
          actions: [{ type: 'primary', text: '属性过滤' }],
        },
      ],
      treeData: [],
      requestdata: {
        //planid: null,//方案编号
        restype: 0, //方案方式： 0为矢量数据提取  1为影像数据提取
        planname: 'null', //方案名称
        createperson: this.$user.id, //方案创建者
        createorganization: this.$user.orgid, //创建组织
        //createtime: null,//创建时间；
        //updateperson: null,//修改人名称；
        //updatetime: null,//修改时间；
        applyorganization: null, //方案指定组织；
        coordinate: null, //坐标范围；
        splacetype: '-1', //-1：默认全图；0:代表行政区；1:代表图幅范围；2:代表坐标范围；
        splaceremark: null, //空间描述；
        extract: 0, //提取方式；0:代表裁剪；1代表相交；2:代表包含；
        projid: null, //投影编号
        //prjname: null,//投影名称；
        //decryption: null,//脱密算法编号；
        schemalist: [
          //{
          //    resid: null,//资源ID
          //    resname: null,//资源名称 add by zl 2016-8-28
          //    schema: null,//属性
          //    filter:null//过滤条件 add by zl 2016-8-28
          //}
        ], //资源信息列表，实体对象结构如下:
        extractlevel: 'City', //与splacetype组合使用，默认从数字1开始，如果是按行政区就填写行政级别，
        //如果是图幅就填写比例尺
        splacelist: [], //行政编码集合，或者图幅集合，或者附件txt地址
        updateType: 0, //更新类型  0,更新时不更新空间范围及相关字段； 1  根据参数条件重新生成空间范围
      },
    };
  },
  watch: {
    treeData(newVal) {
      for (let item of this.treeData) {
        item.name = item.name;
        item.text = item.name;
      }
      return this.treeData;
    },
  },
  async mounted() {
    const response = await api.db.findCatalog({
      owner: 1,
      ownerId: this.$user.orgid,
      access: 1,
      hasChild: false,
      orderby: 'sort_asc',
    });
    response.data[0].children = [];
    response.data[0].title = this.rootNode;
    this.treeData.push(response.data[0]);
  },
  methods: {
    // 判断是否是目录节点
    nodeType(node) {
      switch (node.typeId) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
          return 'directory';
        case '20001': //点线面
        case '20010': //csv
        case '20011': //csv dataset
        case '20012': //csv zip
        case '20002': //地名地址
        case '20016': //地名地址
          return 'vector';
        case '20003': //dom tiff
        case '20007': //dom 影像图幅文件
        case '20008': //dem tiff
        case '20009': //dem 影像图幅文件
          return 'raster';
        case '20102': //sld 样式文件
          return 'sld';
        case '10005': //doc
        case '10006': //txt
        case '10007': //csv
        case '10008': //xls
        case '10009': //zip
        case '10010': //pdf
          return 'file';
      }
    },
    // 过滤节点函数
    filterNode(node, nodeType) {
      if (nodeType === 'directory') {
        return node.typeId < 5;
      } else if (this.value.tag && this.value.tag == nodeType) {
        return node.typeId > 8;
      }
    },
    async loadData(row, callback) {
      const response = await api.db.findCatalog({
        owner: 1,
        ownerId: this.$user.orgid,
        access: 1,
        hasChild: false,
        orderby: 'sort_asc',
        getmode: 'all',
        parentId: row.childId,
        resourceTypeId: '1,2',
      });
      const children = [];
      response.data.forEach(node => {
        const nodeType = this.nodeType(node);
        if (this.directory) {
          if (nodeType === 'directory' && this.filterNode(node, nodeType)) {
            if (node.isChild === 'open') {
              node.loading = false;
              node.children = [];
            }
            node.text = node.name;
            children.push(node);
          }
        } else {
          if (!this.filterType.includes(nodeType) && this.filterNode(node, nodeType)) {
            if (node.isChild === 'open') {
              node.loading = false;
              node.children = [];
            }
            node.text = node.name;
            children.push(node);
          }
        }
      });
      callback(children);
    },
    async getSchemalist(row, callback) {
      if (row.value) return;
      const response = await api.db.findResourceInfo({ id: row.id });
      if (response.data.schema) {
        response.data.schema = response.data.schema.filter(schema => {
          if (
            [
              'the_geom',
              'geom',
              'gid',
              'ID',
              'geometry',
              'x1',
              'x2',
              'y1',
              'y2',
              'Shape_Leng',
              'Shape_Area',
              'bbox',
            ].indexOf(schema.name) === -1
          )
            return schema;
        });
      }
      var item = {
        resid: row.id,
        type: row.shapeType,
        name: row.name,
        fielditem: [],
      };
      var filedArray = [];
      response.data.schema.forEach(schema => {
        schema.resid = row.id;
        schema.value = schema.name;
        filedArray.push(schema.name);
        item.fielditem.push({
          filed: schema.name,
          type: schema.type,
        });
      });
      //resdata.push(item);
      response.data.schema.unshift({
        name: '全部字段',
        type: 'String',
        value: filedArray.join(','),
        resid: row.id,
      });
      callback(response.data.schema);
    },
    filterData(row, index, type) {
      if (!row.value) return;
      const that = this;
      this.vm = this.$window({
        title: '属性过滤',
        footerHide: true,
        render: h => {
          return h(
            AttributeFilter,
            {
              props: {
                value: { schemas: row.value, name: 'xzq' },
              },
            },
            [this.$scopedSlots.default]
          );
        },
        width: 550,
        height: 460,
      });
    },
    selectionClick(arr) {
      if (arr.length) {
        this.checkList = arr;
      }
    },
    async savePlanData() {
      if (!this.requestdata.planname) {
        this.$Message.warning('请检查方案名称是否正确输入！');
        return;
      }

      if (this.checkList.length == 0) {
        this.$Message.warning('请选择资源！');
        return;
      }
      //遍历选择资源集合，提示未保存状态
      for (var item of this.checkList) {
        if (!item.value) {
          this.$Message.warning('资源' + item.name + '尚未选择字段！');
          break;
        }
      }
      //全图范围
      if (this.requestdata.splacetype === '-1') {
        this.requestdata.splaceremark = '根据全图范围提取';
      } else if (this.requestdata.splacetype === '0') {
      } else if (this.requestdata.splacetype === '1') {
      } else if (this.requestdata.splacetype === '2') {
      }
      //默认指定本组织
      if (!this.requestdata.applyorganization) {
        this.requestdata.applyorganization = this.$user.orgid;
      }
      const res = await api.db.addResourcePlan(this.requestdata);
      if (res.status == 200) {
        this.$Message.success('方案创建成功！');
      } else {
        this.$Message.error('方案创建失败！');
      }
    },
    next() {
      if (this.current == 1) {
        this.current = 0;
        this.treedata = 'display';
        this.extent = 'hide';
      } else if (this.current == 0) {
        this.current += 1;
        this.treedata = 'hide';
        this.extent = 'display';
      }
    },
  },
};
</script>
<template>
  <div>
    <p>当前正在进行第 {{ current + 1 }} 步</p>
    <Steps :current="current">
      <Step title="选择资源"></Step>
      <Step title="空间范围"></Step>
    </Steps>
    <div class="planclass">
      <div :class="treedata">
        <Input
          v-model="requestdata.planname"
          class="nameclass">
        <span slot="prepend">方案名称</span>
        </Input>
        <tree-grid
          ref="treegrid"
          :items="treeData"
          :load-data="loadData"
          :columns="columns"
          :highlight-row="true"
          :combo-data="getSchemalist"
          @on-selection-change="selectionClick"
          @on-button-click="filterData">
        </tree-grid>
      </div>
      <div :class="extent">
        <div class="radiodiv" >
          <RadioGroup
            v-model="requestdata.splacetype">
            <Radio label="-1">默认</Radio>
            <Radio label="0">行政区</Radio>
            <Radio label="1">图幅</Radio>
            <Radio label="2">坐标文件</Radio>
        </RadioGroup></div>
        <div>
          <div v-if="requestdata.splacetype==-1"></div>
          <div
            v-if="requestdata.splacetype==0"
            class="citydiv">
            <label>行政区：</label>
            <label></label>
            <Select
              v-model="model12"
              filterable
              multiple>
              <Option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div v-if="requestdata.splacetype==1">
            <div>
              <label>选择比例尺： </label>
              <Select
                v-model="plotting"
                style="width:250px">
                <Option
                  v-for="item in cityList"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
            </Select></div>
            <div>
              <label>输入图符号：</label>
              <Input
                v-model="mapNumber"
                placeholder="请输入图幅号"
                style="width: 190px;  margin: 8px 2px 8px 2px;"></Input>
              <Button
                type="ghost"
                @click="add" >添加</Button></div>
            <div style="position: absolute;left:350px;top:60px;">
              <Table
                v-if="showTable"
                :columns="columns1"
                :data="data2"
                width= "400">
              </Table>
            </div>
          </div>
          <div v-if="requestdata.splacetype==2"></div>
      </div></div>
    </div>
    <div class="planfoot">
      <Button
        class="nextclass"
        type="primary"
        @click="next">下一步</Button>
      <Button
        type="success"
        @click="savePlanData">保存</Button>
      <Button type="warning">取消</Button>
    </div>
  </div>
</template>
<style lang="less" scoped>
.planclass {
  height: 480px;
  overflow-y: scroll;
  .display {
    display: block;
  }
  .hide {
    display: none;
  }
}
.planfoot {
  height: 46px;
  width: 100%;
  line-height: 46px;
  text-align: right;
  background-color: #ffffff;
  .nextclass{
    text-align: left;
  }
}
.nameclass {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 400px;
}
.radiodiv {
  margin-top: 10px;
}
.citydiv {
  width: 280px;
}
</style>
