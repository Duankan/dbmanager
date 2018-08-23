<script>
import * as types from '@/store/types';
export default {
  name: 'BusinessLable',
  data() {
    return {
      value: '',
      newAddText: '',
      readonly: true,
    };
  },
  computed: {
    tagData() {
      return this.$store.state.metadata.tagData;
    },
  },

  created() {
    this.lableDatas();
  },
  methods: {
    //查询所有标签
    lableDatas() {
      this.$store.dispatch(types.SEARCH_LABLE_DATA);
    },
    //添加列表
    async addNewList() {
      this.$Modal.confirm({
        render: h => {
          return h('Input', {
            props: {
              value: this.newAddText,
              autofocus: true,
              placeholder: '请输入标签名',
            },
            on: {
              input: val => {
                this.newAddText = val;
              },
            },
          });
        },
        onOk: async val => {
          const response = await api.db.addTaqsBusiness({
            name: this.newAddText, //标签名
            remark: '', //描述
            type: 1, //类型（0-空间数据，1-业务数据）
          });
          this.lableDatas();
          this.$Message.info('添加成功');
          this.newAddText = '';
        },
        onCancel: () => {
          this.$Message.info('取消');
        },
      });
    },
    //删除列表
    async removeList(id) {
      this.$Modal.confirm({
        title: '删除标签',
        content: '<p>确定删除该标签？</p>',
        onOk: async () => {
          const response = await api.db.deleteTaqsBusiness({ id: id });
          this.tagData.splice(
            this.tagData.findIndex(item => {
              return id === item.id;
            }),
            1
          );
          this.$Message.info('已删除');
        },
        onCancel: () => {
          this.$Message.info('取消');
        },
      });
    },
    //编辑列表
    async editList(event, item) {
      this.readonly = false;
      //获取当前input焦点
      event.target.parentElement.getElementsByTagName('input')[0].focus();
      item.isEdit = true;
    },
    //编辑列表
    async updateList(item) {
      const response = await api.db.updateTaqsBusiness({
        id: item.id, //id
        name: item.name, //标签名
        remark: item.remark, //描述
        type: 1, //类型（0-空间数据，1-业务数据）
      });
      item.isEdit = false;
      this.$Message.info('修改成功');
      this.readonly = true;
    },
    //对表格数据进行筛选
    searchTableTag(id) {
      this.$store.dispatch(types.SEARCH_TABLE_TAG, id);
    },
  },
};
</script>
<template>
  <div class="lable-main">
    <div
      class="lable-top"
    ><Icon
      type="ios-square"
      class="lable-bg-icon"
      size="20"/>
      <span>标签</span>
      <Icon
        v-model="newAddText"
        class="lable-list-icon"
        type="ios-plus-outline"
        size="16"
        @click.native="addNewList"/>
    </div>
    <div class="lable">
      <div
        v-for="(item, index) in tagData"
        :key="index"
        class="lable-list"
        checkbox>
        <input
          v-model="item.name"
          :readonly="readonly"
          class="lable-input-list"
          type="text"
          @click="searchTableTag(item.id)"
        />
        <Icon
          class="lable-list-content-icons"
          type="ios-close-outline"
          size="16"
          @click.native="removeList(item.id)"></Icon>
        <Icon
          v-if="!item.isEdit"
          class="lable-list-content-icon"
          type="android-create"
          size="16"
          @click.native="editList($event,item)"
        ></Icon>
        <Icon
          v-else
          type="ios-checkmark"
          size="16"
          class="lable-list-content-icon-update"
          @click.native="updateList(item)"></Icon>
      </input>
      </icon></div>
    </div>

  </div>
</template>

<style lang="less" scoped>
.lable-main {
  width: 100%;
  padding-left: 25px;
  padding-right: 22px;
  height: calc(~'100vh - 450px');
  padding: 0px 22px 5px 25px;
  border-top: 0px;
  padding-top: 10px;
}
.labletop {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.lable-bg-icon {
  width: 8px;
  height: 8px;
  line-height: 8px;
  background-color: #2d8cf0;
  margin-right: 5px;
}
.lable {
  width: 100%;
  height: calc(100%-40px);
  overflow-y: auto;
  margin-top: 3px;
  .lable-list {
    width: 100%;
    height: 25px;
    background-color: #f8f8f9;
    margin-top: 8px;
    border-radius: 5px;
    padding-left: 10px;
    line-height: 25px;
    .lable-list-content-icon {
      padding-right: 4%;
      cursor: pointer;
      float: right;
      line-height: 25px;
    }
    .lable-list-content-icons {
      cursor: pointer;
      float: right;
      padding-right: 7px;
      line-height: 25px;
    }
    .lable-list-content-icon-update {
      color: green;
      cursor: pointer;
      float: right;
      padding-right: 7px;
      line-height: 25px;
    }
    .lable-input-list {
      height: 25px;
      border: 0;
      background: none;
      cursor: default;
    }
  }
}
.lable-list-icon {
  float: right;
  padding-right: 7px;
  cursor: pointer;
}
</style>
