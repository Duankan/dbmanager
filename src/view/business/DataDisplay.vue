<script>
// import * as types from '@/store/types';
export default {
  name: 'DataDisplay',
  props: {
    //表格数据
    tableDatas: {
      type: Object,
      default: () => {},
    },
    //分类数据
    treeDatas: {
      type: [Array, String, Object],
      default: () => {},
    },
    labelsData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formItem: {
        select: [], //标签名
        multiple: [], //分类id
        input: '', //关键字
      },
      ruleFormdate: {},
      totalCount: 1, //表格总页数
      pageIndex: 1, //表格当前页
      typeTreeData: [],
      value: '',
      copyTreeDatas: [],
    };
  },
  // computed: {
  //   //标签数据
  //   tagData() {
  //     return this.$store.state.metadata.tagData;
  //   },
  // },
  watch: {
    treeDatas: {
      handler(newVals) {
        if (newVals) {
          //复制treeDatas的数据给typeTreeData,用来存放treeDatas里面的数据
          this.typeTreeData = [];
          newVals.forEach(element => {
            //在addLableText里添加两个属性
            if (element.data) {
              this.addLableText(element);
              this.typeTreeData.push(element);
            }
          });
        }
        this.$emit('TreeData', this.treeDatas);
      },
      immediate: true,
    },
  },
  methods: {
    // 查询按钮
    searchData(formItem) {
      //判断选项是否全为空
      if (formItem.select.length == 0 && formItem.input == '' && formItem.multiple == '') {
        this.$Message.error('选项不能全为空');
      } else {
        this.findAllData();
      }
    },
    //查询所有表格数据
    async findAllData() {
      // 获取分类的id;
      const restype = this.formItem.multiple[this.formItem.multiple.length - 1];
      //将标签数组转为字符串
      const select = this.formItem.select.join(',');
      const response = await api.db.findpagelistbusiness({
        name: this.formItem.input, //关键字
        restype: restype, //资源分类
        keyword: select, //标签
        orderfield: '', //排序字段
        sort: '', //排序方式
        pageinfo: {
          pageIndex: this.pageIndex, //当前页
          pageCount: this.pageCount, //总数据
          totalCount: this.totalCount, //总数据
          pageSize: 10, //每页总数
          orderby: '', //排序字段
        },
      });
      this.totalCount = response.data.pageInfo.totalCount;
      this.pageCount = response.data.pageInfo.pageCount;
      this.pageIndex = response.data.pageInfo.pageIndex;
      this.$emit('on-dataChangeEvnet', response.data);
    },
    //清空按钮
    async empty(name) {
      this.formItem.multiple = '';
      this.$refs[name].resetFields();
      this.findAllData();
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
    :ref="formItem"
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
    <FormItem
      label="标  签："
      prop="select">
      <Select
        v-model="formItem.select"
        multiple >
        <Option
          v-for="item in labelsData"
          :value="item.name"
          :key="item.name"
        >{{ item.name }}</Option>
      </Select>
    </FormItem>
    <FormItem
      label="分  类："
      prop="multiple">
      <Cascader
        :data="treeDatas"
        v-model="formItem.multiple"
        transfer
      ></Cascader>
    </FormItem>
    <FormItem
      label="关键字："
      prop="input">
      <Input
        v-model="formItem.input"
        placeholder="请输入关键字">
      </Input>
    </FormItem>
    <FormItem>
      <Button
        type="primary"
        @click="searchData(formItem)">查询</Button>
      <Button @click="empty(formItem)">清空</Button>
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
  height: 30%;
  // height: calc(100% - 496px);
  overflow-y: auto;
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
// /deep/.k-form-item-label {
//   width: 71px;
// }
// /deep/.k-form-item-content {
//   width: 71px;
// }
</style>
