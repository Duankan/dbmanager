<script>
export default {
  name: 'DataDisplay',

  props: {
    lableData: {
      type: Array,
      default: () => [],
    },
    tableDatas: {
      type: Array,
      default: () => [],
    },
    treeDatas: {
      type: [Array, String, Object],
      default: () => {},
    },
  },
  data() {
    return {
      formItem: {},
      typeData: '',
      typeTreeData: [],
    };
  },
  watch: {
    treeDatas: {
      handler(newVals) {
        if (newVals) {
          this.typeTreeData = [];
          newVals.forEach(element => {
            var newObj = Object.assign({}, element);
            this.addLableText(newObj);
            this.typeTreeData.push(newObj);
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    async searchData() {
      const tableDatas = this.tableDatas;
      const response = await api.db.findpagelistbusiness({
        name: '', //表名
        restype: '', //资源分类
        keyword: '', //标签关键字
        orderfield: '', //排序字段
        sort: '', //排序方式
        pageinfo: {
          pageIndex: this.pageIndex, //当前页
          pageSize: 10, //每页总数
          orderby: '', //排序字段
        },
      });

      //获取表格数据
    },
    //清空按钮
    empty() {
      this.formItem.name = '';
      this.formItem.input = '';
      this.formItem.select = '';
    },
    addLableText(item) {
      debugger;
      if (item) {
        this.$set(item, 'label', item.title);
        this.$set(item, 'value', item.title);
      }
      if (item.children) {
        if (item.children.length > 0) {
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
    <FormItem label="名称：" >
      <Select v-model="formItem.name">
        <Option
          v-for="item in tableDatas"
          :value="item.name"
          :key="item.name">{{ item.name }}</Option>
      </Select>
    </FormItem>
    <FormItem label="标签：" >
      <Select v-model="formItem.select">
        <Option
          v-for="item in lableData"
          :value="item.name"
          :key="item.name">{{ item.name }}</Option>
      </Select>
    </FormItem>
    <FormItem label="分类：" >
      <Cascader 
        :data="typeTreeData"
        v-model="typeData"
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
        @click="searchData">查询</Button>
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
