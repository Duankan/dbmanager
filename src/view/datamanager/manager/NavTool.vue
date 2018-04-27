<script>
export default {
  name: 'NavTool',
  data() {
    return {
      search: '',
      gridMode: false,
    };
  },
  methods: {
    toggle() {
      this.gridMode = !this.gridMode;
      this.$emit('toggle-mode', this.gridMode ? 'DataGrid' : 'DataTable');
    },
  },
};
</script>

<template>
  <div class="nav-tool">
    <div class="nav-tool-left">
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

    <div class="nav-tool-right">
      <Input
        v-model="search"
        icon="ios-search"
        placeholder="搜索您的数据"></Input>
      <Dropdown placement="bottom-end">
        <Icon
          type="more"
          size="24"
        ></Icon>
        <DropdownMenu slot="list">
          <DropdownItem>文件名</DropdownItem>
          <DropdownItem>大小</DropdownItem>
          <DropdownItem>修改时间</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Icon
        :type="gridMode ? 'navicon' : 'grid'"
        size="24"
        @click.native="toggle"></Icon>
    </div>
  </div>
</template>

<style lang="less" scoped>
.nav-tool {
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
