<script>
import * as helps from '@/utils/helps';

/*
 * 选择提取资源模块
 */
export default {
  name: 'SelectResource',
  props: {
    //提取模式：0：矢量提取，1：影像提取
    extractMode: {
      type: Number,
      default: 0,
    },
    //绑定数据
    model: {
      type: Object,
      default: () => {
        return {
          schemalist: [],
        };
      },
    },
  },
  data() {
    return {
      //方案名称
      planName: this.model.planname,
      //资源表格列
      layerColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '资源名称',
          key: 'name',
        },
        {
          title: '中文别名',
          key: 'alias',
        },
      ],
      //当前目录资源数据
      catalogLayers: [],
      //选择的资源
      selectLayers: [...this.model.schemalist],
    };
  },
  watch: {
    model() {
      this.planName = this.model.planname;
      this.selectLayers = [...this.model.schemalist];
    },
  },
  methods: {
    //获取目录下发布的资源
    async getCatalogLayers(catalog) {
      const response = await api.public.findCatalog({
        owner: 1,
        ownerId: this.$appUser.orgid,
        access: 1,
        hasChild: false,
        relatedType: 1,
        orderby: 'sort_asc',
        getmode: 'all',
        resourceTypeId: '1,2',
        parentId: catalog.childId,
      });
      //资源类型过滤
      const filterFunc = this.extractMode == 0 ? helps.isVector : helps.isRaster;
      let layers = response.data.filter(p => filterFunc(p) && p.pubState == 1);
      //资源选择过滤
      layers.forEach(p => {
        if (this.selectLayers.find(m => m.resid == p.id)) {
          p._checked = true;
        }
      });
      this.catalogLayers = layers;
    },
    //选择资源
    selectLayer(layers, current) {
      this.addSelect(current);
    },
    //取消选择资源
    cancelLayer(layers, current) {
      this.removeSelect(current);
    },
    //添加资源
    addSelect(layer) {
      let queryLayer = this.selectLayers.find(p => p.resid == layer.id);
      if (!queryLayer) {
        let item = {
          resid: layer.id,
          resname: layer.name,
        };
        //如果是矢量图层，写入schema参数
        if (layer.schema) {
          item.schema = helps.filterSchema(layer.schema.map(m => m.name)).join(',');
        }
        this.selectLayers.push(item);
      }
    },
    //全选添加资源
    selectAllLayer(layers) {
      layers.forEach(p => this.addSelect(p));
    },
    //选择改变，用于取消全选
    selectChange(layers) {
      if (layers.length == 0) {
        this.selectLayers.splice(0, this.selectLayers.length);
      }
    },
    //删除选择
    removeSelect(layer) {
      let queryLayer = this.selectLayers.find(p => p.resid == layer.id);
      if (queryLayer) {
        let layerIdx = this.selectLayers.indexOf(queryLayer);
        this.selectLayers.splice(layerIdx, 1);
      }
    },
    //校验步骤
    async validateStep() {
      let planName = this.planName.trim();
      if (planName === '') {
        this.$Message.error('请输入提取方案名称！');
        return false;
      }
      if (planName.trim().length > 64) {
        this.$Message.error('提取方案名称不能超过64个字符长度！');
        return false;
      }
      if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]*$/.test(planName)) {
        this.$Message.error('方案名称不能包含特殊字符！');
        return false;
      }
      if (this.selectLayers.length == 0) {
        this.$Message.error('请至少选择一个提取资源！');
        return false;
      }
      return true;
    },
    //获取步骤数据
    getStepData() {
      return {
        planname: this.planName.trim(),
        schemalist: this.selectLayers,
      };
    },
  },
};
</script>
<template>
  <div class="select-resource-wrapper">
    <div class="plan-wrapper">
      <label>提取方案名称：</label>
      <Input
        v-model="planName"
        style="width:400px"
        placeholder="输入方案名称...."></Input>
    </div>
    <div class="resource-wrapper">
      <div class="tree-wrapper">
        <div class="region-wrapper">
          <div class="region-header">
            <h4 class="region-title">数据目录</h4>
          </div>
          <div class="region-content">
            <DataTree
              :click-node-expand="false"
              directory
              accordion
              @on-current-select="getCatalogLayers">
            </DataTree>
          </div>
        </div>
      </div>
      <div class="table-wrapper">
        <div class="region-wrapper">
          <div class="region-header">
            <h4 class="region-title">资源列表</h4>
          </div>
          <div class="region-content">
            <Table
              :columns="layerColumns"
              :data="catalogLayers"
              height="390"
              size="small"
              border
              @on-select="selectLayer"
              @on-select-cancel="cancelLayer"
              @on-select-all="selectAllLayer"
              @on-selection-change="selectChange"></Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style lang="less" scoped>
.select-resource-wrapper {
  .plan-wrapper {
    border: 1px solid #eeeeee;
    padding: 6px 12px;
    margin-right: 5px;
    border-radius: 2px;
    > label {
      margin-right: 10px;
    }
  }
  .resource-wrapper {
    display: flex;
    margin-top: 5px;
  }
  .tree-wrapper {
    width: 250px;
  }
  .table-wrapper {
    flex: 1;
    margin: 0 5px;
  }
  /deep/ .k-table-small td {
    height: 30px;
  }
  .region-content {
    height: 400px;
  }
}
</style>
