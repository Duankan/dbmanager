<script>
export default {
  name: 'DataGrid',
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      check: false,
    };
  },
};
</script>

<template>
  <div class="data-grid">
    <div class="data-grid-header">
      <Checkbox v-model="check">全选</Checkbox>
    </div>
    <div class="data-grid-container">
      <div
        v-for="item in value"
        :key="item.id"
        class="data-grid-item">
        <Checkbox v-model="check"></Checkbox>
        <SvgIcon
          icon-class="folder"
          size="56"></SvgIcon>
        <div class="data-grid-item-title">{{ item.alias || item.title }}</div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.data-grid-header {
  padding: 6px 16px;
  background-color: #f8f8f9;
}
.data-grid-container {
  display: flex;
  flex-wrap: wrap;

  .data-grid-item {
    position: relative;
    margin: 20px;
    height: 120px;
    width: 120px;
    cursor: pointer;

    &:hover {
      background-color: #f8f8f9;
    }

    .k-svgicon {
      margin: 20px 0 0 32px;
    }

    .k-checkbox-wrapper {
      position: absolute;
      top: 10px;
      left: 10px;
    }

    .data-grid-item-title {
      text-align: center;
    }
  }
}
</style>
