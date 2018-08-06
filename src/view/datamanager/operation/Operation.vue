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
    };
  },

  methods: {
    toggle() {
      this.$emit('update:component', this.component === 'DataTable' ? 'DataGrid' : 'DataTable');
    },

    inputSearchData() {
      this.$store.dispatch(types.APP_NODES_TABLE, this.search);
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
        clearable
        icon="ios-search"
        placeholder="搜索您的数据"
        @on-change="inputSearchData"
      ></Input>
      <Icon
        :type="component === 'DataTable' ? 'navicon' : 'grid'"
        size="24"
        @click.native="toggle"></Icon>
    </div>
  </div>
</template>

<style lang="less" scoped>
.operation {
  &-fixed {
    float: left;
  }
  &-dynamic {
    float: left;
    margin-left: 32px;
  }
  &-search {
    float: right;
    .k-input-wrapper {
      width: 260px;
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
}
</style>
