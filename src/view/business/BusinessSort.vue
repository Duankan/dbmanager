<script>
export default {
  name: 'BusinessSort',
  data() {
    return {
      dataTree: [
        {
          title: '',
          expand: true,
          children: [
            {
              title: '',
              expand: true,
              children: [
                {
                  title: '',
                  expand: true,
                },
              ],
            },
          ],
        },
      ],
      // ButtonProps: {
      //   type: 'default',
      //   size: 'small',
      // },       :render="renderContent"
    };
  },
  mounted() {
    this.searchTree();
  },
  methods: {
    async searchTree() {
      const response = await api.db.findalltype({});
      this.dataTree = response.data;
    },
  },
};
</script>
<template>
  <div class="main">
    <div
      class="top"
    ><Icon
      type="ios-square"
      class="bg-icon"
      size="20"/>
      <span>资源分类</span>
      <Tree
        :data="dataTree"

      ></Tree>
</div></div></template>

<style lang="less" scoped>
.main {
  width: 100%;
  padding-left: 25px;
  padding-right: 22px;
  height: 244px;
  border: 1px solid #e8eaec;
  padding: 0px 22px 5px 25px;
  border-top: 0px;
  padding-top: 10px;
}
.top {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.bg-icon {
  width: 8px;
  height: 8px;
  line-height: 8px;
  background-color: #2d8cf0;
  margin-right: 5px;
}
/deep/.k-input {
  background: none;
  border: none;
  // cursor: default;
  color: #515a6e;
}
</style>
