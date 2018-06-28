<script>
import * as helps from '@/utils/helps';
import data from './a.json';

/*
 * 过滤提取资源模块
 */
export default {
  name: 'FilterResource',
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
    };
  },
  created() {
    this.selectLayers = data;
  },
  methods: {
    //移除图层
    removeLayer(layer) {},
    //编辑过滤器
    editFilter(layer) {},
  },
};
</script>
<template>
  <div class="filter-resource-wrapper">
    <div class="layer-wrapper">
      <ul class="sheet-list">
        <li
          v-for="(layer,index) in selectLayers"
          :key="index"
          class="sheet-item"
          @click="editFilter(layer)">
          <span class="item-index">{{ index+1 }}</span>
          <span class="item-text">{{ layer.resname }}</span>
          <Icon
            class="item-close"
            type="close"
            title="删除"
            @click.native="removeSelect(layer)" />
        </li>
      </ul>
    </div>
    <div class="filter-wrapper">
      22222
    </div>
  </div>
</template>

<style lang="less">
.filter-resource-wrapper {
  height: 400px;
  display: flex;
  .layer-wrapper {
    width: 200px;
  }
  .filter-wrapper {
    flex: 1;
  }
  .sheet-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .sheet-item {
    width: 250px;
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
    .item-close {
      position: absolute;
      right: 10px;
      top: 8px;
      color: #000000;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
