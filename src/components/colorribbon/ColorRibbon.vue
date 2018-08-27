<script>
/*
 * 色带选择器组件
 */
import DEFAULT_RIBBONS from './default-ribbons';
import tinygradient from 'tinygradient';

export default {
  props: {
    //色带列表，不设置为默认色带列表
    ribbonColors: {
      type: Array,
      default() {
        return DEFAULT_RIBBONS;
      },
    },
    //选择的色带索引
    value: {
      type: Number,
      default: -1,
    },
    //最小分段数
    minSegment: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      //当前选择的色带索引
      currentIdx: this.value,
    };
  },
  computed: {
    //当前色带渐进色样式
    currentRibbon() {
      let colorStyle = {
        background: '#fffffff',
      };
      if (this.currentIdx >= 0) {
        let colors = this.ribbonColors[this.currentIdx];
        let strColor = colors.join(',');
        let targetColors = this.ribbonColors.find(p => p.join(',') == strColor);
        colorStyle = this.getItemStyle(targetColors);
      }
      return colorStyle;
    },
  },
  methods: {
    //获取色带颜色也不对应的色带渐进色样式
    getItemStyle(itemColors) {
      let linearColors = [];
      let isCube = itemColors.length >= this.minSegment;
      if (isCube) {
        itemColors.forEach((item, index) => {
          linearColors.push(`${item} ${index / itemColors.length * 100}%`);
          linearColors.push(`${item} ${++index / itemColors.length * 100}%`);
        });
      } else {
        linearColors = itemColors;
      }
      return {
        background: `linear-gradient(to right, ${linearColors.join(',')})`,
      };
    },
    //选择色带
    selectItem(index) {
      if (index != this.currentIdx) {
        this.$emit('input', index);
        this.$emit('on-change', this.ribbonColors[index]);
      }
      this.currentIdx = index;
    },
    //获取色带
    getRibbon(num = 17) {
      let ribbon = [];
      if (this.currentIdx < 0) return ribbon;

      let colors = this.ribbonColors[this.currentIdx];
      if (colors.length < this.minSegment) {
        let gradient = tinygradient(colors);
        let segments = gradient.rgb(num);
        for (let i = 0; i < num; i++) {
          ribbon.push(segments[i].toHexString());
        }
      } else {
        for (let i = 0; i < num; i++) {
          ribbon.push(colors[i % colors.length]);
        }
      }
      return ribbon;
    },
  },
};
</script>

<template>
  <Dropdown
    trigger="click"
    placement="bottom-start"
    class="ribbon-wrapper k-input-wrapper">
    <div class="k-input">
      <div
        :style="currentRibbon"
        class="ribbon-selection"
      ></div>
      <Icon
        type="arrow-down-b"
        class="k-input-icon k-input-icon-normal ribbon-drop-icon"></Icon>
    </div>
    <DropdownMenu slot="list">
      <DropdownItem
        v-for="(item,index) in ribbonColors"
        :key="index"
        :value="index"
        @click.native="selectItem(index)">
        <div
          :style="getItemStyle(item)"
          class="ribbon-drop-item"></div>
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<style lang="less">
.ribbon-wrapper {
  width: 100%;
  .k-dropdown-rel {
    height: 24px;
  }
  .k-dropdown-menu {
    max-height: 200px;
    overflow: auto;
  }
  .k-dropdown-item {
    padding: 4px 6px;
  }
}
.ribbon-drop-icon {
  top: 0;
}
.ribbon-selection {
  position: absolute;
  top: 5px;
  right: 32px;
  left: 8px;
  bottom: 5px;
}
.ribbon-drop-item {
  height: 20px;
}
</style>
