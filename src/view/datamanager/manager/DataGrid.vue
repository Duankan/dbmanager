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
      loading: false,
    };
  },
  watch: {
    value: {
      handler(val) {
        this.loading = false;
      },
    },
  },
  methods: {
    iconClass(node) {
      switch (node.typeId) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
          return 'folder';
        case '20001': //点线面
        case '20010': //csv
        case '20011': //csv dataset
        case '20012': //csv zip
          switch (node.shapeType.toUpperCase()) {
            case 'POINT':
              return 'point';
            case 'POLYLINE':
            case 'LINESTRING':
            case 'MULTILINESTRING':
              return 'line';
            case 'POLYGON':
            case 'MULTIPOLYGON':
              return 'polygon';
          }
        case '20002': //地名地址
          return 'dmdz';
        case '20003': //dom tiff
        case '20007': //dom 影像图幅文件
          return 'dom';
        case '20008': //dem tiff
        case '20009': //dem 影像图幅文件
          return 'dem';
        case '20005': //接图表shapezip
          return 'grid';
        case '20014': //controlcsvzip dataset
          return 'point';
        case '10005': //doc
          return 'doc';
        case '10006': //txt
          return 'txt';
        case '10007': //csv
          return 'csv';
        case '10008': //xls
          return 'xls';
        case '10009': //zip
          return 'zip';
        case '10010': //pdf
          return 'pdf';
        default:
          return 'other';
      }
    },
    clickDirectory(node) {
      this.loading = true;
      this.$emit('on-select-node', node);
    },
  },
};
</script>

<template>
  <div class="data-grid">
    <div
      v-if="value.length"
      class="data-grid-wrap">
      <div class="data-grid-header">
        <Checkbox v-model="check">
          <span class="total-check">全选</span>
        </Checkbox>
      </div>
      <div class="data-grid-container">
        <div
          v-for="item in value"
          :key="item.id"
          class="data-grid-item">
          <Icon
            type="checkmark-circled"
            size="22"
            color="#358CF0"></Icon>
          <SvgIcon
            :icon-class="iconClass(item)"
            size="60">
          </SvgIcon>
          <span
            v-if="+item.typeId < 8"
            class="directory"
            @click="clickDirectory(item)"
          >
            <Ellipsis :length="10">{{ item.alias || item.name }}</Ellipsis>
          </span>
          <span v-else>
            <Ellipsis :length="10">{{ item.alias || item.name }}</Ellipsis>
          </span>
        </div>
        <Spin
          v-if="loading"
          size="large"
          fix></Spin>
      </div>
    </div>
    <div
      v-else
      class="data-grid-empty">
      <img
        src="~assets/datamanager/empty-file.png"
        alt="">
      <span class="tips">您还没上传过文件哦，点击 <a href="#">上传</a> 按钮～</span>
    </div>
  </div>
</template>
<style lang="less" scoped>
.data-grid {
  height: calc(~'100% - 87px');
  &-empty {
    height: 100%;
    text-align: center;

    & > img {
      margin-top: 260px;
    }
    .tips {
      display: block;
      font-size: 14px;
      margin-top: 20px;
    }
  }
}
.data-grid-header {
  height: 32px;
  padding: 7px 11px;
  background-color: #f8f8f9;
  border-bottom: 1px solid #e9eaec;
  .total-check {
    font-weight: 700;
    margin-left: 8px;
  }
}

.data-grid-container {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  position: relative;
  height: calc(~'100% - 33px');

  .data-grid-item {
    position: relative;
    margin: 4px 0 0 6px;
    height: 120px;
    width: 130px;
    border: 1px solid transparent;
    cursor: pointer;

    &:hover {
      border: 1px solid #90c3fd;
      border-radius: 5px;
      background-color: #eef8ff;
      .k-icon {
        opacity: 0.5;
      }
    }

    .k-icon {
      position: absolute;
      top: 5px;
      left: 5px;
      opacity: 0;
      &:hover {
        opacity: 0.6;
      }
    }

    .k-svgicon {
      margin: 20px 34px 10px 34px;
    }

    .directory:hover {
      color: #459aee;
      cursor: pointer;
    }
    .k-ellipsis {
      text-align: center;
    }
  }
}
</style>
