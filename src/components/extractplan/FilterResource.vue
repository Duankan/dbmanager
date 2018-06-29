<script>
import * as helps from '@/utils/helps';
import data from './a.json';
import AttributeFilter from './AttributeFilter';

/*
 * 过滤提取资源模块
 */
export default {
  name: 'FilterResource',
  components: {
    AttributeFilter,
  },
  props: {
    //绑定数据
    model: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      //选择的资源
      selectLayers: [...this.model],
      //当前编辑的资源ID
      currentId: '',
      //当前字段列表
      currentSchemas: [],
      //当前过滤器
      currentFilter: {
        schemas: '',
        name: '',
        filter: '',
      },
      //是否部分选择
      indeterminate: false,
      //是否已全选
      checkAll: false,
      //字段选择列表
      selectSchemas: [],
    };
  },
  created() {
    this.selectLayers = data;
    this.changeEditLayer(0);
  },
  methods: {
    //切换编辑资源
    async changeEditLayer(index) {
      let layer = this.selectLayers[index];
      //查询资源schema信息
      const response = await api.db.findResourceInfo({ id: layer.resid });
      this.currentSchemas = helps.filterSchema(response.data.schema.map(p => p.name));
      this.currentFilter = {
        schemas: this.currentSchemas.join(','),
        name: layer.resname,
        filter: layer.filter,
      };
      this.selectSchemas = layer.schema.split(',');
      this.currentId = layer.resid;
      //下一个刷新周期更新选中字段
      this.$nextTick(() => {
        this.selectSchemas = layer.schema.split(',');
        this.selectSchemasChange(this.selectSchemas);
      });
    },
    //应用编辑更改
    async applyEditLayer(index) {
      //数据检查
      const isValid = await this.checkBeforeApply();
      if (!isValid) return;
      //应用更改
      let layer = this.selectLayers.find(p => p.resid == this.currentId);
      layer.schema = this.selectSchemas.join(',');
      layer.filter = this.$refs.filterEditor.getFilter();
      //切换编辑资源
      this.changeEditLayer(index);
    },
    //应用更改前进行数据检查
    async checkBeforeApply() {
      //验证提取字段
      if (this.selectSchemas.length == 0) {
        this.$Message.error('应用更改失败，请至少选择一个提取字段!');
        return false;
      }
      //验证过滤条件
      let where = this.$refs.filterEditor.getFilter();
      if (!where) return true;
      const resSQL = await api.db.validateSqlFilter(where);
      if (resSQL.data !== true) {
        this.$Message.error('应用更改失败，验证过滤条件失败，请修改!');
        return false;
      }
      return true;
    },
    //字段全选
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;
      if (this.checkAll) {
        this.selectSchemas = this.currentSchemas;
      } else {
        this.selectSchemas = [];
      }
    },
    //更新全选状态
    selectSchemasChange(data) {
      if (data.length === this.currentSchemas.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    //清空条件
    clearFilter() {
      this.$refs.filterEditor.empty();
    },
    //验证条件
    async verifyFilter() {
      let where = this.$refs.filterEditor.getFilter();
      const resSQL = await api.db.validateSqlFilter(where);
      if (resSQL.data === true) {
        this.$Message.success('条件验证成功！');
      } else {
        this.$Message.error('条件验证失败！');
      }
    },
    //获取选择的资源
    getResources() {
      return this.selectLayers;
    },
  },
};
</script>
<template>
  <div class="filter-resource-wrapper">
    <div class="layer-wrapper">
      <div class="region-wrapper">
        <div class="region-header">
          <h4 class="region-title">已选资源列表</h4>
        </div>
        <div class="region-content">
          <ul class="res-list">
            <li
              v-for="(layer,index) in selectLayers"
              :key="index"
              :class="{actived:layer.resid==currentId}"
              class="res-item"
              @click="applyEditLayer(index)">
              <span class="item-index">{{ index+1 }}</span>
              <span class="item-text">{{ layer.resname }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="filter-wrapper">
      <div class="region-wrapper">
        <div class="region-header">
          <h4 class="region-title">选择提取字段</h4>
        </div>
        <div class="region-content">
          <div class="check-all">
            <Checkbox
              :indeterminate="indeterminate"
              :value="checkAll"
              @click.prevent.native="handleCheckAll">全选</Checkbox>
          </div>
          <div class="check-items">
            <CheckboxGroup
              v-model="selectSchemas"
              @on-change="selectSchemasChange">
              <Checkbox
                v-for="(item,index) in currentSchemas"
                :key="index"
                :label="item"></Checkbox>
            </CheckboxGroup>
          </div>
        </div>
      </div>
      <div class="region-wrapper">
        <div class="region-header">
          <h4 class="region-title">设置过滤条件</h4>
        </div>
        <div class="region-content">
          <AttributeFilter
            ref="filterEditor"
            :value="currentFilter"></AttributeFilter>
          <div class="button-groups">
            <Button
              type="primary"
              size="small"
              @click="clearFilter">清空</Button>
            <Button
              type="warning"
              size="small"
              @click="verifyFilter">验证</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.filter-resource-wrapper {
  height: 400px;
  display: flex;
  .layer-wrapper {
    width: 240px;
  }
  .filter-wrapper {
    width: 550px;
    margin-left: 15px;
  }
  .res-list {
    margin: 0;
    padding: 0;
    list-style: none;
    margin-top: 2px;
    height: 460px;
  }
  .region-wrapper {
    margin-bottom: 10px;
    border: 1px solid #eeeeee;
    border-radius: 2px;
  }
  .region-header {
    padding: 6px 12px;
    border-bottom: 1px solid #eeeeee;
  }
  .region-title {
    color: #666666;
  }
  .region-content {
    padding: 5px;
  }
  .res-item {
    height: 26px;
    line-height: 26px;
    margin-bottom: 4px;
    background-color: #dddddd;
    padding: 0 4px;
    border-radius: 2px;
    position: relative;
    cursor: pointer;
    transition: all 0.4s ease;
    &:hover {
      background-color: #cccccc;
    }
    &.actived {
      background-color: #aaaaaa;
      color: #ffffff;
    }
    .item-index {
      padding: 2px 6px;
      color: #ffffff;
      background-color: #999999;
      font-size: 12px;
      border-radius: 2px;
    }
    .item-text {
      margin-left: 5px;
    }
  }
  .check-all {
    border-bottom: 1px dashed #eeeeee;
    .k-checkbox-wrapper {
      margin: 0 0 3px 5px;
    }
  }
  .check-items {
    margin: 5px;
    .k-checkbox-wrapper {
      margin-right: 14px;
    }
  }
  .k-form-item {
    margin-bottom: 5px;
  }
  .button-groups {
    text-align: right;
  }
}
</style>
