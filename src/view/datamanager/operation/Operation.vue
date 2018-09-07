<script>
import * as types from '@/store/types';
import OperationFixed from './OperationFixed';
import OperationDynamic from './OperationDynamic';

export default {
  name: 'Operation',
  components: {
    OperationFixed,
    OperationDynamic,
  },
  props: {
    component: {
      type: String,
      validator(val) {
        return ['DataTable', 'DataGrid'].includes(val);
      },
      default: 'DataTable',
    },
  },
  data() {
    return {
      search: '',
      hasError: false,
    };
  },
  methods: {
    toggle() {
      this.$emit('update:component', this.component === 'DataTable' ? 'DataGrid' : 'DataTable');
    },
    inputSearchData() {
      this.hasError = false;
      if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]*$/.test(this.search)) {
        this.hasError = true;
        return;
      }
      if (this.search.trim() != '') {
        this.$store.dispatch(types.APP_NODES_TABLE, this.search);
      } else {
        this.$store.dispatch(types.APP_NODES_FETCH, this.$store.state.app.selectNode);
      }
    },
  },
};
</script>

<template>
  <div class="operation">
    <OperationFixed/>
    <OperationDynamic/>
    <div class="operation-search">
      <Input
        v-model="search"
        :class="{'error-input':hasError}"
        clearable
        icon="ios-search"
        placeholder="搜索您的数据"
        @on-change="inputSearchData"
      ></Input>
      <div
        v-show="hasError"
        class="k-form-item-error-tip">不能输入特殊字符</div>
      <Icon
        :type="component === 'DataTable' ? 'navicon' : 'grid'"
        size="24"
        @click.native="toggle"></Icon>
    </div>
  </div>
</template>

<style lang="less" scoped>
.operation {
  .operation-search {
    position: relative;
  }
  &-fixed {
    float: left;
  }
  &-dynamic {
    float: left;
    margin-left: 16px;
  }
  &-search {
    float: right;
    .k-input-wrapper {
      width: 210px;
    }
    .k-icon {
      cursor: pointer;
    }
    & > * {
      margin-left: 8px;
      vertical-align: middle;
    }
  }
  &::before,
  &::after {
    content: '';
    display: table;
  }
  &::after {
    clear: both;
  }
  .error-input {
    /deep/ input {
      border: 1px solid #ed3f14;
      &:focus {
        box-shadow: 0 0 0 2px rgba(237, 63, 20, 0.2);
      }
    }
  }
}
</style>
