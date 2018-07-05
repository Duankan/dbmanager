<script>
import * as types from '@/store/types';
import OperationFixed from './OperationFixed';
import OperationDynamic from './OperationDynamic';
import { cloneDeep } from '@ktw/ktools';

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
  created() {
    this.$store.state.app.copy = cloneDeep(this.$store.state.app.nodes);
  },
  methods: {
    searchh() {
      let nodessss = cloneDeep(this.$store.state.app.nodes);

      for (let i = nodessss.length - 1; i >= 0; i--) {
        if (nodessss[i].name.indexOf(this.search) == -1) {
          nodessss.splice(i, 1);
        }
      }
      console.log(nodessss);
      this.$store.state.app.copy = nodessss;
    },
    sort(key) {
      this.$store.commit(types.SORT_APP_NODES, { key });
    },
    toggle() {
      this.$emit('update:component', this.component === 'DataTable' ? 'DataGrid' : 'DataTable');
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
        icon="ios-search"
        placeholder="搜索您的数据"
        @on-click="searchh"
        @keyup.enter.native="searchh"
      ></Input>
      <Dropdown
        placement="bottom-end"
        @on-click="sort">
        <Icon
          type="more"
          size="24"
        ></Icon>
        <DropdownMenu slot="list">
          <DropdownItem name="name">文件名</DropdownItem>
          <DropdownItem name="size">大小</DropdownItem>
          <DropdownItem name="updateTime">修改时间</DropdownItem>
        </DropdownMenu>
      </Dropdown>
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
