<script>
export default {
  name: 'DataDisplay',

  // props: {
  //   // lableData: {
  //   //   type: Array,
  //   //   default: () => [],
  //   // },
  //   // tableDatas: {
  //   //   type: Array,
  //   //   default: () => [],
  //   // },
  //   // treeDatas: {
  //   //   type: [Array, String, Object],
  //   //   default: () => {},
  //   // },
  // },
  data() {
    return {
      formItem: {},
      // typeData: [],
      // typeTreeData: [],
    };
  },
  computed: {
    //标签数据
    tagData() {
      return this.$store.state.metadata.tagData;
    },
    //分类数据
    treeData() {
      return this.$store.state.metadata.treeData;
    },
  },
  watch: {
    treeDatas: {
      handler(newVals) {
        if (newVals) {
          //复制treeDatas的数据给typeTreeData,用来存放treeDatas里面的数据
          // this.typeTreeData = [];
          newVals.forEach(element => {
            //var newObj = Object.assign({}, element);
            //在addLableText里添加两个属性
            if (element.data) {
              this.addLableText(element);
              this.treeData.push(element);
            }
          });
        }
      },
      immediate: true,
    },
  },

  methods: {
    // async searchData() {
    //   const restype = this.typeData[this.typeData.length - 1];
    //   const response = await api.db.findpagelistbusiness({
    //     name: this.formItem.input, //关键字
    //     restype: restype, //资源分类
    //     keyword: this.formItem.select, //标签
    //     orderfield: '', //排序字段
    //     sort: '', //排序方式
    //     pageinfo: {
    //       pageIndex: 1, //当前页
    //       pageSize: 10, //每页总数
    //       orderby: '', //排序字段
    //     },
    //   });
    // },

    //清空按钮
    empty() {
      this.formItem.name = '';
      this.formItem.input = '';
      this.formItem.select = '';
      this.treeData = '';
    },
    addLableText(item) {
      if (item) {
        this.$set(item, 'label', item.title);
        this.$set(item, 'value', item.data.id);
      }

      //判断是否有子节点
      if (item.children) {
        //判断子节点的个数是否大于0
        if (item.children.length > 0) {
          //大于0就继续往下循环递归
          item.children.forEach(element => {
            this.addLableText(element);
          });
        }
      }
    },
  },
};
</script>

<template>
  <Form
    :model="formItem"
    :label-width="60"
    label-position="left">
    <div
      class="top"><Icon
        type="ios-square"
        class="bg-icon"
        size="20"/>
      <span>查询</span>
    </div>
    <!--<FormItem
      label="名称：">
      <Select v-model="formItem.name">
        <Option
          v-for="item in tableDatas"
          :value="item.name"
          :key="item.name">{{ item.name }}</Option>
      </Select>
    </FormItem>-->
    <FormItem label="标签：" >
      <Select v-model="formItem.select">
        <Option
          v-for="item in tagData"
          :value="item.name"
          :key="item.name">{{ item.name }}</Option>
      </Select>
    </FormItem>
    <FormItem label="分类：" >
      <Cascader
        :data="treeData"
        v-model="treeData"
        transfer
      ></Cascader>
    </select></FormItem>
    <FormItem label="关键字：">
      <Input
        v-model="formItem.input"
        placeholder="请输入关键字">
      </Input>
    </FormItem>
    <FormItem>
      <Button
        type="primary"
        @click="searchData(formItem)">查询</Button>
      <Button @click="empty">清空</Button>
    </FormItem>
  </Form>
</template>

<style lang="less" scoped>
form {
  padding-left: 25px;
  padding-right: 22px;
  border: 1px solid #e8eaec;
  padding: 0px 22px 5px 25px;
  border-top: 0px;
  height: 234px;
}
.k-form-item {
  margin-bottom: 3px !important;
  padding-top: 5px !important;
}
.top {
  width: 100%;
  height: 20px;
  padding-bottom: 27px;
}
.bg-icon {
  width: 8px;
  height: 8px;
  line-height: 8px;
  background-color: #2d8cf0;
  margin-right: 5px;
}
.k-btn {
  padding: 3px 15px;
}
</style>
