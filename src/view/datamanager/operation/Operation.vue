<script>
import * as types from '@/store/types';

export default {
  name: 'Operation',
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
    <div class="operation-left">
      <Dropdown placement="bottom-start">
        <Button type="primary">
          <Icon
            type="upload"
            size="16"
            style="margin-right: 8px"></Icon>
          上传
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem>文件上传</DropdownItem>
          <DropdownItem>文件夹上传</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Dropdown placement="bottom-start">
        <Button type="primary">
          <Icon
            type="android-share-alt"
            size="16"
            style="margin-right: 8px"></Icon>
          连接
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem>第三方服务</DropdownItem>
          <DropdownItem>gis数据库</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Button type="ghost">
        <Icon
          type="folder"
          size="16"
          style="margin-right: 8px"></Icon>
        新建文件夹
      </Button>
    </div>

    <div class="operation-right">
      <Input
        v-model="search"
        icon="ios-search"
        placeholder="搜索您的数据"></Input>
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
  &-left {
    float: left;
    .k-dropdown {
      margin-right: 8px;
    }
  }
  &-right {
    float: right;
    .k-input-wrapper {
      width: 260px;
    }
    .k-icon {
      cursor: pointer;
    }
    > * {
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
